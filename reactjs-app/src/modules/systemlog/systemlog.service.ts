
import apiClient from '../../libs/api-client';
import type { SystemLog } from './systemlog.type';

export interface SystemLogFilter {
  actor?: string;
  status?: string;
  start?: string;
  end?: string;
}

export async function fetchSystemLogsWithFilter(filter: SystemLogFilter): Promise<SystemLog[]> {
  const params: Record<string, string> = {};
  if (filter.actor) params.actor = filter.actor;
  if (filter.status) params.status = filter.status;
  if (filter.start) params.start = filter.start;
  if (filter.end) params.end = filter.end;
  const query = new URLSearchParams(params).toString();
  const url = query ? `/system-logs?${query}` : '/system-logs';
  const res = await apiClient.get(url);
  if (Array.isArray(res)) return res as SystemLog[];
  if (res && Array.isArray(res.data)) return res.data as SystemLog[];
  return [];
}



export interface SystemLogPagedResponse {
  data: SystemLog[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export async function fetchSystemLogsPaged(page: number = 0, size: number = 10): Promise<SystemLogPagedResponse> {
  const response = await apiClient.get(`/system-logs?page=${page}&size=${size}`);

  return {
    data: response.data ?? [],             // không cần .data nữa
    pageNumber: response.pageNumber ?? 0,
    pageSize: response.pageSize ?? size,
    totalRecords: response.totalRecords ?? 0,
    totalPages: response.totalPages ?? 0,
    hasNext: response.hasNext ?? false,
    hasPrevious: response.hasPrevious ?? false,
  };
}



