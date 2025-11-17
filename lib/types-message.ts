// ===== MESSAGE & CONVERSATION TYPES =====

export type MessageType = "text" | "image" | "file" | "system" | "notification";
export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface CreateMessageRequest {
  conversation_id: string;
  content: string;
  type?: MessageType;
  parent_id?: string; // for replies
  attachments?: string[]; // optional
  metadata?: Record<string, any>; // optional
}

export interface SendMessageBySlugRequest {
  recipient_slug: string;
  content: string;
  type?: MessageType;
  parent_id?: string;
}

export interface UpdateMessageRequest {
  content: string;
  attachments?: string[]; // optional
}

export interface MessageResponse {
  _id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  parent_id?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  read_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  sender?: {
    _id: string;
    username: string;
    full_name: string;
    avatar?: string;
    slug: string;
  };
}

export interface MessageListResponse {
  data: MessageResponse[];
  has_more: boolean;
  last_message_id?: string;
  total_estimated?: number;
}

export interface MessageQueryParams {
  limit?: number; // 1-100, default: 50
  last_id?: string; // cursor for pagination
}

export interface MessageSearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface MessageSearchResponse {
  data: MessageResponse[];
  total: number;
}

// Conversation Types
export interface ConversationUser {
  _id: string;
  username: string;
  full_name: string;
  slug: string;
  avatar?: string;
  status: boolean;
  role: string;
  last_seen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  _id: string;
  user1_id: string;
  user2_id: string;
  blocked_by_user1: boolean;
  blocked_by_user2: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationResponse {
  _id: string;
  lastMessage: MessageResponse;
  unreadCount: number;
  sender: ConversationUser;
  conversation: ConversationSummary;
}

export interface ConversationListResponse {
  data: ConversationResponse[];
  total: number;
}

export interface ConversationQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface CreateConversationBySlugRequest {
  recipient_slug: string;
}

// WebSocket Event Types
export interface WebSocketMessageEvent {
  message: MessageResponse;
  conversationId: string;
  sender: {
    _id: string;
    username: string;
    full_name: string;
    slug: string;
    avatar?: string;
  };
}

export interface WebSocketTypingEvent {
  userId: string;
  conversationId: string;
}

export interface WebSocketReadEvent {
  messageId: string;
  userId: string;
  conversationId: string;
}

export interface WebSocketJoinEvent {
  conversationId: string;
}

export interface WebSocketLeaveEvent {
  conversationId: string;
}
