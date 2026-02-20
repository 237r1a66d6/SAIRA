# 🚀 Backend Deployment Instructions for SAIRA ACAD

## Current Status
- ✅ Frontend deployed at: **sairaacad.com**
- ❌ Backend NOT deployed (forms and registrations not working)

## Quick Deployment Steps (Using Render - FREE)

### Step 1: Prepare Your Backend Code
Your backend code is ready! The .env file has been created.

### Step 2: Create a GitHub Repository (if not already done)
1. Go to https://github.com and create a new repository
2. Open PowerShell in your project folder and run:
```powershell
cd "c:\Users\Dell\OneDrive\Desktop\SAIRA\SAIRA"
git init
git add .
git commit -m "Initial commit - SAIRA ACAD"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 3: Deploy to Render.com (FREE)

1. **Sign up on Render:**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository you just created

3. **Configure the Service:**
   - **Name:** saira-backend (or any name you prefer)
   - **Environment:** Node
   - **Region:** Choose closest to your users
   - **Branch:** main
   - **Root Directory:** backend
   - **Build Command:** npm install
   - **Start Command:** npm start
   - **Plan:** Free

4. **Add Environment Variables:**
   Go to "Environment" section and add these:
   ```
   NODE_ENV = production
   JWT_SECRET = [Click "Generate" to create a random secret]
   ALLOWED_ORIGINS = https://sairaacad.com,https://www.sairaacad.com
   PORT = 5000
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://saira-backend-xxxx.onrender.com`

### Step 4: Update Frontend API Configuration

After deployment, you need to update your frontend to point to the new backend URL.

Open `js/api-config.js` and add this line at the top of the file:
```javascript
window.SAIRA_API_BASE_URL = 'https://your-render-url-here.onrender.com';
```

Or use localStorage method (temporary testing):
```javascript
// In browser console on sairaacad.com:
localStorage.setItem('SAIRA_API_BASE_URL', 'https://your-render-url-here.onrender.com');
```

### Alternative Option: Custom Subdomain Setup

If you want to use **api.sairaacad.com** instead of the Render URL:

1. **In Render Dashboard:**
   - Go to your web service settings
   - Under "Custom Domain", add: `api.sairaacad.com`
   - Render will show you a CNAME record to add

2. **In Your Domain Registrar (where you bought sairaacad.com):**
   - Add a CNAME record:
     - Name: `api`
     - Value: [the value Render provides]
     - TTL: Automatic or 3600

3. **Wait for DNS propagation** (5-60 minutes)

4. **No frontend changes needed!** The api-config.js already looks for `api.sairaacad.com`

## Testing Your Backend

After deployment, test these URLs in your browser:

1. **Health Check:**
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"SAIRA ACAD API is running"}`

2. **Root Endpoint:**
   ```
   https://your-backend-url.onrender.com/
   ```
   Should show all available API endpoints

## Troubleshooting

### If forms still don't work:
1. Check browser console for errors (F12)
2. Verify the API URL in api-config.js matches your deployed backend
3. Make sure CORS is configured with your domain
4. Check Render logs for errors

### Render Free Tier Notes:
- Backend will sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- This is normal for free tier
- To avoid this, upgrade to paid tier ($7/month) or use a service like UptimeRobot to ping your API every 10 minutes

## Need Help?
- Render Documentation: https://render.com/docs
- Check Render logs if deployment fails
- Make sure all npm dependencies are listed in package.json

---

## Summary
✅ .env file created
✅ render.yaml created for easy deployment
📝 Next: Follow Step 2 (GitHub) and Step 3 (Render deployment)
