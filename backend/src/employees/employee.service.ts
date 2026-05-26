import { IEmployeeRepository } from "./employee.repository.interface";
import {
  EmployeeFilters,
  PaginatedEmployees,
  Employee,
} from "./employee.types";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "./employee.validator";
import { NotFoundError, ValidationError } from "../shared/errors";
import { ZodError } from "zod";

export class EmployeeService {
  constructor(private readonly repositary: IEmployeeRepository) {}

  async createEmployee(input: unknown): Promise<Employee> {
    const data = this.parseOrThrow(createEmployeeSchema, input);
    return this.repositary.create({
      ...data,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      isActive: true,
    });
  }

  private parseOrThrow<T>(
    schema: {
      safeParse: (
        v: unknown,
      ) => { success: true; data: T } | { success: false; error: ZodError };
    },
    input: unknown,
  ): T {
    const result = schema.safeParse(input);
    if (!result.success) {
      throw new ValidationError(
        result.error.issues.map((e) => e.message).join(","),
      );
    }
    return result.data;
  }
}
