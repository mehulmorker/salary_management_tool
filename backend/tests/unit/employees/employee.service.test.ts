import { IEmployeeRepository } from "@/employees/employee.repository.interface";
import { Employee } from "@/employees/employee.types";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { EmployeeService } from "@/employees/employee.service";

const mockEmployee: Employee = {
  id: 1,
  fullName: "Jane Smith",
  firstName: "Jane",
  lastName: "Smith",
  jobTitle: "Software Engineer",
  department: "Engineering",
  country: "India",
  countryCode: "IN",
  salary: 85000,
  currency: "USD",
  employmentType: "FULL_TIME",
  seniorityLevel: "MID",
  hireDate: new Date(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo: jest.Mocked<IEmployeeRepository> = {
  findMany: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe("EmployeeService", () => {
  let service: EmployeeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmployeeService(mockRepo);
  });

  describe("createEmployee", () => {
    const validInput = {
      firstName: "Jane",
      lastName: "Smith",
      jobTitle: "Software Engineer",
      department: "Engineering",
      country: "India",
      countryCode: "IN",
      salary: 85000,
    };

    it("calls repositary.create with derived fullName", async () => {
      mockRepo.create.mockResolvedValue(mockEmployee);
      await service.createEmployee(validInput);
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: "Jane Smith" }),
      );
    });
  });
});
