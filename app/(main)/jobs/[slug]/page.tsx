"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  Clock,
  Star,
  Briefcase,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Calendar,
  User,
  Eye,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios-instance";
import type { ApiResponse } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/auth-store";
import { useJobRequests, useJobRequestById } from "@/hooks/use-job-requests";
import { JobActionMenu } from "@/components/job/JobActionMenu";

// Utility function to format time
const formatTimeAgo = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hôm nay";
  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
  return `${Math.floor(diffInDays / 365)} năm trước`;
};

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDeadline = (
  deadline?: string | Date,
  daysRemaining?: number
): string => {
  if (typeof daysRemaining === "number") {
    if (daysRemaining > 0) return `Còn ${daysRemaining} ngày`;
    if (daysRemaining === 0) return "Hết hạn hôm nay";
    return `Đã hết hạn ${Math.abs(daysRemaining)} ngày`;
  }
  if (deadline) {
    const d = new Date(deadline);
    if (!isNaN(d.getTime())) {
      const now = new Date();
      const diffDays = Math.floor(
        (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 0) return `Còn ${diffDays} ngày`;
      if (diffDays === 0) return "Hết hạn hôm nay";
      return `Đã hết hạn ${Math.abs(diffDays)} ngày`;
    }
  }
  return "Không giới hạn";
};

export default function JobDetailPage() {
  const { user } = useAuthStore();
  const params = useParams<{ slug: string }>();
  const { data: jobData, isLoading: loading, error: queryError } = useJobRequestById(params?.slug);
  const job = jobData as any;
  const error = queryError ? (queryError as any).message || "Có lỗi xảy ra" : null;

  const { data: similarJobsData } = useJobRequests({
    limit: 4,
    skill_id: job?.required_skill?.id,
  });

  const similarJobs = (similarJobsData?.data || [])
    .filter((j: any) => j.id !== job?.id)
    .slice(0, 3);

  // Effect to handle title update or other side effects if needed
  useEffect(() => {
    if (job?.title) {
      document.title = `${job.title} | Handmade`;
    }
  }, [job]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Không tìm thấy công việc</h2>
          <p className="text-muted-foreground">{error || "Công việc này không tồn tại hoặc đã bị xóa"}</p>
          <Link href="/jobs">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 pt-8">
        {/* Back button */}
        <Link href="/jobs">
          <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="relative overflow-hidden border-border bg-card text-card-foreground shadow-sm">
              <div className="relative h-64 w-full">
                <Image
                  src={(job.images && job.images[0]) || "/placeholder.svg"}
                  alt={job.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-primary text-primary-foreground border-0">
                        {(job as any).category ||
                          job.required_skill?.name ||
                          "Công việc"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-500 text-white border-0"
                      >
                        {job.status === "OPEN" ? "Đang tuyển" : "Đã đóng"}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-white text-balance mb-1 line-clamp-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Đăng{" "}
                          {job.created_at
                            ? formatTimeAgo(job.created_at)
                            : (job as any).postedDate || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{job.view_count || 0} lượt xem</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.id === job.created_by?.id ? (
                      <JobActionMenu 
                        job={{
                          id: job.id,
                          title: job.title,
                          status: job.status,
                          job_slug: job.job_slug
                        }}
                        triggerVariant="outline"
                        className="border-white/30 bg-black/20 backdrop-blur text-white hover:bg-white/20 hover:text-white hover:border-white/50"
                      />
                    ) : (
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/30 bg-black/20 backdrop-blur text-white hover:bg-white/20 hover:text-white hover:border-white/50"
                        aria-label="Yêu thích"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-white/30 bg-black/20 backdrop-blur text-white hover:bg-white/20 hover:text-white hover:border-white/50"
                      aria-label="Chia sẻ"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
              <h2 className="text-xl font-bold mb-4">Mô tả công việc</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </Card>

            {/* Skills Required */}
            <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
              <h2 className="text-xl font-bold mb-4">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {/* Check if skills is array of strings or objects */}
                {(Array.isArray(job.skills) ? job.skills : []).map((skill: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </Badge>
                ))}
                {(!job.skills || job.skills.length === 0) && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm"
                  >
                    {job.required_skill?.name || "Kỹ năng"}
                  </Badge>
                )}
              </div>
            </Card>

            {/* Requirements - If available in API */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
                <h2 className="text-xl font-bold mb-4">Yêu cầu</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Deliverables - If available in API */}
            {job.deliverables && job.deliverables.length > 0 && (
              <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
                <h2 className="text-xl font-bold mb-4">Sản phẩm bàn giao</h2>
                <ul className="space-y-3">
                  {job.deliverables.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <p className="text-white/90 text-sm mb-1">Ngân sách</p>
                  <p className="text-2xl font-bold text-white">
                    {job.price ||
                      `${job.budget_min?.toLocaleString("vi-VN") || "0"} - ${
                        job.budget_max?.toLocaleString("vi-VN") || "0"
                      } ${job.currency || "VND"}`}
                  </p>
                </div>

                {user?.id === job.created_by?.id ? (
                  <>
                    <Link href={`/jobs/edit/${job.id}`} className="block w-full">
                      <Button className="w-full h-12 text-base font-semibold shadow-md bg-orange-500 hover:bg-orange-600 text-white">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Chỉnh sửa công việc
                      </Button>
                    </Link>
                    <Link href={`/dashboard/customer/jobs/${job.id}/applications`} className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full h-12 border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Xem ứng viên ({job.application_count || 0})
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/jobs/${job.job_slug || job.id}/apply`} className="block w-full">
                      <Button className="w-full h-12 text-base font-semibold shadow-md">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Ứng tuyển ngay
                      </Button>
                    </Link>

                    <Link 
                      href={`/messages?slug=${job.created_by?.slug || ""}&name=${encodeURIComponent(job.created_by?.full_name || "")}&avatar=${encodeURIComponent(job.created_by?.avatar_url || "")}&username=${encodeURIComponent(job.created_by?.username || "")}`} 
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Nhắn tin
                      </Button>
                    </Link>
                  </>
                )}

                <div className="pt-4 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Ứng viên</p>
                      <p className="font-semibold text-foreground">
                        {job.application_count || job.applicants || 0} người
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Thời hạn</p>
                      <p className="font-semibold text-foreground">
                        {formatDeadline(
                          job.deadline as any,
                          job.days_remaining as any
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Địa điểm</p>
                      <p className="font-semibold text-foreground">
                        {job.location || job.city || "Toàn quốc"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Về khách hàng
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Link href={job.created_by?.slug ? `/profile/${job.created_by.slug}` : "#"}>
                    {job.created_by?.avatar_url ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border hover:opacity-80 transition-opacity">
                        <Image 
                          src={job.created_by.avatar_url} 
                          alt={job.created_by.full_name || "User"} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg hover:opacity-80 transition-opacity">
                        {job.created_by?.full_name?.charAt(0) ||
                          job.customer?.name?.charAt(0) ||
                          "C"}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link href={job.created_by?.slug ? `/profile/${job.created_by.slug}` : "#"}>
                      <p className="font-semibold text-foreground hover:text-primary hover:underline transition-all">
                        {job.created_by?.full_name ||
                          job.customer?.name ||
                          "Khách hàng"}
                      </p>
                    </Link>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-foreground">
                        {job.customer?.rating || "5.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({job.customer?.reviews || "0"} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Công việc đã đăng
                    </p>
                    <p className="font-semibold text-foreground">
                      {job.customer?.jobsPosted || "1"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Thành viên từ
                    </p>
                    <p className="font-semibold text-foreground">
                      {job.customer?.memberSince || new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <Link href={job.created_by?.slug ? `/profile/${job.created_by.slug}` : "#"} className="w-full block">
                  <Button
                    variant="outline"
                    className="w-full border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Xem hồ sơ
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Similar Jobs - Only show if there are any */}
            {similarJobs.length > 0 && (
              <Card className="p-6 border-border bg-card text-card-foreground shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Công việc tương tự
                </h3>
                <div className="space-y-3">
                  {similarJobs.map((similar: any) => (
                    <Link key={similar.id} href={`/jobs/${similar.job_slug || similar.id}`}>
                      <Card className="p-4 border-border hover:border-primary/50 transition-all bg-muted/30 hover:bg-muted/50">
                        <h4 className="font-medium mb-2 hover:text-primary transition-colors line-clamp-2 text-foreground">
                          {similar.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary font-semibold">
                            {similar.price}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {similar.location}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
