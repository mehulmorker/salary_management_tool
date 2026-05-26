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

describe("GET /api/v1/employees", () => {
  it("returns paginated list of active employees", async () => {
    await request(app).post("/api/v1/employees").send(validPayload);
    await request(app).post("/api/v1/employees").send({
      ...validPayload,
      firstName: "John",
      lastName: "Doe",
    });
    const res = await request(app).get("/api/v1/employees");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.total).toBe(2);
  });

  it("filters by country", async () => {
    await request(app).post("/api/v1/employees").send(validPayload); // country: India
    await request(app).post("/api/v1/employees").send({
      ...validPayload,
      firstName: "Alice",
      lastName: "Wang",
      country: "China",
      countryCode: "CN",
    });
    const res = await request(app).get("/api/v1/employees?country=India");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].country).toBe("India");
  });

  it("does not return inactive employees", async () => {
    const created = await request(app)
      .post("/api/v1/employees")
      .send(validPayload);
    await request(app).delete(`/api/v1/employees/${created.body.id}`);
    const res = await request(app).get("/api/v1/employees");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe("GET /api/v1/employees/:id", () => {
  it("returns employee by id", async () => {
    const created = await request(app)
      .post("/api/v1/employees")
      .send(validPayload);
    const res = await request(app).get(`/api/v1/employees/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("Jane Smith");
  });

  it("returns 404 for nonexistent employee", async () => {
    const res = await request(app).get("/api/v1/employees/999999");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/v1/employees/:id", () => {
  it("updates only provided fields", async () => {
    const created = await request(app)
      .post("/api/v1/employees")
      .send(validPayload);
    const res = await request(app)
      .put(`/api/v1/employees/${created.body.id}`)
      .send({ salary: 95000 });
    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(95000);
    expect(res.body.firstName).toBe("Jane"); // unchanged
  });
});

describe("DELETE /api/v1/employees/:id", () => {
  it("soft-deletes employee (sets isActive=false)", async () => {
    const created = await request(app)
      .post("/api/v1/employees")
      .send(validPayload);
    const res = await request(app).delete(
      `/api/v1/employees/${created.body.id}`
    );
    expect(res.status).toBe(200);
    expect(res.body.isActive).toBe(false);
  });
});
