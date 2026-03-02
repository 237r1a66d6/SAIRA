# 🔧 CONFIGURATION CHECKLIST FOR HOSTINGER
## Quick Reference Guide

---

## ⚠️ BEFORE UPLOADING - UPDATE THESE FILES

### 1. db_connect.php ⚙️
**Location:** Root folder  
**Update Lines 11-13 with YOUR Hostinger credentials:**

```php
$servername = "localhost";  // Keep as "localhost"
$username = "YOUR_DB_USERNAME";  // Get from Hostinger
$password = "YOUR_DB_PASSWORD";  // Get from Hostinger
$database = "YOUR_DB_NAME";      // Get from Hostinger
```

**How to get credentials:**
1. Login to Hostinger hPanel
2. Go to: Databases → Manage
3. Copy: Database Name, Username, Password

---

## 📤 FILES TO UPLOAD TO HOSTINGER

Upload ALL files to `public_html` folder:

### ✅ Root Files:
- [ ] All HTML files (*.html)
- [ ] db_connect.php
- [ ] register_handler.php
- [ ] .htaccess
- [ ] database.sql (delete after importing!)
- [ ] robots.txt
- [ ] sitemap.xml

### ✅ Folders:
- [ ] api/ (with all subfolders)
  - [ ] users/
  - [ ] admin/
  - [ ] teacher/
  - [ ] school-partner/
  - [ ] forms/
- [ ] css/
- [ ] js/
- [ ] assets/

---

## 🗄️ DATABASE SETUP STEPS

### Step 1: Import Database
1. Go to: hPanel → Databases → phpMyAdmin
2. Select your database from left sidebar
3. Click "Import" tab
4. Choose file: `database.sql`
5. Click "Go" button
6. Wait for success message

### Step 2: Verify Tables Created
You should see these 18 tables:
- users
- admins
- teachers
- schools
- partners
- user_sessions
- login_attempts
- password_reset_tokens
- user_activity_log
- contact_submissions
- school_requirements
- teacher_applications
- mentor_applications
- job_applications
- enrollment_applications
- consultation_requests
- partner_contacts
- educator_contacts

### Step 3: Delete database.sql
After successful import, delete `database.sql` from public_html for security!

---

## 🔐 DEFAULT LOGIN CREDENTIALS

### Admin Account:
- **URL:** https://yourdomain.com/admin-login.html
- **Username:** admin
- **Password:** Admin@123
- **⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

### Test User Account (Delete in Production):
- **URL:** https://yourdomain.com/login.html
- **Username:** testuser
- **Password:** Test@123

### Test Teacher Account (Delete in Production):
- **Email:** teacher@example.com
- **Password:** Teacher@123

### Test School Account (Delete in Production):
- **Username:** testschool
- **Password:** School@123

---

## 🧪 TESTING CHECKLIST

After deployment, test these:

### Basic Functionality:
- [ ] Homepage loads: https://yourdomain.com
- [ ] HTTPS working (green padlock)
- [ ] All CSS and images load correctly
- [ ] Mobile responsive design works

### User Features:
- [ ] User registration: /register.html
- [ ] User login: /login.html
- [ ] User dashboard loads after login

### Admin Features:
- [ ] Admin login: /admin-login.html
- [ ] Admin dashboard loads
- [ ] Can view submissions

### Forms:
- [ ] Contact form: /contact-us.html
- [ ] Career applications: /careers.html
- [ ] School requirements: /work-with-us.html
- [ ] All forms submit successfully

### API Endpoints (should return JSON, not 404):
- [ ] /api/users/register.php
- [ ] /api/users/login.php
- [ ] /api/admin/login.php
- [ ] /api/forms/contact.php

---

## 🔒 SECURITY CHECKLIST

### Immediately After Deployment:
- [ ] Change default admin password
- [ ] Verify .htaccess is protecting db_connect.php
- [ ] Verify database.sql is deleted from public folder
- [ ] Enable HTTPS/SSL certificate
- [ ] Force HTTPS in .htaccess (after SSL is active)

### For Production:
- [ ] Delete test user accounts from database
- [ ] Review and limit database user permissions
- [ ] Set up regular backups
- [ ] Monitor error logs

---

## 🌐 API ENDPOINTS REFERENCE

All API endpoints are PHP files in the `/api/` folder:

### User Management:
- Register: `/api/users/register.php` (POST)
- Login: `/api/users/login.php` (POST)

### Admin:
- Login: `/api/admin/login.php` (POST)

### Teacher:
- Login: `/api/teacher/login.php` (POST)

### School Partner:
- Login: `/api/school-partner/login.php` (POST)
- View Applications: `/api/school-partner/applications/[jobs|teachers|mentors].php` (GET)

### Forms (all POST):
- Contact: `/api/forms/contact.php`
- School Requirement: `/api/forms/school-requirement.php`
- Teacher Application: `/api/forms/teacher-application.php`
- Mentor Application: `/api/forms/mentor-application.php`
- Job Application: `/api/forms/job-application.php`
- Enrollment: `/api/forms/enrollment.php`
- Consultation: `/api/forms/consultation.php`

---

## 📊 FILE STRUCTURE ON HOSTINGER

```
public_html/
├── index.html
├── login.html
├── register.html
├── admin-login.html
├── [other HTML files]
├── db_connect.php ⚠️ UPDATE CREDENTIALS
├── register_handler.php
├── .htaccess
├── robots.txt
├── sitemap.xml
├── api/
│   ├── users/
│   │   ├── register.php
│   │   └── login.php
│   ├── admin/
│   │   └── login.php
│   ├── teacher/
│   │   └── login.php
│   ├── school-partner/
│   │   ├── login.php
│   │   └── applications/
│   │       ├── jobs.php
│   │       ├── teachers.php
│   │       └── mentors.php
│   └── forms/
│       ├── contact.php
│       ├── school-requirement.php
│       ├── teacher-application.php
│       ├── mentor-application.php
│       ├── job-application.php
│       ├── enrollment.php
│       └── consultation.php
├── css/
├── js/
│   ├── api-config.js ✅ Updated for PHP
│   └── api-config-new.js ✅ Updated for PHP
└── assets/
```

---

## 🚨 COMMON ISSUES & QUICK FIXES

### "Connection failed" Error:
➜ Update credentials in `db_connect.php`

### "404 Not Found" for API:
➜ Check .htaccess uploaded and PHP files exist

### Forms Not Working:
➜ Check browser console (F12) for errors  
➜ Verify API paths in js/api-config.js

### "Table doesn't exist":
➜ Re-import database.sql in phpMyAdmin

### SSL Not Working:
➜ Install SSL in Hostinger hPanel → Security → SSL  
➜ Wait 10-15 minutes after installation

---

## 📞 NEED HELP?

1. **Check deployment guide:** HOSTINGER-DEPLOYMENT-GUIDE.md
2. **Hostinger Support:** 24/7 live chat in hPanel
3. **Check error logs:** File Manager → public_html → error_log
4. **Browser console:** Press F12 to see JavaScript errors

---

## ✅ READY TO DEPLOY!

1. Update `db_connect.php` with Hostinger credentials
2. Upload all files to `public_html`
3. Import `database.sql` in phpMyAdmin
4. Test all functionality
5. Change admin password
6. Enable HTTPS

**Your website will be live! 🚀**
