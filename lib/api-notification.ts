import axiosInstance from "@/lib/axios-instance";
import type { ApiResponse } from "@/lib/types";
import type {
  NotificationResponse,
  NotificationListResponse,
  NotificationStatsResponse,
  NotificationQueryParams,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationIdsRequest,
  MarkAsReadResponse,
} from "@/lib/types-notification";

const BASE_PATH = "/notifications";

export const notificationApi = {
  /**
   * Lấy danh sách thông báo với phân trang và filter
   */
  getNotifications: async (
    params?: NotificationQueryParams
  ): Promise<ApiResponse<NotificationListResponse>> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.tag) queryParams.append("tag", params.tag);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
    if (params?.unread_only !== undefined)
      queryParams.append("unread_only", params.unread_only.toString());
    if (params?.broadcast_only !== undefined)
      queryParams.append("broadcast_only", params.broadcast_only.toString());
    if (params?.read !== undefined)
      queryParams.append("read", params.read.toString());

    const url = `${BASE_PATH}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Lấy thông báo chưa đọc
   */
  getUnreadNotifications: async (
    limit: number = 10
  ): Promise<ApiResponse<NotificationResponse[]>> => {
    const response = await axiosInstance.get(
      `${BASE_PATH}/unread?limit=${limit}`
    );
    return response.data;
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async (): Promise<ApiResponse<{ unread_count: number }>> => {
    const response = await axiosInstance.get(`${BASE_PATH}/unread-count`);
    return response.data;
  },

  /**
   * Lấy thống kê thông báo
   */
  getStats: async (): Promise<ApiResponse<NotificationStatsResponse>> => {
    const response = await axiosInstance.get(`${BASE_PATH}/stats`);
    return response.data;
  },

  /**
   * Lấy thông báo theo ID
   */
  getNotificationById: async (
    id: string
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Lấy thông báo theo loại
   */
  getNotificationsByType: async (
    type: string,
    status?: string
  ): Promise<ApiResponse<NotificationResponse[]>> => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);

    const url = `${BASE_PATH}/type/${type}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Lấy thông báo broadcast
   */
  getBroadcastNotifications: async (
    status?: string,
    limit: number = 20
  ): Promise<ApiResponse<NotificationResponse[]>> => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    queryParams.append("limit", limit.toString());

    const url = `${BASE_PATH}/broadcast?${queryParams.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  /**
   * Tạo thông báo mới (Admin/System)
   */
  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  },

  /**
   * Tạo thông báo cho nhiều người nhận (Admin/System)
   */
  createMultipleNotifications: async (data: {
    title: string;
    message?: string;
    type?: string;
    priority?: string;
    icon_url?: string;
    image_url?: string;
    action_url?: string;
    action_text?: string;
    data?: Record<string, unknown>;
    tags?: string[];
    expires_at?: string;
    is_silent?: boolean;
    sender_id?: string;
    recipient_ids: string[];
  }): Promise<ApiResponse<NotificationResponse[]>> => {
    const response = await axiosInstance.post(`${BASE_PATH}/multiple`, data);
    return response.data;
  },

  /**
   * Tạo thông báo broadcast (Admin/System)
   */
  createBroadcastNotification: async (data: {
    title: string;
    message?: string;
    type?: string;
    priority?: string;
    icon_url?: string;
    image_url?: string;
    action_url?: string;
    action_text?: string;
    data?: Record<string, unknown>;
    tags?: string[];
    expires_at?: string;
    is_silent?: boolean;
    sender_id?: string;
  }): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.post(`${BASE_PATH}/broadcast`, data);
    return response.data;
  },

  /**
   * Cập nhật thông báo
   */
  updateNotification: async (
    id: string,
    data: UpdateNotificationRequest
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Xóa thông báo
   */
  deleteNotification: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Đánh dấu thông báo đã đọc
   */
  markAsRead: async (
    id: string
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.post(`${BASE_PATH}/${id}/read`);
    return response.data;
  },

  /**
   * Đánh dấu nhiều thông báo đã đọc
   */
  markMultipleAsRead: async (
    ids: string[]
  ): Promise<ApiResponse<MarkAsReadResponse>> => {
    const response = await axiosInstance.post(`${BASE_PATH}/read/multiple`, {
      ids,
    });
    return response.data;
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async (
    type?: string
  ): Promise<ApiResponse<MarkAsReadResponse>> => {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append("type", type);

    const url = `${BASE_PATH}/read/all${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axiosInstance.post(url);
    return response.data;
  },

  /**
   * Đánh dấu thông báo đã lưu trữ
   */
  markAsArchived: async (
    id: string
  ): Promise<ApiResponse<NotificationResponse>> => {
    const response = await axiosInstance.post(`${BASE_PATH}/${id}/archive`);
    return response.data;
  },

  /**
   * Test endpoint (Admin)
   */
  testNotification: async (): Promise<
    ApiResponse<{ message: string; timestamp: string }>
  > => {
    const response = await axiosInstance.post(`${BASE_PATH}/admin/test`);
    return response.data;
  },
};
