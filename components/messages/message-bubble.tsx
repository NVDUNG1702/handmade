"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Reply,
  Copy,
  Edit,
  Trash2,
  Heart,
} from "lucide-react";
import { MessageTimestamp } from "./message-status";
import { cn } from "@/lib/utils";
import type { MessageResponse } from "@/lib/types-message";

interface MessageBubbleProps {
  message: MessageResponse;
  isOwn: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
  onReply?: (message: MessageResponse) => void;
  onEdit?: (message: MessageResponse) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, reaction: string) => void;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTime = true,
  onReply,
  onEdit,
  onDelete,
  onReact,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status icon handling moved to MessageTimestamp component

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar} />
          <AvatarFallback>
            {message.sender?.full_name?.charAt(0) || 
             message.sender?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {/* Sender Name (for group chats) */}
        {!isOwn && showAvatar && (
          <div className="text-xs text-muted-foreground mb-1">
            {message.sender?.full_name || message.sender?.username}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-4 py-2 rounded-2xl max-w-full break-words",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          {/* Reply indicator */}
          {message.parent_id && (
            <div className="text-xs opacity-70 mb-1 border-l-2 border-current pl-2">
              Trả lời tin nhắn
            </div>
          )}

          {/* Message content */}
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="text-xs bg-black/10 rounded px-2 py-1"
                >
                  📎 {attachment}
                </div>
              ))}
            </div>
          )}

          {/* Message metadata */}
          {showTime && (
            <div
              className={cn(
                "mt-1",
                isOwn ? "text-right" : "text-left"
              )}
            >
              <MessageTimestamp 
                timestamp={message.created_at}
                status={message.status}
                isOwn={isOwn}
              />
            </div>
          )}
        </div>

        {/* System message styling */}
        {message.type === "system" && (
          <div className="text-xs text-center text-muted-foreground bg-muted/50 rounded-full px-3 py-1 mx-auto">
            {message.content}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {showActions && message.type !== "system" && (
        <div
          className={cn(
            "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Quick reactions */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onReact?.(message._id, "❤️")}
          >
            <Heart className="w-3 h-3" />
          </Button>

          {/* Reply */}
          {onReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onReply(message)}
            >
              <Reply className="w-3 h-3" />
            </Button>
          )}

          {/* More actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwn ? "end" : "start"}>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Sao chép
              </DropdownMenuItem>
              
              {onReply && (
                <DropdownMenuItem onClick={() => onReply(message)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Trả lời
                </DropdownMenuItem>
              )}

              {isOwn && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(message)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}

              {isOwn && onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(message._id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
