import { createApp } from "@/app";
import request from "supertest";
import { testPrisma, cleanDatabase } from "../helpers/testDb";

const app = createApp(testPrisma);

// 5 known employees for deterministic assertions
const employees = [
  { firstName: "Alice", lastName: "A", jobTitle: "Engineer", department: "Engineering", country: "India", countryCode: "IN", salary: 60000 },
  { firstName: "Bob",   lastName: "B", jobTitle: "Engineer", department: "Engineering", country: "India", countryCode: "IN", salary: 80000 },
  { firstName: "Carol", lastName: "C", jobTitle: "Manager",  department: "HR",          country: "India", countryCode: "IN", salary: 90000 },
  { firstName: "Dave",  lastName: "D", jobTitle: "Engineer", department: "Engineering", country: "USA",   countryCode: "US", salary: 120000 },
  { firstName: "Eve",   lastName: "E", jobTitle: "Director", department: "HR",          country: "USA",   countryCode: "US", salary: 150000 },
];

beforeAll(async () => {
  await cleanDatabase();
  for (const e of employees) {
    await request(app).post("/api/v1/employees").send(e);
  }
});

afterAll(async () => {
  await cleanDatabase();
  await testPrisma.$disconnect();
});

describe("GET /api/v1/insights/summary", () => {
  it("returns correct headcount and payroll", async () => {
    const res = await request(app).get("/api/v1/insights/summary");
    expect(res.status).toBe(200);
    expect(res.body.headcount).toBe(5);
    expect(res.body.totalPayroll).toBe(500000);
    expect(res.body.avgSalary).toBe(100000);
  });
});

describe("GET /api/v1/insights/by-country", () => {
  it("returns stats per country sorted by headcount desc", async () => {
    const res = await request(app).get("/api/v1/insights/by-country");
    expect(res.status).toBe(200);
    expect(res.body[0].country).toBe("India");
    expect(res.body[0].headcount).toBe(3);
    expect(res.body[0].minSalary).toBe(60000);
    expect(res.body[0].maxSalary).toBe(90000);
  });
});

describe("GET /api/v1/insights/by-job-title", () => {
  it("returns avg salary per job title filtered by country", async () => {
    const res = await request(app).get("/api/v1/insights/by-job-title?country=India");
    expect(res.status).toBe(200);
    const engineer = res.body.find((r: { jobTitle: string }) => r.jobTitle === "Engineer");
    expect(engineer).toBeDefined();
    expect(engineer.avgSalary).toBe(70000); // (60000+80000)/2
    expect(engineer.headcount).toBe(2);
  });
});

describe("GET /api/v1/insights/by-department", () => {
  it("returns salary stats per department", async () => {
    const res = await request(app).get("/api/v1/insights/by-department");
    expect(res.status).toBe(200);
    const eng = res.body.find((r: { department: string }) => r.department === "Engineering");
    expect(eng).toBeDefined();
    expect(eng.headcount).toBe(3);
  });
});

describe("GET /api/v1/insights/top-earners", () => {
  it("returns top N earners sorted by salary desc", async () => {
    const res = await request(app).get("/api/v1/insights/top-earners?n=3");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].salary).toBe(150000);
    expect(res.body[1].salary).toBe(120000);
  });
});
