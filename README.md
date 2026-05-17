# Heart-Haven

Heart-Haven is a mobile-first breakup recovery platform for Bangladesh.

## Stack
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: Node.js + Express + Socket.io
- Database: MongoDB + Mongoose

## Core modules
- Moner Kotha: anonymous vent feed
- No-Contact Engine: streak tracker + comfort quotes
- Support Chat: private support rooms with JWT + Socket.io
- Resource Directory: Dhaka/Bangladesh support resources
- Funding Mock APIs: bKash, Nagad, Upay, Rocket scaffolds

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## API endpoints
- `GET /api/health`
- `GET /api/vents`
- `POST /api/vents`
- `GET /api/resources`
- `GET /api/no-contact/:sessionId`
- `POST /api/no-contact/:sessionId/check-in`
- `GET /api/no-contact/:sessionId/weak`
- `POST /api/auth/session`
- `GET /api/support/conversations/:conversationId/messages`
- `POST /api/support/messages`
- `GET /api/funding/mock`

## Environment
Copy the example files:
- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env.local`

## Deployment
See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for Vercel + Render/Railway setup, MongoDB Atlas guidance, and smoke tests.
