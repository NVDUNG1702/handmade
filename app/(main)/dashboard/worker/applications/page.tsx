"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Eye,
  XCircle,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useMyApplications,
  useWithdrawApplication,
} from "@/hooks/use-job-applications";
import ApplicationStatusBadge from "@/components/job/ApplicationStatusBadge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

export default function WorkerApplicationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const limit = 10;
  const { data, isLoading, error } = useMyApplications(
    page,
    limit,
    statusFilter === "all" ? undefined : statusFilter
  );
  const withdrawMutation = useWithdrawApplication();

  const applications = data?.data?.applications || [];
  const total = data?.data?.total || 0;
  const hasMore = data?.data?.has_more || false;

  const handleWithdraw = async (id: string) => {
    withdrawMutation.mutate(id, {
      onSuccess: () => {
        setWithdrawingId(null);
      },
    });
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
            <p className="text-muted-foreground mb-4">
              Không thể tải danh sách đơn ứng tuyển. Vui lòng thử lại!
            </p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Đơn ứng tuyển của tôi
        </h1>
        <p className="text-muted-foreground">
          Quản lý tất cả các đơn ứng tuyển bạn đã gửi
        </p>
      </div>

      {/* Stats & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">Tổng đơn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter((a) => a.status === "PENDING").length}
                </p>
                <p className="text-xs text-muted-foreground">Chờ xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    applications.filter((a) => a.status === "SHORTLISTED")
                      .length
                  }
                </p>
                <p className="text-xs text-muted-foreground">Danh sách ngắn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter((a) => a.status === "SELECTED").length}
                </p>
                <p className="text-xs text-muted-foreground">Được chọn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="glass-card border-white/20 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Lọc theo trạng thái:</label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as ApplicationStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="SHORTLISTED">Danh sách ngắn</SelectItem>
                <SelectItem value="SELECTED">Đã chọn</SelectItem>
                <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                <SelectItem value="WITHDRAWN">Đã rút</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Chưa có đơn ứng tuyển
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? "Bạn chưa ứng tuyển công việc nào"
                : "Không có đơn nào ở trạng thái này"}
            </p>
            <Button onClick={() => router.push("/jobs")}>Tìm công việc</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="glass-card border-white/20 hover:border-white/40 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <ApplicationStatusBadge status={application.status} />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-2 truncate">
                      Job ID: {application.job_id}
                    </h3>

                    {application.message && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {application.message}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {application.proposed_budget && (
                        <Badge variant="outline" className="gap-1">
                          <DollarSign className="w-3 h-3" />
                          {application.proposed_budget.toLocaleString()} VNĐ
                        </Badge>
                      )}
                      {application.estimated_completion_days && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {application.estimated_completion_days} ngày
                        </Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        {getTimeAgo(application.created_at)}
                      </Badge>
                    </div>

                    {application.rejection_reason &&
                      application.status === "REJECTED" && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-destructive mb-1">
                            Lý do từ chối:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {application.rejection_reason}
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => router.push(`/jobs/${application.job_id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      Xem job
                    </Button>

                    {application.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => setWithdrawingId(application.id)}
                        disabled={withdrawMutation.isPending}
                      >
                        <XCircle className="w-4 h-4" />
                        Rút đơn
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {applications.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
            trong tổng số {total} đơn
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || isLoading}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog
        open={!!withdrawingId}
        onOpenChange={() => setWithdrawingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận rút đơn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn rút đơn ứng tuyển này? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={withdrawMutation.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => withdrawingId && handleWithdraw(withdrawingId)}
              disabled={withdrawMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {withdrawMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang rút...
                </>
              ) : (
                "Rút đơn"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
