# Backend

Production-oriented NestJS scaffold for the task management API using Prisma with PostgreSQL.

## Architecture

- `prisma/schema.prisma`: database schema for users, tasks, and audit logs
- `prisma/seed.ts`: predefined admin and user seeding
- `src/prisma`: NestJS Prisma client integration
- `src/auth`: JWT authentication
- `src/users`: predefined user lookup and admin user listing
- `src/tasks`: task CRUD, assignment, and status management
- `src/audit-logs`: centralized audit log persistence and admin access
- `src/seed`: bootstrap predefined admin and user accounts
- `src/common`: shared guards, decorators, and enums

## Run locally

```bash
npm install
cp .env.example .env
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push
npm run start:dev
```

## Run with Docker

```bash
cp .env.example .env
docker compose up --build
```

## Run from Repository Root

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```
