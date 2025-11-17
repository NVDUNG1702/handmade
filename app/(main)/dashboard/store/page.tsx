"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  Package,
  DollarSign,
  Star,
  Eye,
  ShoppingCart,
  Users,
  Plus,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StoreDashboardPage() {
  const stats = [
    {
      label: "Tổng doanh thu",
      value: "125.8M VNĐ",
      change: "+18.2%",
      icon: DollarSign,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      label: "Sản phẩm",
      value: "156",
      change: "+12",
      icon: Package,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Đơn hàng",
      value: "342",
      change: "+24",
      icon: ShoppingCart,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "Lượt xem",
      value: "12.5K",
      change: "+32%",
      icon: Eye,
      gradient: "from-orange-400 to-red-500",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Túi xách da thủ công",
      image: "/leather-bag-crafting.jpg",
      price: "1.2M VNĐ",
      stock: 15,
      sold: 45,
      rating: 4.8,
      status: "active",
    },
    {
      id: 2,
      name: "Ví da handmade",
      image: "/handmade-jewelry-beads.jpg",
      price: "450K VNĐ",
      stock: 8,
      sold: 32,
      rating: 4.9,
      status: "active",
    },
    {
      id: 3,
      name: "Khăn len đan tay",
      image: "/knitting-wool-scarf-tutorial.jpg",
      price: "350K VNĐ",
      stock: 0,
      sold: 28,
      rating: 4.7,
      status: "out-of-stock",
    },
    {
      id: 4,
      name: "Vòng tay handmade",
      image: "/handmade-jewelry-beads.jpg",
      price: "280K VNĐ",
      stock: 25,
      sold: 67,
      rating: 5.0,
      status: "active",
    },
  ]

  const orders = [
    {
      id: "#ORD-2024-001",
      customer: "Nguyễn Thị Mai",
      product: "Túi xách da thủ công",
      amount: "1.2M VNĐ",
      status: "pending",
      date: "2 giờ trước",
    },
    {
      id: "#ORD-2024-002",
      customer: "Trần Văn Nam",
      product: "Ví da handmade",
      amount: "450K VNĐ",
      status: "processing",
      date: "5 giờ trước",
    },
    {
      id: "#ORD-2024-003",
      customer: "Lê Thị Hoa",
      product: "Vòng tay handmade",
      amount: "280K VNĐ",
      status: "completed",
      date: "1 ngày trước",
    },
  ]

  const reviews = [
    {
      id: 1,
      customer: "Nguyễn Thị Mai",
      product: "Túi xách da thủ công",
      rating: 5,
      comment: "Sản phẩm rất đẹp và chất lượng. Đóng gói cẩn thận. Sẽ ủng hộ shop lâu dài!",
      date: "2 ngày trước",
    },
    {
      id: 2,
      customer: "Trần Văn Nam",
      product: "Ví da handmade",
      rating: 5,
      comment: "Chất lượng tuyệt vời, đúng như mô tả. Giao hàng nhanh.",
      date: "3 ngày trước",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-balance mb-1">Quản lý cửa hàng</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="font-semibold text-foreground">Cửa hàng thủ công của tôi</span>
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  4.9 Rating
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/shop/create-product">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </Link>
            <Button variant="outline" className="border-white/20 glass-card bg-transparent">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card p-6 border-white/20 hover:scale-105 transition-transform group">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="glass-card border-white/20">
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sản phẩm của bạn</h2>
                <Link href="/shop/products">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] bg-background/50 backdrop-blur-sm group"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                          <Badge
                            variant={product.status === "active" ? "default" : "secondary"}
                            className={
                              product.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }
                          >
                            {product.status === "active" ? "Đang bán" : "Hết hàng"}
                          </Badge>
                        </div>
                        <p className="text-xl font-bold text-primary">{product.price}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Kho: {product.stock}</span>
                          <span>Đã bán: {product.sold}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {product.rating}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-white/20 bg-transparent">
                            Chỉnh sửa
                          </Button>
                          <Button size="sm" variant="ghost" className="text-muted-foreground">
                            Xem
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Đơn hàng gần đây</h2>
                <Link href="/shop/orders">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-5 border-white/10 hover:border-white/30 transition-all hover:scale-[1.02] bg-background/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-primary">{order.id}</span>
                          <Badge
                            variant="secondary"
                            className={
                              order.status === "completed"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : order.status === "processing"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }
                          >
                            {order.status === "completed"
                              ? "Hoàn thành"
                              : order.status === "processing"
                                ? "Đang xử lý"
                                : "Chờ xác nhận"}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Khách hàng:</span>{" "}
                          <span className="font-medium">{order.customer}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold">{order.amount}</p>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="glass-card p-6 border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-2xl font-bold">4.9</span>
                  <span className="text-sm text-muted-foreground">(127 đánh giá)</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-5 border-white/10 bg-background/50 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white font-bold shrink-0">
                        {review.customer.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{review.customer}</p>
                            <p className="text-sm text-muted-foreground">{review.product}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                        <Button size="sm" variant="ghost" className="text-primary">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Trả lời
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card p-6 border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Doanh thu tháng này</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mục tiêu</span>
                      <span className="font-semibold">125.8M / 150M VNĐ</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-muted-foreground">Tuần này</p>
                      <p className="text-2xl font-bold text-primary">28.5M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tuần trước</p>
                      <p className="text-2xl font-bold text-muted-foreground">24.2M</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Khách hàng</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng khách</p>
                      <p className="text-3xl font-bold">1,234</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Khách mới</p>
                      <p className="text-3xl font-bold text-green-500">+156</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Khách quay lại</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/shop/products/new">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Thêm sản phẩm</h3>
              <p className="text-sm text-muted-foreground">Đăng sản phẩm mới lên cửa hàng</p>
            </Card>
          </Link>

          <Link href="/shop/orders">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-secondary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Đơn hàng</h3>
              <p className="text-sm text-muted-foreground">Quản lý đơn hàng của bạn</p>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-primary w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Tin nhắn</h3>
              <p className="text-sm text-muted-foreground">Trò chuyện với khách hàng</p>
            </Card>
          </Link>

          <Link href="/shop/analytics">
            <Card className="glass-card p-6 border-white/20 hover:scale-105 transition-transform cursor-pointer group h-full">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 w-fit mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Thống kê</h3>
              <p className="text-sm text-muted-foreground">Xem báo cáo chi tiết</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
