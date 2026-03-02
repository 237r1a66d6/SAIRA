# Admin Password Setup Guide

## Quick Fix for "Invalid Credentials" Error

If you're getting "Invalid credentials" when trying to login as admin, follow these steps:

### Method 1: Use LocalStorage (For Local Testing)

1. Open [admin-login.html](admin-login.html) in your browser
2. Press **F12** to open Developer Console
3. Run this command:
   ```javascript
   localStorage.removeItem('admins'); location.reload();
   ```
4. Login with:
   - **Username**: `admin`
   - **Password**: `Admin@123`

### Method 2: Update Database Password (For Hostinger/Production)

#### Step 1: Generate Password Hash

1. Upload `generate-password-hash.php` to your Hostinger file manager
2. Access it via browser: `https://yourdomain.com/generate-password-hash.php`
3. You'll see the generated hash for `Admin@123`
4. Copy the hash (the long string starting with `$2y$10$...`)

#### Step 2: Update Database

**Option A: Use phpMyAdmin SQL Tab**
1. Open phpMyAdmin in Hostinger
2. Select your database
3. Click **SQL** tab
4. Paste and run:
   ```sql
   UPDATE admins 
   SET password = 'PASTE_YOUR_HASH_HERE',
       status = 'active',
       role = 'super_admin'
   WHERE username = 'admin';
   ```

**Option B: Use the Update Script**
1. Open `update-admin-password.sql` 
2. Replace `YOUR_GENERATED_HASH_HERE` with the hash you copied
3. Copy entire contents
4. Paste into phpMyAdmin SQL tab
5. Click **Go**

#### Step 3: Verify

Run this query to check the update:
```sql
SELECT username, email, role, status, created_at 
FROM admins 
WHERE username = 'admin';
```

You should see:
- username: `admin`
- email: `admin@sairaacad.com`
- role: `super_admin`
- status: `active`

### Method 3: Re-import Database

1. In phpMyAdmin, select your database
2. Go to **SQL** tab
3. Run: `DROP TABLE IF EXISTS admins;`
4. Go to **Import** tab
5. Import `database.sql` again
6. Follow **Method 2** above to set correct password

---

## Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `Admin@123`
- **Email**: `admin@sairaacad.com`

### Test Accounts (Commented out by default)
To enable test accounts, uncomment them in `database.sql` and regenerate their password hashes.

---

## Important Security Notes

⚠️ **AFTER FIRST LOGIN:**
1. Change the default admin password immediately
2. Use a strong, unique password
3. Never share your credentials
4. Delete or disable test accounts before production

⚠️ **Password Hashing:**
- Database uses bcrypt hashing (secure)
- LocalStorage uses plain text (for development only)
- Always use database authentication in production

---

## Troubleshooting

### "Invalid credentials" after database import
- The password hash in database.sql may be invalid
- Solution: Follow **Method 2** above to regenerate the hash

### Admin login works locally but not on Hostinger
- LocalStorage vs Database authentication
- Solution: Update database password using **Method 2**

### Console shows "Available admins: []"
- LocalStorage is empty
- Solution: Clear cache and let it initialize: `localStorage.clear(); location.reload();`

### "Backend API unavailable"
- Database connection issue
- Check `db_connect.php` credentials match your Hostinger database
- Solution: Update credentials in `db_connect.php` (lines 11-13)

---

## Files Reference

| File | Purpose |
|------|---------|
| `database.sql` | Main database schema with admin account |
| `update-admin-password.sql` | SQL script to update admin password |
| `generate-password-hash.php` | PHP tool to generate bcrypt hashes |
| `db_connect.php` | Database connection configuration |
| `js/auth.js` | LocalStorage authentication (testing) |
| `api/admin/login.php` | Backend admin login endpoint |

---

## Need Help?

1. Check browser console (F12) for detailed error messages
2. Verify database credentials in `db_connect.php`
3. Test database connection: `https://yourdomain.com/api/admin/login.php`
4. Clear browser cache and localStorage
5. Reimport database.sql if tables are corrupted
