"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomToastProps {
  type?: "message" | "notification" | "success" | "error" | "info";
  title: string;
  description?: string;
  avatar?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CustomToast({
  type = "info",
  title,
  description,
  avatar,
  actionLabel,
  onAction,
}: CustomToastProps) {
  // Icon mapping
  const icons = {
    message: <MessageCircle className="w-4 h-4" />,
    notification: <Bell className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  // Solid background colors - NO transparency
  const styles = {
    message: {
      bg: "bg-blue-500 dark:bg-blue-600",
      text: "text-white",
      icon: "text-white",
      button: "bg-white/20 hover:bg-white/30 text-white border-white/30",
    },
    notification: {
      bg: "bg-amber-500 dark:bg-amber-600",
      text: "text-white",
      icon: "text-white",
      button: "bg-white/20 hover:bg-white/30 text-white border-white/30",
    },
    success: {
      bg: "bg-green-500 dark:bg-green-600",
      text: "text-white",
      icon: "text-white",
      button: "bg-white/20 hover:bg-white/30 text-white border-white/30",
    },
    error: {
      bg: "bg-red-500 dark:bg-red-600",
      text: "text-white",
      icon: "text-white",
      button: "bg-white/20 hover:bg-white/30 text-white border-white/30",
    },
    info: {
      bg: "bg-slate-700 dark:bg-slate-800",
      text: "text-white",
      icon: "text-white",
      button: "bg-white/20 hover:bg-white/30 text-white border-white/30",
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-lg shadow-lg min-w-[320px] max-w-[420px]",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        style.bg
      )}
    >
      {/* Avatar or Icon */}
      {avatar ? (
        <Avatar className="w-9 h-9 flex-shrink-0 border-2 border-white/30">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-white/20 text-white text-xs">
            {title.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className={cn("flex-shrink-0", style.icon)}>{icons[type]}</div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-sm font-semibold line-clamp-1", style.text)}>
          {title}
        </h4>
        {description && (
          <p
            className={cn("text-xs mt-0.5 line-clamp-2 opacity-90", style.text)}
          >
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium",
            "transition-colors border",
            style.button
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Formatted time ago helper
export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Vừa xong";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  return `${Math.floor(seconds / 86400)} ngày trước`;
}
