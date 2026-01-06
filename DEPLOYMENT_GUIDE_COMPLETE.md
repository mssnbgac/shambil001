# 🚀 Complete Deployment Guide - Shambil Pride Academy Management System

## 🎯 **Deployment Overview**
Deploy the full-stack school management system with all features including messaging, class positions, and Nigerian curriculum.

---

## 📋 **Pre-Deployment Checklist**

### ✅ **System Features to Deploy:**
- **30 Classes** (KG to SS3 Science & Arts)
- **37 Subjects** (Complete Nigerian curriculum)
- **Enhanced Messaging System** (Real-time parent-admin communication)
- **Class Position Calculation** (Automatic ranking system)
- **Multi-role Authentication** (Admin, Teacher, Parent, Student, Exam Officer)
- **Results Management** (Grade entry and position tracking)
- **SQLite Database** (With demo data and proper relationships)

### ✅ **Current System Status:**
- **Backend**: Node.js/Express + TypeScript + SQLite
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: SQLite with complete Nigerian school structure
- **Authentication**: JWT-based secure login system

---

## 🌐 **Deployment Options**

## **Option 1: Vercel (Recommended - Free Tier Available)**

### **Why Vercel?**
- ✅ **Free hosting** for both frontend and backend
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in database** support (Vercel Postgres)
- ✅ **Global CDN** for fast loading
- ✅ **Easy domain setup**

### **Step 1: Prepare for Vercel Deployment**

#### **1.1 Create Production Environment Files**
```bash
# Create production environment
cp server/.env server/.env.production
```

#### **1.2 Update Backend for Vercel**
Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/src/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **1.3 Update Package.json for Vercel**
Add to root `package.json`:
```json
{
  "name": "shambil-pride-academy",
  "version": "1.0.0",
  "scripts": {
    "build": "cd client && npm install && npm run build && cd ../server && npm install && npm run build",
    "start": "cd server && npm start"
  }
}
```

### **Step 2: Deploy to Vercel**

#### **2.1 Install Vercel CLI**
```bash
npm install -g vercel
```

#### **2.2 Login and Deploy**
```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: shambil-pride-academy
# - Directory: ./
# - Override settings? No
```

#### **2.3 Set Environment Variables**
```bash
# Set production environment variables
vercel env add JWT_SECRET
# Enter: shambil_pride_academy_jwt_secret_key_2024_birnin_gwari_production

vercel env add NODE_ENV
# Enter: production

vercel env add SCHOOL_NAME
# Enter: Shambil Pride Academy Birnin Gwari
```

---

## **Option 2: Railway (Excellent for Full-Stack)**

### **Why Railway?**
- ✅ **PostgreSQL database** included
- ✅ **Automatic deployments** from GitHub
- ✅ **Environment variables** management
- ✅ **Custom domains** support
- ✅ **$5/month** starter plan

### **Step 1: Prepare for Railway**

#### **1.1 Create Railway Configuration**
Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:production",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### **1.2 Update for PostgreSQL**
Install PostgreSQL adapter:
```bash
cd server
npm install pg @types/pg
```

### **Step 2: Deploy to Railway**

#### **2.1 Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **2.2 Login and Deploy**
```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## **Option 3: Heroku (Traditional PaaS)**

### **Why Heroku?**
- ✅ **Mature platform** with extensive documentation
- ✅ **Add-ons ecosystem** (databases, monitoring)
- ✅ **Git-based deployments**
- ✅ **Free tier** available (with limitations)

### **Step 1: Prepare for Heroku**

#### **1.1 Create Procfile**
```
web: cd server && npm start
```

#### **1.2 Update Package.json**
Add to root `package.json`:
```json
{
  "scripts": {
    "heroku-postbuild": "cd client && npm install && npm run build && cd ../server && npm install && npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

### **Step 2: Deploy to Heroku**

#### **2.1 Install Heroku CLI**
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### **2.2 Create and Deploy**
```bash
# Login to Heroku
heroku login

# Create app
heroku create shambil-pride-academy

# Set environment variables
heroku config:set JWT_SECRET=shambil_pride_academy_jwt_secret_key_2024_birnin_gwari_production
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## **Option 4: DigitalOcean App Platform**

### **Why DigitalOcean?**
- ✅ **Managed databases** (PostgreSQL, MySQL)
- ✅ **Auto-scaling** capabilities
- ✅ **Built-in monitoring**
- ✅ **$12/month** starting price

### **Step 1: Create App Spec**
Create `.do/app.yaml`:
```yaml
name: shambil-pride-academy
services:
- name: api
  source_dir: server
  github:
    repo: your-username/shambil-pride-academy
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: shambil_pride_academy_jwt_secret_key_2024_birnin_gwari_production

- name: web
  source_dir: client
  github:
    repo: your-username/shambil-pride-academy
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: shambil-db
  engine: PG
  version: "13"
```

---

## **Option 5: Self-Hosted VPS (Full Control)**

### **Why VPS?**
- ✅ **Complete control** over environment
- ✅ **Cost-effective** for long-term hosting
- ✅ **Custom configurations** possible
- ✅ **Multiple apps** on same server

### **Recommended VPS Providers:**
- **DigitalOcean Droplets** ($6/month)
- **Linode** ($5/month)
- **Vultr** ($6/month)
- **AWS EC2** (Variable pricing)

### **Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

### **Step 2: Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-username/shambil-pride-academy.git
cd shambil-pride-academy

# Install dependencies
cd server && npm install && npm run build
cd ../client && npm install && npm run build

# Start with PM2
cd ../server
pm2 start dist/index.js --name "shambil-api"
pm2 startup
pm2 save
```

### **Step 3: Configure Nginx**
Create `/etc/nginx/sites-available/shambil-pride-academy`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve React app
    location / {
        root /path/to/shambil-pride-academy/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 **Pre-Deployment Configuration**

### **1. Update API URLs for Production**

#### **Frontend Configuration**
Update `client/src/config/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'  // Production URL
  : 'http://localhost:4000/api';   // Development URL

export default API_BASE_URL;
```

#### **Update All API Calls**
Replace hardcoded localhost URLs:
```typescript
// Before
const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// After
import API_BASE_URL from '../config/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});
```

### **2. Environment Variables Setup**

#### **Production Environment Variables**
```bash
# Required for all platforms
NODE_ENV=production
JWT_SECRET=shambil_pride_academy_jwt_secret_key_2024_birnin_gwari_production
JWT_EXPIRE=7d

# School Information
SCHOOL_NAME=Shambil Pride Academy Birnin Gwari
SCHOOL_ADDRESS=Birnin Gwari, Kaduna State, Nigeria
SCHOOL_PHONE=+234-xxx-xxx-xxxx
SCHOOL_EMAIL=info@shambilprideacademy.edu.ng

# Database (if using external DB)
DATABASE_URL=postgresql://username:password@host:port/database
```

### **3. Database Migration for Production**

#### **For PostgreSQL (Railway, Heroku, etc.)**
Create `server/migrate-to-postgres.js`:
```javascript
// Script to migrate SQLite data to PostgreSQL
// This will be provided separately if needed
```

---

## 🚀 **Recommended Deployment Strategy**

### **For Development/Testing: Vercel**
- **Cost**: Free
- **Setup Time**: 10 minutes
- **Best For**: Quick deployment and testing

### **For Production: Railway or DigitalOcean**
- **Cost**: $5-12/month
- **Setup Time**: 30 minutes
- **Best For**: Reliable production hosting

### **For Enterprise: Self-Hosted VPS**
- **Cost**: $6-20/month
- **Setup Time**: 2-3 hours
- **Best For**: Full control and customization

---

## 📱 **Post-Deployment Checklist**

### ✅ **Functionality Testing**
- [ ] **Authentication**: All user roles can login
- [ ] **Messaging System**: Parent-admin communication works
- [ ] **Result Entry**: Teachers can submit results
- [ ] **Position Calculation**: Class positions display correctly
- [ ] **Database**: All 30 classes and 37 subjects loaded
- [ ] **Responsive Design**: Works on mobile and desktop

### ✅ **Performance Optimization**
- [ ] **Frontend**: React build optimized
- [ ] **Backend**: Production environment configured
- [ ] **Database**: Indexes created for performance
- [ ] **CDN**: Static assets served efficiently

### ✅ **Security Configuration**
- [ ] **HTTPS**: SSL certificate installed
- [ ] **Environment Variables**: Secrets properly configured
- [ ] **CORS**: Configured for production domain
- [ ] **Rate Limiting**: API protection enabled

---

## 🎯 **Next Steps**

1. **Choose Deployment Platform** (Recommended: Vercel for quick start)
2. **Update API URLs** in frontend code
3. **Set Environment Variables** for production
4. **Deploy and Test** all functionality
5. **Configure Custom Domain** (optional)
6. **Set up Monitoring** and backups

Would you like me to help you with a specific deployment platform? I can provide detailed step-by-step instructions for your preferred option!

---

*Deployment Guide Created: January 6, 2026*  
*Status: ✅ Ready for Production Deployment*