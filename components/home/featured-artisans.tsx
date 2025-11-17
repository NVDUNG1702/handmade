"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Briefcase, ArrowRight } from "lucide-react"
import Link from "next/link"

const artisans = [
  {
    id: 1,
    name: "Nguyễn Thị Mai",
    specialty: "Da thủ công",
    avatar: "/vietnamese-woman-smiling.jpg",
    rating: 4.9,
    reviews: 127,
    location: "Hà Nội",
    completedJobs: 89,
    verified: true,
  },
  {
    id: 2,
    name: "Trần Văn Hùng",
    specialty: "Thợ Mộc",
    avatar: "/vietnamese-man-professional.jpg",
    rating: 5.0,
    reviews: 203,
    location: "TP. Hồ Chí Minh",
    completedJobs: 156,
    verified: true,
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    specialty: "Thêu tay",
    avatar: "/vietnamese-woman-happy.jpg",
    rating: 4.8,
    reviews: 94,
    location: "Đà Nẵng",
    completedJobs: 67,
    verified: true,
  },
  {
    id: 4,
    name: "Phạm Minh Tuấn",
    specialty: "Gốm sứ",
    avatar: "/vietnamese-man-casual.jpg",
    rating: 4.9,
    reviews: 156,
    location: "Huế",
    completedJobs: 112,
    verified: true,
  },
]

export function FeaturedArtisans() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-accent/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 text-center md:text-left gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nghệ nhân <span className="gradient-text">nổi bật</span>
            </h2>
            <p className="text-lg text-muted-foreground">Kết nối với những tài năng hàng đầu</p>
          </div>
          <Button
            variant="outline"
            className="glass rounded-xl hover:bg-accent/10 hidden md:flex bg-transparent"
            asChild
          >
            <Link href="/jobs">
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {artisans.map((artisan, index) => (
            <Link
              key={artisan.id}
              href={`/profile/${artisan.id}`}
              className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 group w-full max-w-[300px] md:max-w-none"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <img
                  src={artisan.avatar || "/placeholder.svg"}
                  alt={artisan.name}
                  className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
                {artisan.verified && (
                  <Badge className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white border-0">
                    ✓ Verified
                  </Badge>
                )}
              </div>

              {/* Info */}
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{artisan.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{artisan.specialty}</p>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{artisan.rating}</span>
                  <span className="text-muted-foreground">({artisan.reviews} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {artisan.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  {artisan.completedJobs} dự án hoàn thành
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full gradient-bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                Xem hồ sơ
              </Button>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="glass rounded-xl hover:bg-accent/10 bg-transparent" asChild>
            <Link href="/jobs">
              Xem tất cả nghệ nhân
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
