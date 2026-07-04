# Guzolink

A lightweight marketplace platform where local merchants create online shops and sell products. The project includes a Node.js + Express backend and a Vite-based frontend.

## Overview

This repository contains a full-stack application named Guzolink. The backend provides REST APIs for merchant and shop management, product catalog, orders, customers, and payments. The frontend is a Vite-powered client that lets merchants manage shops and customers browse and buy products.

## Frontend Flow

The frontend follows a render-then-init pattern: the router selects a page, the page returns markup, and an init function attaches event handlers. Key flows include merchant onboarding, shop management, product CRUD, and customer checkout.

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: Vite, vanilla JS, Tailwind CSS
- Payments: Stripe (or pluggable provider)
- Dev tooling: nodemon, Jest, Supertest

## Repository layout

- backend/ — Express API server, models for merchants, shops, products, orders
- guzolink_client/ — Vite frontend application for merchants and customers
- scripts/ — utility scripts (eg. seed data, create demo merchant)

## Quick start

Prerequisites:

- Node.js (v18+ recommended)
- npm
- MongoDB (local or remote)

1) Backend

Install dependencies and start the API server:

```bash
cd backend
npm install
# development with auto-reload
npm run dev
# or start production-like server
npm run start
```

Server defaults to port `9000` unless `PORT` is set.

2) Frontend

Install and run the Vite dev server:

```bash
cd guzolink_client
npm install
npm run dev
```

The frontend runs via Vite and talks to the backend API as configured.

## Environment variables (backend)

Place environment variables in one of these locations (the project checks them in order):

- `backend/envs/.env.local` (development)
- `backend/envs/.env.prod` (production)
- `backend/.env`

Common variables used by the project:

- `DB_URI` / `DB_URL` — MongoDB connection URI
- `HOST` — MongoDB host (default: localhost)
- `DB_NAME` — Database name (default: Guzolink)
- `PORT` — API server port (default: 9000)
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — JWT expiration (e.g. 1d)
- `PAYMENTS_PROVIDER_KEY` — API key for payments provider (eg. Stripe)

## Useful scripts

- Backend
  - `npm run dev` — start `nodemon` development server
  - `npm start` — start node server
  - `npm test` — run tests (Jest)
- Frontend (guzolink_client)
  - `npm run dev` — start Vite dev server
  - `npm run build` — build for production
  - `npm run preview` — preview build

## Create demo merchant

The backend includes a script to create a demo merchant and sample shop/products for local development:

```bash
cd backend
node src/scripts/createDemoMerchant.js
```

Use this for local development and testing.

## Testing

Backend tests use Jest + Supertest. From the `backend` folder run:

```bash
npm test
```

## Contributing

Contributions welcome. Open an issue or submit a pull request with a clear description of changes and rationale.

## License

This project is provided under the `ISC` license (see LICENSE file).

---

If you'd like, I can also:

- add a short API reference for merchant/shop/product endpoints,
- add an `.env.local` example in `backend/envs/.env.local.example`, or
- create a CONTRIBUTING.md with contribution guidelines.
