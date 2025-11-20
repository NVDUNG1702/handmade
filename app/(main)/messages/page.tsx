"use client";

import { useState, useRef, useEffect } from "react";

// Scroll restoration timing constants
const SCROLL_RESTORE_DELAYS = {
  INITIAL: 50, // Initial delay for DOM update
  CONTENT_LOAD: 200, // Delay for lazy-loaded content
  UNBLOCK: 50, // Delay before unblocking scroll
} as const;

import { useAuth } from "@/components/auth-provider";
import { useMessages, useConversations } from "@/hooks/use-messages";
import { ConversationList } from "@/components/messages/conversation-list";
import { MessageBubble } from "@/components/messages/message-bubble";
import { MessageInput } from "@/components/messages/message-input";
import { TypingIndicator } from "@/components/messages/typing-indicator";
import { OnlineStatus } from "@/components/messages/online-status";
import { DateSeparator } from "@/components/messages/date-separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import type {
  MessageResponse,
  ConversationResponse,
} from "@/lib/types-message";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [replyingTo, setReplyingTo] = useState<MessageResponse | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isRestoringScroll = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef<number>(0);
  const scrollRestoreData = useRef<{
    oldHeight: number;
    oldScrollTop: number;
    oldCount: number;
  } | null>(null);

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

  // Restore scroll position after loading more
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isLoadingMore || !scrollRestoreData.current) return;

    const { oldHeight, oldScrollTop, oldCount } = scrollRestoreData.current;
    const newCount = messages.length;

    // Wait until messages actually increased
    if (newCount <= oldCount) {
      return;
    }

    // Update previousMessageCount to prevent scroll to bottom after unblock
    previousMessageCount.current = newCount;

    // Set flag to block all other scrolls
    isRestoringScroll.current = true;

    let rafId1: number;
    let rafId2: number;
    let timerId1: NodeJS.Timeout;
    let timerId2: NodeJS.Timeout;
    let timerId3: NodeJS.Timeout;

    // Wait for DOM to render - optimized timing
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        // Initial scroll restoration
        timerId1 = setTimeout(() => {
          if (!container || !scrollRestoreData.current) return;

          const newHeight = container.scrollHeight;
          const heightDiff = newHeight - oldHeight;
          const newScrollTop = oldScrollTop + heightDiff;

          // Set scroll position directly - NO animation
          container.scrollTop = newScrollTop;

          // Double-check after content loads (images/avatars)
          timerId2 = setTimeout(() => {
            if (!container) return;
            const finalHeight = container.scrollHeight;
            if (finalHeight !== newHeight) {
              const finalHeightDiff = finalHeight - oldHeight;
              const finalScrollTop = oldScrollTop + finalHeightDiff;
              container.scrollTop = finalScrollTop;
            }

            // Unblock scroll
            timerId3 = setTimeout(() => {
              isRestoringScroll.current = false;
              scrollRestoreData.current = null;
              setIsLoadingMore(false);
            }, SCROLL_RESTORE_DELAYS.UNBLOCK);
          }, SCROLL_RESTORE_DELAYS.CONTENT_LOAD);
        }, SCROLL_RESTORE_DELAYS.INITIAL);
      });
    });

    // Cleanup function
    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (timerId1) clearTimeout(timerId1);
      if (timerId2) clearTimeout(timerId2);
      if (timerId3) clearTimeout(timerId3);
    };
  }, [messages, isLoadingMore]);

  // Auto scroll to bottom when new messages arrive (not loading more)
  useEffect(() => {
    // Skip if loading more OR restoring scroll
    if (isLoadingMore || isRestoringScroll.current) {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Only scroll to bottom for initial load or new messages
    const currentCount = messages.length;
    const hasNewMessages = currentCount > previousMessageCount.current;
    previousMessageCount.current = currentCount;

    if (messagesEndRef.current && (isInitialLoad || hasNewMessages)) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
      });

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [messages, isInitialLoad, isLoadingMore]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (
      selectedConversationId &&
      currentConversation &&
      currentConversation.unreadCount > 0
    ) {
      markConversationAsRead();
    }
  }, [selectedConversationId, currentConversation, markConversationAsRead]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
    setReplyingTo(null);
    setIsInitialLoad(true);
    setIsLoadingMore(false);
    previousMessageCount.current = 0;
    scrollRestoreData.current = null;
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversationId(null);
    setReplyingTo(null);
    setIsLoadingMore(false);
  };

  const handleSendMessage = (
    content: string,
    type?: string,
    parentId?: string
  ) => {
    sendMessage(content, type, parentId);
  };

  const handleReply = (message: MessageResponse) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleLoadMore = async () => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;

    // Save exact scroll state
    scrollRestoreData.current = {
      oldHeight: container.scrollHeight,
      oldScrollTop: container.scrollTop,
      oldCount: messages.length,
    };

    // Block all auto-scroll
    setIsLoadingMore(true);

    try {
      await loadMore();
    } catch (error) {
      setIsLoadingMore(false);
      scrollRestoreData.current = null;
    }
  };

  const getOtherUser = (conversation: ConversationResponse) => {
    return conversation.sender;
  };

  // Helper to check if two dates are on different days
  const isSameDay = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
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
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Conversation List - Desktop always visible, Mobile conditional */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r flex-shrink-0 h-full bg-muted/30 overflow-hidden",
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
          "flex-1 flex flex-col h-full max-h-full overflow-hidden",
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
                      <AvatarImage
                        src={getOtherUser(currentConversation)?.avatar}
                      />
                      <AvatarFallback>
                        {getOtherUser(currentConversation)?.full_name?.charAt(
                          0
                        ) ||
                          getOtherUser(currentConversation)?.username?.charAt(
                            0
                          ) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {getOtherUser(currentConversation)?.full_name ||
                        getOtherUser(currentConversation)?.username}
                    </h3>
                    <OnlineStatus
                      userId={getOtherUser(currentConversation)?._id}
                      isOnline={
                        getOtherUser(currentConversation)?.status || false
                      }
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
              <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto px-4 py-6"
                style={{ scrollBehavior: isLoadingMore ? "auto" : "smooth" }}
              >
                <div className="space-y-3 max-w-4xl mx-auto">
                  {/* Load more button */}
                  {hasMore && (
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLoadMore}
                        disabled={messagesLoading || isLoadingMore}
                      >
                        {messagesLoading || isLoadingMore
                          ? "Đang tải..."
                          : "Tải thêm tin nhắn"}
                      </Button>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((message, index) => {
                    const isOwn = message.sender_id === user.id;
                    const showAvatar =
                      !isOwn &&
                      (index === 0 ||
                        messages[index - 1]?.sender_id !== message.sender_id);
                    const showTime =
                      index === messages.length - 1 ||
                      messages[index + 1]?.sender_id !== message.sender_id ||
                      new Date(messages[index + 1]?.created_at).getTime() -
                        new Date(message.created_at).getTime() >
                        5 * 60 * 1000; // 5 minutes

                    // Show date separator if this is first message or day changed
                    const showDateSeparator =
                      index === 0 ||
                      !isSameDay(
                        message.created_at,
                        messages[index - 1].created_at
                      );

                    return (
                      <div key={message._id}>
                        {showDateSeparator && (
                          <DateSeparator date={message.created_at} />
                        )}
                        <MessageBubble
                          message={message}
                          isOwn={isOwn}
                          showAvatar={showAvatar}
                          showTime={showTime}
                          onReply={handleReply}
                        />
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  <TypingIndicator
                    users={typingUsers.map((userId) => ({
                      id: userId,
                      name:
                        getOtherUser(currentConversation)?.full_name || "User",
                      avatar: getOtherUser(currentConversation)?.avatar,
                    }))}
                  />

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
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
              <h2 className="text-xl font-semibold mb-2">
                Chọn một cuộc trò chuyện
              </h2>
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
