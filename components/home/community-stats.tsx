"use client"

import { Users, Briefcase, MessageCircle, Star } from "lucide-react"

const stats = [
  { icon: Users, label: "Nghệ nhân", value: "2,500+", color: "from-pink-500 to-rose-500" },
  { icon: Briefcase, label: "Dự án", value: "1,200+", color: "from-purple-500 to-indigo-500" },
  { icon: MessageCircle, label: "Tin nhắn", value: "50K+", color: "from-blue-500 to-cyan-500" },
  { icon: Star, label: "Đánh giá 5⭐", value: "98%", color: "from-amber-500 to-orange-500" },
]

export function CommunityStats() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="glass rounded-[3rem] p-12 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full" />

          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Cộng đồng <span className="gradient-text">đang lớn mạnh</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Hàng nghìn người đã tin tưởng và kết nối qua Handmade
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 justify-items-center">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div
                    className={`w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}
                  >
                    <stat.icon className="w-12 h-12 md:w-14 md:h-14 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-base md:text-lg text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
