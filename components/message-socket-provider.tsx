"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { messageSocket } from "@/lib/message-socket";
import { useMessageStore } from "@/lib/message-store";
import { usePresenceStore } from "@/lib/presence-store";

export const MessageSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isAuthenticated } = useAuthStore();
  const { addUnreadMessage, updateTypingUsers } = useMessageStore();
  const { setUserOnline, setUserOffline, updateUserPresence } = usePresenceStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      messageSocket.disconnect();
      return;
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
      // Handle message read status update
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

    // Add event listeners
    messageSocket.on("new:message", handleNewMessage);
    messageSocket.on("message:typing:start", handleTypingStart);
    messageSocket.on("message:typing:stop", handleTypingStop);
    messageSocket.on("message:read", handleMessageRead);
    messageSocket.on("user:online", handleUserOnline);
    messageSocket.on("user:offline", handleUserOffline);
    messageSocket.on("presence:update", handlePresenceUpdate);

    return () => {
      // Remove event listeners
      messageSocket.off("new:message", handleNewMessage);
      messageSocket.off("message:typing:start", handleTypingStart);
      messageSocket.off("message:typing:stop", handleTypingStop);
      messageSocket.off("message:read", handleMessageRead);
      messageSocket.off("user:online", handleUserOnline);
      messageSocket.off("user:offline", handleUserOffline);
      messageSocket.off("presence:update", handlePresenceUpdate);
      
      // Keep connection alive for navigation, only disconnect on logout
    };
  }, [isAuthenticated, token, addUnreadMessage, updateTypingUsers, setUserOnline, setUserOffline, updateUserPresence]);

  return <>{children}</>;
};
