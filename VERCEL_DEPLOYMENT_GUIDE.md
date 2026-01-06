# 🚀 Vercel Deployment Guide - Shambil Pride Academy

This guide will help you deploy your Shambil Pride Academy School Management System to Vercel.

## 📋 Pre-Deployment Setup Complete ✅

The following files have been configured for Vercel deployment:

- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.ts` - Serverless function entry point
- ✅ `client/src/utils/api.ts` - Updated API configuration
- ✅ `client/.env.production` - Production environment variables
- ✅ `package.json` - Updated with Vercel build script
- ✅ `.gitignore` - Updated to exclude Vercel files

## 🚀 Deployment Steps

### Step 1: Push to GitHub

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment

   ✨ Added:
   - vercel.json configuration
   - Serverless function setup
   - Production environment variables
   - Updated API endpoints for production
   - Vercel build scripts"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository:**
   - Select "shambil-pride-academy" repository
   - Click "Import"

5. **Configure Project Settings:**
   - **Project Name**: `shambil-pride-academy`
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

6. **Environment Variables:**
   Add these environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   ```

7. **Click "Deploy"**

#### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Details

### Vercel.json Explanation

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "server/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/build/$1"
    }
  ]
}
```

- **Frontend**: Built as static files and served from `/client/build`
- **Backend**: Runs as serverless functions under `/api/*`
- **Routing**: API calls go to serverless functions, everything else to React app

### API Configuration

The client now uses:
- **Development**: `http://localhost:4000/api`
- **Production**: `/api` (relative path for Vercel)

## 🗄️ Database Considerations

### SQLite in Serverless Environment

**Important**: SQLite files are **read-only** in Vercel's serverless environment. For production, consider:

#### Option 1: Use Vercel Postgres (Recommended)
```bash
# Add Vercel Postgres
vercel postgres create
```

#### Option 2: Use PlanetScale (MySQL)
```bash
# Free tier available
# Sign up at planetscale.com
```

#### Option 3: Use Supabase (PostgreSQL)
```bash
# Free tier available
# Sign up at supabase.com
```

### Database Migration Script

If switching to PostgreSQL, update `server/src/config/sqlite-database.ts`:

```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'sqlite:database.sqlite',
  {
    dialect: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
    dialectOptions: process.env.DATABASE_URL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);
```

## 🔒 Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key
DATABASE_URL=your-database-connection-string (if using external DB)
```

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] **Test all user roles** (Admin, Student, Teacher, etc.)
- [ ] **Verify API endpoints** work correctly
- [ ] **Check database operations** (if using external DB)
- [ ] **Test file uploads** (if applicable)
- [ ] **Verify authentication** works
- [ ] **Test responsive design** on mobile
- [ ] **Check console** for any errors

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   ```bash
   # Check build logs in Vercel dashboard
   # Ensure all dependencies are in package.json
   ```

2. **API Routes Not Working:**
   ```bash
   # Verify vercel.json routes configuration
   # Check serverless function logs
   ```

3. **Database Connection Issues:**
   ```bash
   # Verify DATABASE_URL environment variable
   # Check database provider connection limits
   ```

4. **CORS Issues:**
   ```bash
   # Update CORS configuration in server/src/index.ts
   # Add your Vercel domain to allowed origins
   ```

## 📊 Performance Optimization

### Frontend Optimization:
- ✅ Source maps disabled in production
- ✅ Code splitting enabled
- ✅ Static assets optimized

### Backend Optimization:
- ✅ Serverless functions with 30s timeout
- ✅ Database connection pooling
- ✅ Rate limiting enabled

## 🌐 Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to Project → Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate:**
   - Automatically provided by Vercel
   - No additional configuration needed

## 📞 Support

If you encounter issues:

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: Create an issue in your repository
- **School Contact**: shehubala70@gmail.com

## 🎉 Success!

Once deployed, your school management system will be available at:
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

---

**🏫 Shambil Pride Academy School Management System - Now Live on Vercel!**