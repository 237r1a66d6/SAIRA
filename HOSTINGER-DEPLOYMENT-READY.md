# ✅ HOSTINGER DEPLOYMENT READY CHECKLIST
## SAIRA ACAD - Complete Deployment Guide

---

## 🎉 PRE-DEPLOYMENT STATUS: READY ✓

Your project has been configured and is **READY FOR DEPLOYMENT** to Hostinger!

### ✅ Completed Preparations:
- ✓ API configuration updated (auto-detects production/development)
- ✓ All JavaScript files fixed (removed hardcoded localhost:5000)
- ✓ Database connection configured for Hostinger
- ✓ CORS headers properly set
- ✓ .htaccess optimized for performance and security
- ✓ Security headers configured
- ✓ File permissions and protections in place

---

## 📋 DEPLOYMENT STEPS

### STEP 1: Access Hostinger hPanel

1. Go to https://www.hostinger.com and login
2. Navigate to your **hPanel** dashboard
3. Select your hosting plan/domain

---

### STEP 2: Setup Database

#### 2.1 Create/Access MySQL Database
1. In hPanel, go to **"Databases"** → **"MySQL Databases"**
2. Either create a new database or use existing one
3. **Note down these credentials** (you'll need them):
   ```
   Database Name: u642524181_SairaAcad (or your custom name)
   Username: u642524181_DB_1 (or your username)
   Password: [Your database password]
   Hostname: localhost
   ```

#### 2.2 Update Database Credentials
Before uploading, update `db_connect.php` with your actual credentials:

**File: `db_connect.php`** (Lines 10-13)
```php
$servername = "localhost";  // Keep as "localhost"
$username = "YOUR_ACTUAL_USERNAME";  // Replace with your Hostinger username
$password = "YOUR_ACTUAL_PASSWORD";  // Replace with your Hostinger password
$database = "YOUR_ACTUAL_DATABASE";  // Replace with your Hostinger database name
```

#### 2.3 Import Database Schema
1. In hPanel, go to **"Databases"** → **"phpMyAdmin"**
2. Select your database from the left sidebar
3. Click **"Import"** tab
4. Choose your `database.sql` file
5. Click **"Go"** to import

---

### STEP 3: Upload Project Files

#### Option A: Using File Manager (Recommended)

1. In hPanel, go to **"Files"** → **"File Manager"**
2. Navigate to **`public_html`** folder
3. **IMPORTANT**: Delete all default files in `public_html` (index.html, default pages)
4. Click **"Upload"** button
5. **Upload ALL files and folders**:
   
   **Files to Upload:**
   - ✓ All HTML files (index.html, login.html, register.html, etc.)
   - ✓ db_connect.php (with updated credentials!)
   - ✓ register_handler.php
   - ✓ generate-password-hash.php
   - ✓ .htaccess
   - ✓ robots.txt
   - ✓ sitemap.xml
   
   **Folders to Upload:**
   - ✓ api/ (entire folder with all subfolders)
   - ✓ css/ (entire folder)
   - ✓ js/ (entire folder)
   - ✓ assets/ (entire folder)

6. **DO NOT upload:**
   - ❌ database.sql (already imported)
   - ❌ .git/ folder
   - ❌ .md documentation files (optional)

#### Option B: Using FTP Client (FileZilla)

1. Get FTP credentials from hPanel → **"Files"** → **"FTP Accounts"**
2. Connect using FileZilla:
   - Host: ftp.yourdomain.com
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Upload all files to `/public_html/` directory

---

### STEP 4: Set File Permissions

In Hostinger File Manager:
1. Right-click on folders and set permissions to **755**
2. Right-click on files and set permissions to **644**
3. Specifically check:
   - api/ folder and subfolders: **755**
   - All .php files: **644**
   - .htaccess: **644**

---

### STEP 5: Configure SSL Certificate (HTTPS)

1. In hPanel, go to **"Security"** → **"SSL"**
2. Enable **Free SSL Certificate** (Let's Encrypt)
3. Wait 10-15 minutes for SSL to activate
4. After SSL is active, update `.htaccess`:
   - Open `.htaccess` in File Manager
   - **Uncomment** lines 12-13:
     ```apache
     RewriteCond %{HTTPS} off
     RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
     ```
   - This will force HTTPS for all pages

---

### STEP 6: Test Your Website

#### 6.1 Access Your Website
Visit: `https://yourdomain.com` or `https://yoursubdomain.hostinger.site`

#### 6.2 Test Core Functionality
- ✓ Homepage loads correctly
- ✓ Navigation works
- ✓ Forms load (contact, registration, etc.)
- ✓ Login pages accessible
- ✓ CSS and JavaScript load properly
- ✓ Images and assets display

#### 6.3 Test API Endpoints
- ✓ User Registration: Try creating a new account
- ✓ User Login: Try logging in
- ✓ Contact Form: Submit a test contact form
- ✓ Admin Login: Test at `yourdomain.com/admin-login.html`

#### 6.4 Check Browser Console
- Press `F12` in your browser
- Check **Console** tab for any JavaScript errors
- Check **Network** tab to see if API calls succeed

---

### STEP 7: Create Admin Account

#### 7.1 Generate Admin Password Hash
1. Access: `https://yourdomain.com/generate-password-hash.php`
2. Enter your desired admin password
3. Copy the generated hash

#### 7.2 Create Admin in Database
1. Go to **phpMyAdmin** in hPanel
2. Select your database
3. Click on **`admins`** table
4. Click **"Insert"** tab
5. Fill in:
   ```
   username: admin (or your choice)
   email: admin@yourdomain.com
   password_hash: [paste the hash from step 7.1]
   full_name: System Administrator
   status: active
   ```
6. Click **"Go"**

#### 7.3 Test Admin Login
- Visit: `https://yourdomain.com/admin-login.html`
- Login with your admin credentials

---

### STEP 8: Security Hardening

#### 8.1 Delete Sensitive Files
After deployment, delete these files from `public_html/`:
- ❌ `database.sql`
- ❌ `generate-password-hash.php` (after creating admin)
- ❌ All `.md` files (documentation)
- ❌ `test-*.html` files

#### 8.2 Disable PHP Error Display
In hPanel, go to **"Advanced"** → **"PHP Configuration"**:
- Set `display_errors` = **Off**
- Set `log_errors` = **On**

#### 8.3 Update CORS Settings (Optional)
If you want to restrict API access to your domain only:

Edit `db_connect.php` line 68:
```php
// Change from:
header('Access-Control-Allow-Origin: *');

// To:
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

---

## 🎯 POST-DEPLOYMENT CHECKLIST

### Verify Everything Works:
- [ ] Homepage loads with HTTPS
- [ ] All pages are accessible
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Contact forms submit successfully
- [ ] Application forms work
- [ ] Mobile responsive design works
- [ ] All images and CSS load
- [ ] No JavaScript errors in console

### SEO & Performance:
- [ ] Submit sitemap to Google Search Console: `yourdomain.com/sitemap.xml`
- [ ] Test website speed: https://pagespeed.web.dev/
- [ ] Test mobile friendliness: https://search.google.com/test/mobile-friendly
- [ ] Check SSL certificate: https://www.ssllabs.com/ssltest/

### Monitoring:
- [ ] Set up Google Analytics (optional)
- [ ] Monitor error logs in hPanel
- [ ] Regular database backups (weekly recommended)

---

## 🆘 TROUBLESHOOTING

### Problem: "500 Internal Server Error"
**Solution:**
- Check .htaccess file syntax
- Check PHP error logs in hPanel
- Verify file permissions (folders: 755, files: 644)
- Check db_connect.php credentials

### Problem: "Database connection failed"
**Solution:**
- Verify database credentials in db_connect.php
- Ensure database exists in phpMyAdmin
- Check that hostname is "localhost"

### Problem: "API calls fail / CORS errors"
**Solution:**
- Check if SSL is enabled
- Verify .htaccess CORS headers are present
- Check browser console for specific error messages

### Problem: "CSS/JS files not loading"
**Solution:**
- Check file paths in HTML files
- Verify folders uploaded correctly
- Clear browser cache (Ctrl + F5)
- Check file permissions

### Problem: "Forms not submitting"
**Solution:**
- Check browser console for JavaScript errors
- Verify API endpoints exist in /api/ folder
- Test API endpoints directly in browser
- Check PHP error logs

---

## 📞 SUPPORT RESOURCES

### Hostinger Support:
- Live Chat: Available 24/7 in hPanel
- Knowledge Base: https://support.hostinger.com
- Community Forum: https://www.hostinger.com/forum

### Your Project Files:
- All API endpoints: `/api/` folder
- Database connection: `db_connect.php`
- Frontend config: `js/api-config.js`
- Server config: `.htaccess`

---

## 🚀 DEPLOYMENT SUMMARY

**Deployment Type:** Full Stack (Frontend + Backend + Database)
**Hosting Platform:** Hostinger Shared Hosting
**Backend:** PHP 7.4+ with MySQL
**Frontend:** HTML5, CSS3, JavaScript (Vanilla)
**Database:** MySQL 5.7+
**SSL:** Free Let's Encrypt Certificate
**Estimated Deployment Time:** 30-45 minutes

---

## ✅ YOU'RE READY!

Your SAIRA ACAD project is fully prepared for deployment. Follow the steps above carefully, and you'll have your website live on Hostinger in no time!

**Good luck with your deployment! 🎉**

---

*Last Updated: March 5, 2026*
*Project: SAIRA ACAD Educational Platform*
