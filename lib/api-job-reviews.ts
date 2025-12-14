import axiosInstance from "@/lib/axios-instance";
import { API_CONSTANTS } from "@/lib/api-constants";
import {
  ApiResponse,
  PaginatedResult,
  JobReview,
  CreateJobReviewDto,
  UpdateJobReviewDto,
  JobReviewQueryParams,
  WorkerSkillStats,
} from "@/lib/types";

/**
 * Create a new job review
 */
export const createJobReview = (jobId: string, data: CreateJobReviewDto) =>
  axiosInstance.post<ApiResponse<JobReview>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.CREATE.replace(":jobId", jobId),
    data
  );

/**
 * Get all job reviews with filters
 */
export const getJobReviews = (params?: JobReviewQueryParams) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobReview>>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.LIST,
    { params }
  );

/**
 * Get reviews for a specific job
 */
export const getJobReviewsByJob = (jobId: string, params?: JobReviewQueryParams) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobReview>>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.BY_JOB.replace(":jobId", jobId),
    { params }
  );

/**
 * Get reviews received by a worker
 */
export const getJobReviewsByWorker = (
  userId: string,
  params?: JobReviewQueryParams
) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobReview>>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.BY_WORKER.replace(":userId", userId),
    { params }
  );

/**
 * Get reviews for a specific skill
 */
export const getJobReviewsBySkill = (
  skillId: string,
  params?: JobReviewQueryParams
) =>
  axiosInstance.get<ApiResponse<PaginatedResult<JobReview>>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.BY_SKILL.replace(":skillId", skillId),
    { params }
  );

/**
 * Get a single review by ID
 */
export const getJobReviewById = (id: string) =>
  axiosInstance.get<ApiResponse<JobReview>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.DETAIL.replace(":id", id)
  );

/**
 * Update a job review
 */
export const updateJobReview = (id: string, data: UpdateJobReviewDto) =>
  axiosInstance.put<ApiResponse<JobReview>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.UPDATE.replace(":id", id),
    data
  );

/**
 * Delete a job review (soft delete)
 */
export const deleteJobReview = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(
    API_CONSTANTS.ENDPOINTS.JOB_REVIEWS.DELETE.replace(":id", id)
  );

/**
 * Get worker skill statistics
 */
export const getWorkerSkillStats = (workerId: string, skillId?: string) => {
  const params = skillId ? { skill_id: skillId } : {};
  return axiosInstance.get<ApiResponse<WorkerSkillStats>>(
    `/users/${workerId}/skills/stats`,
    { params }
  );
};
