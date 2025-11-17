"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, ArrowRight, Play, CheckCircle2, Shield, Award } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 gradient-animated opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,105,180,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,191,255,0.1),transparent_50%)]" />

      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-shadow animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
              Nền tảng #1 kết nối nghệ nhân Việt Nam
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Khám phá tài năng{" "}
            <span className="relative inline-block">
              <span className="gradient-text">thủ công</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 5 100 2 150 5C200 8 250 10 298 8"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(255, 105, 180)" />
                    <stop offset="100%" stopColor="rgb(0, 191, 255)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            của Gen Z Việt
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Kết nối với hàng nghìn nghệ nhân tài năng, chia sẻ đam mê sáng tạo, và xây dựng sự nghiệp từ đôi bàn tay
            khéo léo của bạn
          </p>

          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl hover:shadow-3xl transition-shadow border border-white/20">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-5 h-5 text-muted-foreground ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công việc, nghệ nhân, kỹ năng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none px-2 py-4 text-foreground placeholder:text-muted-foreground text-base sm:text-lg"
                />
              </div>
              <Button className="gradient-bg-primary text-primary-foreground rounded-xl px-6 sm:px-8 py-4 sm:py-6 hover:opacity-90 transition-all hover:scale-105 shadow-lg whitespace-nowrap">
                Tìm kiếm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Phổ biến:</span>
              {["Da thủ công", "Đan len", "Thêu tay", "Gốm sứ", "Trang sức"].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="glass border-white/20 hover:bg-accent/20 cursor-pointer transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <Button
              size="lg"
              className="gradient-bg-primary text-primary-foreground rounded-xl px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl group w-full sm:w-auto"
              asChild
            >
              <Link href="/register">
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass rounded-xl px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg hover:bg-accent/10 bg-transparent border-white/20 group w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Xem demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">Miễn phí đăng ký</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-muted-foreground">Thanh toán an toàn</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-muted-foreground">2,500+ nghệ nhân tin dùng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
