
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (id, name, price, image_url, description, category) VALUES
  ('p1', 'MacBook Pro 16"', 2499.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', 'Powerful laptop for professionals with M3 Pro chip, 16GB RAM, and 512GB SSD', 'Laptops'),
  ('p2', 'Wireless Gaming Mouse', 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop', 'High-precision wireless gaming mouse with RGB lighting and customizable buttons', 'Accessories'),
  ('p3', 'Mechanical Keyboard', 149.99, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop', 'Premium mechanical keyboard with Cherry MX switches and RGB backlighting', 'Accessories'),
  ('p4', 'iPhone 15 Pro', 999.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system', 'Smartphones'),
  ('p5', 'AirPods Pro', 249.99, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop', 'Premium wireless earbuds with active noise cancellation and spatial audio', 'Audio'),
  ('p6', '4K Monitor 27"', 399.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop', 'Ultra-sharp 4K display with HDR support and USB-C connectivity', 'Monitors'),
  ('p7', 'USB-C Hub', 49.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 'Accessories'),
  ('p8', 'Wireless Charger', 39.99, 'https://images.unsplash.com/photo-1609592806596-4d1b5e5e0e1e?w=400&h=300&fit=crop', 'Fast wireless charging pad compatible with iPhone and Android devices', 'Accessories'),
  ('p9', 'Gaming Headset', 129.99, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop', 'Professional gaming headset with 7.1 surround sound and noise-canceling mic', 'Audio'),
  ('p10', 'Tablet Stand', 29.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', 'Adjustable aluminum stand for tablets and smartphones with multiple viewing angles', 'Accessories')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

DO $$
BEGIN
  RAISE NOTICE 'Database initialization completed successfully!';
  RAISE NOTICE 'Products table created with % rows', (SELECT COUNT(*) FROM products);
END $$; 