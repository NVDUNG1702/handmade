"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  DollarSign,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useMyJobRequests } from "@/hooks/use-job-requests";
import Link from "next/link";
import { useMemo } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { data: myJobsData, isLoading } = useMyJobRequests({
    limit: 100, // Fetch enough to calculate basic stats
  });

  const jobs = useMemo(() => {
    if (!myJobsData) return [];
    
    // If it's already an array (unlikely given the types but possible fallback)
    if (Array.isArray(myJobsData)) return myJobsData;

    // If it's the ApiResponse object
    if (typeof myJobsData === "object" && "data" in myJobsData) {
      const payload = (myJobsData as any).data;
      
      // If payload is PaginatedResult (has data array)
      if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) {
        return payload.data;
      }
      
      // If payload is directly the array
      if (Array.isArray(payload)) {
        return payload;
      }
    }
    
    return [];
  }, [myJobsData]);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter((j: any) => j.status === "COMPLETED").length;
    const activeJobsCount = jobs.filter((j: any) =>
      ["OPEN", "IN_PROGRESS"].includes(j.status)
    ).length;
    // Mocking spending for now as we don't have transaction data
    const totalSpending = "0 VNĐ"; 

    return [
      {
        label: "Tổng chi tiêu",
        value: totalSpending,
        change: "+0%",
        icon: DollarSign,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Công việc đã đăng",
        value: totalJobs.toString(),
        change: `+${activeJobsCount} đang hoạt động`,
        icon: Briefcase,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        label: "Đang tìm thợ",
        value: jobs.filter((j: any) => j.status === "OPEN").length.toString(),
        change: "Cần tuyển",
        icon: Users,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        label: "Hoàn thành",
        value: completedJobs.toString(),
        change: "Đã xong",
        icon: CheckCircle,
        gradient: "from-orange-500 to-red-500",
      },
    ];
  }, [jobs]);

  const activeJobsList = useMemo(() => {
    return jobs
      .filter((j: any) => ["OPEN", "IN_PROGRESS", "ASSIGNED"].includes(j.status))
      .slice(0, 5);
  }, [jobs]);

  const formatCurrency = (value?: number) => {
    return value?.toLocaleString("vi-VN") || "0";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
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
                  {user?.full_name || "Khách hàng"}
                </span>
              </p>
            </div>
          </div>
          <Link href="/jobs/create">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Đăng công việc mới
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
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

        {/* Active Jobs */}
        <Card className="p-6 bg-card border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Công việc đang hoạt động
            </h2>
            <Link href="/dashboard/customer/jobs">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeJobsList.length > 0 ? (
            <div className="space-y-4">
              {activeJobsList.map((job: any) => (
                <Card
                  key={job.id}
                  className="p-4 border-border hover:border-primary/50 transition-all hover:bg-accent/5 bg-card"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">
                            {job.title}
                          </h3>
                          <Badge
                            variant={
                              job.status === "OPEN"
                                ? "outline"
                                : job.status === "IN_PROGRESS"
                                ? "secondary"
                                : "default"
                            }
                            className={
                              job.status === "OPEN"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : job.status === "IN_PROGRESS"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            }
                          >
                            {job.status === "OPEN"
                              ? "Đang tìm thợ"
                              : job.status === "IN_PROGRESS"
                              ? "Đang thực hiện"
                              : job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.application_count || 0} ứng viên
                          </span>
                          {/* <span>Thợ: {job.worker || "Chưa có"}</span> */}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(job.budget_min)} -{" "}
                          {formatCurrency(job.budget_max)}
                        </p>
                        <Link href={`/jobs/${job.job_slug || job.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
              Bạn chưa có công việc nào đang hoạt động.
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/jobs" className="block">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Tìm thợ
              </h3>
              <p className="text-sm text-muted-foreground">
                Khám phá thợ thủ công tài năng
              </p>
            </Card>
          </Link>

          <Link href="/messages" className="block">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary w-fit mb-4 group-hover:scale-110 transition-transform shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Tin nhắn
              </h3>
              <p className="text-sm text-muted-foreground">
                Trò chuyện với thợ của bạn
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/customer/history" className="block">
            <Card className="p-6 bg-card border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-primary w-fit mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Lịch sử
              </h3>
              <p className="text-sm text-muted-foreground">
                Xem lịch sử giao dịch
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
