"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useJobRequestApplications,
  useJobRequestById,
  useSelectApplication,
  useRejectApplication,
} from "@/hooks/use-job-requests";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function JobApplicationsPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: jobData, isLoading: isJobLoading } = useJobRequestById(
    params?.id || ""
  );
  const { data: applicationsData, isLoading: isAppsLoading } =
    useJobRequestApplications(params?.id);
  
  const selectMutation = useSelectApplication();
  const rejectMutation = useRejectApplication();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const job = jobData as any;
  const applications = (applicationsData as any)?.data?.data || [];

  const handleAccept = async (appId: string) => {
    try {
      await selectMutation.mutateAsync(appId);
      toast({
        title: "Thành công",
        description: "Đã chấp nhận ứng viên cho công việc này",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể chấp nhận ứng viên",
      });
    }
  };

  const openRejectDialog = (appId: string) => {
    setSelectedAppId(appId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedAppId || !rejectionReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({
        id: selectedAppId,
        reason: rejectionReason,
      });
      toast({
        title: "Thành công",
        description: "Đã từ chối ứng viên",
      });
      setRejectDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể từ chối ứng viên",
      });
    }
  };

  if (isJobLoading || isAppsLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
            asChild
          >
            <Link href={`/jobs/${job?.job_slug || params?.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại chi tiết công việc
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Danh sách ứng viên
              </h1>
              <p className="text-muted-foreground">
                Công việc:{" "}
                <span className="font-semibold text-foreground">
                  {job?.title}
                </span>
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1">
              {applications.length} ứng viên
            </Badge>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  Chưa có ứng viên nào
                </h3>
                <p className="text-muted-foreground">
                  Công việc này chưa nhận được hồ sơ ứng tuyển nào.
                </p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app: any) => (
              <Card
                key={app._id || app.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Applicant Info */}
                    <div className="flex flex-col items-center md:items-start gap-4 min-w-[200px]">
                      <Link
                        href={`/profile/${app.craftsman_id?.slug}`}
                        className="group text-center md:text-left"
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted border mx-auto md:mx-0 group-hover:ring-2 ring-primary transition-all">
                          {app.craftsman_id?.avatar ? (
                            <Image
                              src={app.craftsman_id.avatar}
                              alt={app.craftsman_id?.full_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold text-2xl">
                              {app.craftsman_id?.full_name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                            {app.craftsman_id?.full_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            @{app.craftsman_id?.username}
                          </p>
                        </div>
                      </Link>

                      <Badge
                        variant={
                          app.status === "ACCEPTED" ||
                          app.status === "SELECTED"
                            ? "default"
                            : app.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                        className="w-full justify-center"
                      >
                        {app.status === "PENDING"
                          ? "Đang chờ"
                          : app.status === "ACCEPTED" ||
                            app.status === "SELECTED"
                          ? "Đã chấp nhận"
                          : app.status === "REJECTED"
                          ? "Đã từ chối"
                          : app.status}
                      </Badge>

                      <div className="w-full space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Kinh nghiệm:
                          </span>
                          <span className="font-medium">
                            {app.experience_years || 0} năm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Đánh giá:
                          </span>
                          <span className="font-medium flex items-center gap-1">
                            <span className="text-yellow-500">★</span>{" "}
                            {app.craftsman_id?.rating || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="flex-1 space-y-4 border-l pl-0 md:pl-6 border-border/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Đề xuất giá:
                          </span>
                          <span className="font-bold text-primary text-lg">
                            {app.price?.toLocaleString("vi-VN")}{" "}
                            {app.currency || "VND"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Thời gian:
                          </span>
                          <span className="font-semibold">
                            {app.delivery_time} ngày
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>
                            {app.phone ||
                              (app.craftsman_id?.phone &&
                              !app.craftsman_id.phone.startsWith("google_")
                                ? app.craftsman_id.phone
                                : "Chưa cập nhật")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {app.craftsman_id?.address || "Chưa cập nhật"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Kỹ năng:</h4>
                        <div className="flex flex-wrap gap-2">
                          {app.skills && app.skills.length > 0 ? (
                            app.skills.map((skill: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-background"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Không có kỹ năng cụ thể
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Đề xuất thực hiện:
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg">
                          {app.proposal || "Chưa có đề xuất chi tiết"}
                        </p>
                      </div>

                      {app.message && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Lời nhắn:
                          </h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line italic">
                            "{app.message}"
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-auto">
                        <Link
                          href={`/messages?slug=${
                            app.craftsman_id?.slug || ""
                          }`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Nhắn tin
                          </Button>
                        </Link>
                        <Link
                          href={`/profile/${app.craftsman_id?.slug}`}
                          className="flex-1"
                        >
                          <Button variant="secondary" className="w-full">
                            <User className="w-4 h-4 mr-2" />
                            Xem hồ sơ
                          </Button>
                        </Link>

                        {(app.status === "PENDING" ||
                          app.status === "SHORTLISTED") && (
                          <>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => openRejectDialog(app._id || app.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Từ chối
                            </Button>
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleAccept(app._id || app.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Duyệt
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối ứng viên</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối ứng viên này. Lý do sẽ được gửi đến
              ứng viên.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
