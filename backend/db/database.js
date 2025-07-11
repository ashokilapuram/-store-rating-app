const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  development: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'store_rating_dev',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
};

// Get environment
const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

// Create connection pool
const pool = new Pool(config);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
    console.error('Database config:', {
      host: config.host || 'connection string',
      database: config.database || 'from connection string',
      user: config.user || 'from connection string'
    });
  } else {
    console.log('✅ Connected to PostgreSQL database');
    if (environment === 'development') {
      console.log(`🗄️ Database: ${config.database}`);
      console.log(`🌍 Host: ${config.host}:${config.port}`);
    } else {
      console.log('🌍 Environment: Production');
    }
    release();
  }
});

// Helper function to run queries
const query = (text, params) => pool.query(text, params);

// Export both pool and query function
module.exports = { pool, query };
