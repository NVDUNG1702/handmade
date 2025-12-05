import axiosInstance from "@/lib/axios-instance";
import type { ApiResponse } from "@/lib/types";
import type {
  CreateMessageRequest,
  SendMessageBySlugRequest,
  UpdateMessageRequest,
  MessageResponse,
  MessageListResponse,
  MessageQueryParams,
  MessageSearchParams,
  MessageSearchResponse,
  ConversationResponse,
  ConversationListResponse,
  ConversationQueryParams,
  CreateConversationBySlugRequest,
} from "@/lib/types-message";

// ===== MESSAGE API =====

export const messageApi = {
  // Gửi tin nhắn mới
  sendMessage: async (
    data: CreateMessageRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await axiosInstance.post("/message", data);
    return response.data;
  },

  // Gửi tin theo slug (tự tạo/lấy conversation)
  sendMessageBySlug: async (
    data: SendMessageBySlugRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await axiosInstance.post("/message/send-by-slug", data);
    return response.data;
  },

  // Lấy tin nhắn theo conversation với cursor pagination
  getConversationMessages: async (
    conversationId: string,
    params?: MessageQueryParams
  ): Promise<ApiResponse<MessageListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.last_id) queryParams.append("last_id", params.last_id);

    const response = await axiosInstance.get(
      `/message/conversation/${conversationId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Lấy replies của tin nhắn
  getMessageReplies: async (
    messageId: string,
    params?: MessageQueryParams
  ): Promise<ApiResponse<MessageListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.last_id) queryParams.append("last_id", params.last_id);

    const response = await axiosInstance.get(
      `/message/replies/${messageId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Lấy tin nhắn chưa đọc
  getUnreadMessages: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<MessageListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await axiosInstance.get(
      `/message/unread/${userId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Tìm kiếm tin nhắn
  searchMessages: async (
    userId: string,
    params: MessageSearchParams
  ): Promise<ApiResponse<MessageSearchResponse>> => {
    const queryParams = new URLSearchParams();
    queryParams.append("query", params.query);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await axiosInstance.get(
      `/message/search/${userId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Đánh dấu tin nhắn đã đọc
  markMessageAsRead: async (
    messageId: string
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await axiosInstance.put(`/message/read/${messageId}`);
    return response.data;
  },

  // Đánh dấu toàn bộ conversation đã đọc
  markConversationAsRead: async (
    conversationId: string
  ): Promise<ApiResponse<{ success: boolean; updated_count: number }>> => {
    const response = await axiosInstance.put(
      `/message/conversation/${conversationId}/read`
    );
    return response.data;
  },

  // Cập nhật tin nhắn
  updateMessage: async (
    messageId: string,
    data: UpdateMessageRequest
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await axiosInstance.put(`/message/${messageId}`, data);
    return response.data;
  },

  // Xóa tin nhắn
  deleteMessage: async (
    messageId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await axiosInstance.delete(`/message/${messageId}`);
    return response.data;
  },

  // Gửi notification
  sendNotification: async (
    receiverId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<MessageResponse>> => {
    const response = await axiosInstance.post(
      `/message/notification?receiver_id=${receiverId}&content=${encodeURIComponent(content)}`,
      metadata || {}
    );
    return response.data;
  },
};

// ===== CONVERSATION API =====

export const conversationApi = {
  // Lấy danh sách conversation
  getConversations: async (
    userId: string,
    params?: ConversationQueryParams
  ): Promise<ApiResponse<ConversationListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.order) queryParams.append("order", params.order);

    const response = await axiosInstance.get(
      `/message/conversations/${userId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Tạo conversation mới
  createConversation: async (
    data: { user1_id: string; user2_id: string }
  ): Promise<ApiResponse<ConversationResponse>> => {
    const response = await axiosInstance.post("/conversations", data);
    return response.data;
  },

  // Tạo hoặc lấy conversation theo recipient slug
  createConversationBySlug: async (
    data: CreateConversationBySlugRequest
  ): Promise<ApiResponse<ConversationResponse>> => {
    const response = await axiosInstance.post(
      "/conversation/create-by-slug",
      data
    );
    return response.data;
  },

  // Block/Unblock theo slug
  blockBySlug: async (data: {
    recipient_slug: string;
    action: "block" | "unblock";
  }): Promise<ApiResponse<ConversationResponse>> => {
    const response = await axiosInstance.post("/conversation/block-by-slug", data);
    return response.data;
  },

  // Block/Unblock theo conversation id
  blockById: async (data: {
    id: string;
    action: "block" | "unblock";
  }): Promise<ApiResponse<ConversationResponse>> => {
    const response = await axiosInstance.post(`/conversation/block/${data.id}`, {
      action: data.action,
    });
    return response.data;
  },
};
