import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  try {
    console.log("Adding stock_count to menu_items...");
    await turso.execute("ALTER TABLE menu_items ADD COLUMN stock_count INTEGER DEFAULT -1");
  } catch (e) {
    if (!e.message.includes("duplicate column name")) console.error(e);
  }

  try {
    console.log("Adding version to orders...");
    await turso.execute("ALTER TABLE orders ADD COLUMN version INTEGER DEFAULT 1");
  } catch (e) {
    if (!e.message.includes("duplicate column name")) console.error(e);
  }

  console.log("Migration complete.");
}

migrate();
