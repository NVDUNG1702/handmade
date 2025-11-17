"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  CheckCircle2,
  Package,
  ShoppingCart,
  Heart,
  Share2,
  MessageSquare,
  TrendingUp,
  Store,
  Users,
  ThumbsUp,
  Send,
  Sparkles,
  Scissors,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StoreDetailPage() {
  const [cartCount, setCartCount] = useState(0)
  const [currentProductPage, setCurrentProductPage] = useState(1)
  const [currentMaterialPage, setCurrentMaterialPage] = useState(1)
  const [currentReviewPage, setCurrentReviewPage] = useState(1)
  const [itemsPerPageProducts, setItemsPerPageProducts] = useState(4)
  const [itemsPerPageMaterials, setItemsPerPageMaterials] = useState(4)
  const [itemsPerPageReviews, setItemsPerPageReviews] = useState(4)

  // Mock store data - in real app, fetch based on params.id
  const store = {
    id: 1,
    name: "Len Việt Store",
    description: "Chuyên cung cấp len cao cấp và phụ kiện đan móc. Hơn 10 năm kinh nghiệm trong ngành.",
    logo: "/yarn-store-logo.jpg",
    cover: "/colorful-yarn-balls-set.jpg",
    rating: 4.9,
    reviews: 1234,
    location: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    distance: 2.3,
    phone: "0912 345 678",
    email: "contact@lenviet.vn",
    specialties: ["Đan len/móc", "Thêu"],
    productCount: 450,
    verified: true,
    responseTime: "Trong vòng 1 giờ",
    openTime: "8:00 - 20:00",
    followers: 12500,
    totalSold: 45000,
    joinDate: "Tham gia từ 2014",
    about:
      "Len Việt Store là cửa hàng chuyên cung cấp len cao cấp và phụ kiện đan móc hàng đầu tại Việt Nam. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm chất lượng nhất với giá cả hợp lý. Đội ngũ tư vấn nhiệt tình, chuyên nghiệp luôn sẵn sàng hỗ trợ khách hàng.",
  }

  const products = [
    {
      id: 1,
      name: "Bộ len cao cấp 20 màu",
      description: "Len mềm mại, không xù lông, phù hợp đan khăn, mũ, áo",
      price: 350000,
      originalPrice: 450000,
      rating: 4.9,
      reviews: 234,
      sold: 1200,
      image: "/colorful-yarn-balls-set.jpg",
      featured: true,
      discount: 22,
      inStock: true,
      type: "material", // Vật liệu
    },
    {
      id: 2,
      name: "Len cotton Nhật Bản",
      description: "Len cotton mềm mại, thấm hút tốt, phù hợp mùa hè",
      price: 280000,
      originalPrice: null,
      rating: 5.0,
      reviews: 156,
      sold: 890,
      image: "/knitting-wool-scarf-tutorial.jpg",
      featured: false,
      discount: 0,
      inStock: true,
      type: "material", // Vật liệu
    },
    {
      id: 3,
      name: "Bộ kim đan 12 size",
      description: "Kim đan inox cao cấp, từ size 2.0mm đến 8.0mm",
      price: 120000,
      originalPrice: 150000,
      rating: 4.8,
      reviews: 445,
      sold: 2100,
      image: "/knitting-needles-set.jpg",
      featured: false,
      discount: 20,
      inStock: true,
      type: "material", // Vật liệu
    },
    {
      id: 4,
      name: "Len lông cừu Úc",
      description: "Len lông cừu 100% từ Úc, ấm áp, mềm mại",
      price: 450000,
      originalPrice: null,
      rating: 4.9,
      reviews: 167,
      sold: 456,
      image: "/colorful-yarn-balls-set.jpg",
      featured: true,
      discount: 0,
      inStock: true,
      type: "material", // Vật liệu
    },
    {
      id: 5,
      name: "Khăn len đan tay",
      description: "Khăn len đan tay thủ công, mềm mại, ấm áp",
      price: 250000,
      originalPrice: null,
      rating: 4.8,
      reviews: 89,
      sold: 345,
      image: "/knitting-wool-scarf-tutorial.jpg",
      featured: false,
      discount: 0,
      inStock: true,
      type: "product", // Sản phẩm
    },
    {
      id: 6,
      name: "Mũ len handmade",
      description: "Mũ len đan tay, nhiều màu sắc, phong cách Hàn Quốc",
      price: 180000,
      originalPrice: 220000,
      rating: 4.9,
      reviews: 156,
      sold: 678,
      image: "/colorful-yarn-balls-set.jpg",
      featured: true,
      discount: 18,
      inStock: true,
      type: "product", // Sản phẩm
    },
    {
      id: 7,
      name: "Túi tote đan móc",
      description: "Túi tote đan móc thủ công, phong cách vintage",
      price: 320000,
      originalPrice: null,
      rating: 5.0,
      reviews: 234,
      sold: 456,
      image: "/knitting-needles-set.jpg",
      featured: false,
      discount: 0,
      inStock: true,
      type: "product", // Sản phẩm
    },
    {
      id: 8,
      name: "Áo len cardigan",
      description: "Áo len cardigan đan tay, form rộng, phong cách oversized",
      price: 550000,
      originalPrice: 650000,
      rating: 4.9,
      reviews: 123,
      sold: 234,
      image: "/colorful-yarn-balls-set.jpg",
      featured: true,
      discount: 15,
      inStock: true,
      type: "product", // Sản phẩm
    },
  ]

  const productItems = products.filter((p) => p.type === "product")
  const materialItems = products.filter((p) => p.type === "material")

  const totalProductPages = Math.ceil(productItems.length / itemsPerPageProducts)
  const startProductIndex = (currentProductPage - 1) * itemsPerPageProducts
  const endProductIndex = startProductIndex + itemsPerPageProducts
  const currentProducts = productItems.slice(startProductIndex, endProductIndex)

  const totalMaterialPages = Math.ceil(materialItems.length / itemsPerPageMaterials)
  const startMaterialIndex = (currentMaterialPage - 1) * itemsPerPageMaterials
  const endMaterialIndex = startMaterialIndex + itemsPerPageMaterials
  const currentMaterials = materialItems.slice(startMaterialIndex, endMaterialIndex)

  const reviews = [
    {
      id: 1,
      author: "Nguyễn Thị Mai",
      avatar: "",
      rating: 5,
      content:
        "Cửa hàng rất uy tín, len chất lượng tốt, màu sắc đẹp. Chủ shop tư vấn nhiệt tình. Mình đã mua nhiều lần và rất hài lòng!",
      date: "2 ngày trước",
      likes: 15,
      images: ["/colorful-yarn-balls-set.jpg", "/knitting-wool-scarf-tutorial.jpg"],
    },
    {
      id: 2,
      author: "Trần Văn Nam",
      avatar: "",
      rating: 5,
      content: "Giao hàng nhanh, đóng gói cẩn thận. Len mềm mại, không xù lông. Sẽ ủng hộ shop lâu dài!",
      date: "5 ngày trước",
      likes: 8,
      images: [],
    },
    {
      id: 3,
      author: "Lê Thị Hoa",
      avatar: "",
      rating: 4,
      content: "Sản phẩm tốt, giá cả hợp lý. Chỉ có điều giao hàng hơi lâu một chút. Nhưng nhìn chung vẫn ok!",
      date: "1 tuần trước",
      likes: 5,
      images: [],
    },
  ]

  const totalReviewPages = Math.ceil(reviews.length / itemsPerPageReviews)
  const startReviewIndex = (currentReviewPage - 1) * itemsPerPageReviews
  const endReviewIndex = startReviewIndex + itemsPerPageReviews
  const currentReviews = reviews.slice(startReviewIndex, endReviewIndex)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  const ProductGrid = ({
    items,
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
    label,
  }: {
    items: typeof products
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    itemsPerPage: number
    onItemsPerPageChange: (value: number) => void
    totalItems: number
    label: string
  }) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="group border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl glass-card overflow-hidden cursor-pointer">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {product.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-white border-0 flex items-center gap-1 shadow-md">
                      <TrendingUp className="w-3 h-3" />
                      Nổi bật
                    </Badge>
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-secondary text-white border-0 text-sm font-bold shadow-md">
                      -{product.discount}%
                    </Badge>
                  </div>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                {/* Rating & Sold */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground text-xs">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Đã bán {product.sold}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between pt-3 border-t border-white/10">
                  <div className="flex-1">
                    <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 shadow-md"
                    onClick={() => setCartCount(cartCount + 1)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    Thêm
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  onItemsPerPageChange(Number(value))
                  onPageChange(1)
                }}
              >
                <SelectTrigger className="w-20 glass-card border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">{label} mỗi trang</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} ({totalItems} {label})
            </span>
          </div>
          <Pagination>
            <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  className={`${
                    currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-primary/10 cursor-pointer"
                  }`}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)

                if (!showPage) {
                  if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => onPageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className={`cursor-pointer ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md"
                          : "hover:bg-primary/10"
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  className={`${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-primary/10 cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Back button */}
        <Link href="/shop">
          <Button variant="ghost" className="hover:bg-white/10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại cửa hàng
          </Button>
        </Link>

        {/* Store Header */}
        <Card className="glass-card border-white/20 overflow-hidden shadow-xl">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64 overflow-hidden bg-muted">
            <Image src={store.cover || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Verified Badge */}
            {store.verified && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-500 text-white border-0 flex items-center gap-2 px-3 py-1.5 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã xác minh
                </Badge>
              </div>
            )}

            {/* Store Logo */}
            <div className="absolute -bottom-12 left-6 md:left-8">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-background">
                <Image src={store.logo || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="p-6 md:p-8 pt-16 md:pt-20">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">{store.name}</h1>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{store.description}</p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold text-lg">{store.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({store.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">{store.productCount} sản phẩm</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{store.followers.toLocaleString()} người theo dõi</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Đã bán {store.totalSold.toLocaleString()}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {store.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/30 px-3 py-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 lg:w-64">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 shadow-lg h-12">
                  <Heart className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Theo dõi cửa hàng</span>
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass-card border-white/20 h-12">
                <TabsTrigger value="products" className="font-medium">
                  Sản phẩm
                </TabsTrigger>
                <TabsTrigger value="materials" className="font-medium">
                  Vật liệu
                </TabsTrigger>
                <TabsTrigger value="about" className="font-medium">
                  Giới thiệu
                </TabsTrigger>
                <TabsTrigger value="reviews" className="font-medium">
                  Đánh giá
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Sản phẩm thủ công ({productItems.length})</h3>
                  </div>
                  <Link href={`/shop/${store.id}/products`}>
                    <Button variant="outline" className="border-white/20 glass-card hover:bg-primary/10 bg-transparent">
                      <Package className="w-4 h-4 mr-2" />
                      Xem tất cả sản phẩm
                    </Button>
                  </Link>
                </div>
                <ProductGrid
                  items={currentProducts}
                  currentPage={currentProductPage}
                  totalPages={totalProductPages}
                  onPageChange={setCurrentProductPage}
                  itemsPerPage={itemsPerPageProducts}
                  onItemsPerPageChange={setItemsPerPageProducts}
                  totalItems={productItems.length}
                  label="sản phẩm"
                />
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="space-y-4 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Scissors className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Vật liệu & Phụ kiện ({materialItems.length})</h3>
                </div>
                <ProductGrid
                  items={currentMaterials}
                  currentPage={currentMaterialPage}
                  totalPages={totalMaterialPages}
                  onPageChange={setCurrentMaterialPage}
                  itemsPerPage={itemsPerPageMaterials}
                  onItemsPerPageChange={setItemsPerPageMaterials}
                  totalItems={materialItems.length}
                  label="vật liệu"
                />
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6 mt-6">
                <Card className="glass-card border-white/20 p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    Về cửa hàng
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{store.about}</p>
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Giờ mở cửa</p>
                        <p className="text-muted-foreground">{store.openTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Thời gian phản hồi</p>
                        <p className="text-muted-foreground">{store.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Địa chỉ</p>
                        <p className="text-muted-foreground">{store.location}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                {/* Review Summary */}
                <Card className="glass-card border-white/20 p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{store.rating}</div>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{store.reviews} đánh giá</p>
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

                {/* Review Form */}
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
                      placeholder="Chia sẻ trải nghiệm của bạn về cửa hàng..."
                      className="glass-card border-white/20 min-h-32"
                    />
                    <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      <Send className="w-4 h-4 mr-2" />
                      Gửi đánh giá
                    </Button>
                  </div>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {currentReviews.map((review) => (
                    <Card key={review.id} className="glass-card border-white/20 p-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {review.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{review.author}</p>
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

                {totalReviewPages > 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Hiển thị</span>
                        <Select
                          value={itemsPerPageReviews.toString()}
                          onValueChange={(value) => {
                            setItemsPerPageReviews(Number(value))
                            setCurrentReviewPage(1)
                          }}
                        >
                          <SelectTrigger className="w-20 glass-card border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">đánh giá mỗi trang</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Trang {currentReviewPage} / {totalReviewPages} ({reviews.length} đánh giá)
                      </span>
                    </div>
                    <Pagination>
                      <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentReviewPage((prev) => Math.max(prev - 1, 1))}
                            className={`${
                              currentReviewPage === 1
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-primary/10 cursor-pointer"
                            }`}
                          />
                        </PaginationItem>

                        {[...Array(totalReviewPages)].map((_, index) => {
                          const pageNumber = index + 1
                          const showPage =
                            pageNumber === 1 ||
                            pageNumber === totalReviewPages ||
                            (pageNumber >= currentReviewPage - 1 && pageNumber <= currentReviewPage + 1)

                          if (!showPage) {
                            if (pageNumber === currentReviewPage - 2 || pageNumber === currentReviewPage + 2) {
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )
                            }
                            return null
                          }

                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => setCurrentReviewPage(pageNumber)}
                                isActive={currentReviewPage === pageNumber}
                                className={`cursor-pointer ${
                                  currentReviewPage === pageNumber
                                    ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md"
                                    : "hover:bg-primary/10"
                                }`}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentReviewPage((prev) => Math.min(prev + 1, totalReviewPages))}
                            className={`${
                              currentReviewPage === totalReviewPages
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-primary/10 cursor-pointer"
                            }`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="glass-card border-white/20 p-6 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Liên hệ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:${store.phone}`} className="hover:text-primary transition-colors">
                    {store.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${store.email}`} className="hover:text-primary transition-colors truncate">
                    {store.email}
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{store.location}</p>
                </div>
                <div className="flex items-center gap-3 text-sm pt-3 border-t border-white/10">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-primary" />
                  </div>
                  <p className="font-semibold text-primary">{store.distance} km từ bạn</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 mt-4">
                <MessageSquare className="w-4 h-4 mr-2" />
                Nhắn tin ngay
              </Button>
            </Card>

            {/* Stats Card */}
            <Card className="glass-card border-white/20 p-6 space-y-4">
              <h3 className="font-bold text-lg">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sản phẩm</span>
                  <span className="font-semibold">{store.productCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Người theo dõi</span>
                  <span className="font-semibold">{store.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đã bán</span>
                  <span className="font-semibold">{store.totalSold.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đánh giá</span>
                  <span className="font-semibold">{store.reviews}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
                  <span className="text-muted-foreground">{store.joinDate}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
