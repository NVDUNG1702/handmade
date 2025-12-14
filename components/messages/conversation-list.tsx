"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MessageCircle,
  Pin,
  MoreVertical,
  Archive,
  Trash2,
  VolumeX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OnlineStatus } from "./online-status";
import type { ConversationResponse } from "@/lib/types-message";

interface ConversationListProps {
  conversations: ConversationResponse[];
  selectedConversationId?: string | null;
  onSelectConversation: (conversationId: string) => void;
  onStartNewChat?: () => void;
  loading?: boolean;
  className?: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onStartNewChat,
  loading = false,
  className,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.sender?.full_name?.toLowerCase().includes(query) ||
      conv.sender?.username?.toLowerCase().includes(query) ||
      conv.lastMessage?.content?.toLowerCase().includes(query)
    );
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 0 ? "Vừa xong" : `${minutes} phút`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} ngày`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const getOtherUser = (conversation: ConversationResponse) => {
    return conversation.sender;
  };

  if (loading) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="p-4 border-b">
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
          {onStartNewChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartNewChat}
              className="h-8 w-8 p-0"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "Không tìm thấy cuộc trò chuyện"
                : "Chưa có tin nhắn nào"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const isSelected = selectedConversationId === conversation._id;

                return (
                  <div
                    key={conversation._id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group hover:bg-muted/50",
                      isSelected && "bg-muted"
                    )}
                    onClick={() => onSelectConversation(conversation._id)}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <Link 
                        href={`/profile/${otherUser?.slug || "#"}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser?.avatar} />
                          <AvatarFallback>
                            {otherUser?.full_name?.charAt(0) ||
                              otherUser?.username?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      {/* Online indicator */}
                      <OnlineStatus
                        userId={otherUser?._id}
                        isOnline={otherUser?.status || false}
                        size="md"
                        className="absolute bottom-0 right-0 pointer-events-none"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">
                          {otherUser?.full_name || otherUser?.username}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {conversation.lastMessage && (
                            <span>
                              {formatTime(conversation.lastMessage.created_at)}
                            </span>
                          )}
                          {/* Pinned indicator */}
                          {/* TODO: Add pinned field to conversation */}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content ||
                            "Chưa có tin nhắn"}
                        </p>

                        <div className="flex items-center gap-1">
                          {/* Unread count */}
                          {conversation.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="h-5 min-w-[20px] text-xs px-1.5"
                            >
                              {conversation.unreadCount > 99
                                ? "99+"
                                : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pin className="w-4 h-4 mr-2" />
                            Ghim
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <VolumeX className="w-4 h-4 mr-2" />
                            Tắt thông báo
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Lưu trữ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
