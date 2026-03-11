# 🚀 SAIRA ACAD - Complete Hostinger Setup Guide

## ✅ Pre-Deployment Checklist

### Step 1: Prepare Files Locally

- [ ] All HTML, CSS, JS files are ready
- [ ] PHP API files are in `/api/` folders
- [ ] `database.sql` is complete
- [ ] `db_connect.php` is ready (will update credentials later)
- [ ] `.htaccess` file is present

---

## 📤 Step 2: Upload Files to Hostinger

### 2.1 Access Hostinger File Manager

1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Files** → **File Manager**
3. Navigate to `public_html` folder

### 2.2 Upload All Files

**Upload these files/folders:**
```
public_html/
├── index.html
├── about-us.html
├── login.html
├── register.html
├── admin-login.html
├── user-dashboard.html
├── admin-dashboard.html
├── (all other HTML files)
├── .htaccess
├── db_connect.php
├── test-connection.php
├── test-api.html
├── generate-password-hash.php
├── database.sql (optional, for reference)
├── css/
│   └── (all CSS files)
├── js/
│   └── (all JavaScript files)
├── assets/
│   └── (all images)
└── api/
    ├── users/
    │   ├── login.php
    │   ├── register.php
    │   └── profile.php
    ├── admin/
    │   ├── login.php
    │   ├── users.php
    │   └── stats.php
    ├── teacher/
    │   └── login.php
    ├── school-partner/
    │   └── login.php
    └── forms/
        ├── contact.php
        └── (other form handlers)
```

**DO NOT upload:**
- `node_modules/` (if present)
- `.git/` folder
- Any local development files
- `README.md` (optional)

---

## 🗄️ Step 3: Setup MySQL Database

### 3.1 Create Database

1. In Hostinger hPanel, go to **Databases** → **MySQL Databases**
2. Click **"Create New Database"**
3. Enter database name (e.g., `sairaacad_db`)
4. Create a database user with a strong password
5. Grant **ALL PRIVILEGES** to the user
6. **Note down these credentials:**
   - Database Name: `u642524181_SairaAcad`
   - Username: `u642524181_DB_1`
   - Password: `[your password]`
   - Host: `localhost`

### 3.2 Import Database Schema

1. Click **"Manage"** on your database
2. Opens phpMyAdmin
3. Select your database from left sidebar
4. Click **"Import"** tab at top
5. Choose file: `database.sql`
6. Scroll down and click **"Go"**
7. Wait for success message

**Expected Result:**
- 18 tables created
- 1 admin account inserted
- Test accounts inserted (optional)

---

## ⚙️ Step 4: Configure Database Connection

### 4.1 Update db_connect.php

1. In File Manager, open `public_html/db_connect.php`
2. Update lines 11-13 with your database credentials:

```php
$servername = "localhost";  // Always localhost for Hostinger
$username = "u642524181_DB_1";  // YOUR database username
$password = "YOUR_PASSWORD_HERE";  // YOUR database password
$database = "u642524181_SairaAcad";  // YOUR database name
```

3. Save the file

---

## 🔐 Step 5: Fix Admin Password

### Option A: Using Web Interface (Easiest)

1. Access: `https://yourdomain.com/test-connection.php`
2. Scroll to **"Password Verification Test"**
3. If it fails, click **"Fix Admin Password Automatically"** button
4. Verify it now shows ✅ green checkmark

### Option B: Using generate-password-hash.php

1. Access: `https://yourdomain.com/generate-password-hash.php`
2. Copy the hash for "Admin@123"
3. Go to phpMyAdmin → Select your database → SQL tab
4. Run this query (replace HASH with copied hash):

```sql
UPDATE admins 
SET password = 'PASTE_HASH_HERE',
    status = 'active',
    role = 'super_admin'
WHERE username = 'admin';
```

### Option C: Manual SQL Update

If above methods don't work, run in phpMyAdmin:

```sql
UPDATE admins 
SET password = '$2y$10$rDa3K9h7XZvBnXV3eTKvJ.vCQH0xE/z7xCJ5gLqpZHJ5xgK5qK5qS',
    status = 'active'
WHERE username = 'admin';
```

---

## 🧪 Step 6: Test Everything

### 6.1 Database Connection Test

1. Visit: `https://yourdomain.com/test-connection.php`
2. Verify all sections show ✅ green checkmarks:
   - Database Connection
   - Tables exist
   - Admin account found
   - Password verification passes

### 6.2 API Integration Test

1. Visit: `https://yourdomain.com/test-api.html`
2. Run each test:
   - Test Database Connection
   - Test Admin Login (username: `admin`, password: `Admin@123`)
   - Test User Registration
   - Test User Login
   - Check Field Mappings

### 6.3 Frontend Login Tests

#### Test Admin Login:
1. Visit: `https://yourdomain.com/admin-login.html`
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`
3. Should redirect to admin dashboard
4. Verify username displays correctly (not "undefined")

#### Test User Registration:
1. Visit: `https://yourdomain.com/register.html`
2. Fill form and submit
3. Should show success message
4. Check phpMyAdmin → `users` table for new entry

#### Test User Login:
1. Visit: `https://yourdomain.com/login.html`
2. Login with registered credentials
3. Should redirect to user dashboard
4. Verify username displays correctly

---

## 🔒 Step 7: Enable SSL Certificate

### 7.1 Install SSL Certificate

1. In Hostinger hPanel, go to **Security** → **SSL**
2. Click **"Install SSL"** for your domain
3. Wait 10-15 minutes for activation

### 7.2 Force HTTPS

After SSL is active:

1. Edit `.htaccess` file
2. Uncomment lines 11-12:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

3. Save file
4. Test: Visit `http://yourdomain.com` (should redirect to https)

---

## 🧹 Step 8: Security Cleanup

### Remove Test Files

After everything works, delete these files:

1. `test-connection.php` ⚠️ **IMPORTANT: Exposes database info**
2. `test-api.html`
3. `generate-password-hash.php`
4. `database.sql` (from public_html, keep backup locally)
5. `update-admin-password.sql`

### Change Default Passwords

1. Login as admin
2. Go to admin dashboard → Settings
3. Change password from `Admin@123` to something strong
4. Never use default passwords in production!

### Delete Test Accounts

Run in phpMyAdmin:

```sql
DELETE FROM users WHERE username = 'testuser';
DELETE FROM teachers WHERE email = 'teacher@example.com';
DELETE FROM schools WHERE username = 'testschool';
```

---

## 🐛 Troubleshooting

### Problem: "Invalid credentials" at login

**Solution:**
1. Run `test-connection.php` → Check password verification
2. If fails, use "Fix Admin Password" button
3. Clear browser cache: Ctrl+Shift+Delete
4. Clear localStorage: F12 → Console → `localStorage.clear()`

### Problem: "Database connection failed"

**Solution:**
1. Check `db_connect.php` credentials match Hostinger
2. Verify database exists in Hostinger hPanel → Databases
3. Check database user has ALL PRIVILEGES
4. Try reconnecting to database in phpMyAdmin

### Problem: "Cannot read properties of undefined"

**Solution:**
1. This means localStorage has corrupted data
2. Open Console (F12) and run: `localStorage.clear()`
3. Refresh page and login again

### Problem: 404 error on API endpoints

**Solution:**
1. Check `.htaccess` file is uploaded
2. Verify `/api/` folders exist with PHP files
3. Check file permissions (should be 644 for PHP files)
4. Test direct URL: `https://yourdomain.com/api/users/login.php`

### Problem: Password hash doesn't verify

**Solution:**
1. PHP bcrypt hashes are unique each time
2. Use `generate-password-hash.php` to create new hash
3. Update database with new hash
4. Or use "Fix Password" button in test-connection.php

### Problem: Username shows as "undefined"

**Solution:**
1. Field name mismatch between database and JavaScript
2. Database uses `username`, not `fullName`
3. Already fixed in latest version
4. Clear cache and login again

---

## 📋 Field Mappings Reference

### Database → Frontend

**Users Table:**
```
Database Column → JavaScript Property
================================
username        → user.username
email          → user.email
phone          → user.phone
qualification  → user.qualification
created_at     → user.created_at
status         → user.status
```

**Admins Table:**
```
Database Column → JavaScript Property
================================
username        → admin.username
email          → admin.email
role           → admin.role
status         → admin.status
created_at     → admin.created_at
```

---

## ✅ Final Verification Checklist

- [ ] Database imported successfully (18 tables)
- [ ] db_connect.php has correct credentials
- [ ] test-connection.php shows all green ✅
- [ ] Admin login works with admin/Admin@123
- [ ] User registration creates database entry
- [ ] User login works and shows correct username
- [ ] User dashboard displays username (not "undefined")
- [ ] Admin dashboard loads correctly
- [ ] SSL certificate is active
- [ ] HTTPS is forced via .htaccess
- [ ] Test files are deleted
- [ ] Default admin password changed
- [ ] Test accounts deleted

---

## 🎉 Your Site is Live!

**URLs:**
- Homepage: `https://yourdomain.com`
- User Login: `https://yourdomain.com/login.html`
- Admin Login: `https://yourdomain.com/admin-login.html`
- User Registration: `https://yourdomain.com/register.html`

**Default Credentials (CHANGE THESE!):**
- Admin: `admin` / `Admin@123`

---

## 📞 Need Help?

**Common Issues:**
1. Database connection → Check db_connect.php
2. Login fails → Run test-connection.php
3. undefined errors → Clear localStorage
4. 404 errors → Check file uploads and .htaccess

**Hostinger Support:**
- Live Chat: Available 24/7 in hPanel
- Help Center: https://support.hostinger.com

---

**Last Updated:** March 1, 2026
**Version:** 2.0 - Complete Hostinger Integration
