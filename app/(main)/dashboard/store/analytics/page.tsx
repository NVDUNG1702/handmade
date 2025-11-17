"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Eye, Star } from "lucide-react"

export default function StoreAnalyticsPage() {
  const stats = [
    {
      title: "Doanh thu tháng này",
      value: "45,250,000đ",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Đơn hàng",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Khách hàng mới",
      value: "42",
      change: "-3.1%",
      trend: "down",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Sản phẩm bán chạy",
      value: "23",
      change: "+15.3%",
      trend: "up",
      icon: Package,
      color: "from-orange-500 to-red-500",
    },
  ]

  const topProducts = [
    { name: "Túi da handmade", sold: 45, revenue: 38250000, rating: 4.9 },
    { name: "Vòng tay handmade", sold: 67, revenue: 16750000, rating: 4.8 },
    { name: "Khăn len đan tay", sold: 34, revenue: 8500000, rating: 4.7 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Thống kê cửa hàng
        </h1>
        <p className="text-muted-foreground">Theo dõi hiệu suất kinh doanh của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  className={`${
                    stat.trend === "up"
                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                      : "bg-red-500/20 text-red-500 border-red-500/30"
                  } gap-1`}
                >
                  {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top sản phẩm có doanh thu cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{product.name}</p>
                      <Badge variant="outline" className="text-xs">
                        <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                        {product.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Đã bán: {product.sold} sản phẩm</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{product.revenue.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các sự kiện quan trọng trong cửa hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Đơn hàng mới</p>
                  <p className="text-sm text-muted-foreground">Nguyễn Văn A đã đặt 2 sản phẩm</p>
                  <p className="text-xs text-muted-foreground mt-1">5 phút trước</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Lượt xem tăng</p>
                  <p className="text-sm text-muted-foreground">Sản phẩm "Túi da" có 45 lượt xem mới</p>
                  <p className="text-xs text-muted-foreground mt-1">1 giờ trước</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Đánh giá mới</p>
                  <p className="text-sm text-muted-foreground">Trần Thị B đã đánh giá 5 sao</p>
                  <p className="text-xs text-muted-foreground mt-1">2 giờ trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
