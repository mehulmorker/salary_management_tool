import 'dotenv/config';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// ── Config ────────────────────────────────────────────────────────────────────
const TARGET       = 10_000;
const BATCH_SIZE   = 1_000;
const PRNG_SEED    = 42;
const DB_PATH      = process.env.DATABASE_URL?.replace('file:', '') ?? '../backend/dev.db';

// ── Deterministic PRNG (LCG) ──────────────────────────────────────────────────
function makePrng(seed: number) {
  let s = seed;
  return {
    next(): number {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    },
    pick<T>(arr: T[]): T {
      return arr[Math.floor(this.next() * arr.length)];
    },
    between(min: number, max: number): number {
      return Math.round(min + this.next() * (max - min));
    },
  };
}

// ── Reference data ────────────────────────────────────────────────────────────
const COUNTRIES = [
  { country: 'India',          countryCode: 'IN' },
  { country: 'United States',  countryCode: 'US' },
  { country: 'United Kingdom', countryCode: 'GB' },
  { country: 'Germany',        countryCode: 'DE' },
  { country: 'Canada',         countryCode: 'CA' },
  { country: 'Australia',      countryCode: 'AU' },
  { country: 'Brazil',         countryCode: 'BR' },
  { country: 'Singapore',      countryCode: 'SG' },
  { country: 'France',         countryCode: 'FR' },
  { country: 'Netherlands',    countryCode: 'NL' },
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Data',
  'Operations',  'HR',      'Finance', 'Marketing',
];

const JOB_TITLES: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead'],
  Product:     ['Product Manager', 'Senior Product Manager', 'Product Owner'],
  Design:      ['UX Designer', 'UI Designer', 'Senior Designer'],
  Data:        ['Data Analyst', 'Data Engineer', 'ML Engineer', 'Data Scientist'],
  Operations:  ['Operations Manager', 'Business Analyst', 'Scrum Master'],
  HR:          ['HR Manager', 'HR Specialist', 'Talent Acquisition Specialist'],
  Finance:     ['Finance Analyst', 'Senior Finance Analyst', 'Finance Manager'],
  Marketing:   ['Marketing Manager', 'Content Strategist', 'Growth Analyst'],
};

const SENIORITY_LEVELS = ['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXEC'];
const EMPLOYMENT_TYPES = ['FULL_TIME', 'FULL_TIME', 'FULL_TIME', 'PART_TIME', 'CONTRACT']; // weighted

const SALARY_RANGES: Record<string, [number, number]> = {
  JUNIOR: [30_000,  65_000],
  MID:    [55_000,  95_000],
  SENIOR: [80_000, 140_000],
  LEAD:   [110_000, 180_000],
  EXEC:   [150_000, 300_000],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function readNames(file: string): string[] {
  return fs.readFileSync(path.join(__dirname, file), 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

function isoDate(rng: ReturnType<typeof makePrng>): string {
  const year  = rng.between(2015, 2024);
  const month = String(rng.between(1, 12)).padStart(2, '0');
  const day   = String(rng.between(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Idempotency check
  const { count } = db
    .prepare('SELECT COUNT(*) as count FROM "Employee" WHERE isActive = 1')
    .get() as { count: number };

  if (count >= TARGET) {
    console.log(`✓ Already seeded (${count.toLocaleString()} active employees). Nothing to do.`);
    db.close();
    return;
  }

  const firstNames = readNames('first_names.txt');
  const lastNames  = readNames('last_names.txt');
  const rng        = makePrng(PRNG_SEED);

  // Build all rows in memory
  const rows = Array.from({ length: TARGET }, () => {
    const firstName      = rng.pick(firstNames);
    const lastName       = rng.pick(lastNames);
    const fullName       = `${firstName} ${lastName}`;
    const department     = rng.pick(DEPARTMENTS);
    const jobTitle       = rng.pick(JOB_TITLES[department]);
    const { country, countryCode } = rng.pick(COUNTRIES);
    const seniorityLevel = rng.pick(SENIORITY_LEVELS) as keyof typeof SALARY_RANGES;
    const employmentType = rng.pick(EMPLOYMENT_TYPES);
    const [min, max]     = SALARY_RANGES[seniorityLevel];
    const salary         = rng.between(min, max);
    const hireDate       = isoDate(rng);
    const now            = new Date().toISOString();

    return {
      fullName, firstName, lastName, jobTitle, department,
      country, countryCode, salary,
      currency: 'USD', employmentType, seniorityLevel,
      hireDate, isActive: 1, createdAt: now, updatedAt: now,
    };
  });

  const insert = db.prepare(`
    INSERT INTO "Employee"
      (fullName, firstName, lastName, jobTitle, department,
       country, countryCode, salary, currency, employmentType,
       seniorityLevel, hireDate, isActive, createdAt, updatedAt)
    VALUES
      (@fullName, @firstName, @lastName, @jobTitle, @department,
       @country, @countryCode, @salary, @currency, @employmentType,
       @seniorityLevel, @hireDate, @isActive, @createdAt, @updatedAt)
  `);

  const insertMany = db.transaction((batch: typeof rows) => {
    for (const row of batch) insert.run(row);
  });

  const start = Date.now();

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    insertMany(rows.slice(i, i + BATCH_SIZE));
  }

  const ms = Date.now() - start;
  console.log(`✓ Seeded ${TARGET.toLocaleString()} employees in ${ms}ms`);

  db.close();
}

main();
