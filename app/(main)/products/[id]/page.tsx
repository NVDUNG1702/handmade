"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  MessageSquare,
  Store,
  ThumbsUp,
  Minus,
  Plus,
  CheckCircle2,
  Award,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [liked, setLiked] = useState(false)

  const product = {
    id: 1,
    name: "Bộ len cao cấp 20 màu",
    description:
      "Bộ len cao cấp với 20 màu sắc đa dạng, chất liệu mềm mại, không xù lông. Phù hợp để đan khăn, mũ, áo và các sản phẩm handmade khác. Mỗi cuộn len có trọng lượng 50g, đủ để hoàn thành nhiều dự án thủ công.",
    price: 350000,
    originalPrice: 450000,
    discount: 22,
    rating: 4.9,
    reviews: 234,
    sold: 1200,
    inStock: true,
    stock: 45,
    category: "Vật liệu",
    brand: "Len Việt",
    sku: "LEN-20M-001",
    images: [
      "/colorful-yarn-balls-set.jpg",
      "/knitting-wool-scarf-tutorial.jpg",
      "/handmade-crafts-workspace-colorful.jpg",
      "/yarn-store-logo.jpg",
    ],
    features: [
      "20 màu sắc đa dạng, dễ phối hợp",
      "Chất liệu mềm mại, không gây ngứa",
      "Không xù lông sau nhiều lần giặt",
      "Phù hợp cho người mới bắt đầu",
      "Có thể giặt máy ở nhiệt độ thấp",
    ],
    specifications: {
      "Chất liệu": "100% Acrylic cao cấp",
      "Trọng lượng": "50g/cuộn",
      "Độ dài": "Khoảng 120m/cuộn",
      "Số kim đề xuất": "3.5mm - 4.5mm",
      "Xuất xứ": "Việt Nam",
      "Bảo quản": "Nơi khô ráo, thoáng mát",
    },
    store: {
      id: 1,
      name: "Len Việt Store",
      logo: "/yarn-store-logo.jpg",
      rating: 4.9,
      reviews: 1234,
      products: 450,
      responseTime: "Trong vòng 1 giờ",
      location: "Hà Nội",
    },
    shipping: {
      freeShipping: true,
      estimatedDays: "2-3 ngày",
      returnPolicy: "Đổi trả trong 7 ngày",
    },
  }

  const reviews = [
    {
      id: 1,
      author: "Nguyễn Thị Mai",
      avatar: "",
      rating: 5,
      content:
        "Len rất đẹp, màu sắc đúng như hình. Chất lượng tốt, mềm mại. Mình đã đan được chiếc khăn rất đẹp. Sẽ ủng hộ shop lâu dài!",
      date: "2 ngày trước",
      likes: 15,
      images: ["/colorful-yarn-balls-set.jpg", "/knitting-wool-scarf-tutorial.jpg"],
      verified: true,
    },
    {
      id: 2,
      author: "Trần Văn Nam",
      avatar: "",
      rating: 5,
      content: "Giao hàng nhanh, đóng gói cẩn thận. Len không xù lông, rất hài lòng!",
      date: "5 ngày trước",
      likes: 8,
      images: [],
      verified: true,
    },
    {
      id: 3,
      author: "Lê Thị Hoa",
      avatar: "",
      rating: 4,
      content: "Sản phẩm tốt, giá cả hợp lý. Chỉ có điều màu hồng hơi nhạt so với hình.",
      date: "1 tuần trước",
      likes: 5,
      images: [],
      verified: false,
    },
  ]

  const relatedProducts = [
    {
      id: 2,
      name: "Len cotton Nhật Bản",
      price: 280000,
      originalPrice: null,
      rating: 5.0,
      sold: 890,
      image: "/knitting-wool-scarf-tutorial.jpg",
    },
    {
      id: 3,
      name: "Bộ kim đan 12 size",
      price: 120000,
      originalPrice: 150000,
      rating: 4.8,
      sold: 2100,
      image: "/knitting-needles-set.jpg",
    },
    {
      id: 4,
      name: "Len lông cừu Úc",
      price: 450000,
      originalPrice: null,
      rating: 4.9,
      sold: 456,
      image: "/colorful-yarn-balls-set.jpg",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6 space-y-8">
        <Link href="/shop">
          <Button variant="ghost" className="hover:bg-white/10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại cửa hàng
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-secondary text-white border-0 text-lg font-bold shadow-lg px-3 py-1">
                        -{product.discount}%
                      </Badge>
                    </div>
                  )}
                  {product.inStock && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">Còn hàng</Badge>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary shadow-lg scale-105"
                          : "border-white/20 hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20">{product.category}</Badge>
                    <Badge variant="outline" className="border-white/20">
                      {product.brand}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold text-lg">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} đánh giá)</span>
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      Đã bán {product.sold}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

                  <div className="space-y-4 p-4 rounded-xl glass-card border-white/20">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Miễn phí vận chuyển</p>
                        <p className="text-sm text-muted-foreground">
                          Giao hàng trong {product.shipping.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">{product.shipping.returnPolicy}</p>
                        <p className="text-sm text-muted-foreground">Nếu sản phẩm có lỗi</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Số lượng:</span>
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 glass-card bg-transparent"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/20 glass-card bg-transparent"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.stock} sản phẩm có sẵn)</span>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base font-semibold">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className={`h-12 w-12 border-white/20 glass-card ${
                        liked ? "bg-pink-500/20 border-pink-500/50 text-pink-500" : "bg-transparent"
                      }`}
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-12 w-12 border-white/20 glass-card bg-transparent"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button variant="outline" className="w-full h-12 border-white/20 glass-card bg-transparent text-base">
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 glass-card border-white/20 h-12">
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá ({product.reviews})</TabsTrigger>
                <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                <Card className="glass-card border-white/20 p-6">
                  <h3 className="text-xl font-bold mb-4">Đặc điểm nổi bật</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="glass-card border-white/20 p-6">
                  <h3 className="text-xl font-bold mb-4">Thông số kỹ thuật</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                      >
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card className="glass-card border-white/20 p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{product.rating}</div>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.reviews} đánh giá</p>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-8">{star} ⭐</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {star === 5 ? 85 : star === 4 ? 10 : 3}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="glass-card border-white/20 p-6">
                  <h3 className="text-lg font-bold mb-4">Viết đánh giá của bạn</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="outline"
                          size="icon"
                          className="border-white/20 glass-card hover:bg-yellow-500/20 hover:border-yellow-500 bg-transparent"
                        >
                          <Star className="w-5 h-5" />
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                      className="glass-card border-white/20 min-h-32"
                    />
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Gửi đánh giá
                    </Button>
                  </div>
                </Card>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="glass-card border-white/20 p-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {review.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{review.author}</p>
                                {review.verified && (
                                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 text-xs">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Đã mua hàng
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-yellow-500">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.rating ? "fill-current" : ""}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="hover:bg-white/10">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {review.likes}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{review.content}</p>
                          {review.images.length > 0 && (
                            <div className="flex gap-2">
                              {review.images.map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                  <Image src={img || "/placeholder.svg"} alt="Review" fill className="object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-6 mt-6">
                <Card className="glass-card border-white/20 p-6">
                  <h3 className="text-xl font-bold mb-4">Thông tin vận chuyển</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-muted-foreground">
                          Miễn phí vận chuyển cho đơn hàng trên 200.000đ. Thời gian giao hàng dự kiến:{" "}
                          {product.shipping.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-accent shrink-0 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Chính sách đổi trả</p>
                        <p className="text-sm text-muted-foreground">
                          {product.shipping.returnPolicy} nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mô tả
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-6 h-6 text-secondary shrink-0 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Đóng gói cẩn thận</p>
                        <p className="text-sm text-muted-foreground">
                          Sản phẩm được đóng gói cẩn thận, đảm bảo nguyên vẹn khi đến tay khách hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
                <Link href="/shop">
                  <Button variant="outline" className="border-white/20 glass-card bg-transparent">
                    Xem tất cả
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedProducts.map((item) => (
                  <Link key={item.id} href={`/products/${item.id}`}>
                    <Card className="glass-card border-white/20 overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all group">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{item.rating}</span>
                          </div>
                          <span className="text-muted-foreground">Đã bán {item.sold}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-lg font-bold text-primary">{formatPrice(item.price)}</div>
                          {item.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="glass-card border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={product.store.logo || "/placeholder.svg"}
                    alt={product.store.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{product.store.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{product.store.rating}</span>
                    <span className="text-muted-foreground">({product.store.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sản phẩm</span>
                  <span className="font-medium">{product.store.products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phản hồi</span>
                  <span className="font-medium">{product.store.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Địa điểm</span>
                  <span className="font-medium">{product.store.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href={`/shop/${product.store.id}`}>
                  <Button variant="outline" className="w-full border-white/20 glass-card bg-transparent">
                    <Store className="w-4 h-4 mr-2" />
                    Xem cửa hàng
                  </Button>
                </Link>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nhắn tin
                </Button>
              </div>
            </Card>

            <Card className="glass-card border-white/20 p-6">
              <h3 className="font-bold mb-4">Thông tin sản phẩm</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mã SKU</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Danh mục</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Thương hiệu</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tình trạng</span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Còn hàng</Badge>
                </div>
              </div>
            </Card>

            <Card className="glass-card border-white/20 p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Cam kết chất lượng</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Sản phẩm chính hãng 100%
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Đổi trả miễn phí trong 7 ngày
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Giao hàng nhanh chóng
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Hỗ trợ 24/7
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
