
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, name, price) VALUES
  ('p1', 'Product One', 100.00),
  ('p2', 'Product Two', 150.00),
  ('p3', 'Another Product', 200.00),
  ('p4', 'Laptop Computer', 999.99),
  ('p5', 'Wireless Mouse', 29.99),
  ('p6', 'Mechanical Keyboard', 89.99),
  ('p7', 'USB Cable', 12.99),
  ('p8', 'Monitor Stand', 45.00)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

DO $$
BEGIN
  RAISE NOTICE 'Database initialization completed successfully!';
  RAISE NOTICE 'Products table created with % rows', (SELECT COUNT(*) FROM products);
END $$; 