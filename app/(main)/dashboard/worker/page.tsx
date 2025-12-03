"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useMyApplications } from "@/hooks/use-job-requests";
import { useMemo } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function WorkerDashboardPage() {
  const { user } = useAuthStore();
  const { data: myApplicationsData, isLoading } = useMyApplications({
    limit: 100,
  });

  const applications = useMemo(() => {
    if (!myApplicationsData) return [];
    if (Array.isArray(myApplicationsData)) return myApplicationsData;
    if (typeof myApplicationsData === "object" && "data" in myApplicationsData) {
      return (myApplicationsData as any).data || [];
    }
    return [];
  }, [myApplicationsData]);

  const stats = useMemo(() => {
    const totalApplications = applications.length;
    const acceptedApplications = applications.filter(
      (app: any) => app.status === "ACCEPTED"
    ).length;
    // Mocking income for now
    const totalIncome = "0 VNĐ";
    // Mocking rating for now
    const averageRating = "5.0";

    return [
      {
        label: "Tổng thu nhập",
        value: totalIncome,
        change: "+0%",
        icon: DollarSign,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        label: "Công việc đã nhận",
        value: acceptedApplications.toString(),
        change: `Trong tổng số ${totalApplications} ứng tuyển`,
        icon: CheckCircle,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Đánh giá trung bình",
        value: averageRating,
        change: "+0.0",
        icon: Star,
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        label: "Tỷ lệ trúng tuyển",
        value: totalApplications > 0
          ? `${Math.round((acceptedApplications / totalApplications) * 100)}%`
          : "0%",
        change: "So với tháng trước",
        icon: TrendingUp,
        gradient: "from-purple-500 to-pink-500",
      },
    ];
  }, [applications]);

  const recentJobs = useMemo(() => {
    return applications.slice(0, 5).map((app: any) => ({
      id: app.job_request?.id,
      title: app.job_request?.title || "Công việc không xác định",
      customer: app.job_request?.created_by?.full_name || "Ẩn danh",
      avatar: app.job_request?.created_by?.full_name?.charAt(0) || "U",
      price: `${(app.job_request?.budget_min || 0).toLocaleString("vi-VN")} - ${(
        app.job_request?.budget_max || 0
      ).toLocaleString("vi-VN")} VNĐ`,
      status: app.status, // PENDING, ACCEPTED, REJECTED
      deadline: app.job_request?.deadline
        ? new Date(app.job_request.deadline).toLocaleDateString("vi-VN")
        : "Không có hạn",
      location: app.job_request?.location || "Toàn quốc",
      category: app.job_request?.required_skill?.name || "Khác",
    }));
  }, [applications]);

  // Mock skills for now as we don't have a user skills endpoint yet
  const skills = [
    { name: "Thủ công", level: 80, jobs: 10 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-1">
                Dashboard
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Chào mừng trở lại,{" "}
                <span className="font-semibold text-foreground">
                  {user?.full_name || "Thợ thủ công"}
                </span>
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Thợ thủ công
                </Badge>
              </p>
            </div>
          </div>
          <Link href="/jobs">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg hover:shadow-xl transition-all text-primary-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              Tìm công việc mới
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground"
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Công việc gần đây
                </h2>
                <Link href="/jobs">
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.map((job: any) => (
                    <Card
                      key={job.id}
                      className="p-5 border-border hover:border-primary/50 transition-all hover:bg-accent/5 bg-card group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className={
                                  job.status === "ACCEPTED"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : job.status === "PENDING"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                }
                              >
                                {job.status === "ACCEPTED"
                                  ? "Đã nhận"
                                  : job.status === "PENDING"
                                  ? "Đang chờ"
                                  : "Đã từ chối"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-border text-muted-foreground"
                              >
                                {job.category}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-sm font-bold">
                                {job.avatar}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Khách hàng:{" "}
                                <span className="text-foreground font-medium">
                                  {job.customer}
                                </span>
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
                          </div>

                          <div className="text-right space-y-3">
                            <p className="text-lg font-bold text-primary">
                              {job.price}
                            </p>
                            <Link href={`/jobs/${job.id}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                              >
                                Chi tiết
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Bạn chưa ứng tuyển công việc nào.
                </div>
              )}
            </Card>

            <Card className="p-6 bg-card border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Kỹ năng của bạn
                </h2>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
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
                        <span className="font-semibold text-foreground">
                          {skill.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 text-xs"
                        >
                          {skill.jobs} công việc
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Mục tiêu tháng này
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thu nhập</span>
                    <span className="font-semibold text-foreground">
                      0 / 50M VNĐ
                    </span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Công việc hoàn thành
                    </span>
                    <span className="font-semibold text-foreground">0 / 10</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/dashboard/worker/schedule">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Lịch làm việc
              </h3>
              <p className="text-sm text-muted-foreground">
                Quản lý lịch trình công việc của bạn
              </p>
            </Card>
          </Link>

          <Link href="/profile#reviews">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Đánh giá
              </h3>
              <p className="text-sm text-muted-foreground">
                Xem đánh giá từ khách hàng
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/worker/earnings">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-primary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Thu nhập
              </h3>
              <p className="text-sm text-muted-foreground">
                Theo dõi thu nhập chi tiết
              </p>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Tin nhắn
              </h3>
              <p className="text-sm text-muted-foreground">
                Trò chuyện với khách hàng
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
