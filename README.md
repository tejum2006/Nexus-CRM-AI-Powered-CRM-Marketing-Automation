# Nexus CRM 🚀

A premium, AI-Powered CRM & Marketing Automation platform powered by Google Gemini.

## Features

- **Authentication** — Secure JWT-based auth with Role-Based Access Control (RBAC).
- **Customer Management** — Full CRM with activity timelines, segments, tags, and notes.
- **Segments & Tags** — Intelligent audience classification and filtering.
- **AI Campaign Builder** — Create targeted email/SMS campaigns using Gemini-powered copy generation.
- **Campaign Simulation Engine** — The system *simulates* campaign delivery. It targets the correct audience, updates customer timelines, calculates delivery metrics, and updates campaign states—all without actually sending real emails or SMS (unless an external provider is added).
- **Real-Time Analytics** — Live KPI tracking, segment distributions, and tag charts.
- **Settings / Profile** — Manage your account name, email, and password.
- **AI Generator Workspace** — Standalone prompt sandbox with template quick-start.
- **Premium Dark UI** — Glassmorphism, gold accents, smooth micro-animations.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite, Tailwind CSS, Recharts, react-hook-form, Zod, Lucide Icons |
| Backend   | Node.js, Express 5, MongoDB + Mongoose |
| AI        | Google Gemini 2.5 Flash (`@google/genai`) |

---

## Environment Variables

Create `server/.env` (copy from `server/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_campaign_copilot
JWT_SECRET=your_strong_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Never commit `.env` to version control.**

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API key"** → **"Create API key"**
3. Paste the key into `GEMINI_API_KEY`

---

## Local Development

### 1. Backend

```bash
cd server
npm install
# configure server/.env
npm run dev
```

Server starts at: `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App opens at: `http://localhost:5173`

---

## Production Build

### Build the frontend

```bash
# From project root
npm run build
```

This compiles the React app into `client/dist/`.

### Start the production server

```bash
# From project root
npm start

# Or from the server directory:
cd server
NODE_ENV=production node index.js
```

The Express server will now serve both the **API** and the **compiled React frontend** from a single process on port 5000.

Open: `http://localhost:5000`

---

## Deployment

### Environment Variables for Production

Set these on your hosting platform (e.g., Railway, Render, Fly.io, Heroku):

```
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a strong random secret>
GEMINI_API_KEY=<your Gemini API key>
NODE_ENV=production
CLIENT_URL=https://your-production-domain.com
```

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add a database user
3. Whitelist your server's IP (or `0.0.0.0/0` for dynamic IPs)
4. Copy the **connection string** and set it as `MONGODB_URI`

### Deploy Steps (Generic)

1. Push code to GitHub (ensure `client/dist/` and `.env` are in `.gitignore`)
2. Connect repository to your hosting platform
3. Set all environment variables
4. Set the **build command**: `npm run build` (from root)
5. Set the **start command**: `npm start` (from root)

---

## API Reference

### Health Check (no auth required)

```
GET /api/health
```

Response:
```json
{ "success": true, "message": "API is healthy", "environment": "production" }
```

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET  | `/api/auth/me` | Get current user (auth required) |
| PUT  | `/api/auth/profile` | Update profile (auth required) |

### Customers, Campaigns, Segments, AI, Dashboard

All routes under `/api/customers`, `/api/campaigns`, `/api/segments`, `/api/ai`, and `/api/dashboard` require a valid JWT `Authorization: Bearer <token>` header.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to MongoDB` | Check `MONGODB_URI` in `.env`. Ensure MongoDB is running locally or Atlas IP is whitelisted. |
| `GEMINI_API_KEY missing` | Set `GEMINI_API_KEY` in `.env`. AI endpoints return `503` if not configured. |
| `Port 5000 already in use` | Change `PORT` in `.env`. |
| React routes return 404 on refresh | Ensure `NODE_ENV=production` is set so the SPA fallback is active. |
| CORS error in browser | Set `CLIENT_URL` in `.env` to the exact origin of the frontend. |

---
