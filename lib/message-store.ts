"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WebSocketMessageEvent,
  WebSocketTypingEvent,
  MessageResponse,
  ConversationResponse,
} from "@/lib/types-message";

export interface MessageState {
  // Global message state
  unreadMessages: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string;
    senderName?: string;
    senderAvatar?: string;
  }>;

  // Conversations cache
  conversations: ConversationResponse[];
  conversationsLoading: boolean;

  // Current conversation
  currentConversationId: string | null;
  currentMessages: MessageResponse[];
  messagesLoading: boolean;
  hasMoreMessages: boolean;
  lastMessageId: string | null;

  // Global typing state
  globalTypingUsers: Record<string, string[]>; // conversationId -> userIds

  // Temporary contact for starting a chat without a real conversation
  tempContact: {
    slug: string;
    uid?: string;
    name?: string;
    avatar?: string;
  } | null;

  // Focus targeting when opening messages
  focusConversationId?: string | null;
  focusConversationSlug?: string | null;

  // Actions
  addUnreadMessage: (message: WebSocketMessageEvent) => void;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  clearUnreadMessages: () => void;
  resetMessageStore: () => void;

  // Conversations actions
  setConversations: (conversations: ConversationResponse[]) => void;
  setConversationsLoading: (loading: boolean) => void;
  updateConversation: (conversation: ConversationResponse) => void;

  // Current conversation actions
  setCurrentConversation: (conversationId: string | null) => void;
  setCurrentMessages: (messages: MessageResponse[]) => void;
  addMessage: (message: MessageResponse) => void;
  updateMessage: (messageId: string, updates: Partial<MessageResponse>) => void;
  setMessagesLoading: (loading: boolean) => void;
  setHasMoreMessages: (hasMore: boolean) => void;
  setLastMessageId: (messageId: string | null) => void;

  // Temp contact actions
  setTempContact: (contact: MessageState["tempContact"]) => void;

  // Focus actions
  setFocusById: (id: string | null) => void;
  setFocusBySlug: (slug: string | null) => void;
  clearFocus: () => void;

  // Typing actions
  updateTypingUsers: (
    conversationId: string,
    userId: string,
    isTyping: boolean
  ) => void;
  clearTypingUsers: (conversationId: string) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      // Initial state
      unreadMessages: [],
      conversations: [],
      conversationsLoading: false,
      currentConversationId: null,
      currentMessages: [],
      messagesLoading: false,
      hasMoreMessages: true,
      lastMessageId: null,
      globalTypingUsers: {},
      tempContact: null,
      focusConversationId: null,
      focusConversationSlug: null,

      // Message actions
      addUnreadMessage: (message: WebSocketMessageEvent) => {
        const { unreadMessages } = get();

        // Extract sender info with fallbacks
        const sender = message.sender || message.message.sender;
        const senderName =
          sender?.full_name || `User ${message.message.sender_id.slice(-4)}`;
        const senderAvatar = sender?.avatar;

        const newMessage = {
          id: message.message._id,
          conversationId: message.message.conversation_id,
          senderId: message.message.sender_id,
          content: message.message.content,
          timestamp: message.message.created_at,
          senderName,
          senderAvatar,
        };

        // Avoid duplicates
        const exists = unreadMessages.some((m) => m.id === newMessage.id);
        if (!exists) {
          set({
            unreadMessages: [...unreadMessages, newMessage],
          });
        }
      },

      markMessageAsRead: (messageId: string) => {
        const { unreadMessages } = get();
        set({
          unreadMessages: unreadMessages.filter((m) => m.id !== messageId),
        });
      },

      markConversationAsRead: (conversationId: string) => {
        const { unreadMessages } = get();
        set({
          unreadMessages: unreadMessages.filter(
            (m) => m.conversationId !== conversationId
          ),
        });
      },

      clearUnreadMessages: () => {
        set({ unreadMessages: [] });
      },

      resetMessageStore: () => {
        set({
          unreadMessages: [],
          conversations: [],
          conversationsLoading: false,
          currentConversationId: null,
          currentMessages: [],
          messagesLoading: false,
          hasMoreMessages: true,
          lastMessageId: null,
          globalTypingUsers: {},
          tempContact: null,
          focusConversationId: null,
          focusConversationSlug: null,
        });
      },

      // Conversations actions
      setConversations: (conversations: ConversationResponse[]) => {
        set({ conversations });
      },

      setConversationsLoading: (loading: boolean) => {
        set({ conversationsLoading: loading });
      },

      updateConversation: (conversation: ConversationResponse) => {
        const { conversations } = get();
        const index = conversations.findIndex((c) => c._id === conversation._id);
        if (index !== -1) {
          const newConversations = [...conversations];
          newConversations[index] = conversation;
          set({ conversations: newConversations });
        } else {
          set({ conversations: [conversation, ...conversations] });
        }
      },

      // Current conversation actions
      setCurrentConversation: (conversationId: string | null) => {
        set({
          currentConversationId: conversationId,
          currentMessages: [],
          hasMoreMessages: true,
          lastMessageId: null,
        });
      },

      setCurrentMessages: (messages: MessageResponse[]) => {
        set({ currentMessages: messages });
      },

      addMessage: (message: MessageResponse) => {
        const { currentMessages } = get();
        // Avoid duplicates
        const exists = currentMessages.some((m) => m._id === message._id);
        if (!exists) {
          set({
            currentMessages: [...currentMessages, message],
          });
        }
      },

      updateMessage: (messageId: string, updates: Partial<MessageResponse>) => {
        const { currentMessages } = get();
        set({
          currentMessages: currentMessages.map((m) =>
            m._id === messageId ? { ...m, ...updates } : m
          ),
        });
      },

      setMessagesLoading: (loading: boolean) => {
        set({ messagesLoading: loading });
      },

      setHasMoreMessages: (hasMore: boolean) => {
        set({ hasMoreMessages: hasMore });
      },

      setLastMessageId: (messageId: string | null) => {
        set({ lastMessageId: messageId });
      },

      // Temp contact actions
      setTempContact: (contact) => {
        set({ tempContact: contact });
      },

      // Focus actions
      setFocusById: (id) => set({ focusConversationId: id }),
      setFocusBySlug: (slug) => set({ focusConversationSlug: slug }),
      clearFocus: () =>
        set({ focusConversationId: null, focusConversationSlug: null }),

      // Typing actions
      updateTypingUsers: (
        conversationId: string,
        userId: string,
        isTyping: boolean
      ) => {
        const { globalTypingUsers } = get();
        const currentUsers = globalTypingUsers[conversationId] || [];

        let newUsers: string[];
        if (isTyping) {
          newUsers = currentUsers.includes(userId)
            ? currentUsers
            : [...currentUsers, userId];
        } else {
          newUsers = currentUsers.filter((id) => id !== userId);
        }

        set({
          globalTypingUsers: {
            ...globalTypingUsers,
            [conversationId]: newUsers,
          },
        });
      },

      clearTypingUsers: (conversationId: string) => {
        const { globalTypingUsers } = get();
        const newTypingUsers = { ...globalTypingUsers };
        delete newTypingUsers[conversationId];
        set({ globalTypingUsers: newTypingUsers });
      },
    }),
    {
      name: "message-storage",
      // Persist important data
      partialize: (state) => ({
        unreadMessages: state.unreadMessages,
        conversations: state.conversations,
        globalTypingUsers: state.globalTypingUsers,
      }),
    }
  )
);

// Selectors for convenience
export const useUnreadMessages = () =>
  useMessageStore((state) => state.unreadMessages);
export const useUnreadCount = () =>
  useMessageStore((state) => state.unreadMessages.length);
export const useConversations = () =>
  useMessageStore((state) => state.conversations);
export const useCurrentConversation = () =>
  useMessageStore((state) => ({
    conversationId: state.currentConversationId,
    messages: state.currentMessages,
    loading: state.messagesLoading,
    hasMore: state.hasMoreMessages,
    lastMessageId: state.lastMessageId,
  }));
export const useGlobalTypingUsers = () =>
  useMessageStore((state) => state.globalTypingUsers);
