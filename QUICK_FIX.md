# Quick Fix for Port Issue

## Problem
Frontend trying to connect to `localhost:3001` but Next.js runs on `localhost:3000`

## Solution

1. **Start Backend**:
```bash
cd SocialConnect
python manage.py runserver
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Access the correct URL**:
- ✅ Frontend: `http://localhost:3000`
- ✅ Backend API: `http://localhost:8000`

## If still loading:

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Check if both servers are running**:
   - Backend: Should show "Starting development server at http://127.0.0.1:8000/"
   - Frontend: Should show "Local: http://localhost:3000"

3. **Make sure you're accessing `localhost:3000` NOT `localhost:3001`**

The error suggests you're trying to access the wrong port!