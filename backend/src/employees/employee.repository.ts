import { IEmployeeRepository } from './employee.repository.interface';
import { Employee, EmployeeFilters, PaginatedEmployees } from './employee.types';
import { parsePagination, toSkipTake, buildMeta } from '../shared/pagination';

export class EmployeeRepository implements IEmployeeRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly prisma: any) {}

  async findMany(filters: EmployeeFilters): Promise<PaginatedEmployees> {
    const pagination = parsePagination({ page: filters.page, limit: filters.limit });
    const { skip, take } = toSkipTake(pagination);

    const where = {
      isActive: true,
      ...(filters.search && { fullName: { contains: filters.search } }),
      ...(filters.country && { country: filters.country }),
      ...(filters.department && { department: filters.department }),
      ...(filters.seniorityLevel && { seniorityLevel: filters.seniorityLevel })
    };

    const orderBy = filters.sortBy
      ? { [filters.sortBy]: filters.sortOrder ?? 'asc' }
      : { fullName: 'asc' as const };

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({ where, orderBy, skip, take }),
      this.prisma.employee.count({ where })
    ]);

    return { data: data as unknown as Employee[], meta: buildMeta(total, pagination) };
  }

  async findById(id: number): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    return employee as unknown as Employee | null;
  }

  async create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const employee = await this.prisma.employee.create({ data: data as never });
    return employee as unknown as Employee;
  }

  async update(
    id: number,
    data: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Employee> {
    const employee = await this.prisma.employee.update({
      where: { id },
      data: data as never
    });
    return employee as unknown as Employee;
  }

  async softDelete(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.update({
      where: { id },
      data: { isActive: false }
    });
    return employee as unknown as Employee;
  }
}
