const db = require('./db/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const adminEmail = 'admin@store.com';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Check if admin already exists
  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, user) => {
    if (err) {
      console.error('Error checking admin user:', err);
      return;
    }
    
    if (!user) {
      // Create admin user
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', adminEmail, hashedPassword, 'admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email: admin@store.com');
            console.log('🔑 Password: admin123');
            console.log('👑 Role: admin');
          }
        }
      );
    } else {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@store.com');
      console.log('🔑 Password: admin123');
    }
  });
}

// Create additional test users
async function createTestUsers() {
  const testUsers = [
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
    },
    {
      name: 'Another Admin',
      email: 'admin2@store.com',
      password: 'admin123',
      role: 'admin'
    }
  ];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    db.get('SELECT * FROM users WHERE email = ?', [userData.email], (err, user) => {
      if (err) {
        console.error(`Error checking user ${userData.email}:`, err);
        return;
      }
      
      if (!user) {
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [userData.name, userData.email, hashedPassword, userData.role],
          function(err) {
            if (err) {
              console.error(`Error creating user ${userData.email}:`, err);
            } else {
              console.log(`✅ ${userData.role} user created: ${userData.email}`);
            }
          }
        );
      } else {
        console.log(`✅ ${userData.role} user already exists: ${userData.email}`);
      }
    });
  }
}

// List all users in database
function listAllUsers() {
  console.log('\n📋 All Users in Database:');
  console.log('========================');
  
  db.all('SELECT id, name, email, role FROM users', [], (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id} | Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
      });
    }
  });
}

// Main execution
async function main() {
  console.log('🔧 Creating Admin and Test Users...');
  console.log('=====================================\n');
  
  await createAdminUser();
  await createTestUsers();
  
  // Wait a bit for all operations to complete
  setTimeout(() => {
    listAllUsers();
    
    console.log('\n📋 Login Credentials:');
    console.log('=====================');
    console.log('👑 Admin: admin@store.com / admin123');
    console.log('👑 Admin 2: admin2@store.com / admin123');
    console.log('👤 User: user@test.com / user123');
    console.log('🏪 Owner: owner@test.com / owner123');
    console.log('=====================\n');
  }, 2000);
}

main().catch(console.error); 