# 🚀 Store Data in MongoDB - Quick Setup

## Current Status
❌ Data is currently stored in **localStorage** (browser storage)  
✅ Backend code is ready - just needs Node.js and MongoDB to run!

---

## 📥 Step 1: Install Node.js (2 minutes)

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click the **LTS** button (recommended version)
   - Run the downloaded installer
   - ✅ Check "Add to PATH" during installation
   - Click Next → Next → Install

2. **Verify Installation:**
   - Open **NEW** PowerShell window
   - Run:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., v20.x.x)

---

## 💾 Step 2: Install MongoDB (3 minutes)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Click **Download**
   - Run the installer
   - Choose **Complete** installation
   - ✅ Install MongoDB as a **Windows Service** (checked by default)
   - ✅ Install MongoDB Compass (optional GUI tool - recommended)

2. **Verify MongoDB is Running:**
   - Press **Win + R**
   - Type: `services.msc`
   - Look for **MongoDB Server** - should be "Running"

---

## ▶️ Step 3: Start Your Backend Server

### Option A: Automated (Easy!)

Double-click this file:
```
setup.ps1
```

It will automatically:
- Check if Node.js is installed ✅
- Install all dependencies ✅
- Test the connection ✅

Then double-click:
```
start-backend.ps1
```

### Option B: Manual

Open PowerShell in your project folder and run:

```powershell
# Navigate to backend folder
cd "C:\Users\bvsri\OneDrive\Desktop\Saira\SAIRA\backend"

# Install dependencies (only needed once)
npm install

# Start the server
npm start
```

---

## ✅ Success! You should see:

```
✅ MongoDB connected successfully
✅ Default admin created (username: admin, password: 1234567@_a)
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

**IMPORTANT: Keep this PowerShell window open while using the website!**

---

## 🌐 Step 4: Use Your Website

Now your registration data will automatically save to MongoDB!

1. **Keep the backend server running** (the PowerShell window)
2. **Open your website** (index.html with Live Server)
3. **Register a new user** → Data saves to MongoDB! 🎉
4. **Login** → Data retrieved from MongoDB! 🎉

---

## 📊 View Your MongoDB Data

### Option 1: MongoDB Compass (GUI - Easy!)

1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. Click on database: **saira_acad**
4. View collections:
   - **users** - All your registered users
   - **admins** - Admin accounts
   - **courses** - Available courses

### Option 2: Command Line

```powershell
# Open MongoDB shell
mongosh

# Switch to your database
use saira_acad

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# View latest user
db.users.find().sort({_id: -1}).limit(1).pretty()

# Exit
exit
```

### Option 3: Browser API

Visit in browser:
```
http://localhost:5000/api/admin/users
```

---

## 🔄 How It Works

### Before (localStorage):
```
Register → Browser localStorage → ⚠️ Lost on browser clear
```

### After (MongoDB):
```
Register → Node.js Backend → MongoDB Database → ✅ Permanent storage
```

### The Magic:
Your frontend code (register.js) **already has this logic**:
1. **Try MongoDB backend first** (if running)
2. **Fallback to localStorage** (if backend not available)

So once you start the backend, **it automatically switches to MongoDB!**

---

## 🧪 Test It!

### Test 1: Register with Backend Running

1. Start backend: `npm start` in backend folder
2. Open website
3. Register new user: "John MongoDB" 
4. Open MongoDB Compass
5. ✅ See "John MongoDB" in database!

### Test 2: Data Persists

1. Register a user
2. Close browser completely
3. Clear browser data (Ctrl+Shift+Delete)
4. Reopen website
5. Login with same credentials
6. ✅ It works! Data is in MongoDB, not browser!

---

## 🎯 Quick Commands Reference

```powershell
# Check if installed
node --version
npm --version

# Install dependencies (one-time)
cd backend
npm install

# Start backend server
npm start

# View MongoDB data
mongosh
use saira_acad
db.users.find()

# Stop server
Ctrl + C
```

---

## ❓ Troubleshooting

### "npm is not recognized"
→ Install Node.js from https://nodejs.org/
→ Restart PowerShell after installation

### "MongoDB connection error"
→ Check if MongoDB service is running (services.msc)
→ Or install MongoDB from https://www.mongodb.com/try/download/community

### "Port 5000 already in use"
→ Change PORT in backend/.env file to 5001
→ Update js/api-config.js to use new port

### Backend starts but website still uses localStorage
→ Make sure backend is running (check PowerShell window)
→ Check browser console (F12) for connection errors
→ URL should be 127.0.0.1:5500 or localhost (not file://)

---

## 📞 Next Steps

1. ✅ Install Node.js
2. ✅ Install MongoDB  
3. ✅ Run `npm install` in backend folder
4. ✅ Run `npm start` to start server
5. ✅ Register new users
6. ✅ View data in MongoDB Compass
7. 🎉 Celebrate your full-stack application!

---

**Your backend is already coded and ready to go! Just install the prerequisites and start it up!** 🚀
