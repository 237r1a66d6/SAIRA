# SAIRA ACAD Backend API

Complete Node.js + Express + MongoDB backend for the SAIRA ACAD platform.

## 📋 Prerequisites

Before running the backend, make sure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Option A: Local MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **Option B: MongoDB Atlas** (Cloud) - [Create free account](https://www.mongodb.com/cloud/atlas/register)

## 🚀 Quick Start

### Step 1: Install Dependencies

Open PowerShell/Terminal in the `backend` folder and run:

```powershell
npm install
```

This will install all required packages:
- express - Web framework
- mongoose - MongoDB ODM
- cors - Cross-origin resource sharing
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- express-validator - Input validation

### Step 2: Configure MongoDB

#### Option A: Using Local MongoDB (Recommended for Development)

1. Install MongoDB Community Server
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Or run: `mongod --dbpath C:\data\db`
3. The `.env` file is already configured for local MongoDB

#### Option B: Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Open `.env` file and replace the MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saira_acad?retryWrites=true&w=majority
   ```

### Step 3: Start the Server

Run the following command in PowerShell:

```powershell
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Default admin created (username: admin, password: 1234567@_a)
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

### Step 4: Test the API

Open your browser and visit:
```
http://localhost:5000
```

You should see the API welcome message with available endpoints.

## 🔧 Configuration

### Environment Variables (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/saira_acad

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Frontend URL
FRONTEND_URL=http://127.0.0.1:5500
```

## 📡 API Endpoints

### User Endpoints

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get statistics
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Health Check

- `GET /api/health` - Check API status

## 👤 Default Admin Credentials

The system automatically creates a default admin account:

```
Username: admin
Password: 1234567@_a
```

⚠️ **Important**: Change these credentials in production!

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongoDB connection error`

**Solutions**:
1. Make sure MongoDB service is running
2. Check if port 27017 is available
3. Verify MongoDB URI in `.env` file
4. For MongoDB Atlas, check:
   - Network Access (whitelist your IP or use 0.0.0.0/0)
   - Database User credentials

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**: Change PORT in `.env` to a different number (e.g., 5001)

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**: Make sure FRONTEND_URL in `.env` matches your frontend URL

### Module Not Found

**Problem**: `Error: Cannot find module 'express'`

**Solution**: Run `npm install` again in the backend folder

## 🧪 Testing the Backend

### Using Browser

Visit: `http://localhost:5000/api/health`

### Using PowerShell/curl

Test user registration:
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

Test admin login:
```powershell
$body = @{
    username = "admin"
    password = "1234567@_a"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
```

## 📂 Project Structure

```
backend/
├── config/
│   └── db.js           # Database configuration
├── models/
│   ├── User.js         # User model
│   ├── Admin.js        # Admin model
│   └── Course.js       # Course model
├── routes/
│   ├── users.js        # User routes
│   └── admin.js        # Admin routes
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
└── server.js           # Main server file
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with express-validator
- CORS protection
- MongoDB injection prevention
- Environment variable protection

## 📝 Development Mode

For auto-restart on file changes, use nodemon:

```powershell
npm run dev
```

## 🌐 Frontend Integration

The frontend is already configured to use this backend. Make sure:

1. Backend is running on `http://localhost:5000`
2. Frontend files include `js/api-config.js`
3. All forms are updated to use the API

## 📊 Database Collections

The system creates these collections:

- `users` - Registered users
- `admins` - Admin accounts
- `courses` - Available courses (optional)

## 🎯 Next Steps

1. ✅ Install Node.js and MongoDB
2. ✅ Run `npm install` in backend folder
3. ✅ Configure `.env` file
4. ✅ Start the server with `npm start`
5. ✅ Test the API endpoints
6. ✅ Open frontend and try registering/logging in
7. 🔒 Change default admin password
8. 📧 Add email verification (optional)
9. 🚀 Deploy to production (optional)

## 💡 Tips

- Keep the terminal window open while testing
- Check console logs for debugging
- Use MongoDB Compass to view database
- Test each endpoint before using frontend

## 📞 Support

If you encounter issues:
1. Check error messages in terminal
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check firewall settings
5. Review the Troubleshooting section

---

**Made with ❤️ for SAIRA ACAD**
