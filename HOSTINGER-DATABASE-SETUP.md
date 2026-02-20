# 🗄️ Hostinger MySQL Database Setup Guide

## Step 1: Get Your Database Details from Hostinger

### Method A: If You Already Have a Database

1. **Login to Hostinger**
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Navigate to Database Management**
   - Click on "Websites" in the sidebar
   - Select your website (sairaacad.com)
   - Scroll down and click on "Databases" → "MySQL Databases"

3. **View Database Details**
   - You'll see a list of your databases
   - Click on "Manage" next to your database
   - You'll find these details:
     - **Database Name**: (e.g., u123456789_saira)
     - **Database User**: (e.g., u123456789_admin)
     - **Database Host**: (e.g., mysql.hostinger.com or specific hostname)
     - **Port**: Usually 3306
     - **Password**: The password you set when creating the database

### Method B: Create a New Database

1. **Go to MySQL Databases Section**
   - In Hostinger hPanel → Websites → Your site → Databases
   - Click "Create New Database"

2. **Fill in the Details**
   - **Database Name**: saira_acad (or your choice)
   - **Username**: saira_admin (or your choice)
   - **Password**: Create a strong password
   - Click "Create"

3. **Save These Details**
   - After creation, you'll see the connection details
   - **Copy and save them immediately** - you'll need them!

---

## Step 2: Update Your .env File

Open your `backend/.env` file and update these values with your Hostinger details:

```env
# Database Configuration - REPLACE WITH YOUR HOSTINGER DETAILS
DB_TYPE=mysql
DB_HOST=mysql.hostinger.com       # Or your specific hostname from Hostinger
DB_PORT=3306
DB_NAME=u123456789_saira          # Your database name from Hostinger
DB_USER=u123456789_admin          # Your database username from Hostinger
DB_PASSWORD=your-strong-password   # Your database password from Hostinger
```

**Example with real values:**
```env
DB_TYPE=mysql
DB_HOST=srv123.mysql.main-hosting.eu
DB_PORT=3306
DB_NAME=u987654321_sairaacad
DB_USER=u987654321_saira
DB_PASSWORD=MyStr0ng!P@ssw0rd
```

---

## Step 3: Deploy to Hostinger

### Option A: Using Hostinger's File Manager

1. **Prepare your files locally**
   ```powershell
   cd "c:\Users\Dell\OneDrive\Desktop\SAIRA\SAIRA\backend"
   npm install
   ```

2. **Create a .zip of your backend folder**
   - Right-click on the `backend` folder
   - Select "Send to" → "Compressed (zipped) folder"

3. **Upload to Hostinger**
   - In hPanel → File Manager
   - Navigate to `public_html` or your domain folder
   - Create a folder called `backend` or `api`
   - Upload the zip file
   - Extract it

4. **Install Node.js on Hostinger**
   - Go to "Advanced" → "Node.js"
   - Click "Create Application"
   - Set Application root: `/public_html/backend` (or your path)
   - Application URL: `api.sairaacad.com` or subdomain
   - Application startup file: `server.js`
   - Node.js version: 18.x or higher
   - Click "Create"

### Option B: Using Git (Recommended)

1. **Setup Git Repository**
   ```powershell
   cd "c:\Users\Dell\OneDrive\Desktop\SAIRA\SAIRA"
   git init
   git add .
   git commit -m "Add MySQL support for Hostinger"
   ```

2. **In Hostinger hPanel**
   - Go to "Advanced" → "Git"
   - Click "Create Repository"
   - Enter your GitHub repository URL
   - Select branch: main
   - Set target path: `/public_html/backend`
   - Click "Create"

3. **Setup Node.js Application**
   - Same as Option A, Step 4 above

---

## Step 4: Configure Environment Variables in Hostinger

1. **In Hostinger Node.js Application Settings**
   - Click on your application
   - Go to "Environment Variables" tab
   - Add each variable from your .env file:
   
   ```
   NODE_ENV = production
   PORT = 5000
   JWT_SECRET = [your secret key]
   DB_TYPE = mysql
   DB_HOST = [your database host]
   DB_PORT = 3306
   DB_NAME = [your database name]
   DB_USER = [your database user]
   DB_PASSWORD = [your database password]
   ALLOWED_ORIGINS = https://sairaacad.com,https://www.sairaacad.com
   ```

2. **Save and Restart** the Node.js application

---

## Step 5: Verify Database Connection

### Check Hostinger Logs
- In Node.js application settings → "Logs" tab
- Look for these messages:
  ```
  ✅ MySQL database connected successfully
     Database: u123456789_saira on mysql.hostinger.com
  ✅ Database tables synchronized
  ✅ Default admin created (username: admin)
  🚀 Server running on port 5000
  ```

### Test the API
Visit these URLs:
1. **Health Check**: `https://api.sairaacad.com/api/health`
2. **Root**: `https://api.sairaacad.com/`

Both should return JSON responses without errors.

---

## Step 6: View Database in Hostinger

### Access phpMyAdmin
1. **In Hostinger hPanel**
   - Go to "Databases" → "MySQL Databases"
   - Click "Enter phpMyAdmin" next to your database

2. **Login**
   - Username and password are the same as your database credentials
   - You'll see all your tables on the left sidebar

3. **View Tables**
   - Click on your database name (e.g., u123456789_saira)
   - You'll see tables like:
     - Users
     - Admins
     - Contacts
     - Enrollments
     - JobApplications
     - etc.

4. **Browse Data**
   - Click on any table name
   - Click "Browse" to see the data
   - When users register or send messages, you'll see them here!

---

## Step 7: Update Frontend API Configuration

The frontend should already be configured to use `api.sairaacad.com`. Verify in `js/api-config.js`.

If you're using a different subdomain, update it:
```javascript
window.SAIRA_API_BASE_URL = 'https://your-subdomain.sairaacad.com';
```

---

## Troubleshooting

### Common Issues:

1. **"Access denied for user"**
   - Check DB_USER and DB_PASSWORD are correct
   - Verify database user has proper permissions in Hostinger

2. **"Can't connect to MySQL server"**
   - Verify DB_HOST is correct (check Hostinger panel)
   - Check if Hostinger allows external connections
   - Your app should be on the same server as the database

3. **"Database doesn't exist"**
   - Verify DB_NAME matches exactly with Hostinger
   - Check for typos in environment variables

4. **Tables not created**
   - Check Node.js logs for errors
   - Verify Sequelize sync is working
   - Database user needs CREATE TABLE permissions

5. **CORS errors**
   - Add your domain to ALLOWED_ORIGINS
   - Restart Node.js application after changes

---

## Quick Reference: Where to Find Things in Hostinger

| What You Need | Where to Find It |
|--------------|------------------|
| Database credentials | hPanel → Databases → MySQL Databases → Manage |
| View database data | hPanel → Databases → phpMyAdmin |
| Node.js logs | hPanel → Advanced → Node.js → Your App → Logs |
| Environment variables | hPanel → Advanced → Node.js → Your App → Environment Variables |
| File manager | hPanel → Files → File Manager |
| Domain DNS settings | hPanel → Domains → Manage → DNS |

---

## Next Steps

After successful deployment:
1. ✅ Test user registration on sairaacad.com
2. ✅ Check if data appears in phpMyAdmin
3. ✅ Test contact form submissions
4. ✅ Verify all forms are working

**Default Admin Login:**
- Username: `admin`
- Password: `1234567@_a`
- URL: `https://sairaacad.com/admin-login.html`

---

Need help? Check the Node.js logs in Hostinger first - they'll tell you exactly what's wrong!
