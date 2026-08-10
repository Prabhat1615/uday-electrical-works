# Uday Electrical Works — Multi-Application Platform

Three independently deployable frontend applications sharing **one backend** and **one MongoDB database**.

```text
uday-electrical-works/
│
├── customer-web/      → Customer Web (storefront + customer portal)   [port 5173]
├── management-web/    → Management Web (Admin + Staff ERP)            [port 5174]
├── technician-web/    → Technician Web (field job app)                [port 5175]
├── server/            → Shared backend (Express + MongoDB + Socket.IO)[port 5000]
└── shared/            → Shared frontend modules (axios, auth context,
                         common components, API wrappers, socket client)
```

`client/` is the legacy monolithic frontend, kept only as a reference during migration.
It is NOT part of production builds or deployments.

## Applications

| Application    | Who uses it        | Deployed to                          |
|----------------|--------------------|--------------------------------------|
| Customer Web   | CUSTOMER           | `https://www.udayelectricalworks.in` |
| Management Web | ADMIN, STAFF       | `https://admin.udayelectricalworks.in` |
| Technician Web | TECHNICIAN         | `https://technician.udayelectricalworks.in` |
| Backend API    | shared by all      | `https://api.udayelectricalworks.in` |

## Roles → Applications

| Role        | Application     |
|-------------|-----------------|
| CUSTOMER    | `customer-web`  |
| ADMIN       | `management-web`|
| STAFF       | `management-web`|
| TECHNICIAN  | `technician-web`|

All roles authenticate against the **same backend** (`/api/auth`). The backend enforces
authorization on every route (`protect` + `authorize` middleware); frontend route guards
are an additional UX layer, never the only line of defense.

Public registration always creates **Customer** accounts only. Admin/Staff/Technician
accounts are created by an Admin from Management Web → User Management (enforced server-side).

## Prerequisites

- Node.js 18+
- MongoDB (local default: `mongodb://127.0.0.1:27017/uday_electrical_dev`, or MongoDB Atlas)

## Run locally (four terminals)

```bash
# 1. Shared backend (port 5000)
cd server
npm install
cp .env.example .env        # adjust MONGO_URI / JWT_SECRET
npm run dev

# 2. Customer Web (port 5173)
cd customer-web
npm install
npm run dev

# 3. Management Web (port 5174)
cd management-web
npm install
npm run dev

# 4. Technician Web (port 5175)
cd technician-web
npm install
npm run dev
```

Open:
- Customer Web → http://localhost:5173
- Management Web → http://localhost:5174
- Technician Web → http://localhost:5175

### Seeding (development only)

The backend **never seeds automatically**. Demo data is applied explicitly:

```bash
cd server
npm run seed:dev            # refuses to run when NODE_ENV=production
```

### Creating the first Admin

```bash
cd server
npm run create:admin        # prompts for name/email/password, or use ADMIN_NAME/ADMIN_EMAIL/ADMIN_PASSWORD env vars
```

The script refuses to run if an Admin already exists. There are no hardcoded credentials.

## Environment variables (names only — never commit real values)

Each frontend has its own `.env` (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api      # production: https://api.udayelectricalworks.in/api
VITE_SOCKET_URL=http://localhost:5000       # production: https://api.udayelectricalworks.in
```

Frontend variables are public (Vite inlines them into the bundle). Never put secrets there.

The backend (`server/.env`) uses server-only variables:

```env
PORT=5000
NODE_ENV=development|production
MONGO_URI=             # MongoDB connection string (never commit)
JWT_SECRET=            # long random string; server refuses to start in production without one
JWT_EXPIRE=30d
CLIENT_URL=            # backward-compatible single origin
CLIENT_URLS=           # comma-separated allowed frontend origins (CORS + Socket.IO)
RAZORPAY_KEY_ID=       # required for real online payments
RAZORPAY_KEY_SECRET=
SMTP_HOST=             # email; unset => emails only logged (dev)
SMTP_USER=
SMTP_PASS=
SMTP_PORT=587
ADMIN_NAME=            # used by `npm run create:admin` (optional)
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### Databases

The database name is derived from the environment and forced on the URI:

| Environment | Database                   |
|-------------|----------------------------|
| development | `uday_electrical_dev`      |
| production  | `uday_electrical_production` |

Development and production data never mix.

## Deployment

Intended architecture (each application deploys independently):

```text
www.udayelectricalworks.in         → customer-web      (Vercel project 1)
admin.udayelectricalworks.in       → management-web    (Vercel project 2)
technician.udayelectricalworks.in  → technician-web    (Vercel project 3)
api.udayelectricalworks.in         → server            (Render / Railway / VPS)
```

- Each frontend contains a `vercel.json` (Vite build, `dist/` output, SPA rewrite so deep
  links like `/products/led-bulb` or `/dashboard` do not 404).
- Set `VITE_API_URL` and `VITE_SOCKET_URL` per project at build time.
- `render.yaml` (repo root) is a blueprint for hosting the API on Render
  (`rootDir: server`, `npm start`, health check `/api/health`).
- The backend listens on `process.env.PORT` and exposes `GET /api/health`
  (used by hosting platforms; includes database state without secrets).
- Production CORS/Socket.IO origins are set via `CLIENT_URLS`, e.g.:
  `https://www.udayelectricalworks.in,https://admin.udayelectricalworks.in,https://technician.udayelectricalworks.in`

## Real-time (Socket.IO)

All three frontends connect to the **same Socket.IO server** on the backend (single server,
attached to the HTTP server on port 5000). Each client joins a personal room (`user:<id>`)
and receives `new_notification` events. Socket.IO CORS uses the same strict origin allowlist
as Express — disallowed origins are rejected at the handshake.

## Security

- Helmet security headers, global + auth rate limiting, request size limits.
- bcrypt password hashing, JWT expiry, role-based authorization on every route.
- No secrets in frontend bundles; payment keys/email passwords are server-only.
- Online payments are never simulated in production: without real Razorpay keys the
  payment API returns 503 and the customer UI directs users to pay at the shop.
- Error responses never include stack traces in production (logged server-side).

## Repository notes

- `.env` files and `node_modules/` are git-ignored; only `.env.example` templates are committed.
- Shared code lives in `shared/` and is imported by all three apps via relative paths.
  Each app's Vite config allows filesystem access outside its root and Tailwind scans
  `../shared/src/**/*` for class names.
