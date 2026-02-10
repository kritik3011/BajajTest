# Bajaj Finserv Health Challenge API

REST API for Chitkara Qualifier 1 — Node.js + Express

## Endpoints

| Method | Endpoint  | Description                                         |
| ------ | --------- | --------------------------------------------------- |
| `GET`  | `/health` | Health check                                        |
| `POST` | `/bfhl`   | Process operations (fibonacci, prime, lcm, hcf, AI) |

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your email and Gemini API key
npm start
```

## Environment Variables

```
PORT=3000
OFFICIAL_EMAIL=your_email@chitkara.edu.in
GEMINI_API_KEY=your_gemini_api_key
```

Get a Gemini API key at: https://aistudio.google.com/apikey

## Deploy to Render

1. Push to GitHub (public repo)
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables in dashboard

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Set environment variables in Vercel dashboard.
