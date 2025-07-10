const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get ratings submitted for this owner's store
router.get('/ratings', authenticateToken, authorizeRoles('owner'), (req, res) => {
  const ownerEmail = req.user.email;
  console.log("OWNER JWT EMAIL:", ownerEmail);

  // Find store owned by this user
  const storeQuery = `SELECT id FROM stores WHERE email = ?`;
  db.get(storeQuery, [ownerEmail], (err, store) => {
    if (err || !store) return res.status(404).json({ error: 'Store not found' });

    const ratingQuery = `
      SELECT users.name AS user_name, users.email AS user_email, ratings.rating
      FROM ratings
      JOIN users ON users.id = ratings.user_id
      WHERE ratings.store_id = ?
    `;

    db.all(ratingQuery, [store.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ storeId: store.id, ratings: rows });
    });
  });
});

// Get average rating for this store
router.get('/average-rating', authenticateToken, authorizeRoles('owner'), (req, res) => {
  const ownerEmail = req.user.email;

  const storeQuery = `SELECT id FROM stores WHERE email = ?`;
  db.get(storeQuery, [ownerEmail], (err, store) => {
    if (err || !store) return res.status(404).json({ error: 'Store not found' });

    const avgQuery = `SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = ?`;

    db.get(avgQuery, [store.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ storeId: store.id, average_rating: row.average_rating || 0 });
    });
  });
});

module.exports = router;
