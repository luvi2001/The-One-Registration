# Camp Registration System

A registration kiosk for camp sign-ups, built for use on a single phone or tablet at the registration desk.

- **Registration page** (`/`) — a camp-poster styled form to register a camper: name, age, area, mobile number, and school.
- **Admin dashboard** (`/admin`) — view all registrations, filter by area, and search by name, school, or mobile number.

**Stack**
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: NestJS + Prisma ORM
- Database: PostgreSQL

The five registration areas (Dematagoda, Kurulopana, Vatala, Valavata, Kotejena) are built in — edit `backend/prisma/schema.prisma` and `frontend/lib/types.ts` if you need to change them.

---

## 1. Prerequisites

Install these first:

- **Node.js** 18 or newer — https://nodejs.org
- **PostgreSQL** 14 or newer — or just use Docker (see below)
- **Docker Desktop** (optional, but the easiest way to get PostgreSQL running) — https://www.docker.com/products/docker-desktop

Check your Node version:
```bash
node -v
```

---

## 2. Unzip and open the project

```bash
unzip camp-registration.zip
cd camp-registration
```

You'll see two folders: `backend/` (the API) and `frontend/` (the website), plus a `docker-compose.yml` for the database.

---

## 3. Start PostgreSQL

**Option A — Docker (recommended, no manual PostgreSQL install needed):**
```bash
docker compose up -d
```
This starts a Postgres database on `localhost:5432` with:
- user: `camp_user`
- password: `camp_password`
- database: `camp_registration`

**Option B — Your own PostgreSQL install:**
Create a database yourself, e.g.:
```sql
CREATE DATABASE camp_registration;
CREATE USER camp_user WITH PASSWORD 'camp_password';
GRANT ALL PRIVILEGES ON DATABASE camp_registration TO camp_user;
```

---

## 4. Set up the backend (NestJS API)

```bash
cd backend
cp .env.example .env
npm install
```

Open `.env` and confirm `DATABASE_URL` matches your database (the default already matches the Docker setup above).

Create the database table and generate the Prisma client:
```bash
npx prisma migrate dev --name init
```

Start the API:
```bash
npm run start:dev
```

The API runs at **http://localhost:3001**. You can leave this terminal open and running.

Useful commands:
- `npx prisma studio` — opens a browser UI to view/edit the database directly.

---

## 5. Set up the frontend (Next.js)

Open a **new terminal window**, then:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

The site runs at **http://localhost:3000**.

- Registration form: **http://localhost:3000**
- Admin dashboard: **http://localhost:3000/admin**

---

## 6. Using it on the registration phone

On the phone/tablet you'll use at the desk, open a browser and go to:
```
http://<the-computer's-local-IP>:3000
```
(e.g. `http://192.168.1.42:3000`) — as long as the phone is on the same Wi-Fi network as the computer running `npm run dev`. Find your computer's local IP with `ipconfig` (Windows) or `ifconfig`/`ip a` (Mac/Linux).

Bookmark that address on the phone's home screen for one-tap access on camp day.

---

## 7. Deploying so it's not tied to one computer (optional)

For a permanent setup, you'd host these somewhere reachable from the internet:
- **Frontend** → Vercel, Netlify, or any Node host. Set `NEXT_PUBLIC_API_URL` to your deployed API's URL.
- **Backend** → Railway, Render, Fly.io, or any Node host with a PostgreSQL add-on. Set `DATABASE_URL` and `CORS_ORIGIN` (your deployed frontend's URL) as environment variables, then run `npx prisma migrate deploy` once.

This is optional — running both `npm run dev` commands on one laptop/desktop at the venue works fine for a single-event camp.

---

## Project structure

```
camp-registration/
├── docker-compose.yml       # PostgreSQL for local development
├── backend/                 # NestJS API
│   ├── prisma/schema.prisma # Database schema (Camper model, Area enum)
│   └── src/
│       ├── campers/         # Registration endpoints (create, list, stats, delete)
│       └── prisma/          # Prisma service/module
└── frontend/                 # Next.js app
    ├── app/page.tsx          # Registration form page
    ├── app/admin/page.tsx    # Admin dashboard
    ├── components/           # Form + poster background
    └── lib/                  # API client + shared types
```

## API reference

| Method | Endpoint          | Description                                      |
|--------|--------------------|--------------------------------------------------|
| POST   | `/campers`         | Register a camper                                |
| GET    | `/campers`         | List campers — query params: `area`, `search`    |
| GET    | `/campers/stats`   | Total count + count per area                     |
| DELETE | `/campers/:id`     | Remove a registration                             |

## Troubleshooting

- **Admin page says "Couldn't load registrations"** — make sure the backend (`npm run start:dev` in `backend/`) is running and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to it.
- **Prisma errors about the database** — double-check `DATABASE_URL` in `backend/.env` and that PostgreSQL is running (`docker compose ps`).
- **Port already in use** — change `PORT` in `backend/.env`, and update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to match.
