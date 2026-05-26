import {
  Employee,
  EmployeeFilters,
  PaginatedEmployees,
} from "./employee.types";

export interface IEmployeeRepository {
  findMany(filters: EmployeeFilters): Promise<PaginatedEmployees>;
  findById(id: number): Promise<Employee | null>;
  create(
    data: Omit<Employee, "id" | "createdAt" | "updatedAt">,
  ): Promise<Employee>;
  update(
    id: number,
    data: Partial<Omit<Employee, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Employee>;
  softDelete(id: number): Promise<Employee>;
}
