"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Upload, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApplyWorkerPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const skillOptions = [
    "Làm túi da",
    "Thêu tay",
    "Đan len",
    "Gốm sứ",
    "Mộc thủ công",
    "Trang sức handmade",
    "Vẽ tranh",
    "Khắc gỗ",
    "Dệt vải",
    "Làm nến",
  ]

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/my-profile">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-balance">Đăng ký trở thành thợ</h1>
              <p className="text-muted-foreground">Chia sẻ kỹ năng và kiếm thu nhập từ đam mê của bạn</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <Card className="glass-card p-6 border-white/20 mb-8">
          <h2 className="text-xl font-bold mb-4">Lợi ích khi trở thành thợ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Thu nhập ổn định</p>
                <p className="text-sm text-muted-foreground">Nhận việc liên tục từ khách hàng</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Linh hoạt thời gian</p>
                <p className="text-sm text-muted-foreground">Làm việc theo lịch trình của bạn</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Hỗ trợ 24/7</p>
                <p className="text-sm text-muted-foreground">Đội ngũ hỗ trợ luôn sẵn sàng</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Application Form */}
        <Card className="glass-card p-8 border-white/20">
          <h2 className="text-2xl font-bold mb-6">Thông tin đăng ký</h2>

          <form className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input id="fullName" placeholder="Nguyễn Văn A" className="glass-card border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input id="phone" placeholder="0123456789" className="glass-card border-white/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="email@example.com" className="glass-card border-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Input
                  id="address"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                  className="glass-card border-white/20"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kỹ năng thủ công</h3>
              <div className="space-y-2">
                <Label>Chọn kỹ năng của bạn *</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-gradient-to-r from-primary to-accent text-white border-0"
                          : "border-white/20 hover:border-primary"
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Số năm kinh nghiệm *</Label>
                <Select>
                  <SelectTrigger className="glass-card border-white/20">
                    <SelectValue placeholder="Chọn số năm kinh nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Dưới 1 năm</SelectItem>
                    <SelectItem value="1-3">1-3 năm</SelectItem>
                    <SelectItem value="3-5">3-5 năm</SelectItem>
                    <SelectItem value="5-10">5-10 năm</SelectItem>
                    <SelectItem value="10+">Trên 10 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Giới thiệu bản thân</h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Mô tả về bạn và kỹ năng của bạn *</Label>
                <Textarea
                  id="bio"
                  placeholder="Chia sẻ về kinh nghiệm, phong cách làm việc và những gì bạn có thể mang lại cho khách hàng..."
                  className="glass-card border-white/20 min-h-32"
                />
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Portfolio</h3>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Tải lên hình ảnh sản phẩm của bạn</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc click để tải lên hình ảnh</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (tối đa 5MB mỗi ảnh)</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chứng chỉ (nếu có)</h3>
              <div className="space-y-2">
                <Label htmlFor="certifications">Tải lên chứng chỉ, bằng cấp liên quan</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc click để tải lên chứng chỉ</p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (tối đa 10MB)</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
              >
                Gửi đơn đăng ký
              </Button>
              <Link href="/my-profile" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-white/20 glass-card bg-transparent">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Note */}
        <Card className="glass-card p-6 border-white/20 mt-6 bg-blue-500/5">
          <p className="text-sm text-muted-foreground">
            <strong>Lưu ý:</strong> Đơn đăng ký của bạn sẽ được xem xét trong vòng 2-3 ngày làm việc. Chúng tôi sẽ liên
            hệ với bạn qua email hoặc số điện thoại đã đăng ký.
          </p>
        </Card>
      </div>
    </div>
  )
}
