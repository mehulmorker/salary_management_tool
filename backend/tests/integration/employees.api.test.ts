import { createApp } from "@/app";
import request from "supertest";
import { testPrisma, cleanDatabase } from "../helpers/testDb";

const app = createApp(testPrisma);

const validPayload = {
  firstName: "Jane",
  lastName: "Smith",
  jobTitle: "Software Engineer",
  department: "Engineering",
  country: "India",
  countryCode: "IN",
  salary: 85000,
};

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});

describe("POST /api/v1/employees", () => {
  it("creates employee and returns 201", async () => {
    const res = await request(app).post("/api/v1/employees").send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.fullName).toBe("Jane Smith");
    expect(res.body.salary).toBe(85000);
    expect(res.body.id).toBeDefined();
  });

  it("returns 400 when salary is missing", async () => {
    const { salary, ...noSalary } = validPayload;
    const res = await request(app).post("/api/v1/employees").send(noSalary);
    expect(res.status).toBe(400);
  });

  it("returns 400 when firstName is missing", async () => {
    const { firstName, ...noName } = validPayload;
    const res = await request(app).post("/api/v1/employees").send(noName);
    expect(res.status).toBe(400);
  });
});
