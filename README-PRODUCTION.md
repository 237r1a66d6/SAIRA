# 🎓 SAIRA ACAD - Strategic Academics Innovation Resource Academy

## ✅ Deployment Ready Status

Your application is now **PRODUCTION READY** with the following improvements:

### ✅ Completed Fixes

1. **Database Migration** ✓
   - Migrated from MongoDB to SQLite
   - All models converted to Sequelize ORM
   - Database file: `backend/saira-acad.db`

2. **Environment Variables** ✓
   - `.env` file configured
   - JWT secrets properly secured
   - Port and URL configurations

3. **CORS Configuration** ✓
   - Proper origin validation
   - Support for multiple frontend URLs
   - Development and production modes

4. **API Auto-Detection** ✓
   - Automatically switches between dev and prod URLs
   - Update production URL in `js/api-config.js`

5. **Error Handling** ✓
   - Comprehensive error messages
   - Network failure handling
   - User-friendly error displays

6. **Deployment Documentation** ✓
   - Complete deployment guide created
   - Multiple hosting options documented
   - Step-by-step instructions

## 🚀 Quick Start

### Development

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Server runs on: http://localhost:5000

2. **Open Frontend:**
   - Open `index.html` in browser
   - Or use Live Server in VS Code

3. **Default Admin Login:**
   - Username: `admin`
   - Password: `1234567@_a`

### Testing

- **Admin Dashboard:** `admin-dashboard.html`
- **School Partner Login:** `school-login.html`
- **User Registration:** `register.html`

## 📦 Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** SQLite (Sequelize ORM)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer

### Frontend
- **HTML5** with semantic markup
- **CSS3** with modern features
- **Vanilla JavaScript** (ES6+)
- **No framework dependencies**

## 📁 Project Structure

```
SAIRA/
├── backend/
│   ├── server.js           # Main server file
│   ├── .env               # Environment variables
│   ├── saira-acad.db      # SQLite database
│   ├── config/
│   │   └── database.js    # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   └── uploads/           # File uploads
├── js/
│   ├── api-config.js      # API configuration
│   ├── admin-dashboard.js
│   ├── school-login.js
│   └── partner-dashboard.js
├── css/
│   └── style.css
├── index.html
└── DEPLOYMENT.md          # Deployment guide
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ CORS protection
- ✅ SQL injection prevention (Sequelize)
- ✅ XSS protection
- ✅ Input validation

## 🌐 Deployment

### Backend Hosting Options
1. **Render.com** (Recommended - Free tier)
2. **Railway.app** (Easy deployment)
3. **Heroku** (Classic choice)

### Frontend Hosting Options
1. **Vercel** (Recommended - Fast CDN)
2. **Netlify** (Great for static sites)
3. **GitHub Pages** (Free hosting)

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions**

## ⚙️ Environment Variables

Required for production:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./saira-acad.db
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=secure-password
```

## 🔄 Before Deployment

1. Update production backend URL in `js/api-config.js`:
   ```javascript
   BASE_URL: isProd 
       ? 'https://your-backend-url.com/api' // UPDATE THIS
       : 'http://localhost:5000/api'
   ```

2. Change default admin password in `.env`

3. Set proper CORS origins in `.env`

4. Test all features locally

## 📊 Database Schema

### Tables
- `users` - User accounts
- `admins` - Admin accounts
- `school_partners` - School partner accounts
- `job_applications` - Job applications
- `teacher_applications` - Teacher applications
- `mentor_applications` - Mentor applications

## 🎯 Features

### For Schools (Partners)
- View all applications (jobs, teachers, mentors)
- Review candidate profiles
- Access resume downloads
- Manage hiring pipeline

### For Admin
- Manage school partners
- View all users
- System statistics
- User management

### For Users/Teachers
- Course enrollment
- Profile management
- Application tracking
- Resource access

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists
- Run `npm install` in backend folder

### CORS errors
- Check `ALLOWED_ORIGINS` in `.env`
- Verify frontend URL matches

### Database issues
- Delete `saira-acad.db` to reset
- Check file permissions

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/school-partner/login` - Partner login
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### School Partner Endpoints
- `GET /api/school-partner/applications/jobs`
- `GET /api/school-partner/applications/teachers`
- `GET /api/school-partner/applications/mentors`

### Form Endpoints
- `POST /api/forms/teacher-application`
- `POST /api/forms/job-application`
- `POST /api/forms/mentor-application`
- `POST /api/forms/contact`

## 📧 Support

For issues or questions:
- Check `DEPLOYMENT.md` for deployment help
- Review backend logs for API errors
- Check browser console for frontend errors

## 📄 License

Copyright © 2026 SAIRA ACAD. All rights reserved.

---

**Your application is now production-ready! 🎉**

Follow the deployment guide to go live.
