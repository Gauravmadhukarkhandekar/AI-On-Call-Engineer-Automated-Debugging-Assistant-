# How to Start Both Frontend and Backend

## Port 3000 is now free! ✅

## Start Backend (Terminal 1)

```bash
cd backend
npm start
```

This will:
1. Build TypeScript → `dist/server.js`
2. Start server on http://localhost:3001

## Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

This will:
1. Build Next.js (already built, so it's fast)
2. Start server on http://localhost:3000

## Quick Commands

**Backend:**
```powershell
cd backend; npm start
```

**Frontend:**
```powershell
cd frontend; npm start
```

## Alternative: Use Dev Mode (No Build Needed)

If you want faster startup without building:

**Backend:**
```powershell
cd backend; npm run dev
```

**Frontend:**
```powershell
cd frontend; npm run dev
```

## Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

