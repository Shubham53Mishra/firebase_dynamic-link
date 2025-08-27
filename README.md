# Dynamic Link Service (URL Shortener)

A production-ready Node.js + MongoDB URL shortener for custom domains and scalable deployments.

## Features
- Create short links via API
- Redirect short links to target URLs
- Store mappings in MongoDB
- Deployable on Vercel, Render, Railway
- Custom domain support

## Setup
1. Clone repo & install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your MongoDB URI.
3. Start server:
   ```bash
   npm start
   ```

## API
- `POST /api/shorten` `{ target: "https://example.com" }` → `{ short, target }`
- `GET /:short` → Redirects to target URL
- `GET /api/links` → List all links

## Deploy
- Point your custom domain to the deployed service.
- Works on Vercel, Render, Railway (Node.js buildpack).
# firebase_dynamic-link
