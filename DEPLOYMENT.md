# Heart-Haven Deployment Guide

## What must be configured

### Backend environment
Set these in your hosting provider:
- `PORT` — your platform will usually inject this, but keep a default of `5000`
- `CLIENT_ORIGIN` — comma-separated frontend origins, e.g. `https://heart-haven.vercel.app`
- `MONGODB_URI` — MongoDB Atlas connection string with the app user, not admin
- `MONGODB_DB` — optional database name, defaults to `heart_haven`
- `JWT_SECRET` — long random secret used to sign support-session tokens
- `NODE_ENV=production`

### Frontend environment
Set:
- `NEXT_PUBLIC_API_BASE_URL` — backend URL, e.g. `https://heart-haven-api.onrender.com`

## Recommended deployment split

### Frontend: Vercel
- Import the repo
- Set root directory to `heart-haven/frontend`
- Add `NEXT_PUBLIC_API_BASE_URL`
- Deploy

### Backend: Render / Railway
- Root directory: `heart-haven/backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add the backend environment variables above

## Database setup
- Create a dedicated MongoDB Atlas database user
- Grant only `readWrite` on the app database
- Whitelist the backend host IP or use `0.0.0.0/0` only if you understand the risk and prefer temporary convenience during setup

## Optional first-run content
After the backend is deployed and connected to MongoDB, run the seed script once:
```bash
npm run seed
```

## Post-deploy smoke test
- Open the frontend home page
- Confirm `/api/health` returns `ok: true`
- Create a vent post
- Open a support room and send a message
- Check the resource directory loads data
- Verify no-contact check-in updates the streak
