const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Debug endpoint to list all users (remove in production)
router.get('/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users });
  });
});

// Create admin user endpoint
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@store.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin User', adminEmail, hashedPassword, 'admin'],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ 
              message: 'Admin user created successfully',
              email: adminEmail,
              password: adminPassword
            });
          }
        );
      } else {
        res.json({ 
          message: 'Admin user already exists',
          email: adminEmail,
          password: adminPassword
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signup Route
router.post('/register', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, hashedPassword, address, role], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email },  // include email
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  });
});

module.exports = router;
