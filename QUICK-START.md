# 🚀 QUICK START - Hostinger Deployment

## 📋 5-Minute Setup Checklist

### 1️⃣ Upload Files (5 min)
```
Upload to public_html/:
✓ All HTML files
✓ css/ folder
✓ js/ folder
✓ api/ folder
✓ assets/ folder
✓ .htaccess
✓ db_connect.php
✓ test-connection.php
✓ test-api.html
```

### 2️⃣ Database Setup (3 min)
```
In Hostinger hPanel:
1. Databases → MySQL Databases
2. Note credentials:
   - Database name
   - Username
   - Password
3. Click "Manage" → phpMyAdmin
4. Import → Choose database.sql
5. Click "Go"
```

### 3️⃣ Update Config (1 min)
```php
Edit db_connect.php lines 11-13:
$username = "u642524181_DB_1";  // Your username
$password = "YOUR_PASSWORD";     // Your password
$database = "u642524181_SairaAcad";  // Your DB name
```

### 4️⃣ Fix Admin Password (30 sec)
```
1. Visit: yourdomain.com/test-connection.php
2. Scroll to "Password Verification Test"
3. Click "Fix Admin Password Automatically"
4. Wait for ✅ success message
```

### 5️⃣ Test & Login (1 min)
```
Test:
- yourdomain.com/test-api.html → Run all tests

Login:
- yourdomain.com/admin-login.html
  Username: admin
  Password: Admin@123

- yourdomain.com/register.html → Create user
- yourdomain.com/login.html → Login as user
```

### 6️⃣ Security Cleanup (1 min)
```
Delete from server:
✗ test-connection.php
✗ test-api.html
✗ generate-password-hash.php
✗ database.sql (keep local backup)

Change passwords:
✓ Admin dashboard → Change from Admin@123
```

---

## ⚡ Emergency Fixes

### "Invalid Credentials" Error
```javascript
// Open browser console (F12), run:
localStorage.clear();
location.reload();
```

### Admin Login Not Working
```
1. Visit: yourdomain.com/test-connection.php
2. Click "Fix Admin Password Automatically"
3. Login with: admin / Admin@123
```

### "Undefined" Username
```javascript
// Clear cache and localStorage:
// Press Ctrl+Shift+Delete → Clear all
// Or run in console:
localStorage.removeItem('currentUser');
localStorage.removeItem('currentAdmin');
location.reload();
```

### Database Connection Failed
```php
// Check db_connect.php has correct:
- Database name (from Hostinger hPanel)
- Username (from Hostinger hPanel)
- Password (from Hostinger hPanel)
- Host is "localhost"
```

---

## 📞 Quick Reference

### Default Credentials
```
Admin:
  URL: yourdomain.com/admin-login.html
  Username: admin
  Password: Admin@123
  ⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!

User:
  URL: yourdomain.com/register.html
  Register new account first
```

### Important URLs
```
Homepage:       yourdomain.com
User Login:     yourdomain.com/login.html
Admin Login:    yourdomain.com/admin-login.html
Registration:   yourdomain.com/register.html
Test DB:        yourdomain.com/test-connection.php
Test API:       yourdomain.com/test-api.html
```

### Database Info
```
Tables Created: 18
  ✓ users
  ✓ admins
  ✓ teachers
  ✓ schools
  ✓ partners
  ✓ user_sessions
  ✓ login_attempts
  ✓ user_activity_log
  ✓ password_reset_tokens
  + 9 form tables

Default Admin: 1 (admin/Admin@123)
Test Accounts: Commented out
```

### File Structure
```
public_html/
├── index.html           (Homepage)
├── login.html          (User login)
├── admin-login.html    (Admin login)
├── register.html       (User registration)
├── user-dashboard.html (User panel)
├── admin-dashboard.html (Admin panel)
├── db_connect.php      (⚠️ UPDATE CREDENTIALS)
├── .htaccess          (Apache config)
├── css/               (Styles)
├── js/                (Frontend logic)
├── api/               (Backend endpoints)
│   ├── users/
│   ├── admin/
│   ├── teacher/
│   ├── school-partner/
│   └── forms/
└── assets/            (Images)
```

---

## ✅ Success Indicators

### All Working If:
- [ ] test-connection.php shows all ✅
- [ ] test-api.html all tests pass
- [ ] Admin login → admin-dashboard.html
- [ ] User registration creates DB entry
- [ ] User login → user-dashboard.html
- [ ] Username displays (not "undefined")
- [ ] No console errors (F12)

---

## 🆘 Help Needed?

### Check These First:
1. **test-connection.php** - Shows database status
2. **Browser Console (F12)** - Shows JavaScript errors
3. **phpMyAdmin** - Verify tables exist
4. **db_connect.php** - Verify credentials correct

### Common Solutions:
| Problem | Solution |
|---------|----------|
| Can't login | Run test-connection.php → Fix password |
| "undefined" shown | Clear localStorage, login again |
| 500 error | Check db_connect.php credentials |
| 404 on API | Verify /api/ folder uploaded |
| Tables missing | Re-import database.sql |

---

## 📱 Contact

### Hostinger Support
- Live Chat: 24/7 in hPanel
- Help Center: support.hostinger.com

### Test Tools Location
```
After upload, access:
- Test DB: https://yourdomain.com/test-connection.php
- Test API: https://yourdomain.com/test-api.html
- Hash Gen: https://yourdomain.com/generate-password-hash.php
```

---

**⏱️ Total Setup Time: ~15 minutes**  
**🎯 Difficulty: Easy (All automated)**  
**✅ Status: Production Ready**

---

**Last Updated:** March 1, 2026  
**Version:** 2.0 Complete
