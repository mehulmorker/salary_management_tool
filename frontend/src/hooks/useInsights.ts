import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights';

export function useSummary() {
  return useQuery({
    queryKey: ['insights', 'summary'],
    queryFn:  () => insightsApi.getSummary(),
  });
}

export function useByCountry() {
  return useQuery({
    queryKey: ['insights', 'by-country'],
    queryFn:  () => insightsApi.getByCountry(),
  });
}

export function useByJobTitle(country?: string) {
  return useQuery({
    queryKey: ['insights', 'by-job-title', country],
    queryFn:  () => insightsApi.getByJobTitle(country),
    enabled:  !!country,
  });
}

export function useByDepartment() {
  return useQuery({
    queryKey: ['insights', 'by-department'],
    queryFn:  () => insightsApi.getByDepartment(),
  });
}

export function useBySeniority() {
  return useQuery({
    queryKey: ['insights', 'by-seniority'],
    queryFn:  () => insightsApi.getBySeniority(),
  });
}

export function useTopEarners(n = 10, country?: string) {
  return useQuery({
    queryKey: ['insights', 'top-earners', n, country],
    queryFn:  () => insightsApi.getTopEarners(n, country),
  });
}

export function useDistribution(bucketSize = 10000, country?: string) {
  return useQuery({
    queryKey: ['insights', 'distribution', bucketSize, country],
    queryFn:  () => insightsApi.getDistribution(bucketSize, country),
  });
}
