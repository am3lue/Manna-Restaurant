import { turso } from '../src/lib/turso';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await turso.execute(`
        SELECT 
          o.id, o.customer_name, o.table_id, o.status, o.payment_method, o.payment_status, o.total_amount, o.notes, o.created_at, o.updated_at, o.version,
          oi.menu_item_id, oi.name_en, oi.name_sw, oi.quantity, oi.unit_price
        FROM orders o 
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status != 'paid'
        ORDER BY o.created_at DESC
      `);
      
      const ordersMap = new Map();
      
      for (const row of result.rows) {
        if (!ordersMap.has(row.id)) {
          ordersMap.set(row.id, {
            id: row.id,
            customerName: row.customer_name,
            tableId: row.table_id,
            status: row.status,
            paymentMethod: row.payment_method,
            paymentStatus: row.payment_status,
            totalAmount: row.total_amount,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            version: row.version,
            items: []
          });
        }
        
        if (row.menu_item_id) {
          ordersMap.get(row.id).items.push({
            menuItemId: row.menu_item_id,
            nameEn: row.name_en,
            nameSw: row.name_sw,
            quantity: row.quantity,
            price: row.unit_price
          });
        }
      }
      
      const orders = Array.from(ordersMap.values());
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { customer_name, table_id, items, notes, total_amount, payment_method } = req.body;
    const order_id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    let transaction;
    
    try {
      transaction = await turso.transaction("write");

      // Inventory Tracking Verification
      for (const item of items) {
        const itemCheck = await transaction.execute({
          sql: "SELECT stock_count, name_en FROM menu_items WHERE id = ?",
          args: [item.menuItemId]
        });
        
        if (itemCheck.rows.length === 0) throw new Error(`Item ${item.nameEn} not found`);
        const stock = itemCheck.rows[0].stock_count as number;
        
        // stock_count === -1 means unlimited
        if (stock !== -1) {
          if (stock < item.quantity) {
            throw new Error(`Insufficient stock for ${itemCheck.rows[0].name_en}. Only ${stock} left.`);
          }
          // Deduct stock
          await transaction.execute({
            sql: "UPDATE menu_items SET stock_count = stock_count - ? WHERE id = ?",
            args: [item.quantity, item.menuItemId]
          });
        }
      }
      
      await transaction.execute({
        sql: "INSERT INTO orders (id, customer_name, table_id, total_amount, notes, payment_method, status, version) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
        args: [order_id, customer_name, table_id, total_amount, notes, payment_method, 'pending']
      });
      
      for (const item of items) {
        await transaction.execute({
          sql: "INSERT INTO order_items (id, order_id, menu_item_id, name_en, name_sw, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
          args: [
            `${order_id}-${item.menuItemId}`, 
            order_id, 
            item.menuItemId, 
            item.nameEn, 
            item.nameSw, 
            item.quantity, 
            item.price
          ]
        });
      }
      
      await transaction.execute({
        sql: "UPDATE dining_tables SET status = 'occupied' WHERE id = ?",
        args: [table_id]
      });
      
      await transaction.commit();
      return res.status(200).json({ success: true, order_id });
    } catch (error) {
      if (transaction && !transaction.closed) {
        try { await transaction.rollback(); } catch (e) {}
      }
      if (error.message.includes('Insufficient stock')) {
         return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    const { id, status, version } = req.body;
    let transaction;
    
    try {
      transaction = await turso.transaction("write");
      
      // Optimistic Locking Update
      const updateResult = await transaction.execute({
        sql: "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?",
        args: [status, id, version || 1] // fallback to 1 if not passed for older clients
      });

      if (updateResult.rowsAffected === 0) {
         // Version mismatch or order deleted
         throw new Error("CONFLICT_VERSION");
      }
      
      if (status === 'ready') {
         const order = await transaction.execute({
           sql: "SELECT table_id FROM orders WHERE id = ?",
           args: [id]
         });
         if (order.rows[0]) {
           await transaction.execute({
             sql: "UPDATE dining_tables SET status = 'ready_to_serve' WHERE id = ?",
             args: [order.rows[0].table_id]
           });
         }
      }

      if (status === 'paid') {
        const order = await transaction.execute({
          sql: "SELECT table_id FROM orders WHERE id = ?",
          args: [id]
        });
        if (order.rows[0]) {
          await transaction.execute({
            sql: "UPDATE dining_tables SET status = 'empty' WHERE id = ?",
            args: [order.rows[0].table_id]
          });
        }
      }
      
      await transaction.commit();
      return res.status(200).json({ success: true });
    } catch (error) {
      if (transaction && !transaction.closed) {
        try { await transaction.rollback(); } catch (e) {}
      }
      if (error.message === "CONFLICT_VERSION") {
         return res.status(409).json({ error: 'Order was updated by another user. Please refresh.' });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).end();
}
