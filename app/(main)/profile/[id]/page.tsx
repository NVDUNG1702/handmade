"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  MapPin,
  Star,
  Briefcase,
  Calendar,
  Award,
  MessageSquare,
  Share2,
  Heart,
  CheckCircle,
  TrendingUp,
  Store,
} from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const userRole = "worker" // Can be: "customer", "worker", "store-owner", or multiple roles
  const hasStorePermission = userRole === "store-owner"
  const hasWorkerPermission = userRole === "worker"

  const profile = {
    name: "Nguyễn Văn A",
    role: "Thợ thủ công",
    avatar: "",
    coverImage: "/profile-cover-handmade.jpg",
    location: "Hà Nội, Việt Nam",
    memberSince: "2023",
    bio: "Nghệ nhân thủ công với 10 năm kinh nghiệm trong lĩnh vực làm túi xách da và các sản phẩm da thủ công cao cấp. Đam mê tạo ra những sản phẩm độc đáo và chất lượng.",
    stats: {
      rating: 4.8,
      reviews: 127,
      jobsCompleted: 156,
      responseTime: "2 giờ",
    },
    skills: ["Làm túi da", "Thêu logo", "Thiết kế", "Da thật", "Handmade"],
    achievements: [
      { icon: Award, title: "Top Thợ 2024", color: "from-yellow-400 to-orange-500" },
      { icon: Star, title: "5 Sao", color: "from-blue-400 to-cyan-500" },
      { icon: CheckCircle, title: "100+ Công việc", color: "from-green-400 to-emerald-500" },
      { icon: TrendingUp, title: "Xu hướng", color: "from-purple-400 to-pink-500" },
    ],
  }

  const portfolio = [
    {
      id: 1,
      title: "Túi xách da cao cấp",
      image: "/portfolio-leather-bag-1.jpg",
      likes: 45,
      category: "Làm túi",
    },
    {
      id: 2,
      title: "Ví da handmade",
      image: "/portfolio-leather-wallet.jpg",
      likes: 32,
      category: "Làm túi",
    },
    {
      id: 3,
      title: "Thắt lưng da thật",
      image: "/portfolio-leather-belt.jpg",
      likes: 28,
      category: "Phụ kiện",
    },
    {
      id: 4,
      title: "Túi đeo chéo vintage",
      image: "/portfolio-crossbody-bag.jpg",
      likes: 56,
      category: "Làm túi",
    },
  ]

  const reviews = [
    {
      id: 1,
      author: "Nguyễn Thị Mai",
      avatar: "",
      rating: 5,
      date: "2 ngày trước",
      job: "Làm túi xách da",
      content: "Sản phẩm rất đẹp và chất lượng. Thợ làm việc rất tận tâm và chuyên nghiệp. Sẽ quay lại lần sau!",
    },
    {
      id: 2,
      author: "Trần Văn Nam",
      avatar: "",
      rating: 5,
      date: "1 tuần trước",
      job: "Thêu logo",
      content: "Công việc hoàn thành đúng hạn, chất lượng tốt. Rất hài lòng với dịch vụ.",
    },
    {
      id: 3,
      author: "Lê Thị Hoa",
      avatar: "",
      rating: 4,
      date: "2 tuần trước",
      job: "Làm ví da",
      content: "Sản phẩm đẹp, tuy nhiên giao hàng hơi chậm một chút. Nhưng nhìn chung vẫn ok.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Cover & Profile */}
        <Card className="glass-card border-white/20 overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64">
            <Image src={profile.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 md:-mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-4xl border-4 border-background">
                  {profile.name.charAt(0)}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Badge className="bg-primary/10 text-primary border-primary/20">{profile.role}</Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tham gia {profile.memberSince}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Nhắn tin
                    </Button>
                    <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{profile.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl glass-card border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-lg">{profile.stats.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.stats.reviews} đánh giá</p>
                  </div>
                  <div className="p-3 rounded-xl glass-card border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-lg">{profile.stats.jobsCompleted}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Hoàn thành</p>
                  </div>
                  <div className="p-3 rounded-xl glass-card border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-lg">96%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
                  </div>
                  <div className="p-3 rounded-xl glass-card border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-lg">{profile.stats.responseTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Phản hồi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Role-based management sections */}
        {(hasWorkerPermission || hasStorePermission) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasWorkerPermission && (
              <Link href="/dashboard/worker">
                <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 group-hover:scale-110 transition-transform shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Quản lý công việc</h3>
                      <p className="text-sm text-muted-foreground">Dashboard thợ thủ công</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-2xl font-bold text-primary">127</p>
                      <p className="text-xs text-muted-foreground">Công việc</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">4.8</p>
                      <p className="text-xs text-muted-foreground">Đánh giá</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">96%</p>
                      <p className="text-xs text-muted-foreground">Thành công</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {hasStorePermission && (
              <Link href="/dashboard/store">
                <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 group-hover:scale-110 transition-transform shadow-lg">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Quản lý cửa hàng</h3>
                      <p className="text-sm text-muted-foreground">Dashboard chủ cửa hàng</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-2xl font-bold text-primary">156</p>
                      <p className="text-xs text-muted-foreground">Sản phẩm</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">4.9</p>
                      <p className="text-xs text-muted-foreground">Đánh giá</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">2.3K</p>
                      <p className="text-xs text-muted-foreground">Lượt xem</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>
        )}

        {/* Application cards for users without permissions */}
        {!hasWorkerPermission && !hasStorePermission && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/apply/worker">
              <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 group-hover:scale-110 transition-transform shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Trở thành thợ</h3>
                    <p className="text-sm text-muted-foreground">Đăng ký làm thợ thủ công</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Chia sẻ kỹ năng của bạn và kiếm thu nhập từ đam mê thủ công
                </p>
              </Card>
            </Link>

            <Link href="/apply/store">
              <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 group-hover:scale-110 transition-transform shadow-lg">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Mở cửa hàng</h3>
                    <p className="text-sm text-muted-foreground">Đăng ký mở cửa hàng</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bán sản phẩm thủ công của bạn và tiếp cận hàng nghìn khách hàng
                </p>
              </Card>
            </Link>
          </div>
        )}

        {/* Skills & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <Card className="glass-card p-6 border-white/20">
            <h2 className="text-xl font-bold mb-4">Kỹ năng</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="glass-card p-6 border-white/20">
            <h2 className="text-xl font-bold mb-4">Thành tích</h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl glass-card border-white/10">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-sm">{achievement.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="glass-card border-white/20">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolio.map((item) => (
                <Card key={item.id} className="glass-card border-white/20 overflow-hidden group cursor-pointer">
                  <div className="relative h-48">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
                          {item.category}
                        </Badge>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        {item.likes}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="glass-card p-6 border-white/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
                      {review.job}
                    </Badge>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
