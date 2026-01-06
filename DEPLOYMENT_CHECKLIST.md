# ✅ Split Deployment Checklist: Frontend (Vercel) + Backend (Render)

## 🎯 **Phase 1: Deploy Backend to Render (10 minutes)**

### **Step 1: Create Render Account**
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub account
- [ ] Verify email address

### **Step 2: Create Web Service**
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: `mssnbgac/shambil001`
- [ ] Configure service settings:
  - **Name**: `shambil-academy-backend`
  - **Region**: `Oregon (US West)` or closest to you
  - **Branch**: `master`
  - **Root Directory**: `server`
  - **Runtime**: `Node`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`

### **Step 3: Add Environment Variables**
Add these in Render dashboard → Environment:
```
NODE_ENV=production
JWT_SECRET=shambil_pride_academy_jwt_secret_key_2024_birnin_gwari_production
PORT=4000
SCHOOL_NAME=Shambil Pride Academy Birnin Gwari
SCHOOL_ADDRESS=Birnin Gwari, Kaduna State, Nigeria
SCHOOL_EMAIL=info@shambilprideacademy.edu.ng
```

### **Step 4: Deploy Backend**
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy your backend URL (e.g., `https://shambil-academy-backend.onrender.com`)

### **Step 5: Test Backend**
- [ ] Visit: `https://your-backend-url.onrender.com/api/health`
- [ ] Should see: `{"status": "OK", "message": "Shambil Pride Academy..."}`

---

## 🎯 **Phase 2: Deploy Frontend to Vercel (5 minutes)**

### **Step 1: Create Vercel Account**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub account
- [ ] Verify email address

### **Step 2: Import Project**
- [ ] Click "New Project"
- [ ] Import `mssnbgac/shambil001` repository
- [ ] Configure project settings:
  - **Framework Preset**: `Create React App`
  - **Root Directory**: `client`
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`
  - **Install Command**: `npm install`

### **Step 3: Add Environment Variable**
Add this in Vercel dashboard → Settings → Environment Variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```
**⚠️ Replace `your-backend-url` with your actual Render URL from Phase 1, Step 4**

### **Step 4: Deploy Frontend**
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy your frontend URL (e.g., `https://shambil001.vercel.app`)

---

## 🎯 **Phase 3: Connect Frontend and Backend (2 minutes)**

### **Step 1: Update Backend CORS**
Go back to Render dashboard → Environment Variables and add:
```
FRONTEND_URL=https://your-vercel-url.vercel.app
```
**⚠️ Replace `your-vercel-url` with your actual Vercel URL from Phase 2, Step 4**

### **Step 2: Redeploy Backend**
- [ ] Render will automatically redeploy after adding the environment variable
- [ ] Wait for redeployment (2-3 minutes)

---

## 🎯 **Phase 4: Test Complete System (5 minutes)**

### **Step 1: Test Login System**
Visit your Vercel frontend URL and test these accounts:

- [ ] **Admin**: admin@shambil.edu.ng / admin123
- [ ] **Parent**: enginboy20@gmail.com / 123456
- [ ] **Teacher**: teacher@shambil.edu.ng / teacher123
- [ ] **Student**: student@shambil.edu.ng / student123

### **Step 2: Test Core Features**
- [ ] **Parent Messaging**: Send message from parent to admin
- [ ] **Admin Reply**: Login as admin and reply to parent message
- [ ] **Results Entry**: Login as teacher and enter student results
- [ ] **Position Display**: Login as student and verify class position shows

### **Step 3: Test Mobile Responsiveness**
- [ ] Open frontend URL on mobile phone
- [ ] Test login and basic navigation
- [ ] Verify responsive design works

---

## 🎯 **Phase 5: Final Configuration (Optional)**

### **Custom Domain (Optional)**
If you have a custom domain:
- [ ] Add domain in Vercel dashboard → Settings → Domains
- [ ] Update DNS records as instructed by Vercel
- [ ] Update `FRONTEND_URL` in Render to use custom domain

### **Monitoring Setup**
- [ ] Check Render logs for any backend errors
- [ ] Check Vercel function logs for frontend issues
- [ ] Set up uptime monitoring (optional)

---

## 📊 **Deployment Summary**

After successful completion, you'll have:

### **✅ Live URLs:**
- **Frontend**: `https://shambil001.vercel.app`
- **Backend**: `https://shambil-academy-backend.onrender.com`
- **API Health**: `https://shambil-academy-backend.onrender.com/api/health`

### **✅ Features Working:**
- **30 Classes**: KG to SS3 Science & Arts
- **37 Subjects**: Complete Nigerian curriculum
- **Real-time Messaging**: Parent-Admin communication
- **Class Positions**: Automatic calculation
- **Multi-role Auth**: Admin, Teacher, Parent, Student
- **Mobile Responsive**: Works on all devices

### **✅ Production Benefits:**
- **Global Performance**: Vercel CDN for frontend
- **Reliable Backend**: Render always-on hosting
- **Secure**: HTTPS on both platforms
- **Scalable**: Auto-scaling on both platforms
- **Cost-Effective**: Free tiers for both platforms

---

## 🐛 **Troubleshooting Guide**

### **Backend Issues:**
- **Build Failed**: Check Render logs, ensure all dependencies in package.json
- **Health Check Failed**: Verify start command and port configuration
- **Database Error**: SQLite database should be included automatically

### **Frontend Issues:**
- **Build Failed**: Check Vercel logs, ensure React build succeeds locally
- **API Connection Failed**: Verify `REACT_APP_API_URL` environment variable
- **CORS Error**: Ensure `FRONTEND_URL` is set correctly in Render

### **Integration Issues:**
- **Login Failed**: Check JWT_SECRET is set in Render
- **Messages Not Working**: Test API endpoints directly
- **Results Not Saving**: Check database permissions and API logs

---

## 🎉 **Success Confirmation**

### **✅ Deployment Complete When:**
- [ ] Backend health endpoint responds correctly
- [ ] Frontend loads without errors
- [ ] All 4 user types can login successfully
- [ ] Parent can send message and admin can reply
- [ ] Teacher can enter results and positions calculate
- [ ] Student can view results with class position
- [ ] System works on mobile devices

### **🎓 Your School Management System is Live!**

**Congratulations!** Your complete Nigerian School Management System is now professionally hosted and ready for daily school operations.

**Share these URLs with your school:**
- **Teachers & Admin**: `https://shambil001.vercel.app`
- **Parents**: `https://shambil001.vercel.app`
- **Students**: `https://shambil001.vercel.app`

---

*Deployment Type: Split (Frontend + Backend)*  
*Estimated Time: 20-25 minutes*  
*Difficulty: Beginner-Friendly*  
*Cost: FREE* ✅