const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Get ratings submitted for this owner's store
router.get('/ratings', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;
    console.log("OWNER EMAIL:", ownerEmail);

    // Find stores owned by this user
    const storeResult = await query('SELECT id, name, address FROM stores WHERE store_owner_email = $1', [ownerEmail]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No stores found for this owner' });
    }

    // Get ratings for all stores owned by this owner
    const allRatings = [];
    for (const store of storeResult.rows) {
      const ratingResult = await query(`
        SELECT 
          users.name AS user_name, 
          users.email AS user_email, 
          ratings.rating, 
          ratings.review,
          stores.name AS store_name
        FROM ratings
        JOIN users ON users.id = ratings.user_id
        JOIN stores ON stores.id = ratings.store_id
        WHERE ratings.store_id = $1
      `, [store.id]);
      
      allRatings.push(...ratingResult.rows);
    }

    res.json({ 
      ownerEmail: ownerEmail, 
      stores: storeResult.rows,
      ratings: allRatings 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average rating for all stores owned by this owner
router.get('/average-rating', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;

    const storeResult = await query('SELECT id, name FROM stores WHERE store_owner_email = $1', [ownerEmail]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No stores found for this owner' });
    }

    // Calculate average rating for all stores
    const storeAverages = [];
    for (const store of storeResult.rows) {
      const avgResult = await query('SELECT AVG(rating) as average_rating FROM ratings WHERE store_id = $1', [store.id]);
      const average_rating = parseFloat(avgResult.rows[0].average_rating) || 0;
      storeAverages.push({
        storeId: store.id,
        storeName: store.name,
        average_rating
      });
    }

    res.json({ 
      ownerEmail: ownerEmail, 
      stores: storeAverages 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
