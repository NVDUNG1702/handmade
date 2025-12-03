import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  jobApplicationApi,
  type CreateJobApplicationDto,
  type UpdateJobApplicationDto,
  type JobApplicationQueryParams,
} from "@/lib/api-job-application";
import { toast } from "./use-toast";

// ==================== QUERY KEYS ====================
export const JOB_APPLICATION_KEYS = {
  all: ["job-applications"] as const,
  lists: () => [...JOB_APPLICATION_KEYS.all, "list"] as const,
  list: (params: JobApplicationQueryParams) =>
    [...JOB_APPLICATION_KEYS.lists(), params] as const,
  myApplications: (page: number, limit: number, status?: string) =>
    [...JOB_APPLICATION_KEYS.all, "my", { page, limit, status }] as const,
  jobApplications: (
    jobId: string,
    page: number,
    limit: number,
    status?: string
  ) =>
    [
      ...JOB_APPLICATION_KEYS.all,
      "job",
      jobId,
      { page, limit, status },
    ] as const,
  detail: (id: string) => [...JOB_APPLICATION_KEYS.all, "detail", id] as const,
  checkApplied: (jobId: string) =>
    [...JOB_APPLICATION_KEYS.all, "check-applied", jobId] as const,
};

// ==================== QUERIES ====================

/**
 * Hook để lấy applications của mình (craftsman view)
 */
export function useMyApplications(
  page = 1,
  limit = 20,
  status?: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED" | "WITHDRAWN"
) {
  return useQuery({
    queryKey: JOB_APPLICATION_KEYS.myApplications(page, limit, status),
    queryFn: () => jobApplicationApi.getMyApplications(page, limit, status),
  });
}

/**
 * Hook để lấy applications cho một job (job owner view)
 */
export function useJobApplications(
  jobId: string,
  page = 1,
  limit = 20,
  status?: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED" | "WITHDRAWN"
) {
  return useQuery({
    queryKey: JOB_APPLICATION_KEYS.jobApplications(jobId, page, limit, status),
    queryFn: () =>
      jobApplicationApi.getJobApplications(jobId, page, limit, status),
    enabled: !!jobId,
  });
}

/**
 * Hook để lấy chi tiết application
 */
export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: JOB_APPLICATION_KEYS.detail(id),
    queryFn: () => jobApplicationApi.getApplicationDetail(id),
    enabled: !!id,
  });
}

/**
 * Hook để check xem đã apply job chưa
 */
export function useCheckApplied(jobId: string) {
  return useQuery({
    queryKey: JOB_APPLICATION_KEYS.checkApplied(jobId),
    queryFn: () => jobApplicationApi.checkApplied(jobId),
    enabled: !!jobId,
  });
}

// ==================== MUTATIONS ====================

/**
 * Hook để tạo application mới (apply job)
 */
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobApplicationDto) =>
      jobApplicationApi.create(data),
    onSuccess: (response, variables) => {
      // Invalidate my applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.myApplications(1, 20),
      });

      // Invalidate check applied for this job
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.checkApplied(variables.job_id),
      });

      // Invalidate job detail (to update application count)
      queryClient.invalidateQueries({
        queryKey: ["jobs", "detail", variables.job_id],
      });

      toast({
        title: "Thành công",
        description: "Đã gửi đơn ứng tuyển thành công!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể gửi đơn ứng tuyển. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để cập nhật application
 */
export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobApplicationDto }) =>
      jobApplicationApi.update(id, data),
    onSuccess: (response) => {
      // Invalidate application detail
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.detail(response.data.id),
      });

      // Invalidate my applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.myApplications(1, 20),
      });

      toast({
        title: "Thành công",
        description: "Đã cập nhật đơn ứng tuyển thành công!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể cập nhật đơn ứng tuyển. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để xóa application
 */
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApplicationApi.delete(id),
    onSuccess: () => {
      // Invalidate my applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.myApplications(1, 20),
      });

      toast({
        title: "Thành công",
        description: "Đã xóa đơn ứng tuyển thành công!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể xóa đơn ứng tuyển. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để shortlist application (job owner)
 */
export function useShortlistApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApplicationApi.shortlist(id),
    onSuccess: (response) => {
      // Invalidate application detail
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.detail(response.data.id),
      });

      // Invalidate job applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.jobApplications(
          response.data.job_id,
          1,
          20
        ),
      });

      toast({
        title: "Thành công",
        description: "Đã thêm vào danh sách ngắn!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể thêm vào danh sách ngắn. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để select application (job owner chọn thợ)
 */
export function useSelectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApplicationApi.select(id),
    onSuccess: (response) => {
      // Invalidate application detail
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.detail(response.data.id),
      });

      // Invalidate job applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.jobApplications(
          response.data.job_id,
          1,
          20
        ),
      });

      // Invalidate job detail (status might change)
      queryClient.invalidateQueries({
        queryKey: ["jobs", "detail", response.data.job_id],
      });

      toast({
        title: "Thành công",
        description: "Đã chọn thợ thành công!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể chọn thợ. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để reject application (job owner từ chối)
 */
export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      jobApplicationApi.reject(id, reason),
    onSuccess: (response) => {
      // Invalidate application detail
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.detail(response.data.id),
      });

      // Invalidate job applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.jobApplications(
          response.data.job_id,
          1,
          20
        ),
      });

      toast({
        title: "Thành công",
        description: "Đã từ chối đơn ứng tuyển!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể từ chối đơn ứng tuyển. Vui lòng thử lại!",
      });
    },
  });
}

/**
 * Hook để withdraw application (craftsman rút đơn)
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApplicationApi.withdraw(id),
    onSuccess: (response) => {
      // Invalidate application detail
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.detail(response.data.id),
      });

      // Invalidate my applications list
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.myApplications(1, 20),
      });

      // Invalidate check applied
      queryClient.invalidateQueries({
        queryKey: JOB_APPLICATION_KEYS.checkApplied(response.data.job_id),
      });

      toast({
        title: "Thành công",
        description: "Đã rút đơn ứng tuyển!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message ||
          "Không thể rút đơn ứng tuyển. Vui lòng thử lại!",
      });
    },
  });
}
