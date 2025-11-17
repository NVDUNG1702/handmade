"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, ImageIcon, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CreateBlogPage() {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const categories = ["Hướng dẫn", "Cảm hứng", "Xu hướng", "Mẹo hay", "Đánh giá", "Khác"]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/blogs">
            <Button variant="ghost" className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title Card */}
          <Card className="glass-card p-6 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Viết bài mới</h1>
                <p className="text-muted-foreground">Chia sẻ kiến thức và kinh nghiệm của bạn</p>
              </div>
            </div>
          </Card>

          {/* Form */}
          <form className="space-y-6">
            {/* Basic Info */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Thông tin cơ bản</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề bài viết *</Label>
                  <Input
                    id="title"
                    placeholder="VD: 10 Xu hướng thủ công handmade hot nhất 2024"
                    className="h-12 glass-card border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <select
                    id="category"
                    className="w-full h-12 px-4 rounded-lg glass-card border border-white/20 bg-background/50 backdrop-blur-sm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Mô tả ngắn *</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                    className="h-20 glass-card border-white/20"
                  />
                </div>
              </div>
            </Card>

            {/* Featured Image */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Ảnh đại diện</h2>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF tối đa 5MB</p>
              </div>
            </Card>

            {/* Content */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Nội dung bài viết</h2>
              <Textarea
                placeholder="Viết nội dung bài viết của bạn..."
                className="min-h-96 glass-card border-white/20"
              />
            </Card>

            {/* Tags */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Tags</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="h-12 glass-card border-white/20"
                  />
                  <Button type="button" onClick={addTag} className="bg-gradient-to-r from-accent to-secondary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 pl-3 pr-1 py-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 h-12 border-white/20 glass-card bg-transparent">
                Lưu nháp
              </Button>
              <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-accent to-secondary hover:opacity-90">
                Xuất bản
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
