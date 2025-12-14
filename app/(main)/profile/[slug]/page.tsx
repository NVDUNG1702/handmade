"use client"

import { use } from "react"
import { useUserBySlug } from "@/hooks/use-user"
import { useUserSkills } from "@/hooks/use-skills"
import { useJobReviewsByWorker } from "@/hooks/use-job-reviews"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Calendar, MessageSquare, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function UserProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  // Fetch user by slug
  const { data: user, isLoading: userLoading, error } = useUserBySlug(slug)
  const { data: userSkills, isLoading: skillsLoading } = useUserSkills(user?.id || "")
  const { data: reviewsData, isLoading: reviewsLoading } = useJobReviewsByWorker(user?.id || "")

  // Show not found if user doesn't exist
  if (error || (!userLoading && !user)) {
    notFound()
  }

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    )
  }

  const reviews = reviewsData?.data || []
  const skills = userSkills || []

  // Calculate stats from real data
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Cover & Profile */}
        <Card className="glass-card border-white/20 overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64">
            <Image
              src={user.cover_url || "/profile-cover-handmade.jpg"}
              alt="Cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 md:-mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-4xl border-4 border-background overflow-hidden">
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.full_name || user.username} fill className="object-cover" />
                  ) : (
                    (user.full_name || user.username).charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{user.full_name || user.username}</h1>
                    <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {user.roles?.includes('worker') ? 'Thợ thủ công' : 'Người dùng'}
                      </Badge>
                      {user.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {user.address}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tham gia {new Date(user.created_at || "").getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Nhắn tin
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Đánh giá</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <p className="text-2xl font-bold">{reviews.length}</p>
                    <p className="text-sm text-muted-foreground">Nhận xét</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <p className="text-2xl font-bold">{skills.length}</p>
                    <p className="text-sm text-muted-foreground">Kỹ năng</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <p className="text-2xl font-bold">-</p>
                    <p className="text-sm text-muted-foreground">Công việc</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {skillsLoading ? (
                  <p className="text-muted-foreground text-sm">Đang tải...</p>
                ) : skills.length > 0 ? (
                  skills.map((userSkill) => (
                    <Badge
                      key={userSkill.id || userSkill._id}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {userSkill.skillName} {userSkill.level ? `• ${userSkill.level}` : ''}
                      {(userSkill.experience_years || userSkill.years_of_experience) && ` • ${userSkill.experience_years || userSkill.years_of_experience} năm`}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Chưa có kỹ năng</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="jobs">Công việc</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid gap-4">
              {reviewsLoading ? (
                <Card className="p-6">
                  <p className="text-muted-foreground">Đang tải đánh giá...</p>
                </Card>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold">{review.reviewer?.full_name || 'Ẩn danh'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.job_request && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Công việc: {review.job_request.title}
                      </div>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                    {review.images && review.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                            <Image src={img} alt="Review" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Chưa có đánh giá nào</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
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
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Chưa có portfolio</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Danh sách công việc sẽ được hiển thị ở đây</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
