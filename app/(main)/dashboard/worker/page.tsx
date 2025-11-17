"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Award,
  Target,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function WorkerDashboardPage() {
  const stats = [
    {
      label: "Tổng thu nhập",
      value: "45.5M VNĐ",
      change: "+12.5%",
      icon: DollarSign,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      label: "Công việc hoàn thành",
      value: "127",
      change: "+8",
      icon: CheckCircle,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Đánh giá trung bình",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      label: "Tỷ lệ hoàn thành",
      value: "96%",
      change: "+3%",
      icon: TrendingUp,
      gradient: "from-purple-400 to-pink-500",
    },
  ]

  const recentJobs = [
    {
      id: 1,
      title: "Làm túi xách da thủ công",
      customer: "Nguyễn Thị Mai",
      avatar: "M",
      price: "1.2M VNĐ",
      status: "in-progress",
      progress: 65,
      deadline: "2 ngày",
      location: "Hà Nội",
      category: "Da thủ công",
    },
    {
      id: 2,
      title: "Thêu logo lên áo",
      customer: "Trần Văn Nam",
      avatar: "N",
      price: "500K VNĐ",
      status: "pending",
      progress: 0,
      deadline: "5 ngày",
      location: "TP.HCM",
      category: "Thêu",
    },
    {
      id: 3,
      title: "Đan khăn len handmade",
      customer: "Lê Thị Hoa",
      avatar: "H",
      price: "800K VNĐ",
      status: "completed",
      progress: 100,
      deadline: "Hoàn thành",
      location: "Đà Nẵng",
      category: "Đan len",
    },
  ]

  const skills = [
    { name: "Da thủ công", level: 95, jobs: 45 },
    { name: "Thêu tay", level: 88, jobs: 32 },
    { name: "Đan len", level: 82, jobs: 28 },
    { name: "Gốm sứ", level: 75, jobs: 22 },
  ]

  const activities = [
    {
      time: "2 giờ trước",
      action: "Hoàn thành công việc",
      detail: "Làm túi xách da cao cấp",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      time: "5 giờ trước",
      action: "Nhận công việc mới",
      detail: "Thêu logo lên áo",
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      time: "1 ngày trước",
      action: "Nhận đánh giá 5 sao",
      detail: "Từ khách hàng Nguyễn Thị Mai",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      time: "2 ngày trước",
      action: "Đạt mốc thu nhập",
      detail: "45M VNĐ trong tháng này",
      icon: Award,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              N
            </div>
            <div>
              <h1 className="text-4xl font-bold text-balance mb-1">Dashboard</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Chào mừng trở lại, <span className="font-semibold text-foreground">Nguyễn Văn A</span>
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Top Worker
                </Badge>
              </p>
            </div>
          </div>
          <Link href="/jobs">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all">
              <Briefcase className="w-4 h-4 mr-2" />
              Tìm công việc mới
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card p-6 border-white/20 hover:scale-105 transition-transform group">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}
                >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Công việc gần đây</h2>
                <Link href="/jobs">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-5 border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] bg-background/50 backdrop-blur-sm group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={
                                job.status === "completed"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : job.status === "in-progress"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }
                            >
                              {job.status === "completed"
                                ? "Hoàn thành"
                                : job.status === "in-progress"
                                  ? "Đang làm"
                                  : "Chờ xác nhận"}
                            </Badge>
                            <Badge variant="outline" className="border-white/20">
                              {job.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-sm font-bold">
                              {job.avatar}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Khách hàng: <span className="text-foreground font-medium">{job.customer}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.deadline}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          </div>

                          {job.status === "in-progress" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Tiến độ</span>
                                <span className="font-semibold">{job.progress}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}
                        </div>

                        <div className="text-right space-y-3">
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {job.price}
                          </p>
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                              Chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Kỹ năng của bạn</h2>
                <Link href="/profile/1">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Chỉnh sửa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{skill.name}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {skill.jobs} công việc
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-2xl font-bold mb-6">Hoạt động gần đây</h2>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 h-fit group-hover:scale-110 transition-transform`}
                    >
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Mục tiêu tháng này</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thu nhập</span>
                    <span className="font-semibold">45.5M / 50M VNĐ</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Công việc hoàn thành</span>
                    <span className="font-semibold">8 / 10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Đánh giá 5 sao</span>
                    <span className="font-semibold">12 / 15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/dashboard/worker/schedule">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lịch làm việc</h3>
              <p className="text-sm text-muted-foreground">Quản lý lịch trình công việc của bạn</p>
            </Card>
          </Link>

          <Link href="/profile/1#reviews">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Đánh giá</h3>
              <p className="text-sm text-muted-foreground">Xem đánh giá từ khách hàng</p>
            </Card>
          </Link>

          <Link href="/dashboard/worker/earnings">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-primary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Thu nhập</h3>
              <p className="text-sm text-muted-foreground">Theo dõi thu nhập chi tiết</p>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tin nhắn</h3>
              <p className="text-sm text-muted-foreground">Trò chuyện với khách hàng</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
