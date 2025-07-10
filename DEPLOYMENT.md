# Deployment Troubleshooting Guide

## 🔧 **Issues Fixed:**

### 1. **Missing Environment Variables**

- The frontend wasn't configured with the correct API URL for production
- Updated `frontend/src/config/api.js` with a fallback URL and better error handling

### 2. **Poor Error Handling**

- Added detailed error messages and loading states to both Login and Register components
- Added console logging for debugging
- Disabled form inputs during submission to prevent multiple clicks

### 3. **CORS Configuration**

- Updated the backend CORS settings to allow requests from your deployed frontend
- Added specific allowed origins and credentials support

### 4. **API Testing**

- Added a test endpoint `/api/test` to verify backend connectivity
- Created a test component on the home page to help debug API issues

### 5. **Render Deployment Issues** ⚠️ **NEW**

- Fixed database path configuration for production
- Added environment variable validation
- Enhanced error handling and logging
- Updated render.yaml with proper configuration

### 6. **Admin Login Issues** ⚠️ **NEW**

- **Problem**: Admin users not being created automatically
- **Problem**: Database being reset on each deployment
- **Solution**: Auto-create admin and test users on database initialization
- **Solution**: Added debug endpoints to check users and create admin

## 🚀 **Next Steps:**

### 1. **Set Environment Variables in Vercel:**

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Add this environment variable:
   ```
   Name: REACT_APP_API_URL
   Value: https://store-rating-backend.onrender.com
   Environment: Production
   ```

### 2. **Fix Render Backend Deployment:**

#### **Option A: Use render.yaml (Recommended)**

1. The updated `render.yaml` file now includes all necessary environment variables
2. Render will automatically generate a JWT_SECRET
3. Deploy using the render.yaml configuration

#### **Option B: Manual Environment Variables**

1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to Environment tab
4. Add/update these variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DB_PATH=/opt/render/project/src/db/store-rating.db
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

### 3. **Test the Fix:**

1. **Test Backend Health:**

   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Test API Connection:**

   - Visit your deployed frontend
   - Click the "Test API Connection" button on the home page
   - Check console logs for debugging information

3. **Test Login:**
   - Try logging in with valid credentials
   - Check browser console for any errors
   - Verify the API URL being used

### 4. **Admin Login Credentials:**

After deployment, the following users will be automatically created:

```
👑 Admin: admin@store.com / admin123
👑 Admin 2: admin2@store.com / admin123
👤 User: user@test.com / user123
🏪 Owner: owner@test.com / owner123
```

### 5. **Debug Admin Issues:**

If admin login still doesn't work:

1. **Check if admin exists:**

   - Visit: `https://your-backend-url.onrender.com/api/auth/users`
   - Should show all users in the database

2. **Create admin manually:**

   - Visit: `https://your-backend-url.onrender.com/api/auth/create-admin`
   - This will create the admin user if it doesn't exist

3. **Run local script:**
   ```bash
   cd backend
   node create-admin.js
   ```

### 6. **Database Persistence:**

**Important**: Render free tier doesn't persist data between deployments. The database will be reset when:

- The service goes to sleep (after 15 minutes of inactivity)
- You redeploy the application
- Render restarts the service

**Solutions:**

1. **Use the auto-creation script** - Users will be recreated automatically
2. **Upgrade to paid plan** - For persistent storage
3. **Use external database** - Like PostgreSQL on Render

### 7. **Debugging Tools Added:**

- **API Test Button**: On the home page to verify backend connectivity
- **Console Logging**: Detailed logs in both Login and Register components
- **Better Error Messages**: Specific error messages for different types of failures
- **Loading States**: Visual feedback during form submission
- **Health Check Endpoint**: `/health` to verify backend status
- **Local Test Script**: `backend/test-local.js` to verify configuration
- **User List Endpoint**: `/api/auth/users` to check database users
- **Admin Creation Endpoint**: `/api/auth/create-admin` to create admin user

## 🔍 **Common Render Errors & Solutions:**

### **Error: "Missing required environment variables"**

**Solution**: Set JWT_SECRET in Render environment variables

### **Error: "Database connection failed"**

**Solution**: The updated database.js now handles production paths correctly

### **Error: "Port already in use"**

**Solution**: Render automatically sets PORT, no need to override

### **Error: "CORS policy"**

**Solution**: Updated CORS configuration includes your frontend domain

### **Error: "Admin login not working"**

**Solution**:

1. Check if admin exists: `/api/auth/users`
2. Create admin: `/api/auth/create-admin`
3. Use credentials: `admin@store.com` / `admin123`

## 🛠️ **Testing Commands:**

### **Local Backend Test:**

```bash
cd backend
node test-local.js
```

### **Create Admin Users:**

```bash
cd backend
node create-admin.js
```

### **API Connection Test:**

```bash
node test-api.js
```

### **Manual API Test:**

```bash
curl https://your-backend-url.onrender.com/health
curl https://your-backend-url.onrender.com/api/test
curl https://your-backend-url.onrender.com/api/auth/users
```

## 📋 **Deployment Checklist:**

- [ ] Set REACT_APP_API_URL in Vercel environment variables
- [ ] Deploy backend with updated render.yaml OR set manual environment variables
- [ ] Test backend health endpoint
- [ ] Test API connection using the test button
- [ ] Check if admin user exists: `/api/auth/users`
- [ ] Create admin if needed: `/api/auth/create-admin`
- [ ] Test admin login: `admin@store.com` / `admin123`
- [ ] Test user login: `user@test.com` / `user123`
- [ ] Test owner login: `owner@test.com` / `owner123`
- [ ] Check all console logs for errors

## 🚨 **If Still Having Issues:**

1. **Check Render Logs**: Go to your Render dashboard → Logs tab
2. **Check Vercel Logs**: Go to your Vercel dashboard → Functions tab
3. **Test API Directly**: Use the test scripts provided
4. **Verify URLs**: Make sure frontend and backend URLs are correct
5. **Check Database**: Use `/api/auth/users` to see if users exist
6. **Create Admin**: Use `/api/auth/create-admin` if admin doesn't exist

The main issues were:

1. **Missing JWT_SECRET** - Now auto-generated or validated
2. **Database path issues** - Now handled properly for production
3. **Environment variable validation** - Now checks required variables on startup
4. **Better error handling** - More detailed error messages and logging
5. **Admin user creation** - Now automatically creates admin and test users
6. **Database persistence** - Added scripts to recreate users after reset

Try these fixes and let me know if you're still experiencing issues!
