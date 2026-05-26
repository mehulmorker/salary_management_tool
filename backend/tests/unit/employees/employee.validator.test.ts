import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/employees/employees.validator";

const validPayload = {
  firstName: "Jane",
  lastName: "Smith",
  jobTitle: "Software Engineer",
  department: "Engineering",
  country: "India",
  countryCode: "IN",
  salary: 85000,
};

describe("createEmployeeSchema", () => {
  it("accept fully valid payload", () => {
    const result = createEmployeeSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("derive fullName from firstName + lastName", () => {
    const result = createEmployeeSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Smith");
    }
  });

  it("rejects missing firstName", () => {
    const result = createEmployeeSchema.safeParse({
      validPayload,
      firstName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non positive salary", () => {
    const result = createEmployeeSchema.safeParse({
      validPayload,
      salary: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative salary", () => {
    const result = createEmployeeSchema.safeParse({
      validPayload,
      salary: -1000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid employementType", () => {
    const result = createEmployeeSchema.safeParse({
      validPayload,
      employementType: "FREELANCE",
    });
    expect(result.success).toBe(false);
  });

  it("defaults seniorityLevel to MID", () => {
    const result = createEmployeeSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.seniorityLevel).toBe("MID");
  });
});

describe("updateEmployeeSchema", () => {
  it("accepts partial payload", () => {
    const result = updateEmployeeSchema.safeParse({ salary: 90000 });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive salary in update", () => {
    const result = updateEmployeeSchema.safeParse({ salary: 0 });
    expect(result.success).toBe(true);
  });

  it("rejects non-positive salary in update", () => {
    const result = updateEmployeeSchema.safeParse({ salary: 0 });
    expect(result.success).toBe(false);
  });

  it("derives fullName when both firstName and lastName provided", () => {
    const result = updateEmployeeSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fullName).toBe("John Doe");
  });

  it("does not set fullName when only firstName provided", () => {
    const result = updateEmployeeSchema.safeParse({ firstName: "John" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fullName).toBeUndefined();
  });
});
