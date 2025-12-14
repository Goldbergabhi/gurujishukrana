# Server (reconciliation notes)

This repository contains two server implementations for historical reasons:

- `server/src/index.ts` — the TypeScript server (recommended). It is the canonical, actively-maintained implementation used in development. It supports JWT auth, materialized aggregates, SSE via `server/src/sse.ts`, and in-memory fallbacks for dev.

- `server/index.js` — a legacy JavaScript server kept for reference. Do not run this in development if you are using the TypeScript server.

Recommended workflow

- Development (fast reload):
  - cd server
  - npm install
  - npm run start:dev

- Production (build and run):
  - cd server
  - npm install --production
  - npm run build
  - npm start

Notes & next steps

- The TypeScript server is the canonical server. If you want to remove the legacy JS server, do so after verifying feature parity.
- The TS server accepts both old and new response payload shapes for compatibility with current frontend code.
 - Consolidate environment variables (MONGODB_URI, JWT_SECRET) in your deployment documentation.
