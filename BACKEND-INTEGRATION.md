# 🎓 SAIRA ACAD - Complete Full-Stack Platform

**Strategic Academics Innovation Resources Academy**

A complete professional development platform for educators with full-stack implementation.

## 🌟 What's New - Backend Integration

Your SAIRA ACAD platform now has a **complete backend system** with:

✅ **Node.js + Express** backend server  
✅ **MongoDB** database for persistent data storage  
✅ **User registration & authentication** with password hashing  
✅ **Admin dashboard** with user management  
✅ **RESTful API** endpoints  
✅ **JWT token** authentication  
✅ **Secure password** hashing with bcryptjs  

### 📊 Data Storage

All data is now stored in **MongoDB database**:

- ✅ User registrations (username, email, phone, qualification, password)
- ✅ Admin accounts (username, password, role)
- ✅ User course enrollments and progress
- ✅ User session management

**No more localStorage!** All data persists in a real database.

## 🚀 Quick Start Guide

### Prerequisites

1. **Node.js** (v14+) - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

### Installation Steps

#### Option 1: Automated Setup (Recommended)

1. Open PowerShell in the SAIRA folder
2. Run the setup script:
   ```powershell
   .\setup.ps1
   ```
3. Follow the prompts

#### Option 2: Manual Setup

1. **Install Node.js and MongoDB** (see prerequisites)

2. **Install backend dependencies:**
   ```powershell
   cd backend
   npm install
   ```

3. **Start the backend server:**
   ```powershell
   npm start
   ```
   Keep this terminal open!

4. **Open frontend:**
   - Use Live Server in VS Code
   - Or open `index.html` in a browser

### Running the Application

**Every time you want to use SAIRA ACAD:**

1. **Start Backend Server:**
   ```powershell
   .\start-backend.ps1
   ```
   Or manually:
   ```powershell
   cd backend
   npm start
   ```

2. **Open Frontend:**
   - Right-click `index.html` → Open with Live Server
   - Or open in browser: `http://127.0.0.1:5500/index.html`

3. **Test it:**
   - Register a new user
   - Login with your credentials
   - Or login as admin (username: `admin`, password: `1234567@_a`)

## 📁 Project Structure

```
SAIRA/
│
├── 📄 index.html              # Landing page
├── 📄 register.html           # User registration
├── 📄 login.html             # User login
├── 📄 admin-login.html       # Admin login
├── 📄 user-dashboard.html    # User dashboard
├── 📄 admin-dashboard.html   # Admin panel
│
├── 📂 js/
│   ├── api-config.js         # ⭐ API configuration & helper functions
│   ├── auth.js               # Authentication utilities
│   ├── register.js           # Registration logic (updated for API)
│   ├── login.js              # Login logic (updated for API)
│   ├── admin-login.js        # Admin login (updated for API)
│   └── ...
│
├── 📂 backend/               # ⭐ NEW: Backend Server
│   ├── 📂 config/
│   │   └── db.js            # Database connection
│   ├── 📂 models/
│   │   ├── User.js          # User data model
│   │   ├── Admin.js         # Admin data model
│   │   └── Course.js        # Course data model
│   ├── 📂 routes/
│   │   ├── users.js         # User API endpoints
│   │   └── admin.js         # Admin API endpoints
│   ├── .env                 # Configuration file
│   ├── server.js            # Main server file
│   ├── package.json         # Dependencies
│   └── README.md            # Backend documentation
│
├── 📄 SETUP-GUIDE.md         # Detailed setup instructions
├── 📄 setup.ps1              # Automated setup script
└── 📄 start-backend.ps1      # Server start script
```

## 🔌 API Endpoints

### User Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update profile

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get statistics
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Health Check
- `GET /api/health` - Check server status
- `GET /` - API documentation

Visit `http://localhost:5000` to see all available endpoints.

## 🔐 Default Credentials

### Admin Account
```
Username: admin
Password: 1234567@_a
```

⚠️ **Important:** Change this password in production!

## 🛠️ Configuration

### Backend Configuration (backend/.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/saira_acad

# Server Settings
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Frontend URL (for CORS)
FRONTEND_URL=http://127.0.0.1:5500
```

### Frontend Configuration (js/api-config.js)

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    // ...
};
```

## 🔍 How It Works

### Registration Flow
1. User fills registration form
2. Frontend validates input
3. `api.registerUser()` sends data to backend
4. Backend validates & hashes password
5. User saved to MongoDB
6. JWT token generated
7. User automatically logged in

### Login Flow
1. User enters credentials
2. `api.loginUser()` sends to backend
3. Backend verifies password
4. JWT token returned
5. Token stored in localStorage
6. User redirected to dashboard

### Admin Features
1. Admin logs in with credentials
2. Backend verifies admin status
3. Admin can:
   - View all registered users
   - See user statistics
   - Update user status
   - Delete users
   - All data from MongoDB database

## 🧪 Testing

### Test the Backend

Open browser and visit:
```
http://localhost:5000
```

You should see API documentation.

### Test Health Endpoint

```
http://localhost:5000/api/health
```

Should return: `{"status":"OK",...}`

### Test Registration (PowerShell)

```powershell
$body = @{
    fullName = "Test User"
    phoneNumber = "1234567890"
    qualification = "B.Ed"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" -Method POST -Body $body -ContentType "application/json"
```

## 📊 Database Access

### Using MongoDB Compass (Recommended)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Open database: `saira_acad`
4. View collections:
   - `users` - All registered users
   - `admins` - Admin accounts

### Using MongoDB Shell

```bash
mongosh
use saira_acad
db.users.find().pretty()
db.admins.find().pretty()
```

## 🔒 Security Features

✅ **Password Hashing** - bcryptjs with salt  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Input Validation** - express-validator  
✅ **CORS Protection** - Controlled origins  
✅ **Environment Variables** - Sensitive data protected  
✅ **MongoDB Injection Prevention** - Mongoose sanitization  

## 🐛 Troubleshooting

### Node.js not found
- Install from [nodejs.org](https://nodejs.org/)
- Restart PowerShell after installation
- Verify: `node --version`

### MongoDB connection error
- **Local:** Check if MongoDB service is running
- **Atlas:** Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas

### Port 5000 already in use
- Change `PORT=5001` in `backend/.env`
- Update API URL in `js/api-config.js`

### CORS errors
- Ensure backend is running
- Check `FRONTEND_URL` in `.env`
- Use Live Server for frontend

### Frontend not connecting
- Verify backend URL: `http://localhost:5000`
- Check browser console for errors
- Ensure `api-config.js` is loaded

## 📚 Documentation

- [Complete Setup Guide](SETUP-GUIDE.md) - Detailed installation instructions
- [Backend README](backend/README.md) - Backend-specific documentation
- [Testing Checklist](TESTING-CHECKLIST.md) - Test scenarios
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

## 🎯 Next Steps

### For Development
- [ ] Install Node.js and MongoDB
- [ ] Run `.\setup.ps1` to install dependencies
- [ ] Start backend with `.\start-backend.ps1`
- [ ] Open frontend with Live Server
- [ ] Test registration and login

### For Production
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Change JWT_SECRET to secure random string
- [ ] Update admin password
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Deploy backend (Heroku, Railway, DigitalOcean)
- [ ] Deploy frontend (Netlify, Vercel)

## 💡 Features

### User Features
- ✅ User registration with validation
- ✅ Secure login with JWT
- ✅ Personal dashboard
- ✅ Course enrollment tracking
- ✅ Progress monitoring
- ✅ Profile management

### Admin Features
- ✅ Separate admin login
- ✅ View all registered users
- ✅ User management (activate/suspend/delete)
- ✅ Dashboard statistics
- ✅ User data in real-time from database

### Technical Features
- ✅ RESTful API architecture
- ✅ MongoDB database integration
- ✅ Password encryption
- ✅ JWT token authentication
- ✅ Input validation
- ✅ Error handling
- ✅ CORS security
- ✅ Environment configuration

## 🎓 Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for HTTP requests

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- express-validator
- cors

## 📞 Support

If you encounter issues:

1. Check the [Setup Guide](SETUP-GUIDE.md)
2. Review the [Troubleshooting](TROUBLESHOOTING.md) section
3. Check error messages in:
   - PowerShell terminal (backend)
   - Browser console (frontend - F12)
4. Verify all prerequisites are installed

## 📝 License

© 2025 SAIRA ACAD - Strategic Academics Innovation Resources Academy

---

## ✨ Summary of Changes

### What's Different Now?

**Before:** Data stored in browser localStorage (temporary, not secure)  
**After:** Data stored in MongoDB database (persistent, secure)

**Before:** No real backend, just client-side JavaScript  
**After:** Full Node.js/Express backend with REST API

**Before:** Passwords stored in plain text  
**After:** Passwords encrypted with bcryptjs

**Before:** No authentication system  
**After:** JWT token-based authentication

**Before:** Data lost on browser clear  
**After:** Data persists in database forever

### Files Added
- `backend/` - Complete backend server
- `js/api-config.js` - API configuration
- `setup.ps1` - Setup automation
- `start-backend.ps1` - Server start script
- `SETUP-GUIDE.md` - Installation guide

### Files Modified
- `js/register.js` - Now uses API
- `js/login.js` - Now uses API  
- `js/admin-login.js` - Now uses API
- `register.html` - Includes api-config.js
- `login.html` - Includes api-config.js
- `admin-login.html` - Includes api-config.js

---

**Made with ❤️ for SAIRA ACAD**

**Ready to transform education! 🎓✨**
