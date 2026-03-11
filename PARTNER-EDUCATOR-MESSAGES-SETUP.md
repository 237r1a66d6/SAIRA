# Partner & Educator Messages - Setup Instructions

## ✅ What Was Fixed

1. **Contact Form** - Now properly saves contact_type (partner/educator)
2. **API Endpoints** - Created separate endpoints for partner and educator messages
3. **Admin Dashboard** - Enhanced to display messages in respective sections
4. **Error Handling** - Improved to prevent cascading failures

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Add Database Column
1. Open **phpMyAdmin**: https://sairaacad.com/phpmyadmin
2. Select database: `u642524181_SairaAcad`
3. Click "SQL" tab
4. Copy and paste this SQL:

```sql
ALTER TABLE contact_submissions 
ADD COLUMN contact_type ENUM('general', 'partner', 'educator') DEFAULT 'general' 
AFTER message;

ALTER TABLE contact_submissions 
ADD INDEX idx_contact_type (contact_type);
```

5. Click "Go" to execute

### Step 2: Upload Updated Files to Server
Upload these 3 files to your Hostinger server:

1. **api/admin/contacts/partners.php** → `/api/admin/contacts/partners.php`
2. **api/admin/contacts/educators.php** → `/api/admin/contacts/educators.php`
3. **api/forms/contact.php** → `/api/forms/contact.php`
4. **js/admin-dashboard.js** → `/js/admin-dashboard.js`

### Step 3: Clear Browser Cache
1. Press **Ctrl + Shift + R** to hard refresh
2. Or press **Ctrl + Shift + Delete** → Clear cache

---

## ✨ How It Works Now

### Contact Form (contact-us.html)
- Users select **"Message as a Partner"** or **"Message as an Educator"**
- Form submits to `/api/forms/contact.php`
- Saves with `contact_type` = 'partner' or 'educator'

### Admin Dashboard
- **Partner Messages** section shows all messages from partners
- **Educator Messages** section shows all messages from educators
- Fetches from:
  - `/api/admin/contacts/partners` 
  - `/api/admin/contacts/educators`

---

## 🧪 Testing

### Test Partner Messages:
1. Go to: https://sairaacad.com/contact-us.html
2. Fill out form
3. Select **"Message as a Partner"**
4. Submit
5. Go to Admin Dashboard → Partner Messages
6. Your message should appear!

### Test Educator Messages:
1. Same steps, but select **"Message as an Educator"**
2. Check Admin Dashboard → Educator Messages

---

## 🔍 Troubleshooting

### "HTTP error! status: 404"
- **Cause**: API files not uploaded
- **Fix**: Upload `partners.php` and `educators.php` to `/api/admin/contacts/`

### "No partner/educator messages yet"
- **Cause**: No messages submitted yet, OR column not added
- **Fix**: 
  1. Run the SQL to add `contact_type` column
  2. Submit a test message from contact form

### "Database query failed"
- **Cause**: `contact_type` column doesn't exist
- **Fix**: Run Step 1 SQL in phpMyAdmin

### Still seeing errors?
1. Check browser console (F12) for specific errors
2. Check if files are uploaded correctly
3. Verify SQL was executed successfully
4. Try submitting a new contact form message

---

## 📊 Database Structure

After running the SQL, your `contact_submissions` table will have:
```
- id
- name
- email  
- phone
- subject
- message
- contact_type ← NEW! (general/partner/educator)
- status
- created_at
- updated_at
```

---

## 🎯 What This Solves

✅ Contact form responses now visible in admin dashboard
✅ Separate sections for Partners and Educators  
✅ Error cascading fixed - no more repeated errors
✅ Proper error messages for debugging
✅ Network failures handled gracefully

---

**After setup, refresh admin dashboard and you'll see partner/educator messages!** 🎉
