# SAIRA ACAD - Complete Setup Guide

## 🎯 Overview

This guide will help you set up the complete SAIRA ACAD platform with:
- Frontend (HTML/CSS/JavaScript)
- Backend (Node.js + Express)
- Database (MongoDB)

## 📦 Step 1: Install Node.js

Node.js is required to run the backend server.

1. Download Node.js from: https://nodejs.org/
2. Choose the **LTS version** (Long Term Support)
3. Run the installer
4. During installation, make sure to check "Add to PATH"
5. Restart PowerShell/Terminal after installation
6. Verify installation by running:
   ```powershell
   node --version
   npm --version
   ```

## 💾 Step 2: Install MongoDB

Choose one option:

### Option A: Local MongoDB (Recommended for Development)

1. Download from: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest
   - Platform: Windows
   - Package: MSI
3. Run installer:
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool - recommended)
4. MongoDB will start automatically
5. Verify it's running by opening MongoDB Compass

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for all)
6. Get connection string
7. Update `.env` file in backend folder with your connection string

## 🚀 Step 3: Install Backend Dependencies

1. Open PowerShell
2. Navigate to backend folder:
   ```powershell
   cd "C:\Users\bvsri\OneDrive\Desktop\Saira\SAIRA\backend"
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Wait for installation to complete

## ▶️ Step 4: Start the Backend Server

In the backend folder, run:
```powershell
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Default admin created (username: admin, password: 1234567@_a)
🚀 Server running on port 5000
```

**Keep this terminal window open!**

## 🌐 Step 5: Open the Frontend

1. Open a new PowerShell window
2. Navigate to the SAIRA folder:
   ```powershell
   cd "C:\Users\bvsri\OneDrive\Desktop\Saira\SAIRA"
   ```
3. If you have Live Server extension in VS Code:
   - Right-click on `index.html`
   - Select "Open with Live Server"
4. Or simply open `index.html` in your browser
   - Note: For full functionality, use a local server (Live Server recommended)

## ✅ Step 6: Test the System

### Test 1: Register a New User
1. Go to the registration page
2. Fill in all fields:
   - Username: TestUser
   - Phone: 1234567890
   - Qualification: B.Ed
   - Email: test@example.com
   - Password: password123
3. Click "Register Now"
4. You should be redirected to the dashboard

### Test 2: Login as User
1. Go to login page
2. Enter your credentials
3. You should see your dashboard

### Test 3: Admin Login
1. Go to admin login page
2. Enter:
   - Username: admin
   - Password: 1234567@_a
3. You should see the admin dashboard with all users

## 🔧 Configuration

### Backend Configuration (.env file)

Located at: `backend/.env`

```env
# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/saira_acad

# Or MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saira_acad

# Server port
PORT=5000

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Frontend URL (update if using different port)
FRONTEND_URL=http://127.0.0.1:5500
```

### Frontend Configuration (js/api-config.js)

Located at: `js/api-config.js`

The API base URL is set to: `http://localhost:5000/api`

If you change the backend port, update this file.

## 📊 Viewing Your Database

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `saira_acad`
4. View collections:
   - `users` - All registered users
   - `admins` - Admin accounts

### Using MongoDB Shell

```powershell
mongosh
use saira_acad
db.users.find()
db.admins.find()
```

## 🔍 Troubleshooting

### Issue: "npm is not recognized"

**Solution**: Node.js is not installed or not in PATH
1. Install Node.js from nodejs.org
2. Restart PowerShell
3. Run: `node --version` to verify

### Issue: "MongoDB connection error"

**Solution A** (Local MongoDB):
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB Server"
3. Start the service
4. Or install MongoDB from mongodb.com

**Solution B** (MongoDB Atlas):
1. Check your internet connection
2. Verify connection string in `.env`
3. Check IP whitelist in Atlas
4. Verify database user credentials

### Issue: "Port 5000 already in use"

**Solution**:
1. Open `.env` file in backend
2. Change PORT to 5001 (or any available port)
3. Update `js/api-config.js` BASE_URL to match

### Issue: "CORS Error" in browser console

**Solution**:
1. Make sure backend is running
2. Check FRONTEND_URL in backend `.env` file
3. Use Live Server or similar local server for frontend

### Issue: Frontend not connecting to backend

**Solution**:
1. Open browser console (F12)
2. Check for error messages
3. Verify backend is running: visit http://localhost:5000
4. Make sure `js/api-config.js` is loaded in HTML files

## 📁 Project Structure

```
SAIRA/
├── index.html              # Home page
├── register.html           # User registration
├── login.html             # User login
├── admin-login.html       # Admin login
├── user-dashboard.html    # User dashboard
├── admin-dashboard.html   # Admin dashboard
│
├── js/
│   ├── api-config.js      # ✨ NEW: API configuration
│   ├── auth.js            # Authentication functions
│   ├── register.js        # ✨ UPDATED: Uses API
│   ├── login.js           # ✨ UPDATED: Uses API
│   └── admin-login.js     # ✨ UPDATED: Uses API
│
└── backend/               # ✨ NEW: Backend server
    ├── config/
    │   └── db.js          # Database connection
    ├── models/
    │   ├── User.js        # User model
    │   ├── Admin.js       # Admin model
    │   └── Course.js      # Course model
    ├── routes/
    │   ├── users.js       # User API routes
    │   └── admin.js       # Admin API routes
    ├── .env               # Configuration
    ├── server.js          # Main server
    ├── package.json       # Dependencies
    └── README.md          # Backend docs
```

## 🎓 How It Works

### Data Flow

1. **User Registration**:
   - User fills form → Frontend validates
   - `register.js` calls `api.registerUser()`
   - Backend hashes password with bcrypt
   - Saves to MongoDB users collection
   - Returns JWT token
   - User is logged in automatically

2. **User Login**:
   - User enters credentials
   - `login.js` calls `api.loginUser()`
   - Backend verifies password
   - Returns JWT token and user data
   - Frontend stores token and redirects

3. **Admin Functions**:
   - Admin logs in via `admin-login.js`
   - Backend verifies admin credentials
   - Admin can view all users from MongoDB
   - Admin can update user status or delete users

### Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Input validation
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Environment variables for secrets

## 📝 Default Credentials

### Admin Account
```
Username: admin
Password: 1234567@_a
```

⚠️ **Change this in production!**

## 🚀 Running in Production

For production deployment:

1. **Environment Variables**:
   - Change JWT_SECRET to a strong random string
   - Use MongoDB Atlas for cloud database
   - Set NODE_ENV=production

2. **Security**:
   - Enable HTTPS
   - Use strong passwords
   - Implement rate limiting
   - Add authentication middleware

3. **Hosting Options**:
   - Backend: Heroku, DigitalOcean, AWS, Railway
   - Frontend: Netlify, Vercel, GitHub Pages
   - Database: MongoDB Atlas

## 📞 Need Help?

1. Check error messages in:
   - PowerShell terminal (backend)
   - Browser console (frontend - press F12)

2. Common commands:
   ```powershell
   # Check if Node.js is installed
   node --version
   
   # Check if MongoDB is running
   mongosh
   
   # Restart backend server
   # Stop: Ctrl + C
   # Start: npm start
   
   # View backend logs
   # Check the terminal where server is running
   ```

3. Verify checklist:
   - ✅ Node.js installed
   - ✅ MongoDB running
   - ✅ Backend dependencies installed (`npm install`)
   - ✅ Backend server running (`npm start`)
   - ✅ Frontend using Live Server or local server
   - ✅ No CORS errors in browser console

## 🎉 Success Indicators

You'll know everything is working when:

1. Backend terminal shows: `✅ MongoDB connected successfully`
2. You can visit: http://localhost:5000 and see API info
3. Registration creates users in MongoDB
4. Login works and redirects to dashboard
5. Admin can see all registered users
6. No errors in browser console

---

**Congratulations! Your SAIRA ACAD platform is now running with a complete backend! 🎓✨**
