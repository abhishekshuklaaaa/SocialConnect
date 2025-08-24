# Start SocialConnect Servers

## 1. Start Backend (Terminal 1)
```bash
cd SocialConnect
python manage.py runserver
```

## 2. Start Frontend (Terminal 2)  
```bash
cd SocialConnect/frontend
npm run dev
```

## 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Fixed Issues:
✅ Removed deprecated Next.js config
✅ Freed up port 3000
✅ Frontend should now run on correct port

**Now restart your frontend server and it should work on port 3000!**