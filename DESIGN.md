# Salary Management Tool — Design & Implementation Plan

> **Artifact type:** Planning notes  
> **Purpose:** Documents the architecture, engineering decisions, TDD approach, and incremental build strategy before implementation begins. Committed as part of the assessment artifacts.

---

## Context

Build a production-quality salary management tool for an HR Manager to manage 10,000 employees and gain salary insights. The assessor values **TDD**, **clean code**, and **incremental commits** — the engineering process is as important as the final product.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Backend | Node.js + Express + TypeScript | JD-specified; Express enables clean layered architecture |
| Database | SQLite via **Prisma ORM** | Relational, zero-ops; Prisma provides type-safe client + `createMany` bulk inserts |
| Frontend | React + Vite + TypeScript | JD-specified |
| Styling | Inline styles (React `style` prop) | Zero build-time deps; consistent design tokens in co-located style objects |
| Charts | **recharts** | BarChart / PieChart out of the box; composable with `ResponsiveContainer` |
| Forms | react-hook-form + zod | Same zod schemas mirrored from backend — validation rules never out of sync |
| Data fetching | @tanstack/react-query | Server-state co-located with components; no Redux needed |
| Routing | React Router v6 | Simple 2-page app |
| Backend tests | Jest + Supertest | Unit + integration tests |
| Frontend tests | Vitest + React Testing Library | Co-located with components |

---

## Project Structure

```
Incubyte/
├── README.md
├── DESIGN.md                  ← this file
├── .gitignore
├── package.json               # npm workspaces root
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts             # Express app factory (no listen call — keeps it testable)
│       ├── server.ts          # Entry point: calls app.listen
│       ├── config/
│       │   └── database.ts    # Prisma client singleton
│       ├── employees/
│       │   ├── employee.controller.ts
│       │   ├── employee.service.ts
│       │   ├── employee.repository.ts            ← implements IEmployeeRepository
│       │   ├── employee.repository.interface.ts  ← interface injected into service
│       │   ├── employee.types.ts
│       │   ├── employee.validator.ts             ← zod schema
│       │   └── employee.routes.ts
│       ├── insights/
│       │   ├── insights.controller.ts
│       │   ├── insights.service.ts
│       │   ├── insights.repository.ts            ← implements IInsightsRepository
│       │   ├── insights.repository.interface.ts
│       │   ├── insights.types.ts
│       │   └── insights.routes.ts
│       └── shared/
│           ├── errors.ts          # AppError, NotFoundError, ValidationError
│           ├── errorHandler.ts    # Express error middleware
│           └── pagination.ts      # Pagination helpers
│   └── tests/
│       ├── unit/
│       │   ├── employees/
│       │   │   ├── employee.service.test.ts
│       │   │   └── employee.validator.test.ts
│       │   └── insights/
│       │       └── insights.service.test.ts
│       ├── integration/
│       │   ├── employees.api.test.ts   ← Supertest against real SQLite
│       │   └── insights.api.test.ts
│       └── helpers/
│           └── testDb.ts              # fresh DB per suite, runs Prisma migrations
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── src/
│       ├── api/
│       │   ├── client.ts           # Axios instance with base URL + interceptors
│       │   ├── employees.api.ts
│       │   └── insights.api.ts
│       ├── components/
│       │   ├── employees/
│       │   │   ├── EmployeeTable.tsx
│       │   │   ├── EmployeeTable.test.tsx
│       │   │   ├── EmployeeForm.tsx
│       │   │   ├── EmployeeForm.test.tsx
│       │   │   └── EmployeeFormModal.tsx
│       │   ├── insights/
│       │   │   ├── InsightsDashboard.tsx        ← stat cards + country table (no sub-components)
│       │   │   └── InsightsDashboard.test.tsx
│       │   └── shared/
│       │       ├── PageLayout.tsx
│       │       ├── Pagination.tsx
│       │       └── DeleteConfirmDialog.tsx
│       ├── pages/
│       │   ├── EmployeesPage.tsx
│       │   └── InsightsPage.tsx
│       ├── hooks/
│       │   ├── useEmployees.ts
│       │   ├── useEmployeeForm.ts
│       │   └── useInsights.ts
│       └── types/
│           └── index.ts
│
└── seed/
    ├── first_names.txt
    ├── last_names.txt
    └── seed.ts          ← idempotency + LCG PRNG; tested via integration suite
```

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
  countryCode    String   // ISO-3166-1 alpha-2 ("IN", "US")
  salary         Float    // annual, USD
  currency       String   @default("USD")
  employmentType String   @default("FULL_TIME")  // FULL_TIME | PART_TIME | CONTRACT
  seniorityLevel String   @default("MID")        // JUNIOR | MID | SENIOR | LEAD | EXEC
  hireDate       DateTime @default(now())
  isActive       Boolean  @default(true)          // soft-delete flag
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([country])
  @@index([jobTitle])
  @@index([country, jobTitle])  // composite index for the primary insight query
  @@index([isActive])
}
```

### Schema decisions

| Decision | Reason |
|---|---|
| `isActive` soft-delete | Historical salary data preserved for audit and analysis (e.g. Q3 payroll report) |
| `firstName` + `lastName` stored separately | Enables "search by last name" without string splitting; seed generation is cleaner |
| `(country, jobTitle)` composite index | Directly accelerates "avg salary for job title in country" — the most frequent insight query |
| `seniorityLevel` + `employmentType` | Required for pay-equity analysis and fair benchmarking |
| `currency` column | Defaults to USD; enables future multi-currency without a schema migration |

---

## API Endpoints

### Base: `/api/v1`

#### Employees

| Method | Path | Description |
|---|---|---|
| `GET` | `/employees` | Paginated list; supports `?search`, `?country`, `?department`, `?sortBy=salary&sortOrder=desc`, `?page`, `?limit` |
| `POST` | `/employees` | Create employee (`fullName` derived server-side from firstName + lastName) |
| `GET` | `/employees/:id` | Single employee |
| `PUT` | `/employees/:id` | Partial update |
| `DELETE` | `/employees/:id` | Soft-delete (sets `isActive=false`) |

**`GET /employees` response shape:**
```json
{
  "data": [{ "id": 1, "fullName": "Jane Smith", ... }],
  "meta": { "total": 10000, "page": 1, "limit": 50, "totalPages": 200 }
}
```

#### Insights

| Method | Path | Description |
|---|---|---|
| `GET` | `/insights/summary` | Dashboard totals (total active employees, annual payroll, global avg salary) |
| `GET` | `/insights/by-country` | min / max / avg / median / headcount / total payroll per country |
| `GET` | `/insights/by-job-title?country=IN` | avg salary per job title in a specific country |
| `GET` | `/insights/by-department` | salary stats per department |
| `GET` | `/insights/by-seniority` | avg salary by seniority level |
| `GET` | `/insights/distribution?country=IN&bucketSize=10000` | histogram bucket data |
| `GET` | `/insights/top-earners?n=10&country=IN` | top N earners globally or by country |

---

## Additional Meaningful Metrics (beyond requirements)

| Metric | Business value for HR Manager |
|---|---|
| **Median salary by country** | Mean is skewed by outliers; median = typical salary used in budget planning |
| **Total annual payroll by country** | Direct input to regional HR budget forecasts |
| **Salary distribution histogram** | Spots pay compression or wide spread across workforce bands |
| **Avg salary by seniority within job title** | Detects pay anomalies (e.g. senior paid less than mid-level) |
| **Payroll share by department** | "Engineering = 42% of total payroll" — exec-level budget visibility |
| **Top N earners** | Audit outlier compensation before performance review cycles |
| **Headcount by department** | Workforce planning — which departments are growing |

---

## TDD Red-Green-Refactor Cycle

Tests are always written **red first**, committed, then made green.

### Round 1 — Validator (pure unit, no DB)
```
employee.validator.test.ts (RED):
  ✗ rejects missing firstName
  ✗ rejects non-positive salary
  ✗ rejects invalid employmentType enum value
  ✗ accepts a fully valid payload
  ✗ derives fullName = firstName + " " + lastName
```
→ implement `employee.validator.ts` with zod → **GREEN**

### Round 2 — Employee Service (unit, mocked IEmployeeRepository)
```
employee.service.test.ts (RED):
  ✗ createEmployee calls repository.create with derived fullName
  ✗ createEmployee throws ValidationError when salary is zero
  ✗ getById throws NotFoundError when employee does not exist
  ✗ update merges partial fields and calls repository.update
  ✗ delete calls repository.softDelete, never repository.hardDelete
  ✗ list passes filter params to repository.findMany
```
→ implement `employee.service.ts` (repository injected as interface; test uses jest.mock) → **GREEN**

### Round 3 — Insights Service (unit, mocked IInsightsRepository)
```
insights.service.test.ts (RED):
  ✗ getByCountry returns stats sorted by headcount descending
  ✗ getByJobTitle filters to specified country
  ✗ getSummary aggregates totalActiveEmployees correctly
  ✗ getDistribution buckets salaries into configured ranges
  ✗ getTopEarners returns exactly N results sorted desc by salary
```
→ implement `insights.service.ts` → **GREEN**

### Round 4 — Integration: Employee API (Supertest + real SQLite)
```
employees.api.test.ts (RED):
  ✗ POST /employees → 201 with created employee body
  ✗ POST /employees → 400 when required field missing
  ✗ GET /employees → 200 with paginated results
  ✗ GET /employees?country=IN → filters correctly
  ✗ GET /employees/:id → 404 for nonexistent id
  ✗ PUT /employees/:id → updates only provided fields
  ✗ DELETE /employees/:id → sets isActive=false, returns 200
  ✗ GET /employees → does not return inactive employees by default
```
→ implement `employee.repository.ts` + controller + routes → **GREEN**

### Round 5 — Integration: Insights API
```
insights.api.test.ts (RED): (seed 5 known employees, assert exact output)
  ✗ GET /insights/by-country → correct min/max/avg for seeded data
  ✗ GET /insights/by-job-title?country= → correct avg
  ✗ GET /insights/summary → correct totals
  ✗ GET /insights/distribution → correct bucket counts
```
→ implement `insights.repository.ts` + controller + routes → **GREEN**

### Round 6 — Frontend Components (Vitest + React Testing Library)
```
EmployeeForm.test.tsx (RED):
  ✗ renders all required fields
  ✗ shows validation error when salary is empty on submit
  ✗ calls onSubmit with correct payload on valid input
  ✗ pre-fills fields when editing an existing employee

EmployeeTable.test.tsx (RED):
  ✗ renders employee rows from props
  ✗ calls onEdit when Edit button is clicked
  ✗ calls onDelete when Delete button is clicked
  ✗ shows empty state when data array is empty

InsightsDashboard.test.tsx (RED):
  ✗ renders a SalaryStatCard for each country returned
  ✗ shows loading spinner while data is fetching
  ✗ shows error message when API call fails
```
→ implement components → **GREEN**

---

## Incremental Commit Plan

Each commit leaves the codebase in a green, runnable state.

```
01  chore: init monorepo — npm workspaces, .gitignore, README skeleton, DESIGN.md
02  chore(backend): scaffold Express + TypeScript + Jest + Prisma
03  chore(frontend): scaffold React + Vite + TypeScript + Vitest
04  feat(backend): Prisma schema + initial SQLite migration
05  test(backend): red tests — employee validator
06  feat(backend): implement employee validator with zod [green]
07  test(backend): red unit tests — employee service
08  feat(backend): implement employee service with repository interface [green]
09  test(backend): red unit tests — insights service
10  feat(backend): implement insights service [green]
11  test(backend): red integration tests — employee API endpoints
12  feat(backend): implement employee repository + controller + routes [green]
13  test(backend): red integration tests — insights API endpoints
14  feat(backend): implement insights repository + controller + routes [green]
15  refactor(backend): extract shared error handler + pagination helpers
16  chore(seed): add first_names.txt + last_names.txt
17  feat(seed): implement fast bulk-insert seed with idempotency + timing log
18  test(frontend): red tests — EmployeeForm component
19  feat(frontend): implement EmployeeForm with zod validation [green]
20  test(frontend): red tests — EmployeeTable component
21  feat(frontend): implement EmployeeTable with pagination [green]
22  feat(frontend): implement EmployeesPage — CRUD flows with modals
23  test(frontend): red tests — InsightsDashboard
24  feat(frontend): implement InsightsDashboard with recharts [green]
25  feat(frontend): implement InsightsPage — all metrics panels
26  feat(frontend): shared layout, navigation sidebar, search bar
27  chore: finalize README with setup, run, and seed instructions
28  docs: add artifacts/ — prompts used, trade-off notes, architecture diagram
```

---

## Seed Script — Performance Strategy

**Target:** < 1 second for 10,000 rows on a developer laptop.

### Why naïve inserts are too slow
Each individual `prisma.employee.create()` opens a transaction, writes a row, and closes. At ~2 ms overhead per call: 10,000 × 2 ms = **~20 seconds**. Unacceptable for a script run regularly by engineers.

### Strategy: single-transaction `createMany`

```
Step 1  Read first_names.txt + last_names.txt into arrays once (O(F + L))
Step 2  Idempotency check: SELECT COUNT(*) WHERE isActive=true
        → if ≥ 10,000: print "already seeded, skipping" and exit 0 (< 5 ms re-run)
Step 3  Generate 10,000 employee objects in memory using a seeded PRNG
        (seedrandom with fixed seed "incubyte-2024" → deterministic, reproducible)
Step 4  prisma.employee.createMany({ data: employees, skipDuplicates: true })
        → Prisma batches as 10 × 1,000-row INSERT statements in a single transaction
Step 5  Print: "✓ Seeded 10,000 employees in 430ms"
```

**WAL mode:** enable `PRAGMA journal_mode=WAL` in the initial migration for write throughput.

**Determinism:** same seeded PRNG ensures identical employees are generated on every fresh DB — integration tests that depend on seeded data are reproducible.

---

## Frontend Component Hierarchy

```
App (React Router)
├── /employees → EmployeesPage
│   ├── SearchBar + filters (country, department, seniority)
│   ├── "Add Employee" button → EmployeeFormModal (create mode)
│   ├── EmployeeTable (@tanstack/react-table)
│   │   └── per row:
│   │       ├── "Edit" → EmployeeFormModal (edit mode, pre-filled)
│   │       └── "Delete" → DeleteConfirmDialog (shadcn AlertDialog)
│   └── Pagination
│
└── /insights → InsightsPage
    ├── InsightsDashboard (stat cards row + country stats table)
    │   └── 3 gradient stat cards: Total Employees · Annual Payroll · Global Avg Salary
    ├── Average Salary by Country (recharts BarChart — horizontal, sorted desc)
    ├── Avg Salary by Job Title (country selector → table: jobTitle | headcount | avg | min | max)
    ├── Salary & Headcount by Department (horizontal BarChart + side table with payrollShare %)
    ├── Average Salary by Seniority (recharts BarChart)
    ├── Salary Distribution histogram (recharts BarChart, bucketSize=10000)
    └── Top Earners table (top-N selector: 5/10/25/50, country filter)
```

---

## Key Architectural Trade-offs

### Repository interface injection (not direct Prisma usage in service)
**Why:** Service layer is tested with a jest mock, never touching SQLite. Unit tests run in < 50 ms total. The integration test suite is the only layer that requires a real DB.

### Prisma over raw `better-sqlite3`
**Why:** `createMany` handles bulk inserts efficiently; `groupBy` with aggregates covers all insight queries declaratively; the generated TypeScript client eliminates a class of runtime type errors; migration history is automatically tracked.

### Soft-delete over hard-delete
**Why:** HR Managers need historical context. If a company runs payroll analysis for Q3, salaries of employees who left mid-quarter must still be available. Hard-delete destroys that audit trail.

### Zod on both backend and frontend
**Why:** Validation rules are defined once (backend) and mirrored in the frontend form schema. If a rule changes (e.g. salary minimum raised), both layers stay in sync without hunting through two codebases.

### shadcn/ui over Ant Design or MUI
**Why:** Components are copied into the project, not installed as a package — perfect tree-shaking, no fighting with override specificity. Ant Design's bundle (~2 MB gzipped) is heavy for a focused tool. MUI's `sx` prop system adds cognitive overhead.
