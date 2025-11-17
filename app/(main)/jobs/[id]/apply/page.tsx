"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Send, Briefcase, DollarSign, MapPin, Clock } from "lucide-react"
import Link from "next/link"

import { RequireAuth } from "@/components/require-auth"

export default function JobApplicationPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    portfolio: "",
    coverLetter: "",
    expectedSalary: "",
  })

  const jobData = {
    title: "Thợ da thủ công cao cấp",
    company: "Xưởng Da Handmade Việt",
    location: "Quận 1, TP.HCM",
    salary: "15-25 triệu",
    type: "Full-time",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
    alert("Đã gửi đơn ứng tuyển thành công!")
    router.push(`/jobs/${params?.id}`)
  }

  return (
    <RequireAuth>
      <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" className="mb-6 gap-2" asChild>
          <Link href={`/jobs/${params?.id}`}>
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Ứng tuyển công việc
          </h1>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{jobData.title}</h2>
                  <p className="text-lg text-muted-foreground mb-3">{jobData.company}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 gap-1">
                      <DollarSign className="w-3 h-3" />
                      {jobData.salary}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {jobData.location}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {jobData.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-card border-white/20 mb-6">
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Vui lòng điền đầy đủ thông tin của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="experience">Kinh nghiệm làm việc *</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Mô tả kinh nghiệm làm việc của bạn..."
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expectedSalary">Mức lương mong muốn</Label>
                <Input
                  id="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                  placeholder="VD: 20 triệu"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 mb-6">
            <CardHeader>
              <CardTitle>Hồ sơ và thư giới thiệu</CardTitle>
              <CardDescription>Thêm thông tin để tăng cơ hội được chọn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="portfolio">Link Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="coverLetter">Thư giới thiệu *</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  placeholder="Giới thiệu bản thân và lý do bạn phù hợp với công việc này..."
                  required
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>CV/Resume</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Kéo thả file hoặc click để tải lên</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Tối đa 5MB)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent gap-2">
              <Send className="w-4 h-4" />
              Gửi đơn ứng tuyển
            </Button>
          </div>
        </form>
      </div>
      </div>
    </RequireAuth>
  )
}
