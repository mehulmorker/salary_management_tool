import { z } from "zod";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT_TYPE"] as const;
const SENIORITY_LEVELS = ["JUNIOR", "MID", "SENIOR", "LEAD", "EXEC"] as const;

export const createEmployeeSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    department: z.string().min(1, "Department is required"),
    country: z.string().min(1, "Country is required"),
    countryCode: z.string().min(2).max(2),
    salary: z.number().positive("Salary must be positive"),
    currency: z.string().optional().default("USD"),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional().default("FULL_TIME"),
    seniorityLevel: z.enum(SENIORITY_LEVELS).optional().default("MID"),
    hireDate: z.iso.datetime().optional(),
  })
  .transform((data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
  }));

export const updateEmployeeSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    jobTitle: z.string().min(1).optional(),
    department: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    countryCode: z.string().min(2).max(2).optional(),
    salary: z.number().positive("Salary must be positive").optional(),
    currency: z.string().optional(),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    seniorityLevel: z.enum(SENIORITY_LEVELS).optional(),
    hireDate: z.iso.datetime().optional(),
  })
  .transform((data): typeof data & { fullName?: string } => {
    if (data.firstName && data.lastName) {
      return { ...data, fullName: `${data.firstName} ${data.lastName}` };
    }
    return data;
  });

export const employeeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  country: z.string().optional(),
  department: z.string().optional(),
  seniorityLevel: z.enum(SENIORITY_LEVELS).optional(),
  sortBy: z.enum(["salary", "fullName", "hireDate"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeQueryInput = z.infer<typeof employeeQuerySchema>;
