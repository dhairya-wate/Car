const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Seeding database...');

    // 0. Create database if not exists
    const tempPool = require('mysql2/promise').createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    await tempPool.query('CREATE DATABASE IF NOT EXISTS carsite');
    await tempPool.end();

    // 1. Create tables if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
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
      )
    `);

    // 2. Create default user if not exists
    const hashedPassword = await bcrypt.hash('password123', 12);
    await db.query(
      `INSERT INTO users (id, name, email, password) 
       VALUES (1, 'John Motor', 'john@motor.com', ?) 
       ON DUPLICATE KEY UPDATE name=name`,
      [hashedPassword]
    );

    // 2. Sample cars data
    const cars = [
      ['Aventador SVJ', 'Lamborghini', 517700, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'V12 powerhouse with active aerodynamics and 770 hp.'],
      ['488 Pista', 'Ferrari', 330000, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800', 'Track-focused V8 supercar with 710 hp and extreme weight savings.'],
      ['GT3 RS', 'Porsche', 223800, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'The ultimate naturally aspirated driving machine.'],
      ['DB11', 'Aston Martin', 205000, 'https://images.unsplash.com/photo-1566473065135-3221379965d7?w=800', 'Grand tourer with a twin-turbo V12 and elegant design.'],
      ['R8 V10 Performance', 'Audi', 196000, 'https://images.unsplash.com/photo-1603577372314-f443a0012ad6?w=800', 'The everyday supercar with a glorious 5.2L V10 engine.'],
      ['G63 AMG', 'Mercedes', 179000, 'https://images.unsplash.com/photo-1520050206274-a1af44633fbc?w=800', 'Luxury off-roader with a twin-turbo V8 and iconic boxy style.'],
      ['E-Type Series 1', 'Jaguar', 125000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'Classic automotive beauty from the 1960s.'],
      ['Skyline GT-R R34', 'Nissan', 150000, 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2837?w=800', 'The legendary Godzilla of Japanese performance cars.']
    ];

    // 3. Insert cars
    // Clear existing sample cars first if needed, or just insert
    for (const car of cars) {
      await db.query(
        'INSERT INTO cars (name, brand, price, image, description, user_id) VALUES (?, ?, ?, ?, ?, 1)',
        car
      );
    }

    console.log('Seeding complete! Added ' + cars.length + ' cars.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
