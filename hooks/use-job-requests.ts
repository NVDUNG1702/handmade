import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as jobRequestsApi from "@/lib/api-job-requests";
import type {
  CreateJobRequest,
  JobRequestFilters,
} from "@/lib/api-job-requests";
import type { PaginatedResult, JobRequestItem } from "@/lib/types";

// Hook để tạo job request
export function useCreateJobRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) =>
      jobRequestsApi.createJobRequest(data),
    onSuccess: () => {
      // Invalidate job requests queries
      queryClient.invalidateQueries({ queryKey: ["job-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-job-requests"] });
    },
  });
}

// Hook để lấy danh sách job requests
export function useJobRequests(params?: JobRequestFilters) {
  return useQuery<PaginatedResult<JobRequestItem>, Error>({
    queryKey: ["job-requests", params],
    queryFn: async () => {
      try {
        const response = await jobRequestsApi.getJobRequests(params);
        console.log("✅ Job requests response:", response.data);

        // Handle flexible response structure
        const responseData = response.data.data;

        if (responseData && typeof responseData === "object") {
          // If it's paginated result
          if (responseData.data && Array.isArray(responseData.data)) {
            return {
              data: responseData.data,
              total: responseData.total || responseData.data.length,
              page: responseData.page || params?.page || 1,
              limit: responseData.limit || params?.limit || 6,
              totalPages:
                responseData.totalPages ||
                Math.ceil(
                  (responseData.total || responseData.data.length) /
                    (params?.limit || 6)
                ),
              has_more: responseData.has_more || false,
            };
          }
          // If direct array
          if (Array.isArray(responseData)) {
            return {
              data: responseData,
              total: responseData.length,
              page: params?.page || 1,
              limit: params?.limit || 6,
              totalPages: Math.ceil(responseData.length / (params?.limit || 6)),
              has_more: false,
            };
          }
        }

        // Return empty data structure on error
        return {
          data: [],
          total: 0,
          page: 1,
          limit: params?.limit || 6,
          totalPages: 1,
          has_more: false,
        };
      } catch (error) {
        console.error("Error fetching job requests:", error);
        // Return empty data structure on error
        return {
          data: [],
          total: 0,
          page: 1,
          limit: params?.limit || 6,
          totalPages: 1,
          has_more: false,
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}

// Hook để lấy job request theo ID
export function useJobRequestById(id: string) {
  return useQuery({
    queryKey: ["job-request", id],
    queryFn: async () => {
      try {
        const response = await jobRequestsApi.getJobRequestById(id);
        console.log("✅ Job request by ID:", response.data);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching job request:", error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
}

// Hook để lấy job request theo path (userSlug + jobSlug)
export function useJobRequestByPath(userSlug: string, jobSlug: string) {
  return useQuery({
    queryKey: ["job-request", "by-path", userSlug, jobSlug],
    queryFn: async () => {
      const res = await jobRequestsApi.getJobRequestByPath(userSlug, jobSlug);
      return res.data.data;
    },
    enabled: Boolean(userSlug && jobSlug),
    staleTime: 60 * 1000,
  });
}

// Hook để lấy applications của job request
export function useJobRequestApplications(
  jobId?: string,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey: ["job-request", jobId, "applications", params],
    queryFn: async () => {
      if (!jobId) return { data: [], total: 0 } as any;
      const res = await jobRequestsApi.getJobRequestApplications(jobId, params);
      return res.data;
    },
    enabled: Boolean(jobId),
    staleTime: 15 * 1000,
  });
}

// Hook để cập nhật job request
export function useUpdateJobRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateJobRequest>;
    }) => jobRequestsApi.updateJobRequest(id, data),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["job-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["job-request", data.data.data?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["my-job-requests"] });
    },
  });
}

// Hook để xóa job request
export function useDeleteJobRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobRequestsApi.deleteJobRequest(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["job-request", id] });
      queryClient.invalidateQueries({ queryKey: ["job-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-job-requests"] });
    },
  });
}

// Hook để lấy job requests của user
export function useMyJobRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["my-job-requests", params],
    queryFn: async () => {
      const response = await jobRequestsApi.getMyJobRequests(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}

// Hook để lấy applications của user
export function useMyApplications(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["my-applications", params],
    queryFn: async () => {
      const response = await jobRequestsApi.getMyApplications(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}
// Hook để shortlist application
export function useShortlistApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobRequestsApi.shortlistApplication(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["job-request"] });
    },
  });
}

// Hook để select application
export function useSelectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobRequestsApi.selectApplication(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["job-request"] });
      queryClient.invalidateQueries({ queryKey: ["my-job-requests"] });
    },
  });
}

// Hook để reject application
export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      jobRequestsApi.rejectApplication(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["job-request"] });
    },
  });
}
