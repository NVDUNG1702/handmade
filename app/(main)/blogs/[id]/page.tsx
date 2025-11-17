"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Eye, Heart, Share2, Bookmark, ArrowLeft, MessageSquare, ThumbsUp, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import axiosInstance from "@/lib/axios-instance"
import type { ApiResponse, BlogItem } from "@/lib/types"
import { useParams } from "next/navigation"

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<any | null>(null)
  useEffect(() => {
    let mounted = true
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get<ApiResponse<any>>(`/blogs/${params.id}`)
        if (!mounted) return
        
        // Handle flexible response structure
        const responseData = res.data.data
        if (responseData && typeof responseData === "object") {
          setPost(responseData)
        } else {
          setPost(null)
        }
      } catch {}
    }
    if (params?.id) void fetchDetail()
    return () => {
      mounted = false
    }
  }, [params?.id])

  const relatedPosts = [
    {
      id: 2,
      title: "Cách chọn chất liệu da phù hợp",
      image: "/leather-materials.jpg",
      date: "3 ngày trước",
    },
    {
      id: 3,
      title: "Bí quyết thêu logo chuyên nghiệp",
      image: "/embroidery-logo.jpg",
      date: "5 ngày trước",
    },
  ]

  const comments = [
    {
      id: 1,
      author: "Trần Văn Nam",
      avatar: "",
      content: "Bài viết rất hữu ích! Mình đang tìm hiểu về xu hướng handmade và bài này giúp mình rất nhiều.",
      date: "1 ngày trước",
      likes: 5,
    },
    {
      id: 2,
      author: "Lê Thị Hoa",
      avatar: "",
      content: "Cảm ơn tác giả đã chia sẻ. Mình rất thích phần về chất liệu thân thiện môi trường.",
      date: "2 ngày trước",
      likes: 3,
    },
  ]

  if (!post) return null
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Back button */}
        <Link href="/blogs">
          <Button variant="ghost" className="hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại blog
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="glass-card p-6 border-white/20">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 mb-4">
                {(post as any).category || post.slug || "Blog"}
              </Badge>
              <h1 className="text-4xl font-bold text-balance mb-4">{post.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  5 phút đọc
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {(post.views ?? 0)} lượt xem
                </span>
                <span>{post.date}</span>
              </div>

              {/* Author */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {((post as any).author?.name || post.author_name || "A").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{(post as any).author?.name || post.author_name || "Tác giả"}</p>
                    <p className="text-sm text-muted-foreground">{(post as any).author?.bio || ""}</p>
                  </div>
                </div>
                <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                  Theo dõi
                </Button>
              </div>
            </Card>

            {/* Featured Image */}
            <Card className="glass-card border-white/20 overflow-hidden">
              <div className="relative h-96">
                <Image src={(post as any).image || post.cover_url || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            </Card>

            {/* Content */}
              <Card className="glass-card p-6 border-white/20">
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: (post as any).content || post.excerpt || "" }} />
            </Card>

            {/* Tags */}
            <Card className="glass-card p-6 border-white/20">
              <h3 className="font-bold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                    <Bookmark className="w-4 h-4 mr-2" />
                    {post.bookmarks}
                  </Button>
                </div>
                <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </Card>

            {/* Comments */}
            <Card className="glass-card p-6 border-white/20">
              <h3 className="text-xl font-bold mb-6">Bình luận ({post.comments})</h3>

              {/* Comment Form */}
              <div className="mb-6">
                <Textarea placeholder="Viết bình luận của bạn..." className="mb-3 glass-card border-white/20" />
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Send className="w-4 h-4 mr-2" />
                  Gửi bình luận
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-4 border-white/10 bg-background/50 backdrop-blur-sm">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-medium shrink-0">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">{comment.date}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="hover:bg-white/10">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="glass-card p-6 border-white/20">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{post.author.name}</h3>
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                </div>
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <p className="font-bold text-lg">{post.author.posts}</p>
                    <p className="text-muted-foreground">Bài viết</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">1.2K</p>
                    <p className="text-muted-foreground">Người theo dõi</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">Theo dõi</Button>
              </div>
            </Card>

            {/* Related Posts */}
            <Card className="glass-card p-6 border-white/20">
              <h3 className="font-bold mb-4">Bài viết liên quan</h3>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blogs/${related.id}`}>
                    <Card className="p-3 border-white/10 hover:border-white/30 transition-all bg-background/50 backdrop-blur-sm group">
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={related.image || "/placeholder.svg"}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">{related.date}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
