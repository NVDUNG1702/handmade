"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import axiosInstance from "@/lib/axios-instance"
import type { ApiResponse } from "@/lib/types"

// Utility function to format time
const formatTimeAgo = (dateString: string | Date): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hôm nay'
  if (diffInDays === 1) return 'Hôm qua'
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`
  return `${Math.floor(diffInDays / 365)} năm trước`
}

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDeadline = (deadline?: string | Date, daysRemaining?: number): string => {
  if (typeof daysRemaining === 'number') {
    if (daysRemaining > 0) return `Còn ${daysRemaining} ngày`
    if (daysRemaining === 0) return 'Hết hạn hôm nay'
    return `Đã hết hạn ${Math.abs(daysRemaining)} ngày`
  }
  if (deadline) {
    const d = new Date(deadline)
    if (!isNaN(d.getTime())) {
      const now = new Date()
      const diffDays = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays > 0) return `Còn ${diffDays} ngày`
      if (diffDays === 0) return 'Hết hạn hôm nay'
      return `Đã hết hạn ${Math.abs(diffDays)} ngày`
    }
  }
  return 'Không giới hạn'
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>()
  const [job, setJob] = useState<any | null>(null)
  const fallback = {
    id: 1,
    title: "Làm túi xách da thủ công cao cấp",
    description:
      "Tôi đang tìm kiếm một thợ thủ công có kinh nghiệm để làm túi xách da thật cao cấp. Túi cần được thiết kế theo yêu cầu riêng với logo thương hiệu của công ty. Yêu cầu chất lượng hoàn thiện cao, đường may tỉ mỉ và sử dụng da thật 100%.",
    customer: {
      name: "Nguyễn Thị Mai",
      avatar: "",
      rating: 4.8,
      reviews: 45,
      jobsPosted: 23,
      memberSince: "2023",
    },
    price: "1.2M - 1.5M VNĐ",
    location: "Hà Nội",
    deadline: "7 ngày",
    applicants: 12,
    category: "Làm túi",
    skills: ["Da thật", "Thêu logo", "Thiết kế"],
    requirements: [
      "Có kinh nghiệm ít nhất 2 năm làm túi xách da",
      "Có portfolio các sản phẩm đã làm",
      "Có thể làm việc theo deadline",
      "Có máy móc và dụng cụ chuyên nghiệp",
    ],
    deliverables: ["1 túi xách da hoàn thiện", "Hộp đựng và bao bì", "Giấy bảo hành 6 tháng"],
    postedDate: "2 ngày trước",
  }
  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get<ApiResponse<any>>(`/job-requests/${params.id}`)
        if (!mounted) return
        
        // Handle flexible response structure
        const responseData = res.data.data
        if (responseData && typeof responseData === "object") {
          setJob(responseData)
        } else {
          setJob(null)
        }
      } catch {
        setJob(fallback)
      }
    }
    if (params?.id) void fetchDetail()
    return () => {
      mounted = false
    }
  }, [params?.id])

  const similarJobs = [
    {
      id: 2,
      title: "Làm ví da handmade",
      price: "500K VNĐ",
      location: "Hà Nội",
    },
    {
      id: 3,
      title: "Sửa chữa túi xách da",
      price: "300K VNĐ",
      location: "Hà Nội",
    },
  ]

  if (!job) return null
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Back button */}
        <Link href="/jobs">
          <Button variant="ghost" className="hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="glass-card p-0 border-white/20 overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={(job.images && job.images[0]) || "/placeholder.svg"}
                  alt={job.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-primary/90 text-white border-0">{(job as any).category || job.required_skill?.name || "Công việc"}</Badge>
                      <Badge variant="secondary" className="bg-green-500 text-white border-0">Đang tuyển</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-white text-balance mb-1 line-clamp-2">{job.title}</h1>
                    <div className="flex items-center gap-4 text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Đăng {job.created_at ? formatTimeAgo(job.created_at) : (job as any).postedDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{job.view_count || 0} lượt xem</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white/20">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-4">Mô tả công việc</h2>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </Card>

            {/* Skills Required */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-4">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
                {(!job.skills || job.skills.length === 0) && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-sm">
                    {job.required_skill?.name || 'Kỹ năng'}
                  </Badge>
                )}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-4">Yêu cầu</h2>
              <ul className="space-y-3">
                {(job.requirements || []).map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
                {(!job.requirements || job.requirements.length === 0) && (
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Không có yêu cầu đặc biệt</span>
                  </li>
                )}
              </ul>
            </Card>

            {/* Deliverables */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-4">Sản phẩm bàn giao</h2>
              <ul className="space-y-3">
                {(job.deliverables || []).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
                {(!job.deliverables || job.deliverables.length === 0) && (
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Sản phẩm hoàn thiện theo yêu cầu</span>
                  </li>
                )}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="glass-card p-6 border-white/20">
              <div className="space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <p className="text-white/80 text-sm mb-1">Ngân sách</p>
                  <p className="text-2xl font-bold text-white">
                    {job.price || `${job.budget_min?.toLocaleString('vi-VN') || '0'} - ${job.budget_max?.toLocaleString('vi-VN') || '0'} ${job.currency || 'VND'}`}
                  </p>
                </div>

                <Link href={`/jobs/${job.id}/apply`}>
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Ứng tuyển ngay
                  </Button>
                </Link>

                <Button variant="outline" className="w-full h-12 border-white/20 glass-card bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nhắn tin
                </Button>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Ứng viên</p>
                      <p className="font-semibold">{job.application_count || job.applicants || 0} người</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Thời hạn</p>
                      <p className="font-semibold">{formatDeadline(job.deadline as any, job.days_remaining as any)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Địa điểm</p>
                      <p className="font-semibold">{job.location || job.city || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Đăng lúc</p>
                      <p className="font-semibold">
                        {job.created_at ? formatDate(job.created_at) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="glass-card p-6 border-white/20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Về khách hàng
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {job.created_by?.full_name?.charAt(0) || job.customer?.name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{job.created_by?.full_name || job.customer?.name || 'Khách hàng'}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{job.customer?.rating || '4.9'}</span>
                      <span className="text-muted-foreground">({job.customer?.reviews || '0'} đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground">Công việc đã đăng</p>
                    <p className="font-semibold">{job.customer?.jobsPosted || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground">Thành viên từ</p>
                    <p className="font-semibold">{job.customer?.memberSince || '2024'}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-white/20 glass-card bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Xem hồ sơ
                </Button>
              </div>
            </Card>

            {/* Similar Jobs */}
            <Card className="glass-card p-6 border-white/20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Công việc tương tự
              </h3>
              <div className="space-y-3">
                {(similarJobs || []).map((similar) => (
                  <Link key={similar.id} href={`/jobs/${similar.id}`}>
                    <Card className="p-4 border-white/10 hover:border-white/30 transition-all bg-background/50 backdrop-blur-sm hover:bg-background/70">
                      <h4 className="font-medium mb-2 hover:text-primary transition-colors line-clamp-2">{similar.title}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">{similar.price}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {similar.location}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
                {(!similarJobs || similarJobs.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Không có công việc tương tự</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
