# SAIRA ACAD - Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Landing Page (index.html)

- [ ] Page loads correctly
- [ ] Navigation bar displays "SAIRA ACAD" branding
- [ ] Purple and orange color theme is visible
- [ ] Hero section displays welcome message
- [ ] "Strategic Academics Innovation Resources Academy" title is shown
- [ ] About section with 3 cards displays
- [ ] Courses section shows 6 courses
- [ ] Partner schools section shows 6 schools
- [ ] Login and Register buttons work in navigation
- [ ] Footer displays copyright information

## ✅ Registration Page (register.html)

- [ ] Registration form displays all required fields
- [ ] Full Name field accepts input
- [ ] Phone Number validates 10 digits
- [ ] Qualification dropdown has options
- [ ] Email field validates email format
- [ ] Password field requires minimum 8 characters
- [ ] Confirm Password field checks matching
- [ ] Error messages display for validation failures
- [ ] Success message shows on successful registration
- [ ] Redirects to login page after 2 seconds
- [ ] Link to Admin Login works at bottom
- [ ] Cannot register with duplicate email
- [ ] Cannot register with duplicate name

## ✅ User Login Page (login.html)

- [ ] Login form displays Full Name and Password fields
- [ ] Error message shows for invalid credentials
- [ ] Successful login redirects to user dashboard
- [ ] Link to Register page works
- [ ] Link to Admin Login works at bottom
- [ ] Remembers logged-in user

## ✅ Admin Login Page (admin-login.html)

- [ ] Admin login form displays with special styling
- [ ] Default credentials work (admin / 1234567@_a)
- [ ] Error message shows for invalid credentials
- [ ] Successful login redirects to admin dashboard
- [ ] Link to User Login works
- [ ] Admin badge displays

## ✅ User Dashboard (user-dashboard.html)

### Navigation & Authentication
- [ ] User name displays in top right
- [ ] Logout button works
- [ ] Sidebar menu displays all tabs
- [ ] Cannot access without login (redirects to login)

### My Dashboard Tab
- [ ] Welcome message with user name
- [ ] 4 statistics cards display
- [ ] User information card shows details
- [ ] Email, phone, qualification display correctly
- [ ] Member since date shows

### Available Courses Tab
- [ ] 6 courses display with details
- [ ] Each course shows icon, description, duration, level
- [ ] Enroll button works for each course
- [ ] Alert shows on enrollment
- [ ] Cannot enroll twice in same course
- [ ] Statistics update after enrollment

### Partner Schools Tab
- [ ] 6 partner schools display
- [ ] Each school shows name and information
- [ ] School stats display

### My Profile Tab
- [ ] Profile avatar with initial displays
- [ ] All user details show correctly
- [ ] Account status shows as "Active"
- [ ] Member since date displays

## ✅ Admin Dashboard (admin-dashboard.html)

### Navigation & Authentication
- [ ] Admin username displays in top right
- [ ] Logout button works
- [ ] Sidebar menu displays all tabs
- [ ] Cannot access without admin login

### Dashboard Overview Tab
- [ ] 4 statistics cards display
- [ ] Total admins count is correct
- [ ] Total users count is correct
- [ ] Course and school counts display
- [ ] Recent activity section shows

### Admin Management Tab
- [ ] Table displays all admins
- [ ] "Add New Admin" button works
- [ ] Add Admin modal opens
- [ ] Can add new admin with username and password
- [ ] Cannot add duplicate admin username
- [ ] Password must be 8+ characters
- [ ] Passwords must match
- [ ] New admin appears in table
- [ ] Can delete non-default admins
- [ ] Cannot delete default admin
- [ ] Confirmation dialog shows before delete

### User Management Tab
- [ ] Table displays all users
- [ ] Shows name, email, phone, qualification, progress
- [ ] "Add New User" button works
- [ ] Add User modal opens
- [ ] Can add new user with all details
- [ ] Cannot add duplicate email
- [ ] Phone validation works (10 digits)
- [ ] Email validation works
- [ ] New user appears in table
- [ ] Edit button opens edit modal
- [ ] Can edit user details (not email)
- [ ] Changes save correctly
- [ ] Delete button works
- [ ] Confirmation dialog shows before delete
- [ ] User removed from table after delete

## ✅ Data Persistence

- [ ] User data saves to localStorage
- [ ] Admin data saves to localStorage
- [ ] Data persists after browser refresh
- [ ] Login state maintained across page reloads
- [ ] Course enrollments save
- [ ] Logout clears session

## ✅ Responsive Design

- [ ] Desktop view (1200px+) works correctly
- [ ] Tablet view (768px-1199px) works correctly
- [ ] Mobile view (below 768px) works correctly
- [ ] Navigation adapts to screen size
- [ ] Tables scroll on small screens
- [ ] Modals display correctly on mobile

## ✅ Error Handling

- [ ] Empty form submissions show errors
- [ ] Invalid email format rejected
- [ ] Invalid phone format rejected
- [ ] Short passwords rejected
- [ ] Mismatched passwords rejected
- [ ] Duplicate registrations prevented
- [ ] Invalid login credentials rejected
- [ ] Non-authenticated access redirected

## ✅ Visual Design

- [ ] Color theme matches logo (purple and orange)
- [ ] Buttons have hover effects
- [ ] Cards have shadow and hover animations
- [ ] Forms are well-styled
- [ ] Typography is readable
- [ ] Icons display correctly (emojis)
- [ ] Gradients display properly
- [ ] Status badges colored correctly

## ✅ Browser Compatibility

Test in multiple browsers:
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (if available)

## 🧪 Test Scenarios

### Scenario 1: Complete User Journey
1. [ ] Open landing page
2. [ ] Click Register
3. [ ] Fill registration form
4. [ ] Submit and auto-redirect to login
5. [ ] Login with credentials
6. [ ] View dashboard
7. [ ] Enroll in a course
8. [ ] Check profile
9. [ ] Logout

### Scenario 2: Admin Management Journey
1. [ ] Go to admin login
2. [ ] Login with default credentials
3. [ ] View dashboard statistics
4. [ ] Add a new admin
5. [ ] Go to user management
6. [ ] Add a new user
7. [ ] Edit the user
8. [ ] View updated information
9. [ ] Logout

### Scenario 3: Error Handling
1. [ ] Try to register with existing email
2. [ ] Try to login with wrong password
3. [ ] Try to access dashboard without login
4. [ ] Try to add admin with short password
5. [ ] Try to enroll in same course twice

## 📊 Performance Checks

- [ ] Pages load quickly
- [ ] No console errors
- [ ] Forms submit smoothly
- [ ] Modals open/close without delay
- [ ] Animations are smooth
- [ ] No broken links

## 🐛 Known Issues / Notes

Document any issues found during testing:

1. ___________________________________
2. ___________________________________
3. ___________________________________

## ✅ Final Verification

- [ ] All HTML files open without errors
- [ ] All CSS styles apply correctly
- [ ] All JavaScript functions work
- [ ] localStorage data persists
- [ ] Default admin account exists
- [ ] All navigation links work
- [ ] All forms submit correctly
- [ ] All modals open and close
- [ ] All buttons are functional
- [ ] No console errors in browser

---

**Testing Date**: _______________  
**Tested By**: _______________  
**Browser Used**: _______________  
**Result**: ⭕ Pass / ⭕ Fail

**Notes**:
_____________________________________
_____________________________________
_____________________________________
