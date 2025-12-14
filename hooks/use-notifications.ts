import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { notificationApi } from "@/lib/api-notification";
import { messageSocket } from "@/lib/message-socket";
import type {
  NotificationQueryParams,
  CreateNotificationRequest,
  UpdateNotificationRequest,
} from "@/lib/types-notification";
import { toast } from "sonner";

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params?: NotificationQueryParams) =>
    [...notificationKeys.lists(), params] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
  stats: () => [...notificationKeys.all, "stats"] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  byType: (type: string, status?: string) =>
    [...notificationKeys.all, "type", type, status] as const,
  broadcast: (status?: string, limit?: number) =>
    [...notificationKeys.all, "broadcast", status, limit] as const,
};

/**
 * Hook lấy danh sách thông báo với phân trang và filter
 */
export function useNotifications(params?: NotificationQueryParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: async () => {
      const response = await notificationApi.getNotifications(params);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải thông báo");
      }
      return response.data;
    },
    staleTime: 30000, // 30s
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}

/**
 * Hook lấy thông báo chưa đọc
 * WebSocket sẽ trigger invalidation khi có notification mới
 */
export function useUnreadNotifications(limit: number = 10) {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async () => {
      const response = await notificationApi.getUnreadNotifications(limit);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải thông báo chưa đọc");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    refetchInterval: false, // ❌ DISABLE polling - dùng WS
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

/**
 * Hook lấy số lượng thông báo chưa đọc
 * Sử dụng WebSocket để realtime updates, không polling
 */
export function useUnreadCount() {
  const queryClient = useQueryClient();

  // Listen WebSocket notification events
  useEffect(() => {
    const handleNewNotification = (data: any) => {
      console.log('🔔 [Notifications] New notification received, invalidating count');
      // Invalidate unread count để refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };

    // Subscribe to notification events
    messageSocket.on('notification:new', handleNewNotification);

    return () => {
      // Cleanup listener
      messageSocket.off('notification:new', handleNewNotification);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      if (response.code !== 0) {
        throw new Error(
          response.message || "Lỗi khi tải số thông báo chưa đọc"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút - Cache lâu vì có WS realtime
    gcTime: 10 * 60 * 1000, // 10 phút
    refetchInterval: false, // ❌ DISABLE polling - dùng WS
    refetchOnWindowFocus: false, // Không refetch khi focus
    refetchOnReconnect: true, // Refetch khi reconnect network
  });
}

/**
 * Hook lấy thống kê thông báo
 */
export function useNotificationStats() {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: async () => {
      const response = await notificationApi.getStats();
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải thống kê thông báo");
      }
      return response.data;
    },
    staleTime: 60000, // 1 phút
  });
}

/**
 * Hook lấy chi tiết thông báo
 */
export function useNotificationDetail(id: string) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: async () => {
      const response = await notificationApi.getNotificationById(id);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải chi tiết thông báo");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook lấy thông báo theo loại
 */
export function useNotificationsByType(type: string, status?: string) {
  return useQuery({
    queryKey: notificationKeys.byType(type, status),
    queryFn: async () => {
      const response = await notificationApi.getNotificationsByType(
        type,
        status
      );
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải thông báo theo loại");
      }
      return response.data;
    },
    enabled: !!type,
  });
}

/**
 * Hook lấy thông báo broadcast
 */
export function useBroadcastNotifications(status?: string, limit: number = 20) {
  return useQuery({
    queryKey: notificationKeys.broadcast(status, limit),
    queryFn: async () => {
      const response = await notificationApi.getBroadcastNotifications(
        status,
        limit
      );
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tải thông báo broadcast");
      }
      return response.data;
    },
  });
}

/**
 * Hook đánh dấu thông báo đã đọc
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationApi.markAsRead(id);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi đánh dấu đã đọc");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi đánh dấu đã đọc");
    },
  });
}

/**
 * Hook đánh dấu nhiều thông báo đã đọc
 */
export function useMarkMultipleAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await notificationApi.markMultipleAsRead(ids);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi đánh dấu đã đọc");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
      toast.success(`Đã đánh dấu ${data.count} thông báo là đã đọc`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi đánh dấu đã đọc");
    },
  });
}

/**
 * Hook đánh dấu tất cả thông báo đã đọc
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type?: string) => {
      const response = await notificationApi.markAllAsRead(type);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi đánh dấu tất cả đã đọc");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success(`Đã đánh dấu ${data.count} thông báo là đã đọc`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi đánh dấu tất cả đã đọc");
    },
  });
}

/**
 * Hook đánh dấu thông báo đã lưu trữ
 */
export function useMarkAsArchived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationApi.markAsArchived(id);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi lưu trữ thông báo");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
      toast.success("Đã lưu trữ thông báo");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi lưu trữ thông báo");
    },
  });
}

/**
 * Hook xóa thông báo
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationApi.deleteNotification(id);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi xóa thông báo");
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(),
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
      toast.success("Đã xóa thông báo");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi xóa thông báo");
    },
  });
}

/**
 * Hook tạo thông báo (Admin/System)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotificationRequest) => {
      const response = await notificationApi.createNotification(data);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi tạo thông báo");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Đã tạo thông báo");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi tạo thông báo");
    },
  });
}

/**
 * Hook cập nhật thông báo
 */
export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNotificationRequest;
    }) => {
      const response = await notificationApi.updateNotification(id, data);
      if (response.code !== 0) {
        throw new Error(response.message || "Lỗi khi cập nhật thông báo");
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.detail(variables.id),
      });
      toast.success("Đã cập nhật thông báo");
    },
    onError: (error: any) => {
      toast.error(error.message || "Lỗi khi cập nhật thông báo");
    },
  });
}
