import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '../api/employees';
import type { CreateEmployeePayload, UpdateEmployeePayload, EmployeeQueryParams } from '../types';

export function useEmployeeList(params?: EmployeeQueryParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn:  () => employeesApi.list(params),
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeePayload) => employeesApi.create(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmployeePayload }) =>
      employeesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}
