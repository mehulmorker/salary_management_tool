# AI Collaboration Log

> **Tool:** Claude (Anthropic) — Claude Code CLI  
> **Approach:** I drove every design and commit decision. Claude was used to think through each step, generate code for review, and help debug — one piece at a time following a strict TDD cycle.

---

## 1. Architecture & Planning

**My prompt:**
> I have a salary management tool assessment. The requirements are: manage 10,000 employees (CRUD), salary insights (min/max/avg by country, avg by job title), React frontend, Node.js backend, SQLite, seed script. Help me design the architecture, database schema, API endpoints, and a TDD plan before writing any code.

**What I got back:** Tech stack rationale, Prisma schema with indexes, full API endpoint list, a 6-round TDD plan, and a seed strategy. I reviewed it, made changes (dropped shadcn/ui in favour of inline styles), and committed it as `DESIGN.md`.

---

## 2. Project Scaffolding

**My prompt:**
> Set up an npm workspaces monorepo with three packages: backend (Express + TypeScript + Jest + Prisma), frontend (React + Vite + TypeScript + Vitest), and seed. Show me exactly what files to create.

I followed the output step by step, created each file, and committed once everything installed cleanly.

---

## 3. Database Schema

**My prompt:**
> Create the Prisma Employee schema. It needs: fullName, firstName, lastName, jobTitle, department, country, countryCode, salary, employmentType, seniorityLevel, isActive (soft-delete), timestamps. Add a composite index on (country, jobTitle) for the insight queries.

Reviewed the schema, added it to `prisma/schema.prisma`, ran `migrate dev`, committed.

---

## 4. Employee Validator — TDD Round 1

**My prompt:**
> Write the RED tests for the employee Zod validator first. Tests should cover: valid payload accepted, fullName derived from firstName + lastName, missing firstName rejected, non-positive salary rejected, invalid employmentType enum rejected. Don't write the implementation yet.

Ran the tests — all failed as expected. Committed as `test(backend): red tests — employee validator`.

**My prompt:**
> Now write the validator implementation to make all these tests green. Minimum code only.

Reviewed, ran tests — all green. Committed.

---

## 5. Employee Service — TDD Round 2

**My prompt:**
> Write RED unit tests for EmployeeService using a jest-mocked IEmployeeRepository interface. Cover: createEmployee stores fullName, salary=0 throws ValidationError, getById throws NotFoundError for missing id, update only changes provided fields, delete calls softDelete (never hardDelete), list passes filter params through.

Committed RED. Then:

**My prompt:**
> Implement EmployeeService injecting IEmployeeRepository. Make all tests green.

---

## 6. Insights Service — TDD Round 3

**My prompt:**
> Write RED unit tests for InsightsService with a mocked IInsightsRepository. Cover: getByCountry sorted by headcount descending, getByJobTitle filters to the given country, getSummary returns correct totals, getDistribution buckets salaries into ranges, getTopEarners returns exactly N results sorted by salary desc.

Committed RED, then asked for the implementation.

---

## 7. Employee API — Integration Tests Round 4

**My prompt:**
> Write Supertest integration tests for the employee API against a real SQLite test DB. Cover full CRUD: POST creates and returns 201, POST returns 400 for missing fields, GET returns paginated list, GET with ?country= filters correctly, GET /:id returns 404 for missing id, PUT updates only provided fields, DELETE soft-deletes (isActive=false), deleted employees are excluded from GET.

Committed RED. Asked for repository + controller + routes implementation.

---

## 8. Insights API — Integration Tests Round 5

**My prompt:**
> Write integration tests for the insights API. Seed exactly 5 known employees in beforeAll, then assert exact values: summary headcount=5 totalPayroll=500000, by-country sorted by headcount desc, by-job-title filtered to India returns correct avgSalary, by-department Engineering headcount=3, top-earners sorted salary desc.

**Bug I hit:** Tests passed individually but failed together. I described the problem:

> The insights tests pass alone but fail when both integration suites run together. The employees suite has a beforeEach(cleanDatabase) and the insights suite has a beforeAll seeding. They share test.db. What's happening?

Claude identified it as a race condition from parallel suite execution and suggested `--runInBand`. I added it to the npm script. Fixed.

---

## 9. Seed Script

**My prompt:**
> Implement the seed script using better-sqlite3 directly. Requirements: LCG PRNG with seed=42 for deterministic output (same 10,000 employees every time), idempotency check up front (exit if COUNT >= 10,000 active), WAL mode for write throughput, 10 countries 8 departments realistic salary ranges by seniority. Target under 200ms for 10,000 rows. Print timing on completion.

Result: 10,000 rows in ~127ms. Re-run exits immediately with an idempotency message.

---

## 10. Frontend Components — TDD Round 6

**My prompt:**
> Write RED Vitest + React Testing Library tests for EmployeeForm, EmployeeTable, and InsightsDashboard. EmployeeForm: renders all fields, shows validation error on empty salary submit, calls onSubmit with correct payload, pre-fills values when editing. EmployeeTable: renders rows, calls onEdit and onDelete on button clicks, shows empty state. InsightsDashboard: renders a stat card per country, shows loading state, shows error state.

Committed RED tests. Then:

**My prompt:**
> Implement EmployeeForm, EmployeeTable, and InsightsDashboard with inline styles (no Tailwind). Make all 14 tests green.

---

## 11. Wiring the Full App

**My prompt:**
> Implement EmployeesPage and InsightsPage. Wire in the Axios API modules, React Query hooks (useEmployees, useInsights), add/edit modal, delete confirmation dialog, and all 7 insights panels. Use the existing components.

---

## 12. UI Fixes (from my own testing)

After running the app and reviewing it myself, I sent screenshots and described what was wrong:

**My prompt:**
> The UI needs fixing. Stat cards are stacked vertically instead of a row. Table columns have no padding. Edit and Delete buttons are merged with no gap between them. Form inputs have no borders — they're invisible. Fix these.

**My prompt:**
> The department pie chart shows equal slices (~12.5% each) — it's meaningless. Replace it with a horizontal bar chart showing average salary per department, sorted descending.

**My prompt:**
> The sidebar scrolls with the content. It should stay fixed while only the main content scrolls.



