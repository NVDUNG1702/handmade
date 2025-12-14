import axiosInstance from "@/lib/axios-instance";
import type { JobRequestItem, ApiResponse, PaginatedResult } from "@/lib/types";
import { cleanQueryParams } from "@/lib/api-utils";

export interface CreateJobRequest {
  title: string;
  description: string;
  required_skill: string;
  budget_min: number;
  budget_max: number;
  currency?: string;
  deadline?: string;
  location?: string;
  city?: string;
  district?: string;
  ward?: string;
  provinceCode?: string;
  wardCode?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  images?: string[];
  is_featured?: boolean;
  is_urgent?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface JobRequestFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  status?:
    | "OPEN"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED";
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  skill_id?: string;
  city?: string;
  district?: string;
  ward?: string;
  provinceCode?: string;
  wardCode?: string;
  radius?: number;
  lat?: number;
  lng?: number;
  budget_min?: number;
  budget_max?: number;
  is_featured?: boolean;
  is_urgent?: boolean;
  assigned_to?: string;
  created_by?: string;
}

// Tạo job request mới
export const createJobRequest = (data: CreateJobRequest) =>
  axiosInstance.post<ApiResponse<JobRequestItem>>("/job-requests", data);

// Lấy danh sách job requests
export const getJobRequests = (params?: JobRequestFilters) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobRequestItem>>>(
    "/job-requests",
    { params: cleanQueryParams(params) }
  );

// Lấy chi tiết job request
export const getJobRequestById = (id: string) =>
  axiosInstance.get<ApiResponse<JobRequestItem>>(`/job-requests/${id}`);

// Lấy chi tiết job request theo path (userSlug + jobSlug)
export const getJobRequestByPath = (userSlug: string, jobSlug: string) =>
  axiosInstance.get<ApiResponse<JobRequestItem>>(
    `/job-requests/by-path/${encodeURIComponent(userSlug)}/${encodeURIComponent(
      jobSlug
    )}`
  );

// Cập nhật job request
export const updateJobRequest = (id: string, data: Partial<CreateJobRequest>) =>
  axiosInstance.put<ApiResponse<JobRequestItem>>(`/job-requests/${id}`, data);

// Xóa job request
export const deleteJobRequest = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/job-requests/${id}`);

// Lấy danh sách job requests của user
export const getMyJobRequests = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobRequestItem>>>(
    "/job-requests/my-posted",
    { params }
  );

// Lấy danh sách applications của user
export const getMyApplications = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  axiosInstance.get<ApiResponse<PaginatedResult<any>>>(
    "/job-requests/my-applications",
    { params }
  );

// Lấy danh sách applications của job request
export const getJobRequestApplications = (
  id: string,
  params?: { page?: number; limit?: number }
) =>
  axiosInstance.get<ApiResponse<PaginatedResult<any>>>(`/job-applications`, {
    params: { job_id: id, ...(params || {}) },
  });

// Shortlist application
export const shortlistApplication = (id: string) =>
  axiosInstance.post<ApiResponse<any>>(`/job-applications/${id}/shortlist`);

// Select application (Approve)
export const selectApplication = (id: string) =>
  axiosInstance.post<ApiResponse<any>>(`/job-applications/${id}/select`);

// Reject application
export const rejectApplication = (id: string, reason: string) =>
  axiosInstance.post<ApiResponse<any>>(`/job-applications/${id}/reject`, {
    reason,
  });
