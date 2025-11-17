"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Lock, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Cài đặt</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="glass-card border-white/20">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Tài khoản
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Palette className="w-4 h-4 mr-2" />
              Giao diện
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Thông tin cá nhân</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" defaultValue="Nguyễn Văn" className="glass-card border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" defaultValue="A" className="glass-card border-white/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="nguyenvana@example.com"
                    className="glass-card border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" defaultValue="+84 123 456 789" className="glass-card border-white/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    defaultValue="Nghệ nhân thủ công với 10 năm kinh nghiệm..."
                    className="glass-card border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" defaultValue="Hà Nội, Việt Nam" className="glass-card border-white/20" />
                </div>

                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">Lưu thay đổi</Button>
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Ảnh đại diện</h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-3xl">
                  N
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                    Tải ảnh lên
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG tối đa 5MB</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Thông báo Email</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Công việc mới</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo khi có công việc phù hợp</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Tin nhắn</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo tin nhắn mới</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Đánh giá</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo đánh giá mới</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Thanh toán</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo về giao dịch</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Bản tin</p>
                    <p className="text-sm text-muted-foreground">Nhận bản tin và cập nhật từ Handmade</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Thông báo Push</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Bật thông báo push</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo trên thiết bị</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Đổi mật khẩu</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input id="currentPassword" type="password" className="glass-card border-white/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input id="newPassword" type="password" className="glass-card border-white/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input id="confirmPassword" type="password" className="glass-card border-white/20" />
                </div>

                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">Cập nhật mật khẩu</Button>
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Xác thực hai yếu tố</h2>
              <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                <div>
                  <p className="font-medium">Bật xác thực 2FA</p>
                  <p className="text-sm text-muted-foreground">Tăng cường bảo mật tài khoản</p>
                </div>
                <Switch />
              </div>
            </Card>

            <Card className="glass-card p-6 border-white/20 border-red-500/20">
              <h2 className="text-xl font-bold mb-6 text-red-500">Vùng nguy hiểm</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl glass-card border-white/10">
                  <p className="font-medium mb-2">Xóa tài khoản</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                  </p>
                  <Button variant="destructive">Xóa tài khoản</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <h2 className="text-xl font-bold mb-6">Giao diện</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl glass-card border-white/10">
                  <div>
                    <p className="font-medium">Chế độ tối</p>
                    <p className="text-sm text-muted-foreground">Tự động chuyển đổi theo hệ thống</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <select className="w-full h-12 px-4 rounded-lg glass-card border border-white/20 bg-background/50 backdrop-blur-sm">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
