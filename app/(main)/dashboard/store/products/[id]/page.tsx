"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Star, Package, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ViewProductPage({ params }: { params: { id: string } }) {
  const [mainImage, setMainImage] = useState("/leather-bag-crafting.jpg")

  const product = {
    id: params.id,
    name: "Túi da handmade cao cấp",
    description:
      "Túi xách da thật 100% được làm thủ công bởi các nghệ nhân có kinh nghiệm. Sản phẩm có thiết kế sang trọng, đường may tỉ mỉ và độ bền cao. Phù hợp cho cả nam và nữ, có thể sử dụng đi làm, đi chơi hoặc làm quà tặng.",
    category: "Sản phẩm hoàn thiện",
    price: 850000,
    stock: 15,
    sold: 45,
    status: "active",
    materials: "Da thật, vải lót cao cấp, khóa kim loại",
    dimensions: "30x25x10 cm",
    weight: "600g",
    images: ["/leather-bag-crafting.jpg", "/handmade-crafts-workspace-colorful.jpg", "/handmade-pottery-workshop.jpg"],
    rating: 4.8,
    reviews: 23,
    createdAt: "15/01/2025",
  }

  const reviews = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất đẹp, chất lượng tốt. Giao hàng nhanh!",
      date: "10/01/2025",
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment: "Túi đẹp nhưng hơi nhỏ so với mô tả. Nhìn chung ok.",
      date: "08/01/2025",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/store/products">
          <Button variant="ghost" className="hover:bg-white/10 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-background/50">
                  <img
                    src={mainImage || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === image ? "border-primary" : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Chi tiết sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Chất liệu</p>
                  <p className="font-medium">{product.materials}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kích thước</p>
                  <p className="font-medium">{product.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trọng lượng</p>
                  <p className="font-medium">{product.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ngày tạo</p>
                  <p className="font-medium">{product.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Đánh giá ({product.reviews})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{product.rating}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{product.reviews} đánh giá</p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-background/30 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Info */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className="mb-2">{product.category}</Badge>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Đang bán</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tồn kho</span>
                  <span className="font-medium">{product.stock} sản phẩm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đã bán</span>
                  <span className="font-medium">{product.sold} sản phẩm</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Link href={`/dashboard/store/products/${product.id}/edit`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa sản phẩm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Lượt xem</p>
                  <p className="text-xl font-bold">1,234</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                <TrendingUp className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <p className="text-xl font-bold">{(product.price * product.sold).toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
