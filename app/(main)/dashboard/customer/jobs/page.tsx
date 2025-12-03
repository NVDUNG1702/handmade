"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  Users,
  Clock,
  MapPin,
  DollarSign,
  ArrowLeft,
  Loader2,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useMyJobRequests } from "@/hooks/use-job-requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CustomerJobsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: myJobsData, isLoading } = useMyJobRequests({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
  });

  const jobs = useMemo(() => {
    if (!myJobsData) return [];
    if (Array.isArray(myJobsData)) return myJobsData;
    if (typeof myJobsData === "object" && "data" in myJobsData) {
      return (myJobsData as any).data || [];
    }
    return [];
  }, [myJobsData]);

  const totalPages = useMemo(() => {
    if (!myJobsData || Array.isArray(myJobsData)) return 1;
    return (myJobsData as any).totalPages || 1;
  }, [myJobsData]);

  const filteredJobs = useMemo(() => {
    if (!search) return jobs;
    return jobs.filter((job: any) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  const formatCurrency = (value?: number) => {
    return value?.toLocaleString("vi-VN") || "0";
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Quản lý công việc
              </h1>
              <p className="text-muted-foreground">
                Danh sách các công việc bạn đã đăng
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

        {/* Filters */}
        <Card className="p-4 bg-card border-border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm công việc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background border-input"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-background border-input">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="OPEN">Đang tìm thợ</SelectItem>
                  <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map((job: any) => (
              <Card
                key={job.id}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-md group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Đăng ngày: {formatDate(job.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location || "Toàn quốc"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.application_count || 0} ứng viên
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(job.budget_min)} -{" "}
                          {formatCurrency(job.budget_max)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ngân sách dự kiến
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                      {job.status === "OPEN" && (
                        <Link href={`/jobs/${job.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Chỉnh sửa
                          </Button>
                        </Link>
                      )}
                      {/* Add more actions like "View Applications" here */}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Chưa có công việc nào
            </h3>
            <p className="text-muted-foreground mb-6">
              Bạn chưa đăng công việc nào hoặc không tìm thấy kết quả phù hợp.
            </p>
            <Link href="/jobs/create">
              <Button className="bg-primary text-primary-foreground">
                Đăng công việc ngay
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
