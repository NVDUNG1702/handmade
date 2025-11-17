"use client";

import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageStatus } from "@/lib/types-message";

interface MessageStatusIconProps {
  status: MessageStatus;
  className?: string;
  showText?: boolean;
}

export function MessageStatusIcon({ status, className, showText = false }: MessageStatusIconProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "sent":
        return {
          icon: Check,
          color: "text-muted-foreground",
          text: "Đã gửi"
        };
      case "delivered":
        return {
          icon: CheckCheck,
          color: "text-muted-foreground",
          text: "Đã nhận"
        };
      case "read":
        return {
          icon: CheckCheck,
          color: "text-blue-500",
          text: "Đã xem"
        };
      case "failed":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          text: "Thất bại"
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          text: "Đang gửi"
        };
    }
  };

  const { icon: Icon, color, text } = getStatusConfig();

  if (showText) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Icon className={cn("w-3 h-3", color)} />
        <span className={cn("text-xs", color)}>{text}</span>
      </div>
    );
  }

  return <Icon className={cn("w-3 h-3", color, className)} />;
}

interface MessageTimestampProps {
  timestamp: string;
  status?: MessageStatus;
  isOwn?: boolean;
  className?: string;
}

export function MessageTimestamp({ 
  timestamp, 
  status, 
  isOwn = false, 
  className 
}: MessageTimestampProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={cn("flex items-center gap-1 text-xs opacity-70", className)}>
      <span>{formatTime(timestamp)}</span>
      {isOwn && status && <MessageStatusIcon status={status} />}
    </div>
  );
}
