"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axios-instance"
import { API_CONSTANTS } from "@/lib/api-constants"
import type { ApiResponse, BlogItem, PaginatedResult } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Sparkles,
  Users,
  FileText,
  Mail,
  ArrowRight,
  Filter,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const postsPerPage = 6
  const [posts, setPosts] = useState<BlogItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const categories = [
    { id: "all", name: "Tất cả", count: 156 },
    { id: "tutorial", name: "Hướng dẫn", count: 45 },
    { id: "inspiration", name: "Cảm hứng", count: 32 },
    { id: "trends", name: "Xu hướng", count: 28 },
    { id: "tips", name: "Mẹo hay", count: 51 },
  ]

  const stats = [
    { icon: FileText, label: "Bài viết", value: "156", color: "text-primary" },
    { icon: Users, label: "Tác giả", value: "24", color: "text-accent" },
    { icon: Eye, label: "Lượt xem", value: "45K", color: "text-secondary" },
    { icon: Heart, label: "Yêu thích", value: "8.2K", color: "text-pink-500" },
  ]

  const featuredPost = {
    id: 1,
    title: "10 Xu hướng thủ công handmade hot nhất 2024",
    excerpt: "Khám phá những xu hướng thủ công đang làm mưa làm gió trong cộng đồng handmade Việt Nam năm nay",
    author: "Nguyễn Thị Mai",
    authorAvatar: "",
    date: "2 ngày trước",
    readTime: "5 phút đọc",
    views: 1234,
    likes: 89,
    comments: 23,
    category: "Xu hướng",
    image: "/handmade-crafts-workspace-colorful.jpg",
  }

  
  // Fetch blogs from BE
  useEffect(() => {
    let isMounted = true
    const fetchBlogs = async () => {
      setIsLoading(true)
      setErrorMessage("")
      try {
        const params: Record<string, string | number> = {
          [API_CONSTANTS.QUERY.PAGE]: currentPage,
          [API_CONSTANTS.QUERY.LIMIT]: postsPerPage,
        }
        if (searchQuery.trim()) params[API_CONSTANTS.QUERY.SEARCH] = searchQuery.trim()
        const res = await axiosInstance.get<ApiResponse<PaginatedResult<BlogItem>>>(
          API_CONSTANTS.ENDPOINTS.BLOGS.LIST,
          { params }
        )
        if (!isMounted) return
        
        // Handle flexible response structure like handmade-fe
        const responseData = res.data.data
        let postsData: BlogItem[] = []
        let totalCount = 0
        
        if (responseData && typeof responseData === "object") {
          if (responseData.data && Array.isArray(responseData.data)) {
            postsData = responseData.data
            totalCount = responseData.total || responseData.data.length
          } else if (Array.isArray(responseData)) {
            postsData = responseData
            totalCount = responseData.length
          } else {
            // Try other possible fields
            const possibleFields = ["blogs", "posts", "items", "results", "list"]
            for (const field of possibleFields) {
              if (responseData[field] && Array.isArray(responseData[field])) {
                postsData = responseData[field]
                totalCount = responseData.total || responseData[field].length
                break
              }
            }
          }
        }
        
        setPosts(postsData)
        setTotal(totalCount)
      } catch (err) {
        setErrorMessage("Không thể tải danh sách bài viết.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void fetchBlogs()
    return () => {
      isMounted = false
    }
  }, [currentPage, searchQuery])

  const trendingPosts = [
    { id: 1, title: "10 Xu hướng thủ công handmade hot nhất 2024", views: 1234 },
    { id: 5, title: "Hướng dẫn đan khăn len cơ bản cho người mới", views: 1456 },
    { id: 4, title: "Cảm hứng từ thiên nhiên cho đồ handmade", views: 923 },
  ]

  const popularTags = [
    "Handmade",
    "DIY",
    "Thủ công",
    "Đan len",
    "Thêu",
    "Gốm sứ",
    "Da thật",
    "Trang trí",
    "Quà tặng",
    "Nghệ thuật",
  ]

  const totalPages = useMemo(() => Math.max(1, Math.ceil((total || 0) / postsPerPage)), [total])
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Khám phá kiến thức handmade</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-balance">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Blog Handmade
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Chia sẻ kiến thức, kinh nghiệm và cảm hứng thủ công từ cộng đồng nghệ nhân Việt Nam
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card border-white/20 rounded-2xl p-4 hover:scale-105 transition-transform"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-2 mx-auto`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 glass-card border-white/20 text-base"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 glass-card border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="trending">Xu hướng</SelectItem>
                <SelectItem value="most-viewed">Xem nhiều</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 whitespace-nowrap shadow-lg"
                    : "border-white/20 glass-card whitespace-nowrap hover:border-primary/50"
                }
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 border-0">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Post with better spacing */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-bold">Bài viết nổi bật</h2>
              </div>
              <Link href={`/blogs/${featuredPost.id}`}>
                <Card className="glass-card border-white/20 overflow-hidden hover:scale-[1.02] transition-all group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto min-h-[300px]">
                      <Image
                        src={featuredPost.cover_url || "/placeholder.svg"}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 flex items-center gap-1 shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          Nổi bật
                        </Badge>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 w-fit mb-4">
                        {featuredPost.tags?.[0] || 'Blog'}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors text-balance">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-balance">
                        {featuredPost.content?.substring(0, 150) + '...' || 'Không có mô tả'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-white/10">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {Math.ceil((featuredPost.content?.length || 0) / 500)} phút đọc
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {featuredPost.view_count || 0} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {featuredPost.like_count || 0} thích
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                            {featuredPost.author?.full_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-medium">{featuredPost.author?.full_name || 'Tác giả'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(featuredPost.created_at || '').toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </section>

            {/* Posts Grid with better spacing */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
                <p className="text-sm text-muted-foreground">
                  Hiển thị {total === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, total)} / {total}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPosts.map((post) => (
                  <Link key={post.id} href={`/blogs/${post.id}`}>
                    <Card className="glass-card border-white/20 overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all group h-full flex flex-col">
                      <div className="relative h-48">
                        <Image
                          src={post.cover_url || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 space-y-3 flex-1 flex flex-col">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 w-fit">
                          {post.tags?.[0] || "Bài viết"}
                        </Badge>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 text-balance">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                          {post.content?.substring(0, 100) + '...' || 'Không có mô tả'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-white/10">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.ceil((post.content?.length || 0) / 500)} phút đọc
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.view_count ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.like_count ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 pt-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-sm font-medium">
                            {post.author?.full_name?.charAt(0) || 'A'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{post.author?.full_name || "Tác giả"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.created_at || '').toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Pagination with better spacing */}
            {totalPages > 1 && (
              <div className="flex justify-center pt-8">
                <Pagination>
                  <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`${
                          currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-primary/10 cursor-pointer"
                        }`}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      const showPage =
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)

                      if (!showPage) {
                        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className={`cursor-pointer ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-primary via-accent to-secondary text-white border-0 shadow-lg"
                                : "hover:bg-accent/10"
                            }`}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-primary/10 cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {/* Trending Posts */}
            <Card className="glass-card border-white/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-lg">Xu hướng</h3>
              </div>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <Link key={post.id} href={`/blogs/${post.id}`}>
                    <div className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {post.views} lượt xem
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Popular Tags */}
            <Card className="glass-card border-white/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-lg">Chủ đề phổ biến</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-white/20 hover:bg-primary/10 hover:border-primary/50 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="glass-card border-white/20 p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Nhận bài viết mới</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Đăng ký để nhận thông báo về bài viết mới nhất từ cộng đồng handmade
              </p>
              <div className="space-y-3">
                <Input type="email" placeholder="Email của bạn" className="glass-card border-white/20" />
                <Button className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90">
                  Đăng ký ngay
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
