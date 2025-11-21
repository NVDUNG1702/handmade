import { io, Socket } from "socket.io-client";
import { EventEmitter } from "events";
import type {
  MessageResponse,
  WebSocketMessageEvent,
  WebSocketTypingEvent,
  WebSocketReadEvent,
} from "@/lib/types-message";

export interface MessageSocketEvents {
  // Connection events
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;

  // Message events
  "new:message": (data: WebSocketMessageEvent) => void;
  "message:sent": (data: any) => void;
  "message:error": (data: any) => void;
  "message:read": (data: WebSocketReadEvent) => void;

  // Typing events
  "message:typing:start": (data: WebSocketTypingEvent) => void;
  "message:typing:stop": (data: WebSocketTypingEvent) => void;

  // Presence events
  "user:online": (data: { userId: string; timestamp: string }) => void;
  "user:offline": (data: { userId: string; lastSeen: string }) => void;
  "presence:update": (data: {
    userId: string;
    isOnline: boolean;
    lastSeen?: string;
  }) => void;

  // Conversation events
  "join:conversation": (data: any) => void;
  "leave:conversation": (data: any) => void;
  "conversation:read": (data: {
    conversationId: string;
    userId: string;
    updatedCount: number;
  }) => void;

  // Notification events
  "notification:new": (data: {
    type?: "info" | "success" | "error" | "warning";
    title?: string;
    message?: string;
    description?: string;
    priority?: "low" | "normal" | "high";
    duration?: number;
    action_url?: string;
    action_label?: string;
    icon?: string;
    invalidate_queries?: string[][];
  }) => void;

  // Auth events
  auth_error: (data: any) => void;
  token_refresh_required: () => void;
}

class MessageSocketService extends EventEmitter {
  private socket: Socket | null = null;
  private wsUrl: string;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private joinedConversationIds: Set<string> = new Set();

  constructor() {
    super();
    const rawBase =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:4000";
    // Remove /api suffix if present
    this.wsUrl = rawBase.replace(/\/?api(\/v\d+)?$/, "");
  }

  // Connect to WebSocket
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.token = token;

      this.socket = io(`${this.wsUrl}/realtime`, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
        path: "/socket.io/",
      });

      this.socket.on("connect", () => {
        this.reconnectAttempts = 0;

        // Re-join previously joined rooms after reconnect
        for (const conversationId of this.joinedConversationIds) {
          this.socket?.emit("join:conversation", { conversationId });
        }
        resolve();
      });

      this.socket.on("join:conversation", (response) => {
        if (!response.success) {
          console.error("❌ [WS] Failed to join conversation:", response.error);
        }
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ [WS] Connection error:", error);
        const msg = String((error as any)?.message || error);

        if (
          msg.includes("jwt expired") ||
          msg.includes("Unauthorized") ||
          msg.includes("Authentication failed") ||
          msg.includes("Auth failed") ||
          (error as any)?.code === 401
        ) {
          console.log("🔄 [WS] Auth failed, attempting token refresh...");
          this.handleTokenRefresh();
          reject(new Error("Authentication failed"));
        } else {
          reject(error);
        }
      });

      this.socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          this.handleReconnect();
        }
      });

      this.socket.on("auth_error", (data) => {
        console.error("🔐 [WS] Auth error:", data.error);
        this.handleTokenRefresh()
          .then((newToken) => {
            if (newToken) {
              console.log("🔄 [WS] Token refreshed, reconnecting...");
              this.connect(newToken).catch(console.error);
            } else {
              console.log("❌ [WS] Token refresh failed, disconnecting");
              this.disconnect();
              reject(new Error(data.error));
            }
          })
          .catch(() => {
            console.log("❌ [WS] Token refresh error, disconnecting");
            this.disconnect();
            reject(new Error(data.error));
          });
      });

      this.socket.on("token_refresh_required", () => {
        console.log("🔄 [WS] Token refresh required");
        this.handleTokenRefresh().then((newToken) => {
          if (newToken) {
            console.log("🔄 [WS] Token refreshed, reconnecting...");
            this.connect(newToken).catch(console.error);
          }
        });
      });

      // Listen for new messages
      this.socket.on("new:message", (data: WebSocketMessageEvent) => {
        console.log("📥 [WS] Received new:message:", data);
        this.emit("new:message", data);
      });

      // Listen for typing events - BE emits "typing:start" and "typing:stop"
      this.socket.on("typing:start", (data: any) => {
        console.log("📥 [WS] Received typing:start:", data);

        // BE sends: { userId, roomId: "conversation:xxx" }
        // FE needs: { userId, conversationId: "xxx" }
        const conversationId =
          data.roomId?.replace("conversation:", "") || data.conversationId;

        this.emit("message:typing:start", {
          userId: data.userId,
          conversationId: conversationId,
        });
      });

      this.socket.on("typing:stop", (data: any) => {
        console.log("📥 [WS] Received typing:stop:", data);

        // BE sends: { userId, roomId: "conversation:xxx" }
        // FE needs: { userId, conversationId: "xxx" }
        const conversationId =
          data.roomId?.replace("conversation:", "") || data.conversationId;

        this.emit("message:typing:stop", {
          userId: data.userId,
          conversationId: conversationId,
        });
      });

      // Listen for read events
      this.socket.on("message:read", (data: WebSocketReadEvent) => {
        console.log("📥 [WS] Received message:read:", data);
        this.emit("message:read", data);
      });

      // Listen for conversation read event
      this.socket.on("conversation:read", (data: any) => {
        console.log("📥 [WS] Received conversation:read:", data);
        this.emit("conversation:read", data);
      });

      // Listen for presence events
      this.socket.on("user:online", (data: any) => {
        console.log("📥 [WS] User came online:", data);
        this.emit("user:online", data);
      });

      this.socket.on("user:offline", (data: any) => {
        console.log("📥 [WS] User went offline:", data);
        this.emit("user:offline", data);
      });

      this.socket.on("presence:update", (data: any) => {
        console.log("📥 [WS] Presence update:", data);
        this.emit("presence:update", data);
      });

      // Listen for general notifications
      this.socket.on("notification:new", (data: any) => {
        console.log("📥 [WS] New notification:", data);
        this.emit("notification:new", data);
      });
    });
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.token = null;
    this.reconnectAttempts = 0;
  }

  // Handle reconnection
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.token) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect(this.token!).catch(console.error);
      }, delay);
    }
  }

  // Handle token refresh
  private async handleTokenRefresh(): Promise<string | null> {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            }
          );

          const data = await res.json();

          if (data.code === 0) {
            const { accessToken, refreshToken: newRefreshToken } = data.data;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", newRefreshToken);
            return accessToken;
          } else {
            localStorage.clear();
            window.location.href = "/login";
            return null;
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          localStorage.clear();
          window.location.href = "/login";
          return null;
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
        return null;
      }
    }
    return null;
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Join conversation
  joinConversation(conversationId: string): void {
    if (this.socket?.connected) {
      console.log("📤 [WS] Emitting join:conversation:", conversationId);
      this.socket.emit("join:conversation", { conversationId });
    }
    this.joinedConversationIds.add(conversationId);
  }

  // Leave conversation
  leaveConversation(conversationId: string): void {
    if (this.socket?.connected) {
      console.log("📤 [WS] Emitting leave:conversation:", conversationId);
      this.socket.emit("leave:conversation", { conversationId });
    }
    this.joinedConversationIds.delete(conversationId);
  }

  // Send message
  sendMessage(data: {
    conversation_id: string;
    content: string;
    type?: string;
    parent_id?: string;
  }): void {
    if (this.socket?.connected) {
      console.log("📤 [WS] Emitting message:send:", data);
      this.socket.emit("message:send", data);
    }
  }

  // Start typing
  startTyping(conversationId: string): void {
    if (!this.socket) {
      console.warn("⚠️ [WS] Socket not initialized");
      return;
    }

    console.log(
      "📤 [WS] Emitting message:typing:start:",
      conversationId,
      "connected:",
      this.socket.connected
    );
    this.socket.emit("message:typing:start", { conversationId });
  }

  // Stop typing
  stopTyping(conversationId: string): void {
    if (!this.socket) {
      console.warn("⚠️ [WS] Socket not initialized");
      return;
    }

    console.log(
      "📤 [WS] Emitting message:typing:stop:",
      conversationId,
      "connected:",
      this.socket.connected
    );
    this.socket.emit("message:typing:stop", { conversationId });
  }

  // Mark message as read
  markMessageAsRead(messageId: string): void {
    if (this.socket?.connected) {
      console.log("📤 [WS] Emitting mark:read:", messageId);
      this.socket.emit("mark:read", { messageId });
    }
  }

  // Mark conversation as read
  markConversationAsRead(conversationId: string): void {
    if (this.socket?.connected) {
      console.log("📤 [WS] Emitting mark:conversation:read:", conversationId);
      this.socket.emit("mark:conversation:read", { conversationId });
    }
  }

  // Event listeners - use EventEmitter methods instead of socket directly
  on<K extends keyof MessageSocketEvents>(
    event: K,
    listener: MessageSocketEvents[K]
  ): this {
    super.on(event, listener as any);
    return this;
  }

  off<K extends keyof MessageSocketEvents>(
    event: K,
    listener?: MessageSocketEvents[K]
  ): this {
    if (listener) {
      super.off(event, listener as any);
    } else {
      super.removeAllListeners(event);
    }
    return this;
  }

  once<K extends keyof MessageSocketEvents>(
    event: K,
    listener: MessageSocketEvents[K]
  ): this {
    super.once(event, listener as any);
    return this;
  }
}

// Singleton instance
export const messageSocket = new MessageSocketService();
