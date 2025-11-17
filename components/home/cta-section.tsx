"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
      <div className="absolute inset-0 gradient-animated opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass rounded-[3rem] p-12 md:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent/20 to-transparent rounded-tl-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full text-base font-bold mb-8 shadow-lg hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Miễn phí đăng ký</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-balance leading-tight">
              Sẵn sàng bắt đầu hành trình <span className="gradient-text">sáng tạo</span>?
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
              Tham gia cộng đồng nghệ nhân Việt Nam ngay hôm nay. Kết nối, học hỏi và phát triển cùng hàng nghìn người
              đam mê thủ công.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Không phí ẩn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Thanh toán an toàn</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="gradient-bg-primary text-primary-foreground rounded-2xl px-10 py-7 hover:opacity-90 hover:scale-105 transition-all duration-300 text-lg font-bold shadow-2xl w-full sm:w-auto"
              >
                Đăng ký miễn phí
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass rounded-2xl px-10 py-7 hover:bg-accent/10 hover:scale-105 transition-all duration-300 bg-transparent text-lg font-semibold w-full sm:w-auto"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
