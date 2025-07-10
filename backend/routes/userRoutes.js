const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get all stores (open to logged-in users)
router.get('/stores', authenticateToken, authorizeRoles('user', 'admin', 'owner'), (req, res) => {
  const query = `
    SELECT 
      s.id, 
      s.name, 
      s.address,
      ROUND(AVG(r.rating), 1) as average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Submit a rating
// Submit a rating
router.post('/rate', authenticateToken, authorizeRoles('user'), (req, res) => {
  const { store_id, rating, review = "" } = req.body;
  const user_id = req.user.userId;

  const query = `INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)`;

  db.run(query, [user_id, store_id, rating, review], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Rating and review submitted', ratingId: this.lastID });
  });
});


// Update a rating
router.put('/rate/:store_id', authenticateToken, authorizeRoles('user'), (req, res) => {
  const { rating } = req.body;
  const { store_id } = req.params;
  const user_id = req.user.userId;

  const query = `UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`;

  db.run(query, [rating, user_id, store_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Rating updated' });
  });
});

// Get average ratings for each store
// Get average ratings for each store
router.get('/ratings', authenticateToken, authorizeRoles('user'), async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT s.id AS storeId, s.name, s.address, r.rating, r.review
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = ?
    `;

    const userRatings = await db.all(query, [userId]);
    res.json(userRatings);
  } catch (err) {
    console.error("Error fetching user ratings:", err);
    res.status(500).json({ error: "Failed to fetch user ratings" });
  }
});





module.exports = router;
