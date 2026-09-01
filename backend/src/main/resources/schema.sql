CREATE DATABASE IF NOT EXISTS nxt_trendz;
USE nxt_trendz;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    rating DOUBLE DEFAULT 0,
    rating_count INT DEFAULT 0,
    category_id BIGINT,
    image_url TEXT,
    description TEXT,
    stock INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_cart (user_id, product_id)
);

-- Seed categories
INSERT IGNORE INTO categories (name) VALUES
('Electronics'), ('Clothing'), ('Home & Kitchen'), ('Sports'), ('Books'), ('Toys'), ('Beauty');

-- Seed admin user (password: admin123)
INSERT IGNORE INTO users (username, password, role) VALUES
('rahul', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER'),
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Seed products
INSERT IGNORE INTO products (title, brand, price, original_price, rating, rating_count, category_id, image_url, description, stock) VALUES
('iPhone 14 Pro', 'Apple', 89999, 109999, 4.7, 1240, 1, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', 'The most powerful iPhone ever with Dynamic Island, 48MP camera, and A16 Bionic chip.', 50),
('Samsung Galaxy S23', 'Samsung', 74999, 94999, 4.5, 980, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 'Snapdragon 8 Gen 2, 200MP camera, bright AMOLED display.', 60),
('Sony WH-1000XM5', 'Sony', 29990, 34990, 4.8, 2100, 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 'Industry-leading noise cancellation with 30-hour battery life.', 80),
('MacBook Air M2', 'Apple', 114900, 129900, 4.9, 870, 1, 'https://images.unsplash.com/photo-1611186871525-e5e1b3c3a6e0?w=400', 'Supercharged by M2 chip, fanless design, 18-hour battery.', 30),
('Nike Air Max 270', 'Nike', 10995, 12995, 4.4, 3400, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'The Nike Air Max 270 delivers visible cushioning under every step.', 120),
('Adidas Ultraboost 22', 'Adidas', 14999, 18999, 4.6, 2200, 2, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', 'Incredible energy return with responsive Boost midsole.', 90),
('Levi\'s 511 Slim Fit Jeans', 'Levi\'s', 3999, 4999, 4.3, 5600, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Classic slim fit jeans with stretch for comfort and style.', 200),
('Instant Pot Duo 7-in-1', 'Instant Pot', 7499, 9999, 4.7, 4300, 3, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer.', 75),
('Dyson V12 Vacuum', 'Dyson', 52900, 62900, 4.6, 890, 3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Detects and adapts to hidden dust with intelligent suction.', 40),
('The Alchemist', 'Paulo Coelho', 299, 399, 4.8, 12000, 5, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'A magical story about following your dreams.', 500),
('Atomic Habits', 'James Clear', 449, 599, 4.9, 18000, 5, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', 'Tiny changes, remarkable results. Build good habits.', 400),
('Wilson Pro Staff Tennis Racket', 'Wilson', 8999, 11999, 4.5, 670, 4, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 'Used by Roger Federer, precision control and spin.', 60),
('Yoga Mat Premium', 'Liforme', 5999, 7499, 4.7, 1100, 4, 'https://images.unsplash.com/photo-1601925228843-c656e8c9e0e5?w=400', 'Eco-friendly, non-slip, alignment guide printed on mat.', 150),
('LEGO Technic Bugatti', 'LEGO', 34999, 39999, 4.9, 2300, 6, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', '3599 pieces, authentic Bugatti Chiron replica with W16 engine.', 35),
('Maybelline Fit Me Foundation', 'Maybelline', 549, 799, 4.3, 8900, 7, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'Natural coverage, blurs pores, controls shine all day.', 300),
('OnePlus 11 5G', 'OnePlus', 56999, 64999, 4.5, 1450, 1, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 'Snapdragon 8 Gen 2, Hasselblad camera, 100W SUPERVOOC charging.', 70),
('Philips Air Fryer', 'Philips', 8999, 12999, 4.6, 3200, 3, 'https://images.unsplash.com/photo-1648345612543-4cf71f619a3e?w=400', 'Rapid Air technology, up to 90% less fat, 4.1L capacity.', 85),
('Campus Running Shoes', 'Campus', 1799, 2499, 4.2, 4100, 2, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400', 'Lightweight EVA sole, breathable mesh upper for daily running.', 250);
