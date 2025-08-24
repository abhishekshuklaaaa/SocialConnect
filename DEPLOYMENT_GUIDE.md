# Deployment Guide

## GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/abhishekshuklaaaa/SocialConnect.git
git push -u origin main
```

## Backend Deployment Options

### Option 1: Railway (Recommended)
1. Connect GitHub repo to Railway
2. Add environment variables
3. Deploy automatically

### Option 2: Heroku
1. Install Heroku CLI
2. Create Procfile
3. Deploy with buildpacks

## Frontend Deployment (Netlify)
1. Build command: `cd frontend && npm run build`
2. Publish directory: `frontend/out` or `frontend/.next`
3. Add environment variables in Netlify dashboard

## Environment Variables Needed
- SECRET_KEY
- SUPABASE_URL  
- SUPABASE_KEY
- SUPABASE_SERVICE_KEY
- DATABASE_URL (for production)