"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Upload, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApplyStorePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categoryOptions = [
    "Túi xách & Ví",
    "Trang sức",
    "Đồ gốm sứ",
    "Đồ gỗ",
    "Đồ len",
    "Tranh & Nghệ thuật",
    "Nến thơm",
    "Đồ trang trí",
    "Quà tặng",
    "Khác",
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-balance">Đăng ký mở cửa hàng</h1>
              <p className="text-muted-foreground">Bán sản phẩm thủ công và tiếp cận hàng nghìn khách hàng</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <Card className="glass-card p-6 border-white/20 mb-8">
          <h2 className="text-xl font-bold mb-4">Lợi ích khi mở cửa hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Tiếp cận rộng</p>
                <p className="text-sm text-muted-foreground">Hàng nghìn khách hàng tiềm năng</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Quản lý dễ dàng</p>
                <p className="text-sm text-muted-foreground">Công cụ quản lý chuyên nghiệp</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold mb-1">Hỗ trợ marketing</p>
                <p className="text-sm text-muted-foreground">Quảng bá sản phẩm hiệu quả</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Application Form */}
        <Card className="glass-card p-8 border-white/20">
          <h2 className="text-2xl font-bold mb-6">Thông tin cửa hàng</h2>

          <form className="space-y-6">
            {/* Store Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="space-y-2">
                <Label htmlFor="storeName">Tên cửa hàng *</Label>
                <Input id="storeName" placeholder="Cửa hàng thủ công của tôi" className="glass-card border-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Mô tả cửa hàng *</Label>
                <Textarea
                  id="storeDescription"
                  placeholder="Giới thiệu về cửa hàng, sản phẩm và giá trị mà bạn mang lại..."
                  className="glass-card border-white/20 min-h-32"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo cửa hàng *</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc click để tải lên logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (khuyến nghị 500x500px)</p>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin chủ cửa hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Họ và tên *</Label>
                  <Input id="ownerName" placeholder="Nguyễn Văn A" className="glass-card border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Số điện thoại *</Label>
                  <Input id="ownerPhone" placeholder="0123456789" className="glass-card border-white/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Email *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="email@example.com"
                  className="glass-card border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Địa chỉ kinh doanh *</Label>
                <Input
                  id="businessAddress"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                  className="glass-card border-white/20"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Danh mục sản phẩm</h3>
              <div className="space-y-2">
                <Label>Chọn danh mục sản phẩm của cửa hàng *</Label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedCategories.includes(category)
                          ? "bg-gradient-to-r from-primary to-accent text-white border-0"
                          : "border-white/20 hover:border-primary"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin kinh doanh</h3>
              <div className="space-y-2">
                <Label htmlFor="businessType">Loại hình kinh doanh *</Label>
                <Select>
                  <SelectTrigger className="glass-card border-white/20">
                    <SelectValue placeholder="Chọn loại hình kinh doanh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                    <SelectItem value="household">Hộ kinh doanh</SelectItem>
                    <SelectItem value="company">Công ty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế (nếu có)</Label>
                <Input id="taxCode" placeholder="0123456789" className="glass-card border-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Số tài khoản ngân hàng *</Label>
                <Input id="bankAccount" placeholder="1234567890" className="glass-card border-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Tên ngân hàng *</Label>
                <Input id="bankName" placeholder="Vietcombank" className="glass-card border-white/20" />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Giấy tờ pháp lý</h3>
              <div className="space-y-2">
                <Label>CMND/CCCD *</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Tải lên ảnh CMND/CCCD (mặt trước và sau)</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (tối đa 5MB mỗi ảnh)</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Giấy phép kinh doanh (nếu có)</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Tải lên giấy phép kinh doanh</p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (tối đa 10MB)</p>
                </div>
              </div>
            </div>

            {/* Product Samples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sản phẩm mẫu</h3>
              <div className="space-y-2">
                <Label>Tải lên hình ảnh sản phẩm mẫu *</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer glass-card">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc click để tải lên hình ảnh sản phẩm</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (tối thiểu 5 ảnh, tối đa 5MB mỗi ảnh)</p>
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
              <Link href="/profile/1" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-white/20 glass-card bg-transparent">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Note */}
        <Card className="glass-card p-6 border-white/20 mt-6 bg-purple-500/5">
          <p className="text-sm text-muted-foreground">
            <strong>Lưu ý:</strong> Đơn đăng ký của bạn sẽ được xem xét trong vòng 3-5 ngày làm việc. Chúng tôi sẽ liên
            hệ với bạn qua email hoặc số điện thoại đã đăng ký. Vui lòng chuẩn bị đầy đủ giấy tờ pháp lý để quá trình
            xét duyệt được nhanh chóng.
          </p>
        </Card>
      </div>
    </div>
  )
}
