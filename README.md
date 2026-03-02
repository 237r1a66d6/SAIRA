# SAIRA ACAD - Strategic Academics Innovation Resources Academy

Welcome to SAIRA ACAD, a comprehensive educational platform for passionate teachers and administrators.

## ✨ COMPLETE: Full-Stack Platform with All Pages!

**SAIRA ACAD is now a complete educational platform with 16 pages and full backend!**

✅ **Node.js + Express** backend server  
✅ **MongoDB** database for all data  
✅ **JWT Authentication** & password encryption  
✅ **RESTful API** with 14+ endpoints  
✅ **Admin panel** with real database  
✅ **File uploads** (resume submissions)  
✅ **7 Interactive forms** with backend integration  
✅ **10 New pages** following complete sitemap  

**Everything works with real database storage!**

📚 **Documentation:**
- [5-Minute Quick Start](QUICK-START.md) ⚡
- [Complete Setup Guide](SETUP-GUIDE.md) 📖
- [Forms Testing Guide](FORMS-TESTING-GUIDE.md) 🧪
- [Integration Summary](COMPLETE-INTEGRATION-SUMMARY.md) 🎉
- [Backend API Docs](backend/README.md) 📡

## 🎯 Project Overview

SAIRA ACAD is a **comprehensive full-stack educational platform** that connects schools, teachers, and mentors. The platform features:

- **For Schools:** Post teacher requirements, book consultations, hire qualified teachers
- **For Teachers:** Browse jobs, enroll in training programs, advance careers
- **For Mentors:** Apply to become trainers, share expertise, impact education
- **For Everyone:** Access resources, success stories, and educational content

Complete with user/admin authentication, form submissions, file uploads, and MongoDB database backend.

## 🌈 Color Theme

The website uses colors inspired by the SAIRA ACAD logo:
- **Primary Purple**: #3d2f7c
- **Secondary Purple**: #5a4794
- **Primary Orange**: #f9a826
- **Secondary Orange**: #fdb84d

## 📁 Project Structure

```
SAIRA/
│
├── 📄 LANDING & AUTH PAGES
│   ├── index.html              # Landing page
│   ├── register.html           # User registration
│   ├── login.html              # User login
│   ├── admin-login.html        # Admin login
│   ├── admin-dashboard.html    # Admin dashboard
│   └── user-dashboard.html     # User dashboard
│
├── 📄 NEW: MAIN WEBSITE PAGES
│   ├── about-us.html           # Company info & values
│   ├── services.html           # Services for schools & teachers
│   ├── mentorship-training.html # Training programs & certifications
│   ├── work-with-us.html       # Job matching platform
│   ├── success-stories.html    # Testimonials & case studies
│   ├── resources.html          # Blog, tips, events
│   ├── careers.html            # Jobs at SAIRA ACAD
│   ├── contact-us.html         # Contact & consultations
│   ├── privacy-policy.html     # Privacy policy
│   └── terms-conditions.html   # Terms & conditions
│
├── 📂 css/
│   └── style.css              # Complete styling (~3000 lines)
│
├── 📂 js/
│   ├── api-config.js          # API configuration
│   ├── register.js            # Registration logic
│   ├── login.js               # Login logic
│   ├── admin-login.js         # Admin login logic
│   ├── user-dashboard.js      # User dashboard logic
│   ├── admin-dashboard.js     # Admin dashboard logic
│   ├── auth.js                # Authentication helper
│   ├── animations.js          # Page animations
│   ├── premium-interactions.js # Interactive features
│   ├── mentorship.js          # ⭐ NEW: Training enrollment
│   ├── work-with-us.js        # ⭐ NEW: Job applications
│   ├── careers.js             # ⭐ NEW: Career applications
│   └── contact.js             # ⭐ NEW: Contact & consultations
│
├── 📂 backend/                # ⭐ Backend API Server
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   │
│   ├── 📂 config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── 📂 models/             # Database models (10 models)
│   │   ├── User.js            # User accounts
│   │   ├── Admin.js           # Admin accounts
│   │   ├── Course.js          # Courses
│   │   ├── Enrollment.js      # ⭐ NEW: Training enrollments
│   │   ├── SchoolRequirement.js # ⭐ NEW: School hiring needs
│   │   ├── TeacherApplication.js # ⭐ NEW: Teacher applications
│   │   ├── MentorApplication.js # ⭐ NEW: Mentor applications
│   │   ├── JobApplication.js  # ⭐ NEW: Career applications
│   │   ├── Contact.js         # ⭐ NEW: Contact submissions
│   │   └── Consultation.js    # ⭐ NEW: Consultation bookings
│   │
│   ├── 📂 routes/             # API endpoints (3 route files)
│   │   ├── users.js           # User routes
│   │   ├── admin.js           # Admin routes
│   │   └── forms.js           # ⭐ NEW: Form submission routes
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── upload.js          # ⭐ NEW: File upload handling
│   │
│   └── 📂 uploads/            # ⭐ NEW: Uploaded files
│       └── resumes/           # Resume files (PDF, DOC, DOCX)
│
└── 📂 assets/                 # Images and media
```
│   ├── auth.js               # Authentication utilities
│   ├── register.js           # ⭐ UPDATED: Uses backend API
│   ├── login.js              # ⭐ UPDATED: Uses backend API
│   ├── admin-login.js        # ⭐ UPDATED: Uses backend API
│   ├── admin-dashboard.js    # Admin dashboard
│   └── user-dashboard.js     # User dashboard
│
├── 📂 backend/                # ⭐ NEW: Backend Server
│   ├── config/
│   │   └── db.js            # Database connection
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Admin.js         # Admin schema
│   │   └── Course.js        # Course schema
│   ├── routes/
│   │   ├── users.js         # User API endpoints
│   │   └── admin.js         # Admin API endpoints
│   ├── .env                 # Configuration
│   ├── server.js            # Main server
│   ├── package.json         # Dependencies
│   └── README.md            # Backend docs
│
├── 📄 QUICK-START.md          # ⭐ 5-minute quick start
├── 📄 SETUP-GUIDE.md          # ⭐ Complete setup guide
├── 📄 BACKEND-INTEGRATION.md  # ⭐ Technical docs
├── 📄 INTEGRATION-COMPLETE.md # ⭐ Summary
├── 📄 setup.ps1               # ⭐ Setup script
└── 📄 start-backend.ps1       # ⭐ Server start script
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v14+) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - [Local MongoDB](https://www.mongodb.com/try/download/community)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free cloud)

### Quick Setup

**Option 1: Automated (Recommended)**
```powershell
.\setup.ps1
```

**Option 2: Manual**
```powershell
cd backend
npm install
npm start
```

### Running the Application

**Every time you use SAIRA ACAD:**

1. **Start backend server:**
   ```powershell
   .\start-backend.ps1
   ```
   Keep this window open!

2. **Open frontend:**
   - Right-click `index.html` → Open with Live Server
   - Or open in browser

3. **Test it:**
   - Register new user
   - Login with credentials
   - Or use admin: `admin` / `1234567@_a`

### Default Admin Credentials

**Username**: `admin`  
**Password**: `1234567@_a`

These credentials are automatically created when you first load the website.

## 👥 User Features

### Registration
- Full Name
- Phone Number (10 digits)
- Qualification (dropdown selection)
- Email Address
- Password (minimum 8 characters)
- Password Confirmation

### User Dashboard
1. **My Dashboard**
   - Welcome message
   - Statistics (enrolled courses, completed, in progress, overall progress)
   - Quick information panel

2. **Available Courses**
   - Mathematics
   - Science
   - Languages
   - Social Studies
   - Arts & Creativity
   - Technology & Digital Learning
   - One-click enrollment

3. **Partner Schools**
   - Delhi Public School
   - Kendriya Vidyalaya
   - Ryan International
   - DAV Public School
   - St. Xavier's School
   - Modern School

4. **My Profile**
   - Complete user information
   - Account status
   - Member since date

## 👨‍💼 Admin Features

### Admin Dashboard

1. **Dashboard Overview**
   - Total admins count
   - Total users count
   - Available courses count
   - Partner schools count
   - Recent activity

2. **Admin Management**
   - View all admins
   - Add new admins
   - Delete admins (except default admin)
   - Monitor admin status

3. **User Management**
   - View all registered users
   - Add new users manually
   - Edit user information
   - Delete users
   - Monitor user progress

## 🔐 Authentication Flow

### User Flow
1. Landing page → Register
2. Register → Login (automatic redirect after successful registration)
3. Login → User Dashboard
4. Access to courses and resources

### Admin Flow
1. Landing page → Admin Login (link in register/login pages)
2. Admin Login → Admin Dashboard
3. Full access to user and admin management

## 💾 Data Storage

All data is stored in browser's localStorage:
- **admins**: List of all administrators
- **users**: List of all registered users
- **currentUser**: Currently logged-in user
- **currentAdmin**: Currently logged-in admin
- **courses_[email]**: Individual user's enrolled courses

## 🔧 Key Functionalities

### Registration Page
- ✅ Form validation
- ✅ Email format checking
- ✅ Phone number validation (10 digits)
- ✅ Password matching verification
- ✅ Duplicate user checking
- ✅ Automatic redirect to login after successful registration
- ✅ Link to admin login at bottom

### Login Page
- ✅ Credential validation
- ✅ Full name and password authentication
- ✅ Error messages for invalid credentials
- ✅ Link to admin login at bottom

### Admin Login Page
- ✅ Username/password authentication
- ✅ Secure admin access
- ✅ Default admin account pre-configured

### Admin Dashboard
- ✅ Add new admins
- ✅ Delete admins (protected default admin)
- ✅ Add users manually
- ✅ Edit user details (name, phone, qualification)
- ✅ Delete users
- ✅ View user progress
- ✅ Statistics overview

### User Dashboard
- ✅ Personal information display
- ✅ Course enrollment
- ✅ Progress tracking
- ✅ Partner schools information
- ✅ Profile management

## 🎨 Design Features

- Responsive design for all screen sizes
- Modern gradient backgrounds
- Smooth animations and transitions
- Intuitive navigation
- Color-coded status badges
- Modal dialogs for actions
- Professional card-based layouts

## 🔒 Security Features

- Password length validation (minimum 8 characters)
- Protected admin routes
- Authentication checking on all dashboard pages
- Secure logout functionality
- Protected default admin from deletion

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🐛 Error Handling

- Form validation errors
- Duplicate account detection
- Invalid credential messages
- Required field validation
- Email format validation
- Phone number format validation

## 💡 Usage Tips

1. **First Time Setup**
   - Open index.html in your browser
   - The default admin account is automatically created
   - Register as a user or login as admin

2. **As a User**
   - Register with your details
   - Login with your full name and password
   - Explore courses and enroll
   - View partner schools

3. **As an Admin**
   - Login with default credentials
   - Add new admins if needed
   - Manage users (add, edit, delete)
   - Monitor user progress

4. **Data Persistence**
   - All data is saved in localStorage
   - Data persists between sessions
   - Clear browser data to reset everything

## 🌐 Browser Compatibility

Tested and working on:
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

## 📞 Support

For any issues or questions about the website:
- Check the console for error messages
- Ensure JavaScript is enabled
- Clear localStorage if experiencing issues
- Use a modern browser for best experience

## 🎓 Courses Offered

1. **Mathematics** - Advanced teaching methodologies
2. **Science** - Innovative approaches to physics, chemistry, and biology
3. **Languages** - Modern language acquisition techniques
4. **Social Studies** - Engaging history and geography methods
5. **Arts & Creativity** - Fostering artistic expression
6. **Technology & Digital Learning** - Integrating technology in education

## 🏫 Partner Schools

- Delhi Public School
- Kendriya Vidyalaya
- Ryan International School
- DAV Public School
- St. Xavier's School
- Modern School

## ✨ Features Summary

✅ Full user registration and authentication  
✅ Admin login with predefined credentials  
✅ User management (add, edit, delete)  
✅ Admin management (add, delete)  
✅ Course enrollment system  
✅ Progress tracking  
✅ Responsive design  
✅ Local database (localStorage)  
✅ Form validation  
✅ Error handling  
✅ Professional UI/UX  
✅ Color-themed design matching logo  

## 🔄 Future Enhancements (Optional)

- Course content pages
- Video lessons
- Quiz and assessment system
- Certificate generation
- Email notifications
- Advanced analytics
- User messaging system
- File upload capability

---

**Created for SAIRA ACAD - Guiding Academic Excellence**  
© 2025 Strategic Academics Innovation Resources Academy
