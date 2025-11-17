"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, DollarSign, Calendar, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CreateJobPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const categories = ["Thêu", "Đan len", "Làm túi", "Trang sức", "Gốm sứ", "Mộc", "Khác"]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/customer">
            <Button variant="ghost" className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Title Card */}
          <Card className="glass-card p-6 border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Đăng công việc mới</h1>
                <p className="text-muted-foreground">Tìm thợ thủ công phù hợp cho dự án của bạn</p>
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
                  <Label htmlFor="title">Tiêu đề công việc *</Label>
                  <Input
                    id="title"
                    placeholder="VD: Làm túi xách da thủ công cao cấp"
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
                  <Label htmlFor="description">Mô tả chi tiết *</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về công việc, yêu cầu, và mong đợi của bạn..."
                    className="min-h-32 glass-card border-white/20"
                  />
                </div>
              </div>
            </Card>

            {/* Budget & Timeline */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Ngân sách & Thời gian</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minBudget">Ngân sách tối thiểu *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="minBudget"
                      type="number"
                      placeholder="500,000"
                      className="pl-10 h-12 glass-card border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxBudget">Ngân sách tối đa *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="maxBudget"
                      type="number"
                      placeholder="1,000,000"
                      className="pl-10 h-12 glass-card border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Thời hạn hoàn thành *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="deadline" type="date" className="pl-10 h-12 glass-card border-white/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="location" placeholder="Hà Nội" className="pl-10 h-12 glass-card border-white/20" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Kỹ năng yêu cầu</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập kỹ năng..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="h-12 glass-card border-white/20"
                  />
                  <Button type="button" onClick={addSkill} className="bg-gradient-to-r from-primary to-accent">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 pl-3 pr-1 py-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
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

            {/* Requirements */}
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Yêu cầu bổ sung</h2>
              <Textarea
                placeholder="Các yêu cầu khác về kinh nghiệm, portfolio, thiết bị..."
                className="min-h-24 glass-card border-white/20"
              />
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 h-12 border-white/20 glass-card bg-transparent">
                Lưu nháp
              </Button>
              <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Đăng công việc
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
