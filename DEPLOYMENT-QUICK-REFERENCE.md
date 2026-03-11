# 🚀 QUICK DEPLOYMENT REFERENCE
## SAIRA ACAD - Hostinger Deployment

---

## 📝 BEFORE YOU UPLOAD

### 1. Update Database Credentials
**File:** `db_connect.php` (Lines 10-13)
```php
$servername = "localhost";
$username = "YOUR_HOSTINGER_DB_USERNAME";
$password = "YOUR_HOSTINGER_DB_PASSWORD";
$database = "YOUR_HOSTINGER_DB_NAME";
```

### 2. Get Your Hostinger Credentials
From hPanel → Databases:
- Database Name: ___________________________
- Username: ___________________________
- Password: ___________________________

---

## 📤 UPLOAD TO HOSTINGER

### Files to Upload to `public_html/`:
```
✓ All .html files
✓ db_connect.php (with updated credentials!)
✓ register_handler.php
✓ generate-password-hash.php
✓ .htaccess
✓ robots.txt
✓ sitemap.xml
✓ api/ (entire folder)
✓ css/ (entire folder)
✓ js/ (entire folder)
✓ assets/ (entire folder)
```

### DO NOT Upload:
```
✗ database.sql (import via phpMyAdmin instead)
✗ .git/ folder
✗ .md files (optional)
```

---

## 🗄️ DATABASE SETUP

### Import Database:
1. hPanel → Databases → phpMyAdmin
2. Select your database
3. Import → Choose `database.sql`
4. Click "Go"

---

## 🔒 ENABLE SSL (After Upload)

### In .htaccess, uncomment lines 12-13:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

---

## 👤 CREATE ADMIN ACCOUNT

### Step 1: Generate Password Hash
Visit: `https://yourdomain.com/generate-password-hash.php`

### Step 2: Insert Admin in Database
phpMyAdmin → `admins` table → Insert:
```
username: admin
email: admin@yourdomain.com
password_hash: [paste hash from step 1]
full_name: System Administrator
status: active
```

### Step 3: Test Login
Visit: `https://yourdomain.com/admin-login.html`

---

## 🧹 POST-DEPLOYMENT CLEANUP

### Delete These Files:
```
✗ database.sql
✗ generate-password-hash.php
✗ test-*.html
✗ All .md files (optional)
```

---

## ✅ TEST CHECKLIST

- [ ] Homepage loads (https://yourdomain.com)
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Contact form works
- [ ] All pages load correctly
- [ ] No console errors (F12)
- [ ] Mobile responsive works

---

## 🆘 QUICK TROUBLESHOOTING

**500 Error?**
→ Check db_connect.php credentials
→ Check file permissions (folders: 755, files: 644)

**Database connection failed?**
→ Verify credentials match Hostinger hPanel
→ Ensure hostname is "localhost"

**API not working?**
→ Check browser console (F12)
→ Verify SSL is enabled
→ Check .htaccess uploaded correctly

**CSS/JS not loading?**
→ Clear browser cache (Ctrl + F5)
→ Check folders uploaded correctly
→ Verify file paths in HTML files

---

## 📞 HOSTINGER SUPPORT

**Live Chat:** Available 24/7 in hPanel
**Knowledge Base:** https://support.hostinger.com

---

## ⏱️ ESTIMATED TIME

**Total Deployment:** 30-45 minutes
- Database Setup: 5-10 min
- File Upload: 10-15 min
- SSL Setup: 5-10 min
- Testing: 10 min

---

**Your project is ready! Follow these steps and you'll be live soon! 🎉**
