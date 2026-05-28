# 💼 SalaryHQ — Salary Management Tool

A full-stack salary management tool for HR Managers to manage 10,000+ employees and gain deep salary insights. Built as an Incubyte assessment with strict **TDD**, clean architecture, and incremental commits.

---

## Features

| Area                | What it does                                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Employee CRUD**   | Create, view, edit, soft-delete employees with full validation                                                                         |
| **Search & Filter** | Filter by name, country, department with live pagination                                                                               |
| **Salary Insights** | Summary stats, country breakdown, job-title drill-down, department analysis, seniority pay, salary distribution histogram, top earners |
| **Seed**            | One command loads 10,000 deterministic employees in < 200 ms                                                                           |

---

## Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Backend        | Node.js · Express v5 · TypeScript           |
| ORM            | Prisma v7 + `better-sqlite3` driver adapter |
| Database       | SQLite (zero-ops, file-based)               |
| Validation     | Zod v4                                      |
| Frontend       | React 19 · Vite · TypeScript                |
| Data Fetching  | TanStack React Query                        |
| Forms          | react-hook-form + Zod                       |
| Charts         | Recharts                                    |
| Backend Tests  | Jest · Supertest                            |
| Frontend Tests | Vitest · React Testing Library              |

---

## Quick Start

### Prerequisites

- Node.js ≥ 20 (`node --version` to check)
- npm ≥ 10 (`npm --version` to check)

### 1. Install all dependencies

```bash
npm install
```

This also auto-generates the Prisma client code into `backend/src/generated/prisma/` via the `postinstall` hook.

### 2. Create the backend environment file

```bash
cp backend/.env.example backend/.env
```

> **If there is no `.env.example`**, create `backend/.env` manually with:
> ```env
> DATABASE_URL=file:./dev.db
> PORT=3001
> ```
>
> This file is required — the Prisma CLI reads `DATABASE_URL` to locate the SQLite database. Without it, the migration in the next step will fail.

### 3. Run the database migration

```bash
npm run db:migrate --workspace=backend
```

This creates `backend/dev.db` and applies the Employee schema. If prompted for a migration name, enter any label (e.g. `init`).

### 4. Seed 10,000 employees

```bash
npm run seed
```

Output: `✓ Seeded 10,000 employees in 127ms`

Re-running is safe — it exits immediately if the database is already seeded.

### 5. Start the backend — open a terminal and run:

```bash
npm run dev:backend
```

Leave this terminal running. You should see: `Server running on port 3001`

### 6. Start the frontend — open a **second** terminal and run:

```bash
npm run dev:frontend
```

Open **http://localhost:5173**

Both servers must be running at the same time. The frontend proxies API calls to `localhost:3001`.

---

## Environment Variables

`backend/.env` (created in Step 2 above):

```env
DATABASE_URL=file:./dev.db   # path to the SQLite database file
PORT=3001                    # port the Express server listens on
```

---

## Troubleshooting

**`prisma migrate dev` fails with "Cannot read DATABASE_URL"**
→ `backend/.env` is missing. Complete Step 2 above.

**`Cannot find module '../generated/prisma'`**
→ The Prisma client wasn't generated. Run `npm install` again or `npm run db:generate:backend`.

**Port 3001 or 5173 already in use**
→ Kill the process using the port: `lsof -ti:3001 | xargs kill` (replace with `5173` for the frontend).

**Frontend shows a blank page or "Network Error"**
→ Make sure the backend is running (Step 5). Check `http://localhost:3001/api/v1/employees` in your browser — it should return JSON.

---

## Running Tests

```bash
# Backend — unit tests (30 tests, ~500 ms)
npm run test:unit --workspace=backend

# Backend — integration tests against real SQLite (15 tests, ~2 s)
npm run test:integration --workspace=backend

# Frontend — component tests (14 tests, ~2 s)
npm test --workspace=frontend
```

### Test counts

| Suite               | Tests  | Speed    |
| ------------------- | ------ | -------- |
| Backend unit        | 30     | < 500 ms |
| Backend integration | 15     | < 2 s    |
| Frontend components | 14     | < 2 s    |
| **Total**           | **59** |          |

### TDD approach

Every feature followed a strict red → green → refactor cycle:

1. Write failing test — commit `test: red …`
2. Write minimal implementation — commit `feat: … [green]`
3. Refactor if needed

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

### Employees

| Method   | Path             | Description                                                                                                               |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/employees`     | Paginated list. Query params: `search`, `country`, `department`, `seniorityLevel`, `sortBy`, `sortOrder`, `page`, `limit` |
| `POST`   | `/employees`     | Create employee. `fullName` is derived server-side from `firstName + lastName`                                            |
| `GET`    | `/employees/:id` | Get single employee (404 if not found)                                                                                    |
| `PUT`    | `/employees/:id` | Partial update — only provided fields change                                                                              |
| `DELETE` | `/employees/:id` | Soft-delete — sets `isActive = false`, data preserved for insights                                                        |

**Example — create employee:**

```bash
curl -X POST http://localhost:3001/api/v1/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "jobTitle": "Senior Engineer",
    "department": "Engineering",
    "country": "India",
    "countryCode": "IN",
    "salary": 95000
  }'
```

**Example — paginated list with filters:**

```bash
curl "http://localhost:3001/api/v1/employees?country=India&sortBy=salary&sortOrder=desc&page=1&limit=20"
```

### Insights

| Method | Path                                                    | Description                                                                          |
| ------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `GET`  | `/insights/summary`                                     | Headcount, total payroll, average salary                                             |
| `GET`  | `/insights/by-country`                                  | min / max / avg / median / headcount / payroll per country, sorted by headcount desc |
| `GET`  | `/insights/by-job-title?country=India`                  | avg salary per job title, optionally filtered by country                             |
| `GET`  | `/insights/by-department`                               | salary stats + payroll share % per department                                        |
| `GET`  | `/insights/by-seniority`                                | avg salary by seniority level                                                        |
| `GET`  | `/insights/top-earners?n=10&country=India`              | top N earners, optionally filtered by country                                        |
| `GET`  | `/insights/distribution?bucketSize=10000&country=India` | salary histogram buckets                                                             |

---

## Project Structure

```
Incubyte/
├── package.json                  # npm workspaces root
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Employee model
│   │   └── migrations/
│   └── src/
│       ├── app.ts                # Express factory (testable — no listen call)
│       ├── server.ts             # Entry point
│       ├── config/database.ts    # Prisma singleton
│       ├── employees/            # Controller → Service → Repository
│       ├── insights/             # Controller → Service → Repository
│       └── shared/               # errors, errorHandler, pagination
│   └── tests/
│       ├── unit/                 # Mocked repos — pure business logic
│       ├── integration/          # Supertest + real SQLite
│       └── helpers/              # testDb, globalSetup, setTestEnv
│
├── frontend/
│   └── src/
│       ├── api/                  # Axios client + per-domain modules
│       ├── hooks/                # React Query wrappers (useEmployees, useInsights)
│       ├── components/
│       │   ├── employees/        # EmployeeTable, EmployeeForm, EmployeeFormModal
│       │   ├── insights/         # InsightsDashboard
│       │   └── shared/           # PageLayout, Pagination, DeleteConfirmDialog
│       ├── pages/                # EmployeesPage, InsightsPage
│       └── types/index.ts        # Shared TypeScript types
│
└── seed/
    ├── seed.ts                   # Bulk insert with idempotency + timing log
    ├── first_names.txt           # 64 diverse first names
    └── last_names.txt            # 64 diverse last names
```

---

## Architecture Decisions

### Soft delete

`isActive = false` instead of hard delete. Historical salary data is preserved for insights — deleted employees still contribute to min/max/avg calculations if queried directly (excluded from list views by default).

### Repository interface injection

`EmployeeService` and `InsightsService` depend on `IEmployeeRepository` / `IInsightsRepository` interfaces, not concrete classes. This makes unit tests trivial (jest mock objects) without spinning up a database.

### Prisma v7 + driver adapter

Prisma v7 removed the default Node.js engine and requires explicit driver adapters. `@prisma/adapter-better-sqlite3` is used — it wraps `better-sqlite3` and enables Prisma's query engine to run in-process, giving synchronous SQLite access with zero network overhead.

### Deterministic seed

The seed script uses a Linear Congruential Generator with a fixed seed (`42`). Running `npm run seed` on a fresh database always produces the same 10,000 employees in the same order — reproducible for demos and testing.

### Integration test isolation

Both integration test suites share a single `test.db`. Tests run with `--runInBand` (sequential) to prevent `employees.api.test.ts`'s `beforeEach(cleanDatabase)` from racing with `insights.api.test.ts`'s `beforeAll` seeding.

---

## Database Schema

```prisma
model Employee {
  id             Int      @id @default(autoincrement())
  fullName       String
  firstName      String
  lastName       String
  jobTitle       String
  department     String
  country        String
  countryCode    String          // ISO 3166-1 alpha-2
  salary         Float           // annual, USD
  currency       String          @default("USD")
  employmentType String          @default("FULL_TIME")
  seniorityLevel String          @default("MID")
  hireDate       DateTime        @default(now())
  isActive       Boolean         @default(true)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@index([country])
  @@index([jobTitle])
  @@index([country, jobTitle])   // accelerates the most frequent insights query
  @@index([isActive])
}
```
