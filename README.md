# Salary Management Tool

A salary management tool for HR Managers to manage 10,000 employees and gain salary insights.

## Stack

- **Backend**: Node.js + Express + TypeScript + Prisma (SQLite)
- **Frontend**: React + Vite + TypeScript + shadcn/ui
- **Tests**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
npm run db:migrate --workspace=backend
```

### 3. Seed 10,000 employees
```bash
npm run seed
```

### 4. Start the backend (port 3001)
```bash
npm run dev:backend
```

### 5. Start the frontend (port 5173)
```bash
npm run dev:frontend
```

## Running Tests

```bash
# Backend unit + integration tests
npm run test:backend

# Frontend component tests
npm run test:frontend
```

## Project Structure

```
Incubyte/
├── backend/      Express API + Prisma + SQLite
├── frontend/     React + Vite SPA
├── seed/         Bulk seed script (10,000 employees)
└── docs/         Step-by-step developer guides
```
