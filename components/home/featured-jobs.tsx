"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, ArrowRight, Zap } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Cần thợ may áo dài cưới",
    category: "May vá",
    location: "Hà Nội",
    budget: "5-8 triệu",
    time: "2 tuần",
    description: "Tìm thợ may có kinh nghiệm làm áo dài cưới truyền thống với chất liệu cao cấp",
    urgent: true,
  },
  {
    id: 2,
    title: "Thiết kế logo thủ công",
    category: "Hội họa",
    location: "TP.HCM",
    budget: "3-5 triệu",
    time: "1 tuần",
    description: "Cần họa sĩ vẽ logo thủ công phong cách vintage cho thương hiệu cafe",
    urgent: false,
  },
  {
    id: 3,
    title: "Làm bàn gỗ handmade",
    category: "Mộc",
    location: "Đà Nẵng",
    budget: "10-15 triệu",
    time: "3 tuần",
    description: "Đặt làm bàn làm việc gỗ tự nhiên theo thiết kế riêng",
    urgent: false,
  },
]

export function FeaturedJobs() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 text-center md:text-left gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Công việc <span className="gradient-text">nổi bật</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">Những dự án đang chờ bạn khám phá</p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="glass rounded-2xl hidden md:flex bg-transparent hover:bg-accent/10 hover:scale-105 transition-all duration-300 px-6"
          >
            Xem tất cả
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className="glass rounded-3xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 rounded-3xl" />

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex-none mb-4">
                  {job.urgent && (
                    <Badge className="gradient-bg-primary text-primary-foreground border-0 px-4 py-1.5 text-sm font-bold shadow-lg">
                      <Zap className="w-4 h-4 mr-1" />
                      Gấp
                    </Badge>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all duration-300 line-clamp-2 min-h-[64px]">
                  {job.title}
                </h3>

                <p className="text-base text-muted-foreground mb-6 line-clamp-2 min-h-[48px] leading-relaxed">
                  {job.description}
                </p>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-base">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="truncate font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="truncate font-medium">{job.budget}</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <span className="truncate font-medium">{job.time}</span>
                  </div>
                </div>

                <Button className="w-full gradient-bg-primary text-primary-foreground rounded-2xl hover:opacity-90 hover:scale-105 transition-all duration-300 flex-none text-base py-6 shadow-lg">
                  Ứng tuyển ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button variant="outline" size="lg" className="glass rounded-2xl bg-transparent hover:bg-accent/10 px-6">
            Xem tất cả công việc
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
