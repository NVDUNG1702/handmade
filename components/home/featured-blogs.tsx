"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import axiosInstance from "@/lib/axios-instance"
import type { ApiResponse, BlogItem } from "@/lib/types"

export function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  useEffect(() => {
    let mounted = true
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get<ApiResponse<BlogItem[]>>("/blogs/featured")
        if (!mounted) return
        
        // Handle flexible response structure
        const responseData = res.data.data
        let blogsData: BlogItem[] = []
        
        if (responseData && typeof responseData === "object") {
          if (Array.isArray(responseData)) {
            blogsData = responseData
          } else if (responseData.data && Array.isArray(responseData.data)) {
            blogsData = responseData.data
          } else {
            // Try other possible fields
            const possibleFields = ["blogs", "posts", "items", "results", "list"]
            for (const field of possibleFields) {
              if (responseData[field] && Array.isArray(responseData[field])) {
                blogsData = responseData[field]
                break
              }
            }
          }
        }
        
        setBlogs(blogsData)
      } catch {}
    }
    void fetchFeatured()
    return () => {
      mounted = false
    }
  }, [])
  return (
    <section className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 gradient-bg-primary rounded-full blur-3xl opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & <span className="gradient-text">Cảm hứng</span>
            </h2>
            <p className="text-lg text-muted-foreground">Chia sẻ kiến thức và câu chuyện từ cộng đồng</p>
          </div>
          <Button variant="outline" className="glass rounded-xl hidden md:flex bg-transparent">
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={(blog as any).image || blog.cover_url || "/placeholder.svg"}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="glass px-3 py-1 rounded-full text-xs font-semibold">{(blog as any).category || blog.slug || "Blog"}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{(blog as any).author || (blog as any).author_name || "Tác giả"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{(blog as any).date || blog.created_at?.slice(0,10) || ""}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="glass rounded-xl bg-transparent">
            Xem tất cả bài viết
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
