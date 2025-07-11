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
    
    console.log("Stores found for owner:", storeResult.rows);

    if (storeResult.rows.length === 0) {
      return res.json({ 
        ownerEmail: ownerEmail, 
        stores: [],
        ratings: [],
        message: 'No stores assigned to this owner yet. Admin needs to assign stores to you.'
      });
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
    
    console.log("Stores found for average calculation:", storeResult.rows);

    if (storeResult.rows.length === 0) {
      return res.json({ 
        ownerEmail: ownerEmail, 
        stores: [],
        message: 'No stores assigned to this owner yet. Admin needs to assign stores to you.'
      });
    }

    // Calculate average rating for all stores
    const storeAverages = [];
    let totalAverage = 0;
    let storeCount = 0;

    for (const store of storeResult.rows) {
      const avgResult = await query('SELECT AVG(rating) as average_rating, COUNT(rating) as rating_count FROM ratings WHERE store_id = $1', [store.id]);
      const average_rating = parseFloat(avgResult.rows[0].average_rating) || 0;
      const rating_count = parseInt(avgResult.rows[0].rating_count) || 0;
      
      storeAverages.push({
        storeId: store.id,
        storeName: store.name,
        average_rating,
        rating_count
      });

      if (average_rating > 0) {
        totalAverage += average_rating;
        storeCount++;
      }
    }

    const overallAverage = storeCount > 0 ? totalAverage / storeCount : 0;

    res.json({ 
      ownerEmail: ownerEmail, 
      stores: storeAverages,
      overallAverage: parseFloat(overallAverage.toFixed(1))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to create sample data (remove in production)
router.post('/create-sample-data', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const ownerEmail = req.user.email;
    
    // Create a sample store for this owner
    const storeResult = await query(
      'INSERT INTO stores (name, email, address, store_owner_email) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Sample Store', 'sample@store.com', '123 Main St', ownerEmail]
    );
    
    const storeId = storeResult.rows[0].id;
    
    // Create some sample ratings
    await query(
      'INSERT INTO ratings (user_id, store_id, rating, review) VALUES ($1, $2, $3, $4)',
      [1, storeId, 4, 'Great store!']
    );
    
    await query(
      'INSERT INTO ratings (user_id, store_id, rating, review) VALUES ($1, $2, $3, $4)',
      [2, storeId, 5, 'Excellent service!']
    );
    
    res.json({ 
      message: 'Sample data created successfully',
      storeId: storeId,
      ownerEmail: ownerEmail
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
