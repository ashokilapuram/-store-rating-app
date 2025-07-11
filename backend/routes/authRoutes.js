const express = require('express');
const router = express.Router();
const { query } = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Debug endpoint to list all users (remove in production)
router.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role FROM users');
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create admin user endpoint
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@store.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const result = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (result.rows.length === 0) {
      const insertResult = await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
        ['Admin User', adminEmail, hashedPassword, 'admin']
      );
      res.json({ 
        message: 'Admin user created successfully',
        email: adminEmail,
        password: adminPassword,
        userId: insertResult.rows[0].id
      });
    } else {
      res.json({ 
        message: 'Admin user already exists',
        email: adminEmail,
        password: adminPassword
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signup Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, address, role]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully', 
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

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
