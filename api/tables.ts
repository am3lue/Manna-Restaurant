import { turso } from '../src/lib/turso';

export default async function handler(req, res) {
  try {
    const result = await turso.execute("SELECT * FROM dining_tables");
    const formattedTables = result.rows.map((t) => ({
      id: t.id,
      number: t.table_number,
      status: t.status
    }));
    res.status(200).json(formattedTables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
