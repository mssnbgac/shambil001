# 🚀 Deployment Guide - Shambil Pride Academy

This guide covers how to deploy your Shambil Pride Academy School Management System to various platforms.

## 📋 Pre-Deployment Checklist

### ✅ Build Verification
- [x] Frontend builds successfully (`npm run build` in client directory)
- [x] Backend compiles without errors
- [x] All dependencies are properly installed
- [x] Environment variables are configured
- [x] Database is properly set up

### ✅ Code Quality
- [x] TypeScript compilation successful
- [x] ESLint warnings addressed (non-blocking)
- [x] Git repository initialized and committed
- [x] .gitignore properly configured

## 🌐 Deployment Options

### 1. Heroku Deployment (Recommended)

#### Prerequisites
- Heroku CLI installed
- Heroku account created

#### Steps

1. **Install Heroku CLI** (if not already installed)
   ```bash
   # Windows (using npm)
   npm install -g heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create shambil-pride-academy
   # Or use your preferred app name
   ```

4. **Add PostgreSQL Database** (for production)
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secure-jwt-secret-key
   heroku config:set PORT=4000
   ```

6. **Create Procfile**
   ```bash
   echo "web: cd server && npm start" > Procfile
   ```

7. **Update package.json for Heroku**
   Add to root package.json:
   ```json
   {
     "scripts": {
       "heroku-postbuild": "cd client && npm install && npm run build && cd ../server && npm install",
       "start": "cd server && npm start"
     },
     "engines": {
       "node": "18.x",
       "npm": "9.x"
     }
   }
   ```

8. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

### 2. Vercel Deployment (Frontend + Serverless)

#### Frontend Deployment
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel --prod
   ```

#### Backend as Serverless Functions
1. **Create vercel.json in root**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
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

### 3. DigitalOcean App Platform

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Frontend**: 
     - Build Command: `cd client && npm install && npm run build`
     - Output Directory: `client/build`
   - **Backend**:
     - Build Command: `cd server && npm install && npm run build`
     - Run Command: `cd server && npm start`

### 4. AWS Deployment

#### Using AWS Amplify (Frontend) + Elastic Beanstalk (Backend)

1. **Frontend on AWS Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Backend on Elastic Beanstalk**
   - Create application zip file
   - Upload to Elastic Beanstalk
   - Configure environment variables

## 🔧 Production Configuration

### Environment Variables

Create production environment files:

**server/.env.production**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

**client/.env.production**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENVIRONMENT=production
```

### Database Migration

For production deployment with PostgreSQL:

1. **Install PostgreSQL dependencies**
   ```bash
   cd server
   npm install pg @types/pg
   ```

2. **Update database configuration**
   ```typescript
   // server/src/config/database.ts
   const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:database.sqlite', {
     dialect: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
     logging: process.env.NODE_ENV === 'development' ? console.log : false,
     dialectOptions: process.env.NODE_ENV === 'production' ? {
       ssl: {
         require: true,
         rejectUnauthorized: false
       }
     } : {}
   });
   ```

### Build Optimization

1. **Client Build Optimization**
   ```json
   // client/package.json
   {
     "scripts": {
       "build": "GENERATE_SOURCEMAP=false react-scripts build"
     }
   }
   ```

2. **Server Build Configuration**
   ```json
   // server/package.json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js",
       "dev": "ts-node src/index.ts"
     }
   }
   ```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] Environment variables secured
- [ ] Database credentials secured
- [ ] Regular security updates

### Security Headers

Add to server configuration:
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 📊 Monitoring & Maintenance

### Health Checks

Add health check endpoint:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging

Implement proper logging:
```bash
npm install winston
```

### Database Backups

Set up automated database backups:
- Heroku: Automatic with Heroku Postgres
- AWS: RDS automated backups
- DigitalOcean: Managed database backups

## 🚀 Go Live Checklist

### Final Steps Before Launch

1. **Test Production Build Locally**
   ```bash
   # Build both client and server
   cd client && npm run build
   cd ../server && npm run build
   
   # Test production server
   NODE_ENV=production npm start
   ```

2. **Domain Configuration**
   - Purchase domain name
   - Configure DNS settings
   - Set up SSL certificate

3. **Performance Testing**
   - Load testing
   - Database performance
   - Frontend optimization

4. **User Acceptance Testing**
   - Test all user roles
   - Verify all features work
   - Check mobile responsiveness

5. **Documentation**
   - Update README.md
   - Create user manuals
   - Document API endpoints

## 📞 Support & Maintenance

### Post-Deployment Support

- Monitor application logs
- Set up error tracking (Sentry, LogRocket)
- Regular database maintenance
- Security updates
- Feature updates based on user feedback

### Contact Information

For deployment support:
- **School**: Shambil Pride Academy
- **Email**: shehubala70@gmail.com
- **Phone**: +2348079387958, +2348034012480

---

**🎉 Your school management system is ready for production deployment!**