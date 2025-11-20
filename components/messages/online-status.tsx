"use client";

import { cn } from "@/lib/utils";
import { useUserPresence } from "@/hooks/use-presence";
import { useLiveTime } from "@/hooks/use-live-time";

interface OnlineStatusProps {
  userId?: string; // For real-time presence
  isOnline?: boolean; // Fallback static value
  lastSeen?: string; // Fallback static value
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function OnlineStatus({
  userId,
  isOnline: fallbackIsOnline,
  lastSeen: fallbackLastSeen,
  size = "md",
  showText = false,
  className,
}: OnlineStatusProps) {
  // Use real-time presence if userId provided, otherwise fallback to props
  const { isOnline: realtimeIsOnline, lastSeen: realtimeLastSeen } =
    useUserPresence(userId);

  const isOnline = userId ? realtimeIsOnline : fallbackIsOnline || false;
  const lastSeen = userId ? realtimeLastSeen : fallbackLastSeen;

  // Live updating time text
  const liveTimeText = useLiveTime(lastSeen, isOnline);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (showText) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "rounded-full border border-background shadow-sm",
            sizeClasses[size],
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
        <span className="text-xs text-muted-foreground">
          {liveTimeText || "Không hoạt động"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full border border-background shadow-sm",
        sizeClasses[size],
        isOnline ? "bg-green-500" : "bg-gray-400",
        className
      )}
      title={liveTimeText || "Không hoạt động"}
    />
  );
}
