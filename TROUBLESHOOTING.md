# SAIRA ACAD - Troubleshooting Guide

## Common Issues and Solutions

### 🔧 Website Not Loading

**Issue**: The website doesn't open or shows a blank page.

**Solutions**:
1. Make sure you're opening `index.html` directly in a browser
2. Check that all files are in the correct folder structure
3. Try a different browser (Chrome recommended)
4. Clear browser cache and try again
5. Check browser console (F12) for error messages

---

### 🔐 Cannot Login

**Issue**: Login fails even with correct credentials.

**Solutions**:

**For Users**:
1. Make sure you're using your **Full Name** (not email) and password
2. Check for typos and extra spaces
3. Name and password are case-sensitive
4. Ensure you registered first before trying to login
5. Try opening browser console (F12) and check localStorage for user data

**For Admins**:
1. Default credentials are:
   - Username: `admin`
   - Password: `1234567@_a`
2. Make sure you're on the admin-login.html page, not login.html
3. Credentials are case-sensitive

---

### 📝 Registration Not Working

**Issue**: Cannot complete registration or getting errors.

**Solutions**:
1. **All fields are required** - fill every field
2. **Phone number** must be exactly 10 digits (no spaces or dashes)
3. **Email** must be valid format (example@domain.com)
4. **Password** must be at least 8 characters
5. **Passwords must match** - check Confirm Password field
6. **Cannot use same email twice** - each email is unique
7. **Cannot use same name twice** - each full name must be unique

---

### 💾 Data Not Saving

**Issue**: Registered but data disappears after closing browser.

**Solutions**:
1. Make sure you're not in **Incognito/Private** browsing mode
2. Check browser settings - localStorage must be enabled
3. Some browsers block localStorage - check settings
4. Try a different browser
5. Don't clear browser data/cookies after registration

---

### 🚫 Cannot Access Dashboard

**Issue**: After login, dashboard doesn't load or redirects back.

**Solutions**:
1. Make sure you successfully logged in
2. Check if you're logged out - try logging in again
3. Clear browser cache and localStorage, then register again
4. Open browser console (F12) and look for errors
5. Try: `localStorage.getItem('currentUser')` in console to check if logged in

---

### 👨‍💼 Admin Features Not Working

**Issue**: Cannot add admins/users or manage data.

**Solutions**:
1. Make sure you're logged in as admin (not regular user)
2. Check you're on admin-dashboard.html, not user-dashboard.html
3. Try logging out and logging back in as admin
4. Cannot delete default admin "admin" - this is by design
5. Make sure forms are filled completely before submitting

---

### 📚 Course Enrollment Issues

**Issue**: Cannot enroll in courses or enrollment doesn't save.

**Solutions**:
1. Make sure you're logged in as a user
2. Cannot enroll in same course twice - check if already enrolled
3. Check dashboard statistics to see enrolled courses
4. Try logging out and back in
5. Check localStorage for course data

---

### 🎨 Website Looks Wrong

**Issue**: Colors, layout, or styling doesn't look right.

**Solutions**:
1. Make sure `css/style.css` file exists
2. Clear browser cache (Ctrl+F5)
3. Check browser console for CSS loading errors
4. Try a different browser
5. Ensure all files are in correct folders

---

### 📱 Not Working on Mobile

**Issue**: Website doesn't work properly on phone/tablet.

**Solutions**:
1. Use a modern mobile browser (Chrome, Safari, Firefox)
2. Try landscape and portrait orientations
3. Zoom may affect layout - try default zoom level
4. Some features work better on desktop
5. Clear mobile browser cache

---

### ⚠️ Console Errors

**Issue**: Seeing errors in browser console (F12).

**Common Errors and Fixes**:

1. **"Cannot read property of null"**
   - Element ID might be wrong
   - Page might be loading before JavaScript
   - Refresh the page

2. **"localStorage is not defined"**
   - Browser doesn't support localStorage
   - Private browsing mode is on
   - localStorage is disabled in settings

3. **"Uncaught ReferenceError: function is not defined"**
   - JavaScript file didn't load
   - Check file paths in HTML
   - Clear cache and reload

4. **CSS file not loading**
   - Check file path: `css/style.css`
   - Make sure file exists
   - Check for typos in file name

---

### 🔄 Need to Reset Everything

**Issue**: Want to start fresh or data is corrupted.

**Solution**:
1. Open browser console (F12)
2. Go to "Application" or "Storage" tab
3. Find "Local Storage"
4. Right-click and "Clear"
5. Or run in console:
   ```javascript
   localStorage.clear();
   ```
6. Refresh the page
7. Default admin will be recreated automatically

---

### 📧 Email Validation Failing

**Issue**: Valid email addresses are rejected.

**Solutions**:
1. Make sure format is: name@domain.com
2. No spaces before or after email
3. Must have @ symbol and domain
4. Try common format like: test@gmail.com

---

### 📞 Phone Validation Failing

**Issue**: Phone number not accepted.

**Solutions**:
1. Must be exactly **10 digits**
2. No spaces, dashes, or parentheses
3. Only numbers: 9876543210
4. No country code (+91, etc.)
5. No special characters

---

### 🔐 Password Issues

**Issue**: Password not accepted or doesn't work.

**Solutions**:
1. Must be at least **8 characters**
2. Can include letters, numbers, symbols
3. Password is **case-sensitive**
4. In registration: password and confirm password must match exactly
5. Remember your password - it cannot be recovered (stored locally)

---

### 🖼️ Logo Not Showing

**Issue**: Logo doesn't appear in navigation.

**Solution**:
This is normal! The website is designed to work without logo files. To add your logo:
1. Place logo image in `assets/` folder
2. Name it `logo.png`
3. Refresh the page

---

### 🏫 School Logos Not Showing

**Issue**: School logos show placeholder text.

**Solution**:
This is by design! The website uses text placeholders. To add actual logos:
1. Add logo images to `assets/` folder
2. Update HTML to reference the images
3. Uncomment the `<img>` tags in HTML

---

## 🆘 Still Having Issues?

### Debug Steps:

1. **Open Browser Console** (Press F12)
   - Look for red error messages
   - Check what the error says

2. **Check localStorage**
   ```javascript
   // In console, type:
   localStorage.getItem('users')
   localStorage.getItem('admins')
   localStorage.getItem('currentUser')
   ```

3. **Check File Structure**
   ```
   SAIRA/
   ├── index.html
   ├── login.html
   ├── register.html
   ├── admin-login.html
   ├── user-dashboard.html
   ├── admin-dashboard.html
   ├── css/
   │   └── style.css
   └── js/
       ├── auth.js
       ├── login.js
       ├── register.js
       ├── admin-login.js
       ├── user-dashboard.js
       └── admin-dashboard.js
   ```

4. **Test in Different Browser**
   - Try Chrome, Firefox, or Edge
   - One might work better than others

5. **Check JavaScript is Enabled**
   - Website requires JavaScript
   - Check browser settings

---

## 🔍 Checking if Everything Works

### Quick Test:
1. Open `index.html`
2. Click "Register"
3. Fill form and submit
4. Login with your credentials
5. If you see dashboard → ✅ Working!

### Admin Test:
1. Go to `admin-login.html`
2. Login with: admin / 1234567@_a
3. If you see admin dashboard → ✅ Working!

---

## 💡 Tips for Best Experience

1. **Use Google Chrome** - Best compatibility
2. **Don't use private/incognito mode** - localStorage won't persist
3. **Keep all files together** - Don't move files around
4. **Regular backups** - Export localStorage data if important
5. **One browser per session** - Don't switch browsers mid-session

---

## 🛠️ Advanced Troubleshooting

### Check if Default Admin Exists:
```javascript
// In console:
console.log(JSON.parse(localStorage.getItem('admins')));
```
Should show admin with username "admin"

### Check if Users Exist:
```javascript
// In console:
console.log(JSON.parse(localStorage.getItem('users')));
```
Should show array of registered users

### Manual Admin Creation:
If default admin doesn't exist:
```javascript
// In console:
localStorage.setItem('admins', JSON.stringify([{
    username: 'admin',
    password: '1234567@_a',
    createdDate: new Date().toISOString(),
    status: 'active'
}]));
```

### Clear Specific Data:
```javascript
// Remove only users:
localStorage.removeItem('users');

// Remove only admins:
localStorage.removeItem('admins');

// Remove current session:
localStorage.removeItem('currentUser');
localStorage.removeItem('currentAdmin');
```

---

## 📞 Support Checklist

Before asking for help, please check:
- [ ] Tried different browser
- [ ] Cleared cache and cookies
- [ ] Checked browser console for errors
- [ ] Verified all files are in correct locations
- [ ] JavaScript is enabled
- [ ] Not using private browsing
- [ ] Followed exact steps in guide
- [ ] Read through this troubleshooting guide

---

**Remember**: This is a local website using localStorage. All data is stored in your browser only. If you clear browser data, everything will be reset!

---

© 2025 SAIRA ACAD - Guiding Academic Excellence
