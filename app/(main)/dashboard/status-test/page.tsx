"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineStatus } from "@/components/messages/online-status";
import { TypingIndicator } from "@/components/messages/typing-indicator";
import { MessageStatusIcon, MessageTimestamp } from "@/components/messages/message-status";
import { MessageBubble } from "@/components/messages/message-bubble";
import type { MessageResponse, MessageStatus } from "@/lib/types-message";

export default function StatusTestPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [showTyping, setShowTyping] = useState(false);
  const [messageStatus, setMessageStatus] = useState<MessageStatus>("read");

  const mockMessage: MessageResponse = {
    _id: "msg1",
    sender_id: "user1",
    conversation_id: "conv1",
    content: "Đây là tin nhắn test để kiểm tra các trạng thái khác nhau",
    type: "text",
    status: messageStatus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender: {
      _id: "user1",
      username: "testuser",
      full_name: "Test User",
      avatar: "/avatar-placeholder.jpg",
      slug: "testuser"
    }
  };

  const mockTypingUsers = showTyping ? [
    {
      id: "user2",
      name: "Nguyễn Văn A",
      avatar: "/avatar-placeholder.jpg"
    }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Status Components Test</h1>
          <p className="text-muted-foreground">
            Test các component trạng thái: Online/Offline, Typing, Message Status
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
                <CardDescription>
                  Điều khiển các trạng thái để test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Online Status Control */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Online Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="online-status"
                      checked={isOnline}
                      onCheckedChange={setIsOnline}
                    />
                    <Label htmlFor="online-status">
                      {isOnline ? "Online" : "Offline"}
                    </Label>
                  </div>
                </div>

                <Separator />

                {/* Typing Indicator Control */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Typing Indicator</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="typing-status"
                      checked={showTyping}
                      onCheckedChange={setShowTyping}
                    />
                    <Label htmlFor="typing-status">
                      {showTyping ? "Đang nhập..." : "Không nhập"}
                    </Label>
                  </div>
                </div>

                <Separator />

                {/* Message Status Control */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Message Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["sent", "delivered", "read", "failed"] as MessageStatus[]).map((status) => (
                      <Button
                        key={status}
                        variant={messageStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMessageStatus(status)}
                        className="justify-start"
                      >
                        <MessageStatusIcon status={status} className="mr-2" />
                        {status === "sent" && "Đã gửi"}
                        {status === "delivered" && "Đã nhận"}
                        {status === "read" && "Đã xem"}
                        {status === "failed" && "Thất bại"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Online Status Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar with status */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/avatar-placeholder.jpg" />
                      <AvatarFallback>TU</AvatarFallback>
                    </Avatar>
                    <OnlineStatus 
                      isOnline={isOnline}
                      size="md"
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Test User</h4>
                    <OnlineStatus 
                      isOnline={isOnline}
                      showText={true}
                      size="sm"
                      lastSeen={isOnline ? undefined : new Date(Date.now() - 5 * 60 * 1000).toISOString()}
                    />
                  </div>
                </div>

                {/* Different sizes */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <OnlineStatus isOnline={isOnline} size="sm" />
                    <span className="text-sm">Small</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <OnlineStatus isOnline={isOnline} size="md" />
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <OnlineStatus isOnline={isOnline} size="lg" />
                    <span className="text-sm">Large</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typing Indicator Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <TypingIndicator users={mockTypingUsers} />
                {!showTyping && (
                  <p className="text-muted-foreground text-sm">
                    Bật "Typing Indicator" để xem preview
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Status Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status icons */}
                <div className="grid grid-cols-2 gap-4">
                  {(["sent", "delivered", "read", "failed"] as MessageStatus[]).map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <MessageStatusIcon status={status} />
                      <span className="text-sm">
                        {status === "sent" && "Đã gửi"}
                        {status === "delivered" && "Đã nhận"}
                        {status === "read" && "Đã xem"}
                        {status === "failed" && "Thất bại"}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Message timestamp */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Message Timestamp</Label>
                  <MessageTimestamp 
                    timestamp={new Date().toISOString()}
                    status={messageStatus}
                    isOwn={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Message Bubble Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Message Bubble Preview</CardTitle>
            <CardDescription>
              Preview tin nhắn với các trạng thái hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl space-y-4">
              {/* Received message */}
              <MessageBubble
                message={{
                  ...mockMessage,
                  sender_id: "other",
                  content: "Xin chào! Bạn có khỏe không?"
                }}
                isOwn={false}
                showAvatar={true}
                showTime={true}
              />

              {/* Sent message */}
              <MessageBubble
                message={mockMessage}
                isOwn={true}
                showAvatar={false}
                showTime={true}
              />

              {/* Typing indicator */}
              {showTyping && (
                <TypingIndicator users={mockTypingUsers} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-green-600">✅ Đã implement</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• OnlineStatus component</li>
                  <li>• TypingIndicator component</li>
                  <li>• MessageStatus components</li>
                  <li>• UI integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-yellow-600">⚠️ Cần WebSocket</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time online status</li>
                  <li>• Real-time typing events</li>
                  <li>• Message delivery status</li>
                  <li>• Read receipts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-600">🔄 Backend integration</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• User presence API</li>
                  <li>• Typing events API</li>
                  <li>• Message status updates</li>
                  <li>• Last seen timestamps</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
