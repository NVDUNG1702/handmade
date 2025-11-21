"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  MessageSquare,
  Star,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Heart,
  UserPlus,
  TrendingUp,
  Bell,
  Package,
  MessageCircle,
  Share2,
  Calendar,
  Award,
  Megaphone,
  Loader2,
} from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/use-notifications";
import { NotificationType, NotificationStatus } from "@/lib/types-notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

// Icon mapping cho các loại notification
const notificationIconMap: Record<NotificationType, any> = {
  [NotificationType.SYSTEM]: Bell,
  [NotificationType.ORDER]: Package,
  [NotificationType.MESSAGE]: MessageCircle,
  [NotificationType.COMMENT]: MessageSquare,
  [NotificationType.REVIEW]: Star,
  [NotificationType.FOLLOW]: UserPlus,
  [NotificationType.LIKE]: Heart,
  [NotificationType.SHARE]: Share2,
  [NotificationType.EVENT]: Calendar,
  [NotificationType.BADGE]: Award,
  [NotificationType.PROMOTION]: Megaphone,
  [NotificationType.JOB_APPLICATION]: Briefcase,
};

// Color mapping cho các loại notification
const notificationColorMap: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: "from-blue-400 to-cyan-500",
  [NotificationType.ORDER]: "from-green-400 to-emerald-500",
  [NotificationType.MESSAGE]: "from-blue-400 to-indigo-500",
  [NotificationType.COMMENT]: "from-purple-400 to-pink-500",
  [NotificationType.REVIEW]: "from-yellow-400 to-orange-500",
  [NotificationType.FOLLOW]: "from-blue-400 to-indigo-500",
  [NotificationType.LIKE]: "from-pink-400 to-rose-500",
  [NotificationType.SHARE]: "from-teal-400 to-cyan-500",
  [NotificationType.EVENT]: "from-purple-400 to-pink-500",
  [NotificationType.BADGE]: "from-yellow-400 to-orange-500",
  [NotificationType.PROMOTION]: "from-orange-400 to-red-500",
  [NotificationType.JOB_APPLICATION]: "from-blue-400 to-cyan-500",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useNotifications({ page, limit });
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleNotificationClick = async (
    notificationId: string,
    actionUrl?: string
  ) => {
    // Đánh dấu đã đọc
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }

    // Điều hướng nếu có action_url
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined);
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return "Vừa xong";

    try {
      const dateObj = new Date(date);
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return "Vừa xong";
      }
      return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
    } catch (error) {
      return "Vừa xong";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Lỗi tải thông báo</h2>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Không thể tải thông báo. Vui lòng thử lại sau."}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tải lại
          </Button>
        </Card>
      </div>
    );
  }

  const unreadCount = data?.unread_count || 0;
  const notifications = data?.notifications || [];
  const hasMore = data ? page < data.totalPages : false;

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">Thông báo</h1>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-white">
                  {unreadCount} mới
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Cập nhật mới nhất về hoạt động của bạn
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="border-white/20 glass-card bg-transparent"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đánh dấu đã đọc tất cả"
              )}
            </Button>
          )}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card className="p-12 text-center border-white/20 glass-card">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Không có thông báo</h2>
            <p className="text-muted-foreground">Bạn chưa có thông báo nào</p>
          </Card>
        )}

        {/* Notifications */}
        <div className="space-y-3">
          {notifications.map((notification) => {
            const IconComponent =
              notificationIconMap[notification.type] || Bell;
            const color =
              notificationColorMap[notification.type] ||
              "from-gray-400 to-gray-500";
            const isUnread = notification.status === NotificationStatus.UNREAD;

            return (
              <Card
                key={notification.id}
                className={`p-4 border-white/20 hover:border-white/40 transition-all hover:scale-[1.01] glass-card cursor-pointer ${
                  isUnread ? "bg-primary/5" : ""
                }`}
                onClick={() =>
                  handleNotificationClick(
                    notification.id,
                    notification.action_url
                  )
                }
              >
                <div className="flex items-start gap-4">
                  {notification.sender?.avatar_url ? (
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarImage
                        src={notification.sender.avatar_url}
                        alt={notification.sender.full_name}
                      />
                      <AvatarFallback>
                        {notification.sender.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${color} shrink-0`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {isUnread && (
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(notification.created_at)}
                      </p>
                      {notification.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          Quan trọng
                        </Badge>
                      )}
                      {notification.priority === "urgent" && (
                        <Badge
                          variant="destructive"
                          className="text-xs animate-pulse"
                        >
                          Khẩn cấp
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-white/20 glass-card bg-transparent"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xem thêm thông báo"
              )}
            </Button>
          </div>
        )}

        {/* Total count */}
        {data && data.total > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Hiển thị {notifications.length} / {data.total} thông báo
          </p>
        )}
      </div>
    </div>
  );
}
