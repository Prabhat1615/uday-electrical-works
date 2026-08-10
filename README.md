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

## Roles → Applications

| Role        | Application     |
|-------------|-----------------|
| CUSTOMER    | `customer-web`  |
| ADMIN       | `management-web`|
| STAFF       | `management-web`|
| TECHNICIAN  | `technician-web`|

All four roles authenticate against the **same backend** (`/api/auth`). The backend enforces
authorization on every route (`protect` + `authorize` middleware). Frontend route guards are
an additional UX layer — never the only line of defense.

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/uday_electrical_erp`)

## Run locally (four terminals)

```bash
# 1. Shared backend (port 5000)
cd server
npm install
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

## Environment configuration

Each frontend has its own `.env` (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

The backend reads CORS origins from `server/.env`:

```env
CLIENT_URLS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

## Demo accounts (seeded by the backend)

| Role       | Email                        | Password            |
|------------|------------------------------|---------------------|
| Admin      | admin@udayelectrical.com     | adminpassword123    |
| Staff      | staff@udayelectrical.com     | staffpassword123    |
| Technician | tech1@udayelectrical.com     | techpassword123     |
| Customer   | customer@srilakshmi.com      | customerpassword123 |

> Public registration (`POST /api/auth/register`) always creates **Customer** accounts only.
> Admin/Staff/Technician accounts are created by an Admin from
> Management Web → User Management (Add User) — enforced server-side.

## Production deployment architecture

```text
www.udayelectricalworks.in      → Customer Web
admin.udayelectricalworks.in    → Management Web
technician.udayelectricalworks.in → Technician Web
api.udayelectricalworks.in      → Shared Backend
```

Each frontend is a static build (`npm run build` → `dist/`) served on its own subdomain,
pointing `VITE_API_URL` at the API subdomain. The backend CORS config accepts the three
frontend origins via `CLIENT_URLS`.

## Real-time (Socket.IO)

All three frontends connect to the **same Socket.IO server** on the backend (single server).
Each client joins a personal room (`user:<id>`) and receives `new_notification` events pushed
by the backend when notifications are created (e.g. booking status changes, assignments).

## Repository notes

- `client/` is the legacy monolithic frontend, kept only as a reference during migration.
- `.env` files and `node_modules/` are git-ignored; only `.env.example` files are committed.
- Shared code lives in `shared/` and is imported by all three apps via relative paths.
  Each app's Vite config allows filesystem access outside its root and Tailwind scans
  `../shared/src/**/*` for class names.
