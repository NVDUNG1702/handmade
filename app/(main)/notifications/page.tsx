"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "job",
      icon: Briefcase,
      title: "Công việc mới phù hợp với bạn",
      description: "Làm túi xách da thủ công cao cấp - 1.2M VNĐ",
      time: "5 phút trước",
      unread: true,
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 2,
      type: "message",
      icon: MessageSquare,
      title: "Tin nhắn mới từ Nguyễn Thị Mai",
      description: "Cảm ơn bạn đã hoàn thành công việc!",
      time: "10 phút trước",
      unread: true,
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 3,
      type: "review",
      icon: Star,
      title: "Đánh giá mới",
      description: "Trần Văn Nam đã đánh giá 5 sao cho công việc của bạn",
      time: "1 giờ trước",
      unread: true,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: 4,
      type: "payment",
      icon: DollarSign,
      title: "Thanh toán thành công",
      description: "Bạn đã nhận được 1.2M VNĐ từ Lê Thị Hoa",
      time: "2 giờ trước",
      unread: false,
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 5,
      type: "job_complete",
      icon: CheckCircle,
      title: "Công việc hoàn thành",
      description: "Công việc 'Thêu logo' đã được đánh dấu hoàn thành",
      time: "3 giờ trước",
      unread: false,
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 6,
      type: "application",
      icon: AlertCircle,
      title: "Ứng tuyển mới",
      description: "Phạm Minh Tuấn đã ứng tuyển công việc của bạn",
      time: "5 giờ trước",
      unread: false,
      color: "from-orange-400 to-red-500",
    },
    {
      id: 7,
      type: "like",
      icon: Heart,
      title: "Lượt thích mới",
      description: "Bài viết của bạn đã nhận được 15 lượt thích mới",
      time: "1 ngày trước",
      unread: false,
      color: "from-pink-400 to-rose-500",
    },
    {
      id: 8,
      type: "follow",
      icon: UserPlus,
      title: "Người theo dõi mới",
      description: "Hoàng Thị Lan đã bắt đầu theo dõi bạn",
      time: "1 ngày trước",
      unread: false,
      color: "from-blue-400 to-indigo-500",
    },
    {
      id: 9,
      type: "trending",
      icon: TrendingUp,
      title: "Bài viết của bạn đang thịnh hành",
      description: "'10 Xu hướng handmade 2024' đã đạt 1000 lượt xem",
      time: "2 ngày trước",
      unread: false,
      color: "from-purple-400 to-pink-500",
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">Thông báo</h1>
              {unreadCount > 0 && <Badge className="bg-primary text-white">{unreadCount} mới</Badge>}
            </div>
            <p className="text-muted-foreground">Cập nhật mới nhất về hoạt động của bạn</p>
          </div>
          <Button variant="outline" className="border-white/20 glass-card bg-transparent">
            Đánh dấu đã đọc tất cả
          </Button>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border-white/20 hover:border-white/40 transition-all hover:scale-[1.01] glass-card cursor-pointer ${
                notification.unread ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${notification.color} shrink-0`}>
                  <notification.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    {notification.unread && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" className="border-white/20 glass-card bg-transparent">
            Xem thêm thông báo
          </Button>
        </div>
      </div>
    </div>
  )
}
