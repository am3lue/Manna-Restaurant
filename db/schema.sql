-- Manna Restaurant Production Schema (Turso/SQLite)

-- 1. Users (Staff & Registered Customers)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer', -- 'customer', 'waiter', 'kitchen', 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_sw TEXT NOT NULL,
  desc_en TEXT,
  desc_sw TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL, -- 'food', 'drink', 'sides', 'specials'
  is_available BOOLEAN DEFAULT 1,
  image_url TEXT
);

-- 3. Dining Tables
CREATE TABLE IF NOT EXISTS dining_tables (
  id TEXT PRIMARY KEY,
  table_number TEXT NOT NULL,
  status TEXT DEFAULT 'empty' -- 'empty', 'occupied', 'ready_to_serve'
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  table_id TEXT REFERENCES dining_tables(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'cooking', 'ready', 'served', 'paid'
  payment_method TEXT, -- 'M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Cash'
  payment_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'paid'
  total_amount REAL NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items (Line items for each order)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id TEXT REFERENCES menu_items(id),
  name_en TEXT NOT NULL, -- Snapshot at time of order
  name_sw TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);
