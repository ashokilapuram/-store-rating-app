const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get ratings submitted for this owner's store
router.get('/ratings', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;
    console.log("OWNER JWT EMAIL:", ownerEmail);

    // Find store owned by this user
    const storeResult = await query('SELECT id FROM stores WHERE email = $1', [ownerEmail]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = storeResult.rows[0];
    const ratingResult = await query(`
      SELECT users.name AS user_name, users.email AS user_email, ratings.rating, ratings.review
      FROM ratings
      JOIN users ON users.id = ratings.user_id
      WHERE ratings.store_id = $1
    `, [store.id]);

    res.json({ storeId: store.id, ratings: ratingResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average rating for this store
router.get('/average-rating', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;

    const storeResult = await query('SELECT id FROM stores WHERE email = $1', [ownerEmail]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = storeResult.rows[0];
    const avgResult = await query('SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1', [store.id]);

    const average_rating = parseFloat(avgResult.rows[0].average_rating) || 0;
    res.json({ storeId: store.id, average_rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
