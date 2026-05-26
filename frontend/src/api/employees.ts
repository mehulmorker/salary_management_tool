import { apiClient } from './client';
import type {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  PaginatedResponse,
  EmployeeQueryParams,
} from '../types';

export const employeesApi = {
  list(params?: EmployeeQueryParams): Promise<PaginatedResponse<Employee>> {
    return apiClient.get('/employees', { params }).then(r => r.data);
  },

  getById(id: number): Promise<Employee> {
    return apiClient.get(`/employees/${id}`).then(r => r.data);
  },

  create(data: CreateEmployeePayload): Promise<Employee> {
    return apiClient.post('/employees', data).then(r => r.data);
  },

  update(id: number, data: UpdateEmployeePayload): Promise<Employee> {
    return apiClient.put(`/employees/${id}`, data).then(r => r.data);
  },

  delete(id: number): Promise<Employee> {
    return apiClient.delete(`/employees/${id}`).then(r => r.data);
  },
};
