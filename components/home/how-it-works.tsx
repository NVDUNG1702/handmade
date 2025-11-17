"use client"

import { UserPlus, Search, MessageCircle, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Đăng ký tài khoản",
    description: "Tạo hồ sơ miễn phí và giới thiệu kỹ năng của bạn",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Search,
    title: "Tìm kiếm cơ hội",
    description: "Khám phá hàng trăm dự án phù hợp với chuyên môn",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: MessageCircle,
    title: "Kết nối & thương lượng",
    description: "Trò chuyện trực tiếp với khách hàng và thỏa thuận chi tiết",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CheckCircle,
    title: "Hoàn thành & nhận tiền",
    description: "Giao sản phẩm và nhận thanh toán an toàn qua nền tảng",
    color: "from-amber-500 to-orange-500",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-accent/5 to-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Cách thức <span className="gradient-text">hoạt động</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Chỉ với 4 bước đơn giản, bạn có thể bắt đầu kiếm tiền từ đam mê thủ công của mình
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[60%] w-full h-1 bg-gradient-to-r from-primary/30 via-accent/30 to-transparent -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}

              <div
                className="glass rounded-3xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white font-bold text-xl shadow-2xl group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700">
                  {index + 1}
                </div>

                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl mx-auto sm:mx-0`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-4 text-center sm:text-left group-hover:gradient-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed text-center sm:text-left">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
