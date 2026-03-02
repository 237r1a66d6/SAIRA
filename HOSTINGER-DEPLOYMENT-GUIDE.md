# 🚀 HOSTINGER DEPLOYMENT GUIDE
## Complete Step-by-Step Instructions for SAIRA ACAD

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before uploading to Hostinger, ensure you have:
- ✅ Hostinger account with active hosting plan
- ✅ Domain name (if applicable)
- ✅ FTP/SFTP credentials from Hostinger
- ✅ Database credentials from Hostinger hPanel
- ✅ All project files ready

---

## 🗂️ STEP 1: GET YOUR HOSTINGER CREDENTIALS

### 1.1 Login to Hostinger hPanel
1. Go to https://www.hostinger.com
2. Click "Login" and enter your credentials
3. Navigate to your hPanel dashboard

### 1.2 Get Database Credentials
1. In hPanel, go to **"Databases"** section
2. Click **"Manage"** next to your database
3. Note down these credentials:
   ```
   Database Name: u642524181_SairaAcad (or similar)
   Username: u642524181_DB_1 (or similar)
   Password: [Your database password]
   Hostname: localhost
   ```

### 1.3 Get FTP/File Manager Access
1. In hPanel, go to **"Files"** → **"File Manager"**
2. OR get FTP credentials from **"Files"** → **"FTP Accounts"**

---

## 📤 STEP 2: UPLOAD PROJECT FILES

### Option A: Using Hostinger File Manager (Recommended)

1. In hPanel, go to **"Files"** → **"File Manager"**
2. Navigate to **`public_html`** folder (this is your website root)
3. **Delete ALL existing files** in public_html (if any)
4. Click **"Upload"** button
5. Upload ALL your project files:
   - All HTML files (index.html, login.html, register.html, etc.)
   - All folders (css/, js/, api/, assets/)
   - db_connect.php
   - register_handler.php
   - .htaccess
   - database.sql (for importing, then delete after)
   - robots.txt
   - sitemap.xml

6. **File Structure in public_html should look like:**
   ```
   public_html/
   ├── index.html
   ├── login.html
   ├── register.html
   ├── admin-login.html
   ├── [all other HTML files]
   ├── db_connect.php
   ├── register_handler.php
   ├── .htaccess
   ├── database.sql
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
   └── assets/
   ```

### Option B: Using FTP Client (FileZilla)

1. Download FileZilla from https://filezilla-project.org/
2. Connect using your Hostinger FTP credentials
3. Navigate to `public_html` folder on remote side
4. Drag and drop all project files from local to remote

---

## 🗄️ STEP 3: CONFIGURE DATABASE

### 3.1 Update Database Connection File

1. In File Manager, open **`db_connect.php`**
2. Click **"Edit"** or right-click → **"Edit"**
3. Update these lines with YOUR actual Hostinger credentials:
   ```php
   $servername = "localhost";  // Keep as "localhost"
   $username = "u642524181_DB_1";  // YOUR DATABASE USERNAME
   $password = "YourActualPassword";  // YOUR DATABASE PASSWORD
   $database = "u642524181_SairaAcad";  // YOUR DATABASE NAME
   ```
4. Click **"Save"**

### 3.2 Import Database Schema

1. In hPanel, go to **"Databases"** → **"phpMyAdmin"**
2. Click on your database name in the left sidebar
3. Click **"Import"** tab at the top
4. Click **"Choose File"** and select **`database.sql`**
5. Scroll down and click **"Go"**
6. Wait for success message: **"Import has been successfully finished"**

### 3.3 Verify Database Import

1. In phpMyAdmin, click your database name in left sidebar
2. You should see these 18 tables:
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

### 3.4 Delete database.sql (Security)

1. After successful import, go back to File Manager
2. **DELETE** the `database.sql` file from public_html
3. This prevents unauthorized access to your database structure

---

## ⚙️ STEP 4: CONFIGURE PHP SETTINGS

### 4.1 Check PHP Version
1. In hPanel, go to **"Advanced"** → **"PHP Configuration"**
2. Ensure PHP version is **7.4 or higher** (8.0+ recommended)
3. If needed, select higher version and save

### 4.2 Verify .htaccess is Working
1. Visit your website: `https://yourdomain.com`
2. The .htaccess file should automatically:
   - Enable compression
   - Set caching headers
   - Protect sensitive files
   - Enable CORS for API

---

## 🔒 STEP 5: ENABLE HTTPS (SSL Certificate)

### 5.1 Install FREE SSL Certificate
1. In hPanel, go to **"Security"** → **"SSL"**
2. Click **"Install SSL"** or **"Let's Encrypt SSL"**
3. Select your domain
4. Click **"Install"** and wait 5-10 minutes

### 5.2 Force HTTPS
1. After SSL is active, open **`.htaccess`** file
2. Find these lines (around line 11-12):
   ```apache
   # RewriteCond %{HTTPS} off
   # RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```
3. **Remove the # symbols** to uncomment:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```
4. Save file

---

## 🧪 STEP 6: TEST YOUR WEBSITE

### 6.1 Test Homepage
1. Visit: `https://yourdomain.com`
2. Homepage should load correctly

### 6.2 Test User Registration
1. Go to: `https://yourdomain.com/register.html`
2. Fill out registration form
3. Submit and verify success message
4. Check database in phpMyAdmin → users table

### 6.3 Test User Login
1. Go to: `https://yourdomain.com/login.html`
2. Login with registered user
3. Should redirect to user dashboard

### 6.4 Test Admin Login
1. Go to: `https://yourdomain.com/admin-login.html`
2. Default credentials:
   - Username: `admin`
   - Password: `Admin@123`
3. Should redirect to admin dashboard
4. **⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

### 6.5 Test Contact Form
1. Go to: `https://yourdomain.com/contact-us.html`
2. Fill and submit contact form
3. Check database: contact_submissions table

### 6.6 Test All API Endpoints
Visit these URLs to verify API is working:
- User Register: `https://yourdomain.com/api/users/register.php`
- User Login: `https://yourdomain.com/api/users/login.php`
- Admin Login: `https://yourdomain.com/api/admin/login.php`

All should return JSON error (because no data sent), not 404 error.

---

## 🔐 STEP 7: SECURITY HARDENING

### 7.1 Change Default Admin Password
1. Login to phpMyAdmin
2. Go to `admins` table
3. Click "Edit" on admin user
4. Change password to a strong one (use password generator)
5. **Hash it first** using this PHP code (run in phpMyAdmin SQL tab):
   ```sql
   UPDATE admins 
   SET password = '$2y$10$YourNewHashHere' 
   WHERE username = 'admin';
   ```
   
   Or create new hash in PHP:
   ```php
   <?php echo password_hash('YourNewPassword', PASSWORD_DEFAULT); ?>
   ```

### 7.2 Delete Test Accounts (Production)
In phpMyAdmin, run these SQL commands:
```sql
-- Delete test user
DELETE FROM users WHERE username = 'testuser';

-- Delete test teacher
DELETE FROM teachers WHERE email = 'teacher@example.com';

-- Delete test school
DELETE FROM schools WHERE username = 'testschool';
```

### 7.3 Secure Database Credentials
1. Ensure `db_connect.php` has correct permissions (644)
2. Never commit credentials to public repositories
3. Consider using environment variables for larger deployments

### 7.4 Enable Error Logging
1. Create error log in public_html: `php_errors.log`
2. Set permissions to 644
3. Monitor regularly for issues

---

## 📊 STEP 8: VERIFY EVERYTHING WORKS

### Final Checklist:
- [ ] Website loads at your domain
- [ ] HTTPS is working (green padlock in browser)
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Teacher login works (if applicable)
- [ ] School partner login works (if applicable)
- [ ] Contact forms submit successfully
- [ ] All images and CSS load correctly
- [ ] Mobile responsive design works
- [ ] Database tables are populated with test data
- [ ] Default admin password has been changed
- [ ] Test accounts deleted (for production)

---

## 🛠️ TROUBLESHOOTING COMMON ISSUES

### Issue 1: "Connection failed" error
**Solution:**
- Verify database credentials in `db_connect.php`
- Check database name, username, password in Hostinger hPanel
- Ensure hostname is "localhost"

### Issue 2: "404 Not Found" for API calls
**Solution:**
- Check .htaccess file exists in public_html
- Verify PHP files are in correct folders (api/users/, api/forms/, etc.)
- Check file permissions (644 for files, 755 for folders)

### Issue 3: Forms not submitting
**Solution:**
- Open browser console (F12) and check for JavaScript errors
- Verify API endpoints in js/api-config.js
- Check if PHP files have correct permissions
- Look at PHP error logs

### Issue 4: "Table doesn't exist" error
**Solution:**
- Re-import database.sql in phpMyAdmin
- Verify all 18 tables were created
- Check you selected correct database before importing

### Issue 5: SSL certificate not working
**Solution:**
- Wait 10-15 minutes after installation
- Clear browser cache
- Check SSL status in Hostinger hPanel → Security → SSL

### Issue 6: Images not loading
**Solution:**
- Check assets/ folder was uploaded
- Verify image paths in HTML files
- Check file names match exactly (case-sensitive)

---

## 📞 SUPPORT RESOURCES

### Hostinger Support:
- Live Chat: Available 24/7 in hPanel
- Knowledge Base: https://support.hostinger.com
- Tutorials: https://www.hostinger.com/tutorials

### Database Issues:
- phpMyAdmin documentation
- Check PHP error logs in File Manager

### Website Issues:
- Browser Console (F12) for JavaScript errors
- Check .htaccess syntax
- Review PHP error logs

---

## 🎉 DEPLOYMENT COMPLETE!

Your SAIRA ACAD website is now live on Hostinger!

**Next Steps:**
1. ✅ Monitor error logs regularly
2. ✅ Backup database weekly (Hostinger → Databases → Backup)
3. ✅ Keep PHP and scripts updated
4. ✅ Monitor database size (included in hosting limits)
5. ✅ Set up regular backups in Hostinger control panel
6. ✅ Test all functionality after any updates

**Important Links:**
- Your Website: `https://yourdomain.com`
- Admin Panel: `https://yourdomain.com/admin-login.html`
- Hostinger hPanel: `https://hpanel.hostinger.com`
- phpMyAdmin: Via hPanel → Databases → phpMyAdmin

---

## 📝 MAINTENANCE CHECKLIST

### Daily:
- Check website loads correctly
- Monitor contact form submissions

### Weekly:
- Backup database via phpMyAdmin or Hostinger backup
- Check error logs
- Review new user registrations

### Monthly:
- Update test and review all forms
- Check database size
- Review and clean old login attempts/logs (optional)
- Test all login systems

### Quarterly:
- Change admin passwords
- Review and update SSL certificate (auto-renews)
- Check for PHP version updates
- Optimize database tables

---

## 🔄 UPDATING YOUR WEBSITE

To update files:
1. Edit files locally
2. Upload via File Manager or FTP
3. Replace existing files
4. Clear browser cache to see changes

To update database structure:
1. Backup existing database first!
2. Make changes in phpMyAdmin
3. Export updated SQL schema for future use

---

## ✅ PROJECT READY FOR HOSTINGER!

All files have been configured and optimized for Hostinger hosting.
Simply follow this guide step-by-step and your website will be live!

**Good luck! 🚀**
