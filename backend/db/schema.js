const { query } = require('./database');
const bcrypt = require('bcryptjs');

// Create Users table
const createUsersTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        role VARCHAR(20) CHECK(role IN ('admin', 'user', 'owner')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');
  } catch (err) {
    console.error('❌ Error creating users table:', err);
  }
};

// Create Stores table
const createStoresTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        store_owner_email VARCHAR(255) REFERENCES users(email) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Stores table created/verified');
  } catch (err) {
    console.error('❌ Error creating stores table:', err);
  }
};

// Create Ratings table
const createRatingsTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Ratings table created/verified');
  } catch (err) {
    console.error('❌ Error creating ratings table:', err);
  }
};

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@store.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const result = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (result.rows.length === 0) {
      await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin user created successfully');
      console.log('📧 Admin Email: admin@store.com');
      console.log('🔑 Admin Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  }
};

// Create some sample users for testing
const createSampleUsers = async () => {
  const sampleUsers = [
    {
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user'
    },
    {
      name: 'Test Owner',
      email: 'owner@test.com',
      password: 'owner123',
      role: 'owner'
    }
  ];

  for (const userData of sampleUsers) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const result = await query('SELECT * FROM users WHERE email = $1', [userData.email]);
      
      if (result.rows.length === 0) {
        await query(
          'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
          [userData.name, userData.email, hashedPassword, userData.role]
        );
        console.log(`✅ ${userData.role} user created: ${userData.email}`);
      }
    } catch (err) {
      console.error(`❌ Error creating user ${userData.email}:`, err);
    }
  }
};

// Initialize database with sample data
const initializeDatabase = async () => {
  console.log('🗄️ Initializing PostgreSQL database...');
  
  try {
    // Create tables
    await createUsersTable();
    await createStoresTable();
    await createRatingsTable();
    
    // Create sample users
    await createAdminUser();
    await createSampleUsers();
    
    console.log('\n📋 Sample Login Credentials:');
    console.log('=============================');
    console.log('👑 Admin: admin@store.com / admin123');
    console.log('👤 User: user@test.com / user123');
    console.log('🏪 Owner: owner@test.com / owner123');
    console.log('=============================\n');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  }
};

// Run initialization
initializeDatabase();
