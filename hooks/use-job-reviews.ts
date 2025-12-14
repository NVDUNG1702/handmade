import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as jobReviewsApi from "@/lib/api-job-reviews";
import {
  CreateJobReviewDto,
  UpdateJobReviewDto,
  JobReviewQueryParams,
} from "@/lib/types";
import { toast } from "sonner";

// Query keys
export const jobReviewKeys = {
  all: ["job-reviews"] as const,
  lists: () => [...jobReviewKeys.all, "list"] as const,
  list: (params: JobReviewQueryParams) => [...jobReviewKeys.lists(), params] as const,
  byJob: (jobId: string) => [...jobReviewKeys.all, "job", jobId] as const,
  byWorker: (userId: string) => [...jobReviewKeys.all, "worker", userId] as const,
  bySkill: (skillId: string) => [...jobReviewKeys.all, "skill", skillId] as const,
  detail: (id: string) => [...jobReviewKeys.all, "detail", id] as const,
  stats: (workerId: string, skillId?: string) =>
    [...jobReviewKeys.all, "stats", workerId, skillId] as const,
};

/**
 * Hook để lấy danh sách job reviews
 */
export function useJobReviews(params?: JobReviewQueryParams) {
  return useQuery({
    queryKey: jobReviewKeys.list(params || {}),
    queryFn: async () => {
      const response = await jobReviewsApi.getJobReviews(params);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}

/**
 * Hook to get reviews for a specific job
 * NOTE: Backend endpoint not yet implemented, returns empty data on 404
 */
export function useJobReviewsByJob(
  jobId: string,
  params?: JobReviewQueryParams
) {
  return useQuery({
    queryKey: ["job-reviews", "job", jobId, params],
    queryFn: async () => {
      try {
        const response = await jobReviewsApi.getJobReviewsByJob(jobId, params);
        return response.data;
      } catch (error: any) {
        // Backend endpoint not yet implemented, return empty data
        if (error?.response?.status === 404) {
          console.warn(`Job reviews endpoint not implemented yet for job ${jobId}`);
          return { data: [], total: 0, page: 1, limit: 10 };
        }
        throw error;
      }
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Hook to get reviews received by a worker
 * NOTE: Backend endpoint not yet implemented, returns empty data on 404
 */
export function useJobReviewsByWorker(
  workerId: string,
  params?: JobReviewQueryParams
) {
  return useQuery({
    queryKey: ["job-reviews", "worker", workerId, params],
    queryFn: async () => {
      try {
        const response = await jobReviewsApi.getJobReviewsByWorker(workerId, params);
        return response.data;
      } catch (error: any) {
        // Backend endpoint not yet implemented, return empty data
        if (error?.response?.status === 404) {
          console.warn(`Job reviews endpoint not implemented yet for worker ${workerId}`);
          return { data: [], total: 0, page: 1, limit: 10 };
        }
        throw error;
      }
    },
    enabled: !!workerId,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry 404 errors
  });
}

/**
 * Hook để lấy reviews theo skill
 */
export function useJobReviewsBySkill(skillId: string, params?: JobReviewQueryParams) {
  return useQuery({
    queryKey: jobReviewKeys.bySkill(skillId),
    queryFn: async () => {
      const response = await jobReviewsApi.getJobReviewsBySkill(skillId, params);
      return response.data.data;
    },
    enabled: !!skillId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook để lấy chi tiết một review
 */
export function useJobReview(id: string) {
  return useQuery({
    queryKey: jobReviewKeys.detail(id),
    queryFn: async () => {
      const response = await jobReviewsApi.getJobReviewById(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook để lấy thống kê skill của worker
 */
export function useWorkerSkillStats(workerId: string, skillId?: string) {
  return useQuery({
    queryKey: jobReviewKeys.stats(workerId, skillId),
    queryFn: async () => {
      const response = await jobReviewsApi.getWorkerSkillStats(workerId, skillId);
      return response.data.data;
    },
    enabled: !!workerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook mutation để tạo job review
 */
export function useCreateJobReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: CreateJobReviewDto }) =>
      jobReviewsApi.createJobReview(jobId, data),
    onSuccess: (response, { jobId }) => {
      toast.success("Đánh giá đã được gửi thành công");
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.byJob(jobId) });
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.byWorker(response.data.data.worker_id) });
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.lists() });
      
      if (response.data.data.skill_id) {
        queryClient.invalidateQueries({ 
          queryKey: jobReviewKeys.bySkill(response.data.data.skill_id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: jobReviewKeys.stats(response.data.data.worker_id, response.data.data.skill_id) 
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi đánh giá");
    },
  });
}

/**
 * Hook mutation để update job review
 */
export function useUpdateJobReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobReviewDto }) =>
      jobReviewsApi.updateJobReview(id, data),
    onSuccess: (response, { id }) => {
      toast.success("Đánh giá đã được cập nhật");
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.lists() });
      
      const review = response.data.data;
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.byJob(review.job_request_id) });
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.byWorker(review.worker_id) });
      
      if (review.skill_id) {
        queryClient.invalidateQueries({ queryKey: jobReviewKeys.bySkill(review.skill_id) });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể cập nhật đánh giá");
    },
  });
}

/**
 * Hook mutation để xóa job review
 */
export function useDeleteJobReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobReviewsApi.deleteJobReview(id),
    onSuccess: () => {
      toast.success("Đánh giá đã được xóa");
      
      // Invalidate all review lists
      queryClient.invalidateQueries({ queryKey: jobReviewKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể xóa đánh giá");
    },
  });
}
