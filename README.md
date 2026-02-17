# EarlyLedge MVP

EarlyLedge is a calm, parent-facing web app for tracking ages 4–8 learning activities and keeping skill exposure balanced week to week.

## Stack

- Frontend: React + Vite + TypeScript + MUI
- Backend: Django + Django REST Framework + JWT auth
- Database: PostgreSQL
- PDF: WeasyPrint
- Local orchestration: Docker Compose

## MVP Features

- Email/password signup + login
- Add multiple children per parent
- Log activities with optional notes, duration, date
- Automatic keyword-based skill mapping
- Manual skill override in activity form
- Weekly dashboard (counts by skill + recent activities)
- Gentle suggestion prompts when a skill is missing in the last 7 days
- Suggestions engine with age-filtered ideas
- Monthly snapshot PDF export

## Project Structure

- backend/: Django API server
- frontend/: React application
- docs/schema.sql: SQL schema reference
- docker-compose.yml: Local dev services

## Environment Variables

Copy [/.env.example](.env.example) to `.env`.

Also available:

- [backend/.env.example](backend/.env.example)
- [frontend/.env.example](frontend/.env.example)

## Run with Docker (recommended)

1. Copy `.env.example` to `.env`.
2. Start services:
   - `docker compose up --build`
3. App URLs:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

On startup, backend runs migrations and seeds initial skill categories + suggestions.

## Local Run (without Docker)

### Backend

1. Create/activate a virtual environment.
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Set env vars (or create a local `.env` workflow).
4. Run migrations:
   - `python backend/manage.py migrate`
5. Seed data:
   - `python backend/manage.py seed_initial_data`
6. Start API:
   - `python backend/manage.py runserver`

### Frontend

1. Install dependencies:
   - `cd frontend && npm install`
2. Set `VITE_API_BASE_URL` (see [frontend/.env.example](frontend/.env.example)).
3. Start dev server:
   - `npm run dev`

## Seed Data

Seed command:

- `python backend/manage.py seed_initial_data`

It creates:

- 7 skill categories
- 35 suggestions (age-filtered, offline-friendly)

## API Overview

- `POST /api/auth/signup/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET|POST /api/children/`
- `GET|POST /api/activities/`
- `GET /api/skills/`
- `GET /api/dashboard/weekly/?child_id=<id>`
- `GET /api/suggestions/?skill_id=<id>&child_id=<id>`
- `GET /api/reports/monthly/?child_id=<id>&month=YYYY-MM`

## Notes

- Activity auto-mapping uses backend keyword rules (no AI).
- If manual `skill_ids` are provided in create activity, they override auto-mapping.
- The UI intentionally avoids gamification/streak mechanics.
