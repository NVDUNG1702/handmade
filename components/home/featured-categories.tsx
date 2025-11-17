"use client"

import { Palette, Scissors, Hammer, Sparkles, Shirt, Gift } from "lucide-react"

const categories = [
  { icon: Palette, name: "Hội họa", count: "234 nghệ nhân", color: "from-pink-500 to-rose-500" },
  { icon: Scissors, name: "May vá", count: "189 nghệ nhân", color: "from-purple-500 to-indigo-500" },
  { icon: Hammer, name: "Mộc", count: "156 nghệ nhân", color: "from-blue-500 to-cyan-500" },
  { icon: Sparkles, name: "Trang sức", count: "298 nghệ nhân", color: "from-amber-500 to-orange-500" },
  { icon: Shirt, name: "Thời trang", count: "412 nghệ nhân", color: "from-teal-500 to-emerald-500" },
  { icon: Gift, name: "Quà tặng", count: "167 nghệ nhân", color: "from-violet-500 to-purple-500" },
]

export function FeaturedCategories() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Khám phá <span className="gradient-text">danh mục</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Tìm kiếm nghệ nhân theo lĩnh vực yêu thích của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className="glass rounded-3xl p-6 md:p-8 hover:scale-110 hover:shadow-2xl transition-all duration-500 group w-full max-w-[200px] relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 rounded-3xl" />

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 mx-auto shadow-lg`}
                >
                  <category.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-center text-base md:text-lg">{category.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center font-medium">{category.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
