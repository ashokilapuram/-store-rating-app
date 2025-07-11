const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get all stores (open to logged-in users)
router.get('/stores', authenticateToken, authorizeRoles('user', 'admin', 'owner'), async (req, res) => {
  try {
    console.log("Fetching stores for user:", req.user.email);
    
    const result = await query(`
      SELECT 
        s.id, 
        s.name, 
        s.address,
        ROUND(AVG(r.rating), 1) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address
    `);
    
    console.log("Stores found:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: err.message });
  }
});

// Submit a rating
router.post('/rate', authenticateToken, authorizeRoles('user'), async (req, res) => {
  try {
    const { store_id, rating, review = "" } = req.body;
    const user_id = req.user.userId;

    const result = await query(
      'INSERT INTO ratings (user_id, store_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, store_id, rating, review]
    );
    
    res.status(201).json({ 
      message: 'Rating and review submitted', 
      ratingId: result.rows[0].id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a rating
router.put('/rate/:store_id', authenticateToken, authorizeRoles('user'), async (req, res) => {
  try {
    const { rating } = req.body;
    const { store_id } = req.params;
    const user_id = req.user.userId;

    const result = await query(
      'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3',
      [rating, user_id, store_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    res.json({ message: 'Rating updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average ratings for each store
router.get('/ratings', authenticateToken, authorizeRoles('user'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT s.id AS storeId, s.name, s.address, r.rating, r.review
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
    `, [userId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user ratings:", err);
    res.status(500).json({ error: "Failed to fetch user ratings" });
  }
});

module.exports = router;
