"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Filter,
  Search,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyJobRequests } from "@/hooks/use-job-requests";
import { useMemo, useState } from "react";

export default function CustomerHistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data: myJobsData, isLoading } = useMyJobRequests({
    limit: 100,
    status: "COMPLETED", // Only fetch completed jobs for history
  });

  const jobs = useMemo(() => {
    if (!myJobsData) return [];
    if (Array.isArray(myJobsData)) return myJobsData;
    if (typeof myJobsData === "object" && "data" in myJobsData) {
      return (myJobsData as any).data || [];
    }
    return [];
  }, [myJobsData]);

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (search) {
      result = result.filter((job: any) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Lịch sử giao dịch
            </h1>
            <p className="text-muted-foreground">
              Xem lại các công việc đã hoàn thành và thanh toán
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-card border-border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên công việc..."
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
                    <SelectValue placeholder="Thời gian" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="last_month">Tháng trước</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* History List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job: any) => (
              <Card
                key={job.id}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-md group"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Thợ: {job.assigned_to?.full_name || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Hoàn thành: {formatDate(job.updated_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Mã đơn: #{job.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(job.budget_min)} VNĐ
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1 border-green-500/20 text-green-500 bg-green-500/10"
                    >
                      Đã thanh toán
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end gap-3">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    Xuất hóa đơn
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    Đánh giá lại
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Chưa có lịch sử giao dịch
            </h3>
            <p className="text-muted-foreground">
              Các công việc đã hoàn thành sẽ xuất hiện tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
