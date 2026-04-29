const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// GET /api/cars - public, list all
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS owner_name FROM cars c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/cars/:id - public, single car
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.name AS owner_name FROM cars c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Car not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/cars - protected
router.post('/', authMiddleware, async (req, res) => {
  const { name, brand, price, image, description } = req.body;
  if (!name || !brand || !price)
    return res.status(400).json({ message: 'Name, brand, and price are required.' });

  try {
    const [result] = await db.query(
      'INSERT INTO cars (name, brand, price, image, description, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand, price, image || null, description || null, req.user.id]
    );
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/cars/:id - protected, owner only
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, brand, price, image, description } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Car not found.' });
    if (rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized.' });

    await db.query(
      'UPDATE cars SET name=?, brand=?, price=?, image=?, description=? WHERE id=?',
      [
        name !== undefined ? name : rows[0].name,
        brand !== undefined ? brand : rows[0].brand,
        price !== undefined ? price : rows[0].price,
        image !== undefined ? image : rows[0].image,
        description !== undefined ? description : rows[0].description,
        req.params.id,
      ]
    );
    const [updated] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/cars/:id - protected, owner only
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Car not found.' });
    if (rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized.' });

    await db.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
    res.json({ message: 'Car deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
