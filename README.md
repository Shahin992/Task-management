# Task Management System Setup

This repository is structured as a simple monorepo for the assignment:

- `backend`: NestJS API with PostgreSQL, Prisma, JWT auth, RBAC, tasks, and audit logs
- `frontend`: Next.js app for admin and user task workflows

The apps stay separate in code structure, but the repository provides one top-level Docker entrypoint so `docker compose up` runs the full stack as required by the PDF.

## Requirement Mapping

- Roles: `ADMIN`, `USER`
- Auth: JWT login with predefined users
- Tasks: create, update, delete, assign, status management
- Audit logs: task creation, update, deletion, status change, assignment change
- Database: PostgreSQL with Prisma ORM

## Demo Credentials

Defined in the backend environment:

- Admin: `admin@task.local` / `Admin123!`
- User: `user@task.local` / `User123!`

## Run Everything

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api/v1`
- PostgreSQL: `localhost:5432`
- Adminer: `http://localhost:8080`

## Run Everything In Dev Mode

Use this when you want frontend and backend code changes to apply without rebuilding the Docker image each time.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run docker:dev
```

Dev mode details:

- `backend` runs `npm run start:dev`
- `frontend` runs `npm run dev`
- source code is bind-mounted into the containers
- PostgreSQL data stays persistent through the `postgres_data` volume

## Run Backend Only

```bash
cd backend
cp .env.example .env
docker compose up --build
```

API default URL: `http://localhost:3001/api/v1`

## Run Frontend Only

```bash
cd frontend
cp .env.example .env.local
docker compose up --build
```

Frontend default URL: `http://localhost:3000`

The frontend expects the backend API at `http://localhost:3001/api/v1`.
