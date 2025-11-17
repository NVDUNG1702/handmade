"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Nghệ nhân Da thủ công",
    avatar: "/vietnamese-woman-smiling.jpg",
    rating: 5,
    content:
      "Handmade đã giúp tôi kết nối với hàng trăm khách hàng mới. Doanh thu của tôi tăng gấp 3 lần chỉ sau 6 tháng sử dụng nền tảng!",
  },
  {
    name: "Trần Văn Hùng",
    role: "Thợ Mộc",
    avatar: "/vietnamese-man-professional.jpg",
    rating: 5,
    content:
      "Giao diện thân thiện, dễ sử dụng. Tôi có thể quản lý dự án và giao tiếp với khách hàng một cách chuyên nghiệp. Rất hài lòng!",
  },
  {
    name: "Lê Thị Hương",
    role: "Nghệ nhân Thêu",
    avatar: "/vietnamese-woman-happy.jpg",
    rating: 5,
    content:
      "Nền tảng tuyệt vời cho những người yêu thích thủ công như tôi. Thanh toán nhanh chóng, an toàn. Tôi đã giới thiệu cho nhiều bạn bè!",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Nghệ nhân <span className="gradient-text">nói gì</span> về chúng tôi
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Hàng nghìn nghệ nhân đã tin tưởng và phát triển sự nghiệp cùng Handmade
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 justify-items-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass rounded-3xl p-10 hover:scale-105 hover:shadow-2xl transition-all duration-500 relative group w-full max-w-[450px] md:max-w-none"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-2xl group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700">
                <Quote className="w-8 h-8 text-white" />
              </div>

              <div className="flex gap-1.5 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-500 text-amber-500" />
                ))}
              </div>

              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="relative">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/30 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
