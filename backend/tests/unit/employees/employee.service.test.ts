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

    it("throws ValidationError when salary is zero", async () => {
      await expect(
        service.createEmployee({ ...validInput, salary: 0 }),
      ).rejects.toThrow(ValidationError);
    });

    it("throws ValidationError when firstName is empty", async () => {
      await expect(
        service.createEmployee({ ...validInput, firstName: "" }),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getEmployeeById", () => {
    it("returns employee when found", async () => {
      mockRepo.findById.mockResolvedValue(mockEmployee);
      const result = await service.getEmployeeById(1);
      expect(result).toEqual(mockEmployee);
    });

    it("throws NotFoundError when employee does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getEmployeeById(1)).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateEmployee", () => {
    it("calls repository.update with merged fields", async () => {
      mockRepo.findById.mockResolvedValue(mockEmployee);
      mockRepo.update.mockResolvedValue({ ...mockEmployee, salary: 90000 });
      await service.updateEmployee(1, { salary: 90000 });
      expect(mockRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ salary: 90000 }),
      );
    });

    it("throws NotFoundError when employee does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(
        service.updateEmployee(99, { salary: 90000 }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteEmployee", () => {
    it("calls softDelete, never hardDelete", async () => {
      mockRepo.findById.mockResolvedValue(mockEmployee);
      mockRepo.softDelete.mockResolvedValue({
        ...mockEmployee,
        isActive: false,
      });
      await service.deleteEmployee(1);
      expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when employee does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.deleteEmployee(99)).rejects.toThrow(NotFoundError);
    });
  });

  describe("listEmplyees", () => {
    it("passes filters to repositary.findMany", async () => {
      const paginated = {
        data: [mockEmployee],
        meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
      };

      mockRepo.findMany.mockResolvedValue(paginated);

      await service.listEmployees({ country: "India", page: 1, limit: 50 });

      expect(mockRepo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ country: "India" }),
      );
    });
  });
});
