# Field Service App

A full-stack task management application for field-service teams. Administrators create and assign work, while workers view their assigned tasks and update their progress.

The project is organized as two applications:

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT authentication, bcrypt, and class-validator
- **Frontend**: React, TypeScript, Vite, React Router, Axios, Tailwind CSS, and React Hot Toast

## Features

- Worker registration and JWT-based login
- Role-aware access for administrators and workers
- Admin task creation and assignment to workers
- Admin task deletion
- Admin view of all tasks
- Worker view of assigned tasks
- Worker status updates: `pending`, `in_progress`, and `done`
- Protected API requests with Bearer tokens
- Client-side error and success notifications

## Application Flow

1. A user registers through the frontend. New registrations are created as workers by default.
2. The user logs in and receives a JWT access token.
3. The frontend stores the token and user details in `localStorage`.
4. Axios attaches the token to protected requests.
5. Administrators can create and assign tasks; workers can update the status of their assigned tasks.

## Project Structure

```text
field-service-app/
├── Backend/
│   ├── src/
│   │   ├── auth/          # Registration, login, JWT and role guards
│   │   ├── user/          # User entity and worker lookup
│   │   ├── task/          # Task entity, DTOs, controller and service
│   │   └── migrations/    # PostgreSQL schema migrations
│   ├── apis.rest          # REST Client request examples
│   └── package.json
├── Frontend/
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── context/   # Authentication state
│       │   ├── pages/     # Login, registration, dashboard and task creation
│       │   └── services/  # Axios API client
│       └── package.json
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL 13 or newer
- A PostgreSQL database for the backend

## Local Setup

### 1. Configure PostgreSQL

Create a PostgreSQL database and make sure the `uuid-ossp` extension is available. The migrations use `uuid_generate_v4()` for UUID primary keys.

```sql
CREATE DATABASE field_service;
\c field_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Configure the backend

Create `Backend/.env` with values for your local database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=field_service
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
PORT=3000
```

`Backend/.env` is ignored by Git. Do not commit database passwords or JWT secrets.

### 3. Install and start the backend

```bash
cd Backend
npm install
npm run migration:run
npm run start:dev
```

The API runs at `http://localhost:3000` by default.

### 4. Install and start the frontend

Open a second terminal:

```bash
cd Frontend/frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

The current Axios client uses `http://localhost:3000` as its API base URL. If the backend runs on another host or port, update `Frontend/frontend/src/services/api.ts`.

## Roles

### Worker

- Register and log in
- View tasks assigned to them
- Update the status of their tasks

### Administrator

- Log in
- View all tasks
- Create and assign tasks to workers
- Delete tasks

The public registration endpoint always creates a worker. There is currently no public admin-registration or admin-management screen, so an administrator must be provisioned separately in the database or through an administrative process.

## API Reference

All protected endpoints require:

```http
Authorization: Bearer <access_token>
```

### Authentication

| Method | Endpoint | Access | Body |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | `{ "name": "Alex", "email": "alex@example.com", "password": "Password1!" }` |
| `POST` | `/auth/login` | Public | `{ "email": "alex@example.com", "password": "Password1!" }` |

A successful login returns an `access_token` and a public user object. Registration passwords must be at least 8 characters and contain an uppercase letter, number, and special character.

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/user/worker` | Admin | Returns all users with the worker role. |

### Tasks

| Method | Endpoint | Access | Body or description |
| --- | --- | --- |
| `GET` | `/task` | Authenticated users | Admins receive all tasks; workers receive tasks assigned to them. |
| `GET` | `/task/:id` | Authenticated users | Returns one task with assigned and creating users. |
| `POST` | `/task/create` | Admin | `{ "title": "Install equipment", "description": "...", "assignedTo": "worker-uuid", "createdBy": "admin-uuid" }` |
| `PATCH` | `/task/:id` | Authenticated users | Any subset of `title`, `description`, and `status`. |
| `DELETE` | `/task/:id` | Admin | Deletes a task. |

Valid task statuses are `pending`, `in_progress`, and `done`.

## Available Scripts

### Backend

Run these commands from `Backend/`:

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Compile the backend |
| `npm run start:prod` | Run the compiled backend |
| `npm run migration:run` | Apply pending database migrations |
| `npm run migration:generate -- <name>` | Generate a migration from entity changes |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage |
| `npm run lint` | Lint and automatically fix backend files |

### Frontend

Run these commands from `Frontend/frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the production bundle |
| `npm run preview` | Preview the production bundle locally |
| `npm run lint` | Run ESLint |

## Database

TypeORM is configured with `synchronize: false`, so schema changes are applied through migrations rather than being generated automatically at runtime.

Current migrations create:

- `users`, including `admin` and `worker` roles
- `task`, including task status and user relationships
- UUID primary keys and foreign-key relationships

## Testing

Backend unit and end-to-end test commands are available through npm scripts. The current end-to-end suite includes the root health-style endpoint; broader authentication, authorization, migration, and task workflow coverage can be added as the application evolves.

## Security Notes

- Keep `.env` files out of version control.
- Use a strong, unique `JWT_SECRET` outside local development.
- The frontend stores the JWT in `localStorage`; evaluate an HTTP-only cookie approach before deploying to production.
- Server-side guards are the source of truth for authorization. Frontend role checks only control the visible user interface.

## License

This project is currently marked as private and unlicensed in the backend package configuration.
