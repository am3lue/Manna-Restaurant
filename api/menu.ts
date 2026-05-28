import { turso } from '../src/lib/turso';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Pull ALL items so staff can manage out-of-stock items
      const result = await turso.execute("SELECT * FROM menu_items");
      const formattedMenu = result.rows.map((item) => ({
        id: item.id,
        nameEn: item.name_en,
        nameSw: item.name_sw,
        descEn: item.desc_en,
        descSw: item.desc_sw,
        price: item.price,
        category: item.category,
        image: item.image_url || item.id,
        isAvailable: item.is_available === 1,
        stockCount: item.stock_count !== undefined ? item.stock_count : -1
      }));

      // Vercel Edge Caching: Cache in browser for 5s, cache in Vercel Edge for 60s, serve stale while revalidating for up to 120s
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      
      return res.status(200).json(formattedMenu);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { nameEn, nameSw, descEn, descSw, price, category, stockCount } = req.body;
    const id = `m${Date.now()}`; // Unique ID
    try {
      await turso.execute({
        sql: "INSERT INTO menu_items (id, name_en, name_sw, desc_en, desc_sw, price, category, is_available, stock_count) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)",
        args: [id, nameEn, nameSw, descEn, descSw, price, category, stockCount !== undefined ? stockCount : -1]
      });
      return res.status(200).json({ success: true, id });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    const { id, isAvailable, nameEn, nameSw, descEn, descSw, price, category, stockCount } = req.body;
    try {
      if (isAvailable !== undefined && nameEn === undefined) {
        // Simple toggle for availability and stock
        await turso.execute({
          sql: "UPDATE menu_items SET is_available = ?, stock_count = ? WHERE id = ?",
          args: [isAvailable ? 1 : 0, stockCount !== undefined ? stockCount : -1, id]
        });
      } else {
        // Full update
        await turso.execute({
          sql: "UPDATE menu_items SET name_en = ?, name_sw = ?, desc_en = ?, desc_sw = ?, price = ?, category = ?, stock_count = ? WHERE id = ?",
          args: [nameEn, nameSw, descEn, descSw, price, category, stockCount !== undefined ? stockCount : -1, id]
        });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await turso.execute({
        sql: "DELETE FROM menu_items WHERE id = ?",
        args: [id]
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).end();
}
