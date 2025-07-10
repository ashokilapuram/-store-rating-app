# 🚀 Deployment Guide: Vercel + Render

This guide will help you deploy your Store Rating App using **Vercel** for the frontend and **Render** for the backend.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Your project pushed to GitHub

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Setup Render Project
1. Go to [Render.com](https://render.com)
2. Sign up/login with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository

### 1.2 Configure Render Settings
1. **Name:** `store-rating-backend` (or your preferred name)
2. **Root Directory:** `backend`
3. **Runtime:** `Node`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`

### 1.3 Add Environment Variables
Click **"Environment"** and add:
```
JWT_SECRET=your-super-secret-jwt-key-here
DB_PATH=./db/store-rating.db
PORT=10000
NODE_ENV=production
```

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy the generated URL (e.g., `https://your-app-name.onrender.com`)

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Setup Vercel Project
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click **"New Project"**
4. Import your GitHub repository

### 2.2 Configure Vercel Settings
1. Set **Root Directory** to `frontend`
2. Configure build settings:
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### 2.3 Add Environment Variables
Add this environment variable:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## 🔧 Step 3: Update API Configuration

### 3.1 Update Frontend API URL
1. In Vercel dashboard, go to your project settings
2. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```
3. Redeploy the frontend

### 3.2 Test the Connection
1. Visit your Vercel frontend URL
2. Try to register/login
3. Check if API calls work

## 🔒 Step 4: Security & Production Setup

### 4.1 Generate Strong JWT Secret
```bash
# Generate a random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4.2 Update Render Environment Variables
1. Go to Render dashboard
2. Add the generated JWT secret:
   ```
   JWT_SECRET=your-generated-secret-here
   ```

### 4.3 Enable HTTPS (Automatic)
- Vercel provides HTTPS automatically
- Render provides HTTPS automatically

## 🚨 Troubleshooting

### Common Issues:

#### 1. CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:** 
- Add CORS configuration in backend
- Check that API URLs are correct

#### 2. Environment Variables Not Working
**Problem:** API calls still go to localhost
**Solution:**
- Verify environment variables are set correctly
- Redeploy after changing environment variables

#### 3. Database Issues
**Problem:** Database not persisting
**Solution:**
- Render provides persistent storage
- Check database path configuration

#### 4. Build Failures
**Problem:** Frontend won't build
**Solution:**
- Check all imports are correct
- Verify all dependencies are in package.json
- Check for syntax errors

#### 5. Render Sleep Issues
**Problem:** Backend goes to sleep after inactivity
**Solution:**
- Free tier has sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider paid plan for always-on service

## 📊 Monitoring & Maintenance

### Render (Backend)
- **Logs:** Available in Render dashboard
- **Metrics:** Request count, response time
- **Scaling:** Automatic scaling available

### Vercel (Frontend)
- **Analytics:** Built-in analytics
- **Performance:** Automatic optimization
- **CDN:** Global CDN for fast loading

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Render:** Deploys on every push to main branch
- **Vercel:** Deploys on every push to main branch

## 💰 Cost Estimation

### Free Tier Limits:
- **Vercel:** 100GB bandwidth/month, unlimited deployments
- **Render:** Free tier includes sleep after 15 minutes inactivity

### Paid Plans:
- **Vercel Pro:** $20/month for more features
- **Render:** $7/month for always-on service

## 🎉 Success!

Your app is now deployed and accessible worldwide! 

**Frontend:** `https://your-app-name.vercel.app`
**Backend:** `https://your-app-name.onrender.com`

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **GitHub Issues:** For project-specific issues
