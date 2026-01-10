# SAIRA ACAD - Deployment Guide

## Backend Deployment

### Option 1: Render.com (Recommended)
1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=5000
     JWT_SECRET=your-random-secret-key-here
     DATABASE_PATH=./saira-acad.db
     FRONTEND_URL=https://your-frontend-url.com
     ALLOWED_ORIGINS=https://your-frontend-url.com
     ```

### Option 2: Railway.app
1. Create account at https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-detect and deploy

### Option 3: Heroku
```bash
cd backend
heroku create saira-acad-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku git:remote -a saira-acad-backend
git push heroku main
```

## Frontend Deployment

### Option 1: Vercel (Recommended)
1. Create account at https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
4. Update `js/api-config.js` with production backend URL

### Option 2: Netlify
1. Create account at https://netlify.com
2. Drag & drop your SAIRA folder
3. Update API URL in `js/api-config.js`

### Option 3: GitHub Pages
```bash
# Update js/api-config.js first
git add .
git commit -m "Production ready"
git push origin main
```
Go to Settings → Pages → Enable GitHub Pages

## Update Frontend API URL

Before deploying frontend, update `js/api-config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://your-backend-url.com/api', // Change this
    // ...
};

export const API_BASE_URL = API_CONFIG.BASE_URL;
```

## Database

SQLite database file (`saira-acad.db`) will be created automatically on first run.
For production, consider upgrading to PostgreSQL using services like:
- Supabase (Free tier)
- Railway PostgreSQL
- Render PostgreSQL

## Environment Variables

Create `.env.production` for production settings:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-production-key
DATABASE_PATH=./saira-acad.db
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=change-this-password
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## Post-Deployment Checklist

- [ ] Backend URL updated in frontend `api-config.js`
- [ ] CORS configured with correct frontend URL
- [ ] Environment variables set in hosting platform
- [ ] Admin password changed from default
- [ ] Test all API endpoints
- [ ] Test file uploads
- [ ] Test authentication flows
- [ ] Database backup strategy in place

## Support

For issues, check:
- Backend logs in hosting platform
- Browser console for frontend errors
- Network tab for API call failures
