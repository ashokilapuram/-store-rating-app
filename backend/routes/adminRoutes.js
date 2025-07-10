const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin dashboard test route
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});

// Get all stores
router.get('/stores', authenticateToken, authorizeRoles('admin'), (req, res) => {
  db.all("SELECT * FROM stores", [], (err, rows) => {
    if (err) {
      console.error("Error fetching stores:", err);
      return res.status(500).json({ error: 'Failed to fetch stores' });
    }
    res.json(Array.isArray(rows) ? rows : []);
  });
});

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(Array.isArray(rows) ? rows : []);
  });
});

// Admin summary: total users, total stores, total ratings
router.get('/summary', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const summary = {};

  db.get("SELECT COUNT(*) AS totalUsers FROM users", [], (err, userRow) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user count' });
    summary.totalUsers = userRow.totalUsers || 0;

    db.get("SELECT COUNT(*) AS totalStores FROM stores", [], (err, storeRow) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch store count' });
      summary.totalStores = storeRow.totalStores || 0;

      db.get("SELECT COUNT(*) AS totalRatings FROM ratings", [], (err, ratingRow) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch rating count' });
        summary.totalRatings = ratingRow.totalRatings || 0;

        res.json(summary);
      });
    });
  });
});

// Add a new store
router.post('/add-store', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { name, email, address } = req.body;
  console.log("Adding store:", name, email, address);

  const query = `INSERT INTO stores (name, email, address) VALUES (?, ?, ?)`;

  db.run(query, [name, email, address], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Store added successfully', storeId: this.lastID });
  });
});

// Add a new user
router.post('/add-user', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, hashedPassword, address, role], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User added successfully', userId: this.lastID });
  });
});

module.exports = router;
