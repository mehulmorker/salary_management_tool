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
  constructor(private readonly repository: IEmployeeRepository) {}

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.repository.findById(id);
    if (!employee) throw new NotFoundError("Employee", id);
    return employee;
  }

  async listEmployees(filters: EmployeeFilters): Promise<PaginatedEmployees> {
    return this.repository.findMany(filters);
  }

  async createEmployee(input: unknown): Promise<Employee> {
    const data = this.parseOrThrow(createEmployeeSchema, input);
    return this.repository.create({
      ...data,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      isActive: true,
    });
  }

  async updateEmployee(id: number, input: unknown): Promise<Employee> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError("Employee", id);

    const { hireDate, ...rest } = this.parseOrThrow(
      updateEmployeeSchema,
      input,
    );
    return this.repository.update(id, {
      ...rest,
      ...(hireDate ? { hireDate: new Date(hireDate) } : {}),
    });
  }

  async deleteEmployee(id: number): Promise<Employee> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError("Employee", id);
    return this.repository.softDelete(id);
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
