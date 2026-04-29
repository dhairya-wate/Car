-- CarSite Database Schema
CREATE DATABASE IF NOT EXISTS carsite;
USE carsite;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample data
-- Create a default user (id=1) so car samples can be linked
-- Password is 'password123'
INSERT INTO users (id, name, email, password) VALUES
  (1, 'John Motor', 'john@motor.com', '$2a$12$LQv3c1yqBWVHxkd0LqCF6u5K6V.fA.R/W6Z/Yp6.O6Z/Yp6.O6Z/Y')
  ON DUPLICATE KEY UPDATE id=id;

INSERT INTO cars (name, brand, price, image, description, user_id) VALUES
  ('911 Carrera', 'Porsche', 112000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'Iconic rear-engine sports car with a 3.0L twin-turbo flat-six engine producing 379 hp.', 1),
  ('Model S Plaid', 'Tesla', 89990, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800', 'Tri-motor all-electric sedan with 1,020 hp and a 0-60 in under 2 seconds.', 1),
  ('M3 Competition', 'BMW', 74900, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'High-performance sedan with a 3.0L twin-turbo inline-six producing 503 hp.', 1);
