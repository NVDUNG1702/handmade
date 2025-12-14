"use client"

import { use } from "react"
import { useUserBySlug } from "@/hooks/use-user"
import { useUserSkills } from "@/hooks/use-skills"
import { useJobReviewsByWorker } from "@/hooks/use-job-reviews"
import { useJobRequests } from "@/hooks/use-job-requests"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Mail, Phone, Award, Briefcase, TrendingUp, MessageSquare, Share2, Calendar } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SkillDetailDialog } from "@/components/profile/SkillDetailDialog"
import { JobCard } from "@/components/job/JobCard"

export default function UserProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  // Fetch user by slug
  const { data: user, isLoading: userLoading, error } = useUserBySlug(slug)
  const { data: userSkills, isLoading: skillsLoading } = useUserSkills(user?._id || "")
  const { data: reviewsData, isLoading: reviewsLoading } = useJobReviewsByWorker(user?._id || "")

  // Fetch completed jobs by this user (as worker)
  const { data: completedJobsData, isLoading: completedJobsLoading } = useJobRequests({ 
    assigned_to: user?._id || "", 
    status: "COMPLETED",
    limit: 6 
  })

  // Fetch posted jobs by this user (as creator)
  const { data: postedJobsData, isLoading: postedJobsLoading } = useJobRequests({ 
    created_by: user?._id || "",
    limit: 6 
  })

  // Show not found if user doesn't exist
  if (error || (!userLoading && !user)) {
    notFound()
  }

  if (userLoading || !user) {
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
  const completedJobs = completedJobsData?.data || []
  const postedJobs = postedJobsData?.data || []

  // Calculate stats from real data
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-xl relative">
          {/* Action Buttons (Top Right) */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button variant="outline" size="sm" className="glass bg-background/50 backdrop-blur-md border-white/20">
              <Share2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button size="sm" className="gap-2 shadow-lg">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Nhắn tin</span>
            </Button>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8 relative">
            {/* Avatar & Name Row */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white border-4 border-background shadow-xl overflow-hidden">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.full_name || user.username} 
                        width={128}
                        height={128}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-5xl font-bold">
                        {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-background shadow-lg" />
              </div>

              {/* Name & Info */}
              <div className="flex-1 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {user.full_name || user.username}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <Badge className="bg-primary/15 text-primary border-primary/30 py-1 px-3">
                    {user.roles && user.roles.includes('worker') ? '⚒️ Thợ thủ công' : '👤 Người dùng'}
                  </Badge>
                  
                  {user.address && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {user.address}
                    </span>
                  )}
                  
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Tham gia {new Date(user.created_at || Date.now()).getFullYear()}
                  </span>
                </div>

                {/* Contact Info (Public View - Only show if available) */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 text-sm text-muted-foreground">
                    {user.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </span>
                    )}
                    {user.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                        </span>
                    )}
                </div>

                {user.bio && (
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
                    {user.bio}
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
                  <span className="text-2xl font-bold">{completedJobs.length}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Việc đã làm</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Kỹ năng chuyên môn
              </h3>
              
              {skillsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Đang tải...</span>
                </div>
              ) : skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <SkillDetailDialog key={s.id || s._id} skill={s} userId={user._id} isOwner={false}>
                      <Badge variant="secondary" className="px-3 py-1.5 bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                        {s.skillName} {s.level ? `• ${s.level}` : ''}
                        {(s.experience_years || s.years_of_experience) && ` • ${s.experience_years || s.years_of_experience} năm`}
                      </Badge>
                    </SkillDetailDialog>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-dashed">
                  <p className="text-sm text-muted-foreground">Chưa có kỹ năng.</p>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reviews">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reviews">
              <Award className="w-4 h-4 mr-2" />
              Đánh giá ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Briefcase className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="posted_jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Đã đăng
            </TabsTrigger>
            <TabsTrigger value="completed_jobs">
              <TrendingUp className="w-4 h-4 mr-2" />
              Đã làm
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
                  {r.images && r.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {r.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image src={img} alt="Review" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center border-dashed">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-medium mb-1">Chưa có đánh giá</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="mt-4">
             <div className="grid gap-4">
              {skills.map((userSkill) =>
                userSkill.portfolio_images && userSkill.portfolio_images.length > 0 && (
                  <Card key={userSkill.id || userSkill._id} className="p-6">
                    <h4 className="font-semibold mb-4">{userSkill.skillName}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userSkill.portfolio_images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image src={img} alt={`${userSkill.skillName} portfolio`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              )}
              {skills.every(s => !s.portfolio_images || s.portfolio_images.length === 0) && (
                <Card className="p-12 text-center border-dashed">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-medium mb-1">Chưa có portfolio</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="posted_jobs" className="mt-4">
             {postedJobsLoading ? (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Đang tải danh sách công việc...</p>
                </Card>
             ) : postedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postedJobs.map((job) => (
                    <div key={job.id} className="h-full">
                       <JobCard job={job} nearbyEnabled={false} />
                    </div>
                  ))}
                </div>
             ) : (
                <Card className="p-12 text-center border-dashed">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-medium mb-1">Chưa có công việc nào đã đăng</p>
                </Card>
             )}
          </TabsContent>

          <TabsContent value="completed_jobs" className="mt-4">
             {completedJobsLoading ? (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Đang tải danh sách công việc...</p>
                </Card>
             ) : completedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="h-full">
                       <JobCard job={job} nearbyEnabled={false} />
                    </div>
                  ))}
                </div>
             ) : (
                <Card className="p-12 text-center border-dashed">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-medium mb-1">Chưa có công việc hoàn thành</p>
                  <p className="text-sm text-muted-foreground">Người dùng này chưa hoàn thành công việc nào trên hệ thống</p>
                </Card>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
