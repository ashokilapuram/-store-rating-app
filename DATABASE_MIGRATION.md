# 🗄️ Database Migration Guide: SQLite → PostgreSQL

## 🎯 **Why Migrate to PostgreSQL?**

- **Production Ready**: PostgreSQL is designed for production deployments
- **Better Performance**: Handles concurrent users and large datasets
- **Reliability**: ACID compliance and data integrity
- **Scalability**: Can handle growing data and user base
- **Cloud Support**: Works seamlessly with Railway, Render, Heroku, etc.

## 🚀 **Step 1: Install PostgreSQL**

### **Windows:**

1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for `postgres` user

### **macOS:**

```bash
brew install postgresql
brew services start postgresql
```

### **Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ **Step 2: Create Database**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE store_rating_dev;

# Exit
\q
```

## ⚙️ **Step 3: Configure Environment**

1. Copy the environment file:

```bash
cp env.example .env
```

2. Update `.env` with your PostgreSQL credentials:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=store_rating_dev
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

## 🔧 **Step 4: Install Dependencies**

```bash
cd backend
npm install pg
```

## 🚀 **Step 5: Test Local Setup**

```bash
# Start the backend
npm start
```

You should see:

```
✅ Connected to PostgreSQL database
🗄️ Database: store_rating_dev
🌍 Host: localhost:5432
✅ Users table created/verified
✅ Stores table created/verified
✅ Ratings table created/verified
```

## ☁️ **Step 6: Production Deployment**

### **Option A: Railway (Recommended)**

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Connect your GitHub repo
5. Set environment variables:
   - `DATABASE_URL` (auto-provided by Railway)
   - `JWT_SECRET` (your secret key)
   - `NODE_ENV=production`

### **Option B: Render**

1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Add PostgreSQL service
5. Set environment variables

### **Option C: Heroku**

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
4. Deploy: `git push heroku main`

## 🔄 **Migration Benefits**

### **Before (SQLite):**

- ❌ File-based database
- ❌ Not suitable for production
- ❌ Deployment issues
- ❌ Limited concurrent users

### **After (PostgreSQL):**

- ✅ Client-server architecture
- ✅ Production-ready
- ✅ Cloud deployment friendly
- ✅ Handles multiple users
- ✅ Better performance
- ✅ Data integrity

## 🧪 **Testing**

### **Local Testing:**

```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm start
```

### **Login Credentials:**

- **Admin**: admin@store.com / admin123
- **User**: user@test.com / user123
- **Owner**: owner@test.com / owner123

## 🚨 **Troubleshooting**

### **Connection Issues:**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### **Permission Issues:**

```bash
# Connect as postgres user
sudo -u postgres psql

# Create user and database
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE store_rating_dev OWNER your_username;
GRANT ALL PRIVILEGES ON DATABASE store_rating_dev TO your_username;
```

### **Environment Variables:**

- Ensure `.env` file exists in backend directory
- Check all database variables are set correctly
- Restart the server after changing environment variables

## 📊 **Performance Comparison**

| Feature          | SQLite    | PostgreSQL |
| ---------------- | --------- | ---------- |
| Concurrent Users | 1-10      | 1000+      |
| Data Size        | Limited   | Unlimited  |
| Production Ready | ❌        | ✅         |
| Cloud Deployment | Difficult | Easy       |
| Performance      | Basic     | Advanced   |

## 🎉 **Next Steps**

1. **Test locally** with PostgreSQL
2. **Deploy to Railway/Render** for production
3. **Monitor performance** and user experience
4. **Scale as needed** with your growing user base

Your app is now ready for production deployment! 🚀
