import axiosInstance from "./axios-instance";

// ==================== TYPES ====================

export interface CreateJobApplicationDto {
  job_id: string;
  proposal: string;
  price: number;
  delivery_time: number;
  message?: string;
  currency?: string;
  experience_years?: number;
  portfolio_items?: string[];
  skills?: string[];
}

export interface UpdateJobApplicationDto {
  message?: string;
  proposed_budget?: number;
  estimated_completion_days?: number;
  portfolio_links?: string[];
}

export interface JobApplicationUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export interface JobApplicationItem {
  id: string;
  job_id: string;
  craftsman_id: string;
  craftsman?: JobApplicationUser;
  message: string;
  proposed_budget?: number;
  estimated_completion_days?: number;
  portfolio_links?: string[];
  status: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED" | "WITHDRAWN";
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationListResponse {
  code: number;
  message: string;
  data: {
    applications: JobApplicationItem[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  };
}

export interface JobApplicationResponse {
  code: number;
  message: string;
  data: JobApplicationItem;
}

export interface JobApplicationQueryParams {
  page?: number;
  limit?: number;
  job_id?: string;
  craftsman_id?: string;
  status?: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED" | "WITHDRAWN";
}

// ==================== API CLIENT ====================

export const jobApplicationApi = {
  /**
   * Tạo application mới (thợ apply job)
   */
  create: async (
    data: CreateJobApplicationDto
  ): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.post<JobApplicationResponse>(
      "/job-applications",
      data
    );
    return response.data;
  },

  /**
   * Lấy danh sách applications với filter và pagination
   */
  getApplications: async (
    params?: JobApplicationQueryParams
  ): Promise<JobApplicationListResponse> => {
    const response = await axiosInstance.get<JobApplicationListResponse>(
      "/job-applications",
      { params }
    );
    return response.data;
  },

  /**
   * Lấy applications của mình (craftsman)
   */
  getMyApplications: async (
    page = 1,
    limit = 20,
    status?: string
  ): Promise<JobApplicationListResponse> => {
    const params: any = { page, limit };
    if (status) params.status = status;

    const response = await axiosInstance.get<JobApplicationListResponse>(
      "/job-applications",
      { params }
    );
    return response.data;
  },

  /**
   * Lấy applications cho một job cụ thể (job owner)
   */
  getJobApplications: async (
    jobId: string,
    page = 1,
    limit = 20,
    status?: string
  ): Promise<JobApplicationListResponse> => {
    const params: any = { job_id: jobId, page, limit };
    if (status) params.status = status;

    const response = await axiosInstance.get<JobApplicationListResponse>(
      "/job-applications",
      { params }
    );
    return response.data;
  },

  /**
   * Lấy chi tiết một application
   */
  getApplicationDetail: async (id: string): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.get<JobApplicationResponse>(
      `/job-applications/${id}`
    );
    return response.data;
  },

  /**
   * Cập nhật application (craftsman)
   */
  update: async (
    id: string,
    data: UpdateJobApplicationDto
  ): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.put<JobApplicationResponse>(
      `/job-applications/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Xóa application (craftsman)
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/job-applications/${id}`);
  },

  /**
   * Shortlist application (job owner)
   */
  shortlist: async (id: string): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.post<JobApplicationResponse>(
      `/job-applications/${id}/shortlist`
    );
    return response.data;
  },

  /**
   * Select craftsman (job owner chọn thợ)
   */
  select: async (id: string): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.post<JobApplicationResponse>(
      `/job-applications/${id}/select`
    );
    return response.data;
  },

  /**
   * Reject application (job owner từ chối)
   */
  reject: async (
    id: string,
    reason: string
  ): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.post<JobApplicationResponse>(
      `/job-applications/${id}/reject`,
      { reason }
    );
    return response.data;
  },

  /**
   * Withdraw application (craftsman rút application)
   */
  withdraw: async (id: string): Promise<JobApplicationResponse> => {
    const response = await axiosInstance.post<JobApplicationResponse>(
      `/job-applications/${id}/withdraw`
    );
    return response.data;
  },

  /**
   * Check if user has applied to a job
   */
  checkApplied: async (
    jobId: string
  ): Promise<{ applied: boolean; application?: JobApplicationItem }> => {
    try {
      const response = await jobApplicationApi.getMyApplications(1, 100);
      const application = response.data.applications.find(
        (app) => app.job_id === jobId && app.status !== "WITHDRAWN"
      );
      return {
        applied: !!application,
        application,
      };
    } catch (error) {
      return { applied: false };
    }
  },
};

export default jobApplicationApi;
