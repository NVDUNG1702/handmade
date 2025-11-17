"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Briefcase, Users, Clock, CheckCircle, ArrowRight, Search, MessageSquare } from "lucide-react"

export default function CustomerDashboardPage() {
  const stats = [
    {
      label: "Tổng chi tiêu",
      value: "28.3M VNĐ",
      change: "+15.2%",
      icon: DollarSign,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Công việc đã đăng",
      value: "45",
      change: "+5",
      icon: Briefcase,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "Thợ đã thuê",
      value: "23",
      change: "+3",
      icon: Users,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      label: "Hoàn thành",
      value: "38",
      change: "+7",
      icon: CheckCircle,
      gradient: "from-orange-400 to-red-500",
    },
  ]

  const activeJobs = [
    {
      id: 1,
      title: "Làm túi xách da thủ công",
      worker: "Nguyễn Văn B",
      price: "1.2M VNĐ",
      status: "in-progress",
      progress: 65,
      applicants: 8,
    },
    {
      id: 2,
      title: "Thêu logo lên áo",
      worker: "Chưa chọn thợ",
      price: "500K VNĐ",
      status: "pending",
      progress: 0,
      applicants: 12,
    },
    {
      id: 3,
      title: "Đan khăn len handmade",
      worker: "Trần Thị C",
      price: "800K VNĐ",
      status: "review",
      progress: 100,
      applicants: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Quản lý công việc của bạn</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Đăng công việc mới
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card p-6 border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Active Jobs */}
        <Card className="glass-card p-6 border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Công việc đang hoạt động</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Card
                key={job.id}
                className="p-4 border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] bg-background/50 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge
                          variant={
                            job.status === "review" ? "default" : job.status === "in-progress" ? "secondary" : "outline"
                          }
                          className={
                            job.status === "review"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              : job.status === "in-progress"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {job.status === "review"
                            ? "Chờ đánh giá"
                            : job.status === "in-progress"
                              ? "Đang làm"
                              : "Chờ chọn thợ"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants} ứng viên
                        </span>
                        <span>Thợ: {job.worker}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xl font-bold text-primary">{job.price}</p>
                      <Button size="sm" variant="outline" className="border-white/20 bg-transparent">
                        Chi tiết
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {job.status !== "pending" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tìm thợ</h3>
            <p className="text-sm text-muted-foreground">Khám phá thợ thủ công tài năng</p>
          </Card>

          <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary w-fit mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tin nhắn</h3>
            <p className="text-sm text-muted-foreground">Trò chuyện với thợ của bạn</p>
          </Card>

          <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
            <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-primary w-fit mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Lịch sử</h3>
            <p className="text-sm text-muted-foreground">Xem lịch sử giao dịch</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
