const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin dashboard test route
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});

// Get all stores
router.get('/stores', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await query("SELECT * FROM stores");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get owners for store assignment
router.get('/owners', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await query("SELECT name, email FROM users WHERE role = 'owner'");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching owners:", err);
    res.status(500).json({ error: 'Failed to fetch owners' });
  }
});

// Admin summary: total users, total stores, total ratings
router.get('/summary', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [userResult, storeResult, ratingResult] = await Promise.all([
      query("SELECT COUNT(*) AS totalUsers FROM users"),
      query("SELECT COUNT(*) AS totalStores FROM stores"),
      query("SELECT COUNT(*) AS totalRatings FROM ratings")
    ]);

    const summary = {
      totalUsers: parseInt(userResult.rows[0].totalusers) || 0,
      totalStores: parseInt(storeResult.rows[0].totalstores) || 0,
      totalRatings: parseInt(ratingResult.rows[0].totalratings) || 0
    };

    res.json(summary);
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Add a new store
router.post('/add-store', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, address, store_owner_email } = req.body;
    console.log("Adding store:", name, email, address, "Owner Email:", store_owner_email);

    const result = await query(
      'INSERT INTO stores (name, email, address, store_owner_email) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, address, store_owner_email]
    );
    
    res.status(201).json({ 
      message: 'Store added successfully', 
      storeId: result.rows[0].id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new user
router.post('/add-user', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, address, role]
    );
    
    res.status(201).json({ 
      message: 'User added successfully', 
      userId: result.rows[0].id 
    });
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
