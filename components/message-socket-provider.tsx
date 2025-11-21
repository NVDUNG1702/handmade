"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { messageSocket } from "@/lib/message-socket";
import { useMessageStore } from "@/lib/message-store";
import { usePresenceStore } from "@/lib/presence-store";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CustomToast,
  getTimeAgo,
} from "@/components/notifications/custom-toast";

export const MessageSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isAuthenticated } = useAuthStore();
  const { addUnreadMessage, updateTypingUsers } = useMessageStore();
  const { setUserOnline, setUserOffline, updateUserPresence } =
    usePresenceStore();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      messageSocket.disconnect();
      return;
    }

    // Request notification permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(console.error);
      }
    }

    // Connect to WebSocket
    const connectSocket = async () => {
      try {
        await messageSocket.connect(token);
        console.log("✅ [MessageSocket] Connected successfully");
      } catch (error) {
        console.error("❌ [MessageSocket] Connection failed:", error);
      }
    };

    connectSocket();

    // Global message listeners
    const handleNewMessage = (data: any) => {
      console.log("📥 [MessageSocket] New message received:", data);
      addUnreadMessage(data);

      // Check if message is not from current user
      const isOwnMessage = data.message?.sender_id === user?.id;
      if (isOwnMessage) return;

      // Get sender info
      const senderName =
        data.sender?.full_name ||
        data.sender?.username ||
        data.message?.sender?.full_name ||
        data.message?.sender?.username ||
        "Người dùng";
      const messageContent = data.message?.content || "";
      const conversationId =
        data.conversationId || data.message?.conversation_id;

      // Show custom toast notification
      toast.custom(
        (t) => (
          <CustomToast
            type="message"
            title={senderName}
            description={
              messageContent.substring(0, 70) +
              (messageContent.length > 70 ? "..." : "")
            }
            avatar={data.sender?.avatar || data.message?.sender?.avatar}
            actionLabel="Xem"
            onAction={() => {
              if (conversationId) {
                // Invalidate queries to refetch fresh data
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
                queryClient.invalidateQueries({
                  queryKey: ["messages", conversationId],
                });
                // Navigate to conversation
                router.push(`/messages?conversation=${conversationId}`);
              }
              toast.dismiss(t);
            }}
          />
        ),
        { duration: 5000 }
      );

      // Browser notification
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const notification = new Notification(
          `${senderName} gửi tin nhắn mới`,
          {
            body: messageContent,
            icon:
              data.sender?.avatar ||
              data.message?.sender?.avatar ||
              "/logo.png",
            tag: `message-${data.message?._id || Date.now()}`,
            badge: "/logo.png",
          }
        );

        // Click to open conversation
        notification.onclick = () => {
          window.focus();
          if (conversationId) {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({
              queryKey: ["messages", conversationId],
            });
            router.push(`/messages?conversation=${conversationId}`);
          }
          notification.close();
        };
      }
    };

    const handleTypingStart = (data: any) => {
      console.log("📥 [MessageSocket] Typing start:", data);
      updateTypingUsers(data.conversationId, data.userId, true);
    };

    const handleTypingStop = (data: any) => {
      console.log("📥 [MessageSocket] Typing stop:", data);
      updateTypingUsers(data.conversationId, data.userId, false);
    };

    const handleMessageRead = (data: any) => {
      console.log("📥 [MessageSocket] Message read:", data);
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleConversationRead = (data: any) => {
      console.log("📥 [MessageSocket] Conversation read:", data);

      // Clear unread messages for this conversation in store
      if (data.conversationId) {
        useMessageStore.getState().markConversationAsRead(data.conversationId);
      }

      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Also invalidate messages for that conversation
      if (data.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["messages", data.conversationId],
        });
      }
    };

    const handleUserOnline = (data: any) => {
      console.log("📥 [MessageSocket] User online:", data);
      // FE tự tạo timestamp khi nhận được event
      setUserOnline(data.userId, new Date().toISOString());
    };

    const handleUserOffline = (data: any) => {
      console.log("📥 [MessageSocket] User offline:", data);
      // FE tự tạo timestamp khi nhận được event offline
      setUserOffline(data.userId, new Date().toISOString());
    };

    const handlePresenceUpdate = (data: any) => {
      console.log("📥 [MessageSocket] Presence update:", data);
      updateUserPresence(data.userId, data.isOnline, data.lastSeen);
    };

    const handleNotification = (data: any) => {
      console.log("📥 [MessageSocket] Notification:", data);

      // Map notification type to custom toast type
      const notificationType = data.type || "info";
      const toastType =
        notificationType === "message"
          ? "message"
          : (notificationType as "notification" | "success" | "error" | "info");

      // Show custom toast
      toast.custom(
        (t) => (
          <CustomToast
            type={toastType}
            title={data.title || "Thông báo"}
            description={data.message || data.description}
            avatar={data.avatar}
            actionLabel={
              data.action_url ? data.action_label || "Xem" : undefined
            }
            onAction={
              data.action_url
                ? () => {
                    // Invalidate specific queries if provided
                    if (data.invalidate_queries) {
                      data.invalidate_queries.forEach((queryKey: string[]) => {
                        queryClient.invalidateQueries({ queryKey });
                      });
                    }
                    router.push(data.action_url);
                    toast.dismiss(t);
                  }
                : undefined
            }
          />
        ),
        { duration: data.duration || 5000 }
      );

      // Browser notification for important ones
      if (
        data.priority === "high" &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const notification = new Notification(data.title || "Thông báo", {
          body: data.message || data.description,
          icon: data.icon || "/logo.png",
          badge: "/logo.png",
        });

        if (data.action_url) {
          notification.onclick = () => {
            window.focus();
            router.push(data.action_url);
            notification.close();
          };
        }
      }
    };

    // Add event listeners
    messageSocket.on("new:message", handleNewMessage);
    messageSocket.on("message:typing:start", handleTypingStart);
    messageSocket.on("message:typing:stop", handleTypingStop);
    messageSocket.on("message:read", handleMessageRead);
    messageSocket.on("conversation:read", handleConversationRead);
    messageSocket.on("user:online", handleUserOnline);
    messageSocket.on("user:offline", handleUserOffline);
    messageSocket.on("presence:update", handlePresenceUpdate);
    messageSocket.on("notification:new", handleNotification);

    return () => {
      // Remove event listeners
      messageSocket.off("new:message", handleNewMessage);
      messageSocket.off("message:typing:start", handleTypingStart);
      messageSocket.off("message:typing:stop", handleTypingStop);
      messageSocket.off("message:read", handleMessageRead);
      messageSocket.off("conversation:read", handleConversationRead);
      messageSocket.off("user:online", handleUserOnline);
      messageSocket.off("user:offline", handleUserOffline);
      messageSocket.off("presence:update", handlePresenceUpdate);
      messageSocket.off("notification:new", handleNotification);

      // Keep connection alive for navigation, only disconnect on logout
    };
  }, [
    isAuthenticated,
    token,
    user?.id,
    addUnreadMessage,
    updateTypingUsers,
    setUserOnline,
    setUserOffline,
    updateUserPresence,
    router,
    queryClient,
  ]);

  return <>{children}</>;
};
