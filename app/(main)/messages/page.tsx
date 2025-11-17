"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useMessages, useConversations } from "@/hooks/use-messages";
import { ConversationList } from "@/components/messages/conversation-list";
import { MessageBubble } from "@/components/messages/message-bubble";
import { MessageInput } from "@/components/messages/message-input";
import { TypingIndicator } from "@/components/messages/typing-indicator";
import { OnlineStatus } from "@/components/messages/online-status";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Search,
  Info,
  Users,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MessageResponse, ConversationResponse } from "@/lib/types-message";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<MessageResponse | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { conversations, isLoading: conversationsLoading } = useConversations();
  const {
    messages,
    loading: messagesLoading,
    hasMore,
    typingUsers,
    sendMessage,
    loadMore,
    markAsRead,
    markConversationAsRead,
    startTyping,
    stopTyping,
  } = useMessages(selectedConversationId);

  // Get current conversation
  const currentConversation = conversations.find(
    (conv) => conv._id === selectedConversationId
  );

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (selectedConversationId && currentConversation && currentConversation.unreadCount > 0) {
      markConversationAsRead();
    }
  }, [selectedConversationId, currentConversation, markConversationAsRead]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
    setReplyingTo(null);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversationId(null);
    setReplyingTo(null);
  };

  const handleSendMessage = (content: string, type?: string, parentId?: string) => {
    sendMessage(content, type, parentId);
  };

  const handleReply = (message: MessageResponse) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const getOtherUser = (conversation: ConversationResponse) => {
    return conversation.sender;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-muted-foreground">
            Bạn cần đăng nhập để sử dụng tính năng tin nhắn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List - Desktop always visible, Mobile conditional */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r flex-shrink-0 h-full bg-muted/30",
          showMobileChat ? "hidden md:flex" : "flex"
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          loading={conversationsLoading}
          className="w-full h-full"
        />
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full max-h-full",
          !showMobileChat && !selectedConversationId ? "hidden md:flex" : "flex"
        )}
      >
        {selectedConversationId && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b px-4 py-3 flex items-center justify-between bg-background/95 backdrop-blur-sm flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-8 w-8 p-0"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getOtherUser(currentConversation)?.avatar} />
                      <AvatarFallback>
                        {getOtherUser(currentConversation)?.full_name?.charAt(0) ||
                         getOtherUser(currentConversation)?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <OnlineStatus 
                      userId={getOtherUser(currentConversation)?._id}
                      isOnline={getOtherUser(currentConversation)?.status || false}
                      size="sm"
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {getOtherUser(currentConversation)?.full_name ||
                       getOtherUser(currentConversation)?.username}
                    </h3>
                    <OnlineStatus 
                      userId={getOtherUser(currentConversation)?._id}
                      isOnline={getOtherUser(currentConversation)?.status || false}
                      showText={true}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Search className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Info className="w-4 h-4 mr-2" />
                      Thông tin
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Thành viên
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem className="text-destructive">
                      Chặn người dùng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-muted/20">
              <ScrollArea className="h-full px-4 py-6">
                <div className="space-y-3 max-w-4xl mx-auto">
                {/* Load more button */}
                {hasMore && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadMore}
                      disabled={messagesLoading}
                    >
                      {messagesLoading ? "Đang tải..." : "Tải thêm tin nhắn"}
                    </Button>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message, index) => {
                  const isOwn = message.sender_id === user.id;
                  const showAvatar = !isOwn && (
                    index === 0 || 
                    messages[index - 1]?.sender_id !== message.sender_id
                  );
                  const showTime = 
                    index === messages.length - 1 ||
                    messages[index + 1]?.sender_id !== message.sender_id ||
                    (new Date(messages[index + 1]?.created_at).getTime() - 
                     new Date(message.created_at).getTime()) > 5 * 60 * 1000; // 5 minutes

                  return (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      showTime={showTime}
                      onReply={handleReply}
                    />
                  );
                })}

                {/* Typing indicator */}
                <TypingIndicator 
                  users={typingUsers.map(userId => ({
                    id: userId,
                    name: getOtherUser(currentConversation)?.full_name || "User",
                    avatar: getOtherUser(currentConversation)?.avatar
                  }))}
                />

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0">
              <MessageInput
                onSendMessage={handleSendMessage}
                onStartTyping={startTyping}
                onStopTyping={stopTyping}
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
                disabled={messagesLoading}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h2>
              <p className="text-muted-foreground">
                Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
