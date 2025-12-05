"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageApi, conversationApi } from "@/lib/api-message";
import { useAuth } from "@/components/auth-provider";
import { useMessageStore } from "@/lib/message-store";
import { usePresenceStore } from "@/lib/presence-store";
import { messageSocket } from "@/lib/message-socket";
import { toast } from "sonner";
import type {
  CreateMessageRequest,
  MessageResponse,
  MessageQueryParams,
  MessageSearchParams,
  ConversationQueryParams,
  CreateConversationBySlugRequest,
} from "@/lib/types-message";

// ===== MESSAGE HOOKS =====

// Hook để quản lý tin nhắn trong conversation
export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const {
    currentMessages,
    messagesLoading,
    hasMoreMessages,
    lastMessageId,
    setCurrentConversation,
    setCurrentMessages,
    addMessage,
    updateMessage,
    setMessagesLoading,
    setHasMoreMessages,
    setLastMessageId,
  } = useMessageStore();

  // Set current conversation when conversationId changes
  useEffect(() => {
    setCurrentConversation(conversationId);
  }, [conversationId, setCurrentConversation]);

  // WebSocket integration
  useEffect(() => {
    if (!conversationId || !user) return;

    // Join conversation room
    messageSocket.joinConversation(conversationId);

    // Handle new messages
    const handleNewMessage = (data: any) => {
      if (data.message.conversation_id === conversationId) {
        const isOwnMessage = data.message.sender_id === user?.id;

        // Replace temp message if exists
        const tempIndex = currentMessages.findIndex(
          (m) =>
            (m as any)._id?.startsWith?.("temp-") &&
            m.content === data.message.content &&
            m.sender_id === data.message.sender_id
        );
        if (tempIndex !== -1) {
          updateMessage(currentMessages[tempIndex]._id, data.message);
        } else {
          // Add new message if not duplicate
          const exists = currentMessages.some(
            (m) => m._id === data.message._id
          );
          if (!exists) {
            addMessage(data.message);
            // Global notification is handled by MessageSocketProvider
          }
        }
      }
    };

    // Handle message read status
    const handleMessageRead = (data: any) => {
      if (data.conversationId === conversationId) {
        updateMessage(data.messageId, { status: "read" });
      }
    };

    // Handle typing events
    const handleTypingStart = (data: any) => {
      if (data.conversationId === conversationId && data.userId !== user.id) {
        setTypingUsers((prev) => new Set([...prev, data.userId]));

        // Clear existing timeout
        if (typingTimeoutRef.current[data.userId]) {
          clearTimeout(typingTimeoutRef.current[data.userId]);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current[data.userId] = setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
          delete typingTimeoutRef.current[data.userId];
        }, 3000);
      }
    };

    const handleTypingStop = (data: any) => {
      if (data.conversationId === conversationId && data.userId !== user.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });

        if (typingTimeoutRef.current[data.userId]) {
          clearTimeout(typingTimeoutRef.current[data.userId]);
          delete typingTimeoutRef.current[data.userId];
        }
      }
    };

    // Add event listeners
    messageSocket.on("new:message", handleNewMessage);
    messageSocket.on("message:read", handleMessageRead);
    messageSocket.on("message:typing:start", handleTypingStart);
    messageSocket.on("message:typing:stop", handleTypingStop);

    return () => {
      // Remove event listeners
      messageSocket.off("new:message", handleNewMessage);
      messageSocket.off("message:read", handleMessageRead);
      messageSocket.off("message:typing:start", handleTypingStart);
      messageSocket.off("message:typing:stop", handleTypingStop);

      // Leave conversation room
      messageSocket.leaveConversation(conversationId);
    };
  }, [conversationId, user, currentMessages, addMessage, updateMessage]);

  // Query để lấy tin nhắn
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => {
      if (!conversationId || conversationId.startsWith("new:")) return null;
      return messageApi.getConversationMessages(conversationId, { limit: 50 });
    },
    enabled: !!conversationId && !conversationId.startsWith("new:"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation để gửi tin nhắn
  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateMessageRequest) => {
      return messageApi.sendMessage(data);
    },
    onSuccess: (response) => {
      if (response.code === 0) {
        // Invalidate conversations to update last message
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
    onError: (error: any) => {
      console.error("Send message error:", error);
      toast.error("Không thể gửi tin nhắn");
    },
  });

  // Mutation để đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      try {
        return await messageApi.markMessageAsRead(messageId);
      } catch (e) {
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Mutation để đánh dấu conversation đã đọc
  const markConversationAsReadMutation = useMutation({
    mutationFn: (conversationId: string) =>
      messageApi.markConversationAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  // Cập nhật messages khi data thay đổi
  useEffect(() => {
    if (messagesData?.data) {
      const sorted = [...messagesData.data.data].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setCurrentMessages(sorted);
      setHasMoreMessages(messagesData.data.has_more);
      setLastMessageId(messagesData.data.last_message_id || null);
    }
  }, [messagesData, setCurrentMessages, setHasMoreMessages, setLastMessageId]);

  // Load more messages
  const loadMore = useCallback(async () => {
    if (
      !conversationId ||
      !hasMoreMessages ||
      messagesLoading ||
      !lastMessageId
    ) {
      return;
    }

    setMessagesLoading(true);
    try {
      const response = await messageApi.getConversationMessages(
        conversationId,
        {
          limit: 50,
          last_id: lastMessageId,
        }
      );

      if (response.code === 0) {
        // Merge and sort all messages
        const newMessages = [...response.data.data, ...currentMessages]
          .filter(
            (m, idx, arr) => arr.findIndex((x) => x._id === m._id) === idx
          )
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

        setCurrentMessages(newMessages);
        setHasMoreMessages(response.data.has_more);
        setLastMessageId(response.data.last_message_id || null);
      }
    } catch (error) {
      toast.error("Không thể tải thêm tin nhắn");
    } finally {
      setMessagesLoading(false);
    }
  }, [
    conversationId,
    hasMoreMessages,
    messagesLoading,
    lastMessageId,
    currentMessages,
    setMessagesLoading,
    setCurrentMessages,
    setHasMoreMessages,
    setLastMessageId,
  ]);

  // Gửi tin nhắn
  const sendMessage = useCallback(
    async (content: string, type = "text", parentId?: string) => {
      if (!conversationId || !content.trim()) return;

      const trimmed = content.trim();
      const tempId = `temp-${Date.now()}`;
      const optimistic: MessageResponse = {
        _id: tempId,
        sender_id: user?.id || "",
        conversation_id: conversationId,
        content: trimmed,
        type: type as any,
        status: "sent",
        parent_id: parentId,
        attachments: [],
        metadata: {},
        read_at: undefined,
        delivered_at: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: {
          _id: user?.id || "",
          username: user?.username || "",
          full_name: user?.full_name || "",
          avatar: user?.avatar_url,
          slug: user?.username || "",
        },
      };

      // Optimistic update
      addMessage(optimistic);

      const messageData: CreateMessageRequest = {
        conversation_id: conversationId,
        content: trimmed,
        type: type as any,
        parent_id: parentId,
      };

      try {
        const response = await sendMessageMutation.mutateAsync(messageData);
        if (response?.code === 0 && response.data) {
          // Replace temp message with server response
          const serverMsg = response.data;
          updateMessage(tempId, serverMsg);
        } else {
          // Remove temp message on non-success response
          const updatedMessages = currentMessages.filter(
            (m) => m._id !== tempId
          );
          setCurrentMessages(updatedMessages);
          throw new Error(response?.message || "Failed to send message");
        }
      } catch (e) {
        // Remove temp message on error
        const updatedMessages = currentMessages.filter((m) => m._id !== tempId);
        setCurrentMessages(updatedMessages);
        // Re-throw to propagate error to UI
        throw e;
      }
    },
    [
      conversationId,
      user,
      addMessage,
      sendMessageMutation,
      updateMessage,
      currentMessages,
      setCurrentMessages,
    ]
  );

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = useCallback(
    (messageId: string) => {
      const message = currentMessages.find((m) => m._id === messageId);
      if (!message || message.sender_id === user?.id) return;

      markAsReadMutation.mutate(messageId);
    },
    [markAsReadMutation, currentMessages, user?.id]
  );

  // Đánh dấu conversation đã đọc
  const markConversationAsRead = useCallback(() => {
    if (!conversationId) return;

    // Join conversation first to ensure we're in the room
    messageSocket.joinConversation(conversationId);

    // Then mark as read
    setTimeout(() => {
      try {
        messageSocket.markConversationAsRead(conversationId);
      } catch (error) {
        console.error("Failed to mark conversation as read via socket:", error);
        // Fallback to API call
        markConversationAsReadMutation.mutate(conversationId);
      }
    }, 100);
  }, [conversationId, markConversationAsReadMutation]);

  // Typing handlers
  const startTyping = useCallback(() => {
    if (conversationId) {
      messageSocket.startTyping(conversationId);
    }
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (conversationId) {
      messageSocket.stopTyping(conversationId);
    }
  }, [conversationId]);

  return {
    messages: currentMessages,
    hasMore: hasMoreMessages,
    loading: isLoadingMessages || messagesLoading,
    error: messagesError,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    loadMore,
    markAsRead,
    markConversationAsRead,
    startTyping,
    stopTyping,
    refetchMessages,
  };
};

// Hook để quản lý conversations
export const useConversations = (params?: ConversationQueryParams) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { conversations, setConversations, setConversationsLoading } =
    useMessageStore();
  const { setUserOnline, setUserOffline } = usePresenceStore();

  const {
    data: conversationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["conversations", params],
    queryFn: async () => {
      if (!user?.id) return null;
      setConversationsLoading(true);
      try {
        const result = await conversationApi.getConversations(user.id, params);
        return result;
      } finally {
        setConversationsLoading(false);
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Update store when data changes
  useEffect(() => {
    if (conversationsData?.data) {
      const conversationsList = conversationsData.data.data || [];
      setConversations(conversationsList);

      // Sync presence từ API data
      console.log("🔄 [Conversations] Syncing presence from API data...");
      conversationsList.forEach((conversation) => {
        // Lấy sender (user khác trong conversation)
        const otherUser = conversation.sender;

        if (otherUser && otherUser._id !== user?.id) {
          // Nếu có last_seen thì user offline, ngược lại online
          if (otherUser.last_seen) {
            console.log(
              `📥 [Presence] Setting ${otherUser.username} offline (last_seen: ${otherUser.last_seen})`
            );
            setUserOffline(otherUser._id, otherUser.last_seen);
          } else {
            console.log(`📥 [Presence] Setting ${otherUser.username} online`);
            setUserOnline(otherUser._id, new Date().toISOString());
          }
        }
      });
    }
  }, [
    conversationsData,
    setConversations,
    setUserOnline,
    setUserOffline,
    user?.id,
  ]);

  // Mutation để tạo conversation by slug
  const createConversationBySlugMutation = useMutation({
    mutationFn: (data: CreateConversationBySlugRequest) =>
      conversationApi.createConversationBySlug(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: any) => {
      console.error("Create conversation error:", error);
      toast.error("Không thể tạo cuộc trò chuyện");
    },
  });

  // Mutation để tạo conversation
  const createConversationMutation = useMutation({
    mutationFn: (data: { user1_id: string; user2_id: string }) =>
      conversationApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: any) => {
      console.error("Create conversation error:", error);
      toast.error("Không thể tạo cuộc trò chuyện");
    },
  });

  return {
    conversations,
    total: conversationsData?.data?.total || 0,
    isLoading,
    error,
    createConversationBySlug: createConversationBySlugMutation.mutate,
    createConversation: createConversationMutation.mutateAsync,
    refetch,
  };
};

// Hook để tìm kiếm tin nhắn
export const useMessageSearch = (params: MessageSearchParams) => {
  const { user } = useAuth();

  const {
    data: searchData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messageSearch", params],
    queryFn: () => {
      if (!user?.id || !params.query.trim()) return null;
      return messageApi.searchMessages(user.id, params);
    },
    enabled: !!user?.id && !!params.query.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    messages: searchData?.data?.data || [],
    total: searchData?.data?.total || 0,
    isLoading,
    error,
    refetch,
  };
};

// Hook để lấy tin nhắn chưa đọc
export const useUnreadMessages = (params?: {
  page?: number;
  limit?: number;
}) => {
  const { user } = useAuth();

  const {
    data: unreadData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["unreadMessages", params],
    queryFn: () => {
      if (!user?.id) return null;
      return messageApi.getUnreadMessages(user.id, params);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    messages: unreadData?.data?.data || [],
    total: unreadData?.data?.data?.length || 0,
    isLoading,
    error,
    refetch,
  };
};
