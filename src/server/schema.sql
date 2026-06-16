-- Edit this file to change the database schema or seed data.
--
-- The server automatically restarts and drops/recreates all tables on changes.

-- ============================================================================
-- Schema
-- ============================================================================

-- Menu items. Prices stored as integer cents to avoid float rounding issues.
-- `barcode` is the EAN/UPC printed on the item — the mobile app scans it with
-- the camera to add products to an order. Nullable: made-to-order drinks may
-- not have one.
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT UNIQUE,
  price_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Orders start as 'pending', move to 'completed'.
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Line items. unit_price_cents is a snapshot of the product price at time of sale.
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);

-- ============================================================================
-- Seed data
-- ============================================================================

-- Barcodes are 13-digit EAN-13-style codes so the camera scanner has something
-- to read. They don't need valid check digits for the demo.
INSERT INTO products (name, sku, barcode, price_cents) VALUES
  ('Drip Coffee',           'drip-coffee',      '0200000000017', 250),
  ('Latte',                 'latte',            '0200000000024', 550),
  ('Cappuccino',            'cappuccino',       '0200000000031', 550),
  ('Espresso',              'espresso',         '0200000000048', 350),
  ('Americano',             'americano',        '0200000000055', 400),
  ('Matcha Latte',          'matcha-latte',     '0200000000062', 600),
  ('Chai Latte',            'chai-latte',       '0200000000079', 550),
  ('Cold Brew',             'cold-brew',        '0200000000086', 450),
  ('Croissant',             'croissant',        '0200000000093', 375),
  ('Blueberry Muffin',      'blueberry-muffin', '0200000000109', 400),
  ('Banana Bread',          'banana-bread',     '0200000000116', 350),
  ('Chocolate Chip Cookie', 'choc-chip-cookie', '0200000000123', 300),
  ('Cinnamon Roll',         'cinnamon-roll',    '0200000000130', 450),
  ('Ceramic Mug',           'ceramic-mug',      '0200000000147', 1800),
  ('Tote Bag',              'tote-bag',         '0200000000154', 2200);

-- A few sample orders so the orders page isn't empty.
-- Product IDs match insertion order above (1=Drip Coffee, 2=Latte, etc.)
-- Prices are snapshotted from the products above.
INSERT INTO orders (status) VALUES
  ('completed'),
  ('completed'),
  ('completed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES
  (1, 2,  2, 550),  -- 2x Latte
  (1, 9,  1, 375),  -- 1x Croissant
  (2, 1,  1, 250),  -- 1x Drip Coffee
  (2, 6,  1, 600),  -- 1x Matcha Latte
  (2, 10, 2, 400),  -- 2x Blueberry Muffin
  (3, 8,  3, 450),  -- 3x Cold Brew
  (3, 13, 1, 450);  -- 1x Cinnamon Roll
