"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Store, MapPin, Phone, Mail, Globe, Upload, Save, X } from "lucide-react"

export default function StoreInfoPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [storeData, setStoreData] = useState({
    name: "Cửa hàng Handmade Việt",
    description: "Chuyên cung cấp các sản phẩm handmade chất lượng cao, được làm thủ công bởi các nghệ nhân tài năng.",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0123456789",
    email: "contact@handmade.vn",
    website: "https://handmade.vn",
    avatar: "/store-icon.jpg",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Thông tin cửa hàng
        </h1>
        <p className="text-muted-foreground">Quản lý thông tin và cài đặt cửa hàng của bạn</p>
      </div>

      <Card className="glass-card border-white/20 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin hiển thị của cửa hàng</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-primary to-accent">
                Chỉnh sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-accent">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={storeData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                <Store className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="w-4 h-4" />
                Tải ảnh lên
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên cửa hàng</Label>
              <Input
                id="name"
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                disabled={!isEditing}
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={storeData.address}
                  onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={storeData.phone}
                    onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={storeData.email}
                    onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={storeData.website}
                  onChange={(e) => setStoreData({ ...storeData, website: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle>Trạng thái cửa hàng</CardTitle>
          <CardDescription>Thông tin về tình trạng hoạt động</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Trạng thái hoạt động</p>
              <p className="text-sm text-muted-foreground">Cửa hàng đang mở cửa và nhận đơn hàng</p>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">Đang hoạt động</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
