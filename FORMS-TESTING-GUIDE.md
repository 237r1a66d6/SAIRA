# SAIRA ACAD Forms Testing Guide

Complete testing checklist for all form submissions on the SAIRA ACAD platform.

## 🎯 Overview

This guide helps you test all 7 form submission endpoints integrated into the SAIRA ACAD website.

## 📋 Prerequisites

Before testing, ensure:

1. ✅ Backend server is running (`npm start` in backend folder)
2. ✅ MongoDB is connected (check server logs)
3. ✅ Frontend is served (use Live Server or similar)
4. ✅ All HTML pages are created (check workspace structure)
5. ✅ JavaScript files are linked correctly

## 🧪 Testing Checklist

### 1. Training Enrollment Form

**Page:** `mentorship-training.html`

**Test Steps:**
1. Open mentorship-training.html
2. Click "Enroll Now" button on any certification card
3. Fill in enrollment modal form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Years of Experience: 5
   - Why join: Test message
4. Click Submit
5. **Expected Result:** Success message, form closes
6. **Verify in MongoDB:** Check `enrollments` collection

**API Endpoint:** `POST /api/forms/enrollment`

---

### 2. School Requirement Form

**Page:** `work-with-us.html`

**Test Steps:**
1. Open work-with-us.html
2. Click "Post a Requirement" button in Schools section
3. Fill in school requirement form:
   - School Name: ABC School
   - Location: New York
   - Contact Person: John Doe
   - Email: john@school.com
   - Phone: +1234567890
   - Position Type: Full-Time
   - Subject: Mathematics
   - Grade Levels: 9-12
   - Min Experience: 3 years
   - Salary Range: $50,000-$60,000
   - Additional Info: Optional details
4. Click Submit
5. **Expected Result:** Success message, form closes
6. **Verify in MongoDB:** Check `schoolrequirements` collection

**API Endpoint:** `POST /api/forms/school-requirement`

---

### 3. Teacher Application Form

**Page:** `work-with-us.html`

**Test Steps:**
1. Open work-with-us.html
2. Click "Apply Now" button in Teachers section
3. Fill in teacher application form:
   - Name: Jane Smith
   - Email: jane@example.com
   - Phone: +1234567890
   - Qualification: Master's in Education
   - Subject: Science
   - Experience: 5 years
   - Preferred Location: California
   - Current Salary: $45,000 (optional)
   - Cover Letter: Test message
   - Resume: Upload PDF/DOC file
4. Click Submit
5. **Expected Result:** Success message, form closes
6. **Verify in MongoDB:** Check `teacherapplications` collection
7. **Verify File Upload:** Check `backend/uploads/resumes/` folder

**API Endpoint:** `POST /api/forms/teacher-application`

**File Upload Test:**
- Try PDF file ✅
- Try DOC file ✅
- Try DOCX file ✅
- Try invalid file (e.g., .txt) ❌ Should fail
- Try file > 5MB ❌ Should fail

---

### 4. Mentor Application Form

**Page:** `work-with-us.html`

**Test Steps:**
1. Open work-with-us.html
2. Click "Become a Mentor" button
3. Fill in mentor application form:
   - Name: Dr. Sarah Johnson
   - Email: sarah@example.com
   - Phone: +1234567890
   - Qualification: PhD in Education
   - Experience: 15 years (minimum 10 required)
   - Specialization: STEM Education
   - Achievements: Published papers, awards
   - Hours per week: 10
   - Why mentor: Test message
4. Click Submit
5. **Expected Result:** Success message, form closes
6. **Verify in MongoDB:** Check `mentorapplications` collection

**API Endpoint:** `POST /api/forms/mentor-application`

**Validation Test:**
- Try with < 10 years experience ❌ Should fail validation

---

### 5. Job Application Form

**Page:** `careers.html`

**Test Steps:**
1. Open careers.html
2. Click "Apply Now" button on any job listing OR
3. Click "Apply for This Role" in modal
4. Fill in application form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Position: Senior Developer
   - Current Location: San Francisco
   - Total Experience: 7 years
   - Current Company: Tech Corp (optional)
   - Notice Period: 30 days (optional)
   - Cover Letter: Test message
   - Resume: Upload PDF/DOC file
5. Click Submit
6. **Expected Result:** Success message, form closes
7. **Verify in MongoDB:** Check `jobapplications` collection
8. **Verify File Upload:** Check `backend/uploads/resumes/` folder

**API Endpoint:** `POST /api/forms/job-application`

---

### 6. Contact Form

**Page:** `contact-us.html`

**Test Steps:**
1. Open contact-us.html
2. Fill in contact form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - I am a: School / Teacher / Mentor / Other
   - Subject: Partnership Inquiry
   - Message: Test message
3. Click Send Message
4. **Expected Result:** Success message appears
5. **Verify in MongoDB:** Check `contacts` collection

**API Endpoint:** `POST /api/forms/contact`

---

### 7. Consultation Booking Form

**Page:** `contact-us.html`

**Test Steps:**
1. Open contact-us.html
2. Click "Book Free Consultation" button (School or Teacher)
3. Fill in consultation form:
   - Name: Jane Smith
   - Email: jane@example.com
   - Phone: +1234567890
   - Organization: ABC School (optional)
   - Preferred Date: Future date
   - Preferred Time: 14:00
   - Topic: Teacher hiring strategy
4. Click Book Consultation
5. **Expected Result:** Success message, form closes
6. **Verify in MongoDB:** Check `consultations` collection

**API Endpoint:** `POST /api/forms/consultation`

**Date Validation:**
- Try past date ✅ Should accept (server doesn't validate yet)
- Try future date ✅ Should accept

---

## 🔍 MongoDB Verification

### Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `saira_acad`
4. Check each collection:
   - enrollments
   - schoolrequirements
   - teacherapplications
   - mentorapplications
   - jobapplications
   - contacts
   - consultations

### Using MongoDB Shell

```bash
mongosh
use saira_acad
db.enrollments.find().pretty()
db.schoolrequirements.find().pretty()
db.teacherapplications.find().pretty()
db.mentorapplications.find().pretty()
db.jobapplications.find().pretty()
db.contacts.find().pretty()
db.consultations.find().pretty()
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to submit form"
**Solution:**
- Check backend server is running
- Check console for errors (F12 in browser)
- Verify MongoDB is connected
- Check network tab for API response

### Issue 2: Form doesn't close after submission
**Solution:**
- Check JavaScript file is loaded
- Check console for JavaScript errors
- Verify modal close function is defined

### Issue 3: File upload fails
**Solution:**
- Check file size (max 5MB)
- Check file format (PDF, DOC, DOCX only)
- Verify `uploads/resumes/` folder exists in backend
- Check multer middleware is configured

### Issue 4: MongoDB document not created
**Solution:**
- Check server console for errors
- Verify model schema matches request body
- Check required fields are provided
- Test API endpoint directly using Postman

### Issue 5: CORS error
**Solution:**
- Check CORS is configured in server.js
- Verify FRONTEND_URL in .env file
- Try using `origin: '*'` for testing

---

## 📊 Testing Status Tracker

Use this checklist to track your testing progress:

- [ ] Training Enrollment Form - Working
- [ ] School Requirement Form - Working
- [ ] Teacher Application Form - Working
- [ ] Teacher Application File Upload - Working
- [ ] Mentor Application Form - Working
- [ ] Job Application Form - Working
- [ ] Job Application File Upload - Working
- [ ] Contact Form - Working
- [ ] Consultation Booking Form - Working
- [ ] MongoDB Collections - All Created
- [ ] File Uploads - Accessible via URL
- [ ] Error Handling - Working
- [ ] Success Messages - Displaying
- [ ] Form Validation - Working

---

## 🚀 Advanced Testing

### API Testing with Postman

1. Install Postman
2. Import collection or create requests manually
3. Test each endpoint with various inputs:
   - Valid data
   - Missing required fields
   - Invalid data types
   - Large file uploads
   - Invalid file formats

### Browser Console Testing

Open browser console (F12) and test API calls:

```javascript
// Test enrollment
fetch('http://localhost:5000/api/forms/enrollment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        program: 'foundation',
        experience: 5,
        message: 'Test enrollment'
    })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## ✅ Success Criteria

All forms are working correctly when:

1. ✅ All 7 forms submit successfully
2. ✅ Success messages display properly
3. ✅ Forms close after submission
4. ✅ Data appears in MongoDB collections
5. ✅ File uploads work and files are accessible
6. ✅ Error handling works (invalid inputs)
7. ✅ Form validation prevents invalid submissions
8. ✅ No console errors appear
9. ✅ All modals open and close properly
10. ✅ API endpoints return correct responses

---

## 📝 Notes

- Test in multiple browsers (Chrome, Firefox, Edge)
- Test on different screen sizes (responsive design)
- Clear browser cache if experiencing issues
- Check network tab for failed API calls
- Monitor server console for backend errors
- Keep MongoDB Compass open to verify real-time updates

---

**Happy Testing! 🎉**

If you find any issues, check the TROUBLESHOOTING.md file or review the backend logs.
