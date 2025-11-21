// Notification Types matching backend schema

export enum NotificationType {
  SYSTEM = "system",
  ORDER = "order",
  MESSAGE = "message",
  COMMENT = "comment",
  REVIEW = "review",
  FOLLOW = "follow",
  LIKE = "like",
  SHARE = "share",
  EVENT = "event",
  BADGE = "badge",
  PROMOTION = "promotion",
  JOB_APPLICATION = "job_application",
}

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
  ARCHIVED = "archived",
}

export enum NotificationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export interface NotificationUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export interface NotificationResponse {
  id: string;
  recipient_id: string;
  recipient?: NotificationUser;
  sender_id?: string;
  sender?: NotificationUser;
  title: string;
  message?: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  icon_url?: string;
  image_url?: string;
  action_url?: string;
  action_text?: string;
  data?: Record<string, unknown>;
  tags?: string[];
  read_at?: Date | string;
  expires_at?: Date | string;
  is_silent: boolean;
  is_broadcast: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  metadata?: Record<string, unknown>;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  unread_count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationStatsResponse {
  total: number;
  unread: number;
  read: number;
  archived: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  keyword?: string;
  tag?: string;
  sort_by?: "created_at" | "read_at" | "priority" | "type";
  sort_order?: "asc" | "desc";
  unread_only?: boolean;
  broadcast_only?: boolean;
  read?: boolean;
}

export interface CreateNotificationRequest {
  recipient_id: string;
  sender_id?: string;
  title: string;
  message?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  icon_url?: string;
  image_url?: string;
  action_url?: string;
  action_text?: string;
  data?: Record<string, unknown>;
  tags?: string[];
  expires_at?: string;
  is_silent?: boolean;
  is_broadcast?: boolean;
}

export interface UpdateNotificationRequest {
  title?: string;
  message?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  icon_url?: string;
  image_url?: string;
  action_url?: string;
  action_text?: string;
  data?: Record<string, unknown>;
  tags?: string[];
  expires_at?: string;
  is_silent?: boolean;
}

export interface NotificationIdsRequest {
  ids: string[];
}

export interface MarkAsReadResponse {
  message: string;
  count: number;
}
