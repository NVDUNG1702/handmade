"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  Send,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios-instance";
import { API_CONSTANTS } from "@/lib/api-constants";
import type { JobRequestItem } from "@/lib/types";
import {
  useCreateApplication,
  useCheckApplied,
} from "@/hooks/use-job-applications";
import ApplicationStatusBadge from "@/components/job/ApplicationStatusBadge";
import { useAuthStore } from "@/lib/auth-store";

import { RequireAuth } from "@/components/require-auth";

export default function JobApplicationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params?.id as string;
  const { user } = useAuthStore();

  const [job, setJob] = useState<JobRequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    proposal: "",
    price: "",
    delivery_time: "",
    message: "",
  });

  const createApplicationMutation = useCreateApplication();
  const { data: checkAppliedData, isLoading: checkingApplied } =
    useCheckApplied(jobId);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_CONSTANTS.ENDPOINTS.JOB_REQUESTS.DETAIL.replace(":id", jobId)}`
        );
        setJob(response.data.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // Skill validation logic
  const userSkills = ((user as any)?.userSkills as any[]) || [];
  
  const hasRequiredSkill = () => {
    if (!job?.required_skill || !userSkills.length) return false;

    const requiredSkillName = job.required_skill.name;
    if (!requiredSkillName) return false;

    return userSkills.some((skill: any) => {
      const skillName =
        skill.skillName ||
        skill.skill?.name ||
        (typeof skill.skillId === "object" && skill.skillId?.name);

      return (
        skillName === requiredSkillName ||
        skillName?.toLowerCase() === requiredSkillName?.toLowerCase()
      );
    });
  };

  const getTotalExperienceYears = () => {
    if (!userSkills.length) return 0;
    return userSkills.reduce((total: number, skill: any) => {
      const years = skill.years_of_experience || skill.experience_years || 0;
      return total + years;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobId) return;

    createApplicationMutation.mutate(
      {
        job_id: jobId,
        proposal: formData.proposal,
        price: Number(formData.price),
        delivery_time: Number(formData.delivery_time),
        message: formData.message || undefined,
        experience_years: getTotalExperienceYears(),
      },
      {
        onSuccess: () => {
          router.push(`/jobs/${jobId}`);
        },
      }
    );
  };

  if (loading || checkingApplied) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </RequireAuth>
    );
  }

  if (!job) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Không tìm thấy công việc
            </h2>
            <Button onClick={() => router.push("/jobs")}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </RequireAuth>
    );
  }

  // Check if already applied
  if (checkAppliedData?.applied) {
    return (
      <RequireAuth>
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button variant="ghost" className="mb-6 gap-2" asChild>
              <Link href={`/jobs/${jobId}`}>
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>
            </Button>

            <Card className="glass-card border-white/20 text-center p-12">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">
                Bạn đã ứng tuyển công việc này
              </h2>
              <p className="text-muted-foreground mb-4">Trạng thái:</p>
              <ApplicationStatusBadge
                status={checkAppliedData.application?.status || "PENDING"}
                className="text-base px-4 py-2"
              />
              <div className="flex gap-4 justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/jobs/${jobId}`)}
                >
                  Xem công việc
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/worker/applications")}
                >
                  Xem đơn của tôi
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </RequireAuth>
    );
  }

  const canApply = job.status === "OPEN" && job.created_by?.id !== user?.id; // && hasRequiredSkill(); // Temporarily disable skill check strictness if needed, but keeping it for warning
  const userHasRequiredSkill = hasRequiredSkill();

  return (
    <RequireAuth>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 gap-2" asChild>
            <Link href={`/jobs/${params?.id}`}>
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
              Ứng tuyển công việc
            </h1>
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                    <p className="text-lg text-muted-foreground mb-3">
                      {job.created_by?.full_name || job.created_by?.username}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.budget_min && job.budget_max && (
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.budget_min.toLocaleString()} -{" "}
                          {job.budget_max.toLocaleString()} VNĐ
                        </Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.city}
                      </Badge>
                      {job.deadline && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Hạn:{" "}
                          {new Date(job.deadline).toLocaleDateString("vi-VN")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="glass-card border-white/20 mb-6">
              <CardHeader>
                <CardTitle>Thông tin ứng tuyển</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Proposal */}
                <div>
                  <Label htmlFor="proposal">Đề xuất thực hiện công việc *</Label>
                  <Textarea
                    id="proposal"
                    value={formData.proposal}
                    onChange={(e) =>
                      setFormData({ ...formData, proposal: e.target.value })
                    }
                    placeholder="Mô tả chi tiết cách bạn sẽ thực hiện công việc này, kinh nghiệm và phương pháp của bạn..."
                    required
                    rows={6}
                    className="mt-1"
                    minLength={10}
                    maxLength={1000}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formData.proposal.length}/1000
                    </span>
                  </div>
                </div>

                {/* Price and Delivery Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Giá đề xuất (VNĐ) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      placeholder="VD: 5000000"
                      className="mt-1"
                      required
                      min={0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ngân sách: {job.budget_min?.toLocaleString()} -{" "}
                      {job.budget_max?.toLocaleString()} VNĐ
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="delivery_time">
                      Thời gian giao hàng (ngày) *
                    </Label>
                    <Input
                      id="delivery_time"
                      type="number"
                      value={formData.delivery_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          delivery_time: e.target.value,
                        })
                      }
                      placeholder="VD: 7"
                      className="mt-1"
                      required
                      min={1}
                      max={365}
                    />
                  </div>
                </div>

                {/* Experience Years (Auto-calculated) */}
                <div>
                  <Label htmlFor="experience_years">
                    Tổng số năm kinh nghiệm (tự động tính từ kỹ năng)
                  </Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={getTotalExperienceYears()}
                    disabled
                    className="mt-1 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Số năm kinh nghiệm được tính tự động từ tổng các kỹ năng trong hồ sơ của bạn
                  </p>
                </div>

                {/* Message (Optional) */}
                <div>
                  <Label htmlFor="message">Lời nhắn cho khách hàng (tùy chọn)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Lời nhắn thêm cho khách hàng..."
                    rows={3}
                    className="mt-1"
                    maxLength={1000}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                {/* Warning if can't apply */}
                {!canApply && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3 text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      {job.status !== "OPEN"
                        ? "Công việc này đã không còn mở ứng tuyển"
                        : job.created_by?.id === user?.id
                        ? "Bạn không thể ứng tuyển công việc của chính mình"
                        : "Không thể ứng tuyển công việc này"}
                    </span>
                  </div>
                )}
                
                {/* Warning for missing skill but still allow apply (or block if strict) */}
                {!userHasRequiredSkill && canApply && (
                   <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3 text-yellow-600 dark:text-yellow-400">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      Bạn chưa có kỹ năng "{job.required_skill?.name}" trong hồ sơ. Việc ứng tuyển có thể bị hạn chế.
                    </span>
                  </div>
                )}

              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.back()}
                disabled={createApplicationMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent gap-2"
                disabled={createApplicationMutation.isPending || !canApply}
              >
                {createApplicationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi đơn ứng tuyển
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
}
