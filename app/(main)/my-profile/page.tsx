"use client"

import { useUser } from "@/hooks/use-user"
import { useUserSkills } from "@/hooks/use-skills"
import { useJobReviewsByWorker } from "@/hooks/use-job-reviews"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, MapPin, Star, Mail, Phone, Award, Briefcase, TrendingUp } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"

export default function MyProfilePage() {
  const { user, loading, mounted, authed } = useUser()

  // Redirect to login if not authenticated (after mounted)
  if (mounted && !authed) {
    redirect("/login")
  }

  const { data: userSkills, isLoading: skillsLoading } = useUserSkills(user?.id || "")
  const { data: reviewsData, isLoading: reviewsLoading } = useJobReviewsByWorker(user?.id || "")

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    )
  }

  const reviews = reviewsData?.data || []
  const skills = userSkills || []
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl relative">
          {/* Edit Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-4 gap-2 z-10"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Chỉnh sửa</span>
          </Button>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            {/* Avatar & Name Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {(user as any).avatar ? (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-border shadow-xl">
                    <Image 
                      src={(user as any).avatar} 
                      alt={user.full_name || user.username || "User"} 
                      width={128}
                      height={128}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white border-4 border-border shadow-xl">
                    <span className="text-5xl font-bold">
                      {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-background shadow-lg" />
              </div>

              {/* Name & Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.full_name || user.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                  <Badge className="bg-primary/15 text-primary border-primary/30">
                    {user.roles?.includes('worker') ? '⚒️ Thợ thủ công' : '👤 Người dùng'}
                  </Badge>
                  {(user as any).email && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="hidden md:inline">{(user as any).email}</span>
                    </span>
                  )}
                  {(user as any).phone && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="hidden md:inline">{(user as any).phone}</span>
                    </span>
                  )}
                </div>
                {(user as any).address && (
                  <p className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    {(user as any).address}
                  </p>
                )}
                {(user as any).bio && (
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {(user as any).bio}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-500 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-2xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Đánh giá</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-500 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="text-2xl font-bold">{reviews.length}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Nhận xét</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-500 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">{skills.length}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Kỹ năng</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500 mb-1">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-2xl font-bold">—</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Công việc</p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Kỹ năng chuyên môn
                </h3>
                <Button variant="outline" size="sm">+ Thêm</Button>
              </div>
              
              {skillsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Đang tải...</span>
                </div>
              ) : skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s.id || s._id} variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary">
                      {s.skillName} {s.level ? `• ${s.level}` : ''}
                      {(s.experience_years || s.years_of_experience) && ` • ${s.experience_years || s.years_of_experience} năm`}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-dashed">
                  <p className="text-sm text-muted-foreground">Chưa có kỹ năng. Thêm ngay!</p>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reviews">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">
              <Award className="w-4 h-4 mr-2" />
              Đánh giá ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Briefcase className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <TrendingUp className="w-4 h-4 mr-2" />
              Công việc
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-4 space-y-4">
            {reviewsLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              </Card>
            ) : reviews.length > 0 ? (
              reviews.map((r) => (
                <Card key={r.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{r.reviewer?.full_name || 'Ẩn danh'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  {r.job_request && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {r.job_request.title}
                    </Badge>
                  )}
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center border-dashed">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-medium mb-1">Chưa có đánh giá</p>
                <p className="text-sm text-muted-foreground">Hoàn thành công việc để nhận đánh giá</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="mt-4">
            <Card className="p-12 text-center border-dashed">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-medium mb-1">Portfolio</p>
              <p className="text-sm text-muted-foreground">Thêm hình ảnh công việc</p>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="mt-4">
            <Card className="p-12 text-center border-dashed">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-medium mb-1">Công việc</p>
              <p className="text-sm text-muted-foreground">Lịch sử công việc đã hoàn thành</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
