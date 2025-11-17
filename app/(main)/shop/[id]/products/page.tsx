"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  ArrowLeft,
  Star,
  Package,
  ShoppingCart,
  Heart,
  Search,
  Filter,
  X,
  MapPin,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function StoreProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [productType, setProductType] = useState<"all" | "finished" | "materials">("all")
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high" | "rating">("popular")
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Mock store data
  const store = {
    id: 1,
    name: "Len Việt Store",
    logo: "/yarn-store-logo.jpg",
    rating: 4.9,
    reviews: 1234,
    location: "Hà Nội",
  }

  // Mock products data
  const allProducts = [
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
      type: "materials",
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
      type: "materials",
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
      type: "materials",
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
      type: "materials",
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
      type: "finished",
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
      type: "finished",
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
      type: "finished",
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
      type: "finished",
    },
  ]

  // Filter products
  const filteredProducts = allProducts
    .filter((product) => {
      if (productType !== "all" && product.type !== productType) return false
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false
      if (product.rating < minRating) return false
      if (inStockOnly && !product.inStock) return false
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id - a.id
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.sold - a.sold
      }
    })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href={`/shop/${store.id}`}>
            <Button variant="ghost" className="hover:bg-white/10 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại cửa hàng
            </Button>
          </Link>
        </div>

        {/* Store Info Banner */}
        <Card className="glass-card border-white/20 p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 flex-shrink-0 bg-background shadow-lg">
              <Image src={store.logo || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{store.name}</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{store.rating}</span>
                  <span className="text-muted-foreground">({store.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{store.location}</span>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Giỏ hàng
              {cartCount > 0 && <Badge className="ml-2 bg-secondary border-0">{cartCount}</Badge>}
            </Button>
          </div>
        </Card>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">
            Khám phá {allProducts.length} sản phẩm từ {store.name}
          </p>
        </div>

        {/* Product Type Tabs */}
        <Tabs value={productType} onValueChange={(v) => setProductType(v as any)} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 glass-card border-white/20 h-11 p-1">
            <TabsTrigger value="all" className="font-medium">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="finished" className="font-medium">
              Sản phẩm hoàn thiện
            </TabsTrigger>
            <TabsTrigger value="materials" className="font-medium">
              Nguyên liệu
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass-card border-white/20 focus:border-primary/50 transition-colors text-base"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-48 h-12 glass-card border-white/20">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-12 border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-all"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="font-medium">Bộ lọc</span>
            {(minRating > 0 || inStockOnly) && (
              <Badge className="ml-2 bg-primary text-primary-foreground border-0 shadow-sm">
                {(minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="w-80 h-fit sticky top-24 glass-card border-white/20 p-6 space-y-6 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Bộ lọc
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-foreground">Khoảng giá</Label>
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">{formatPrice(priceRange[0])}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-primary">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <Label className="text-sm font-bold text-foreground">Đánh giá tối thiểu</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinRating(rating)}
                      className={
                        minRating === rating
                          ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md"
                          : "border-white/20 glass-card hover:border-primary/30"
                      }
                    >
                      {rating === 0 ? (
                        "Tất cả"
                      ) : (
                        <span className="flex items-center gap-1">
                          {rating}
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                <Checkbox
                  id="inStock"
                  checked={inStockOnly}
                  onCheckedChange={(v) => setInStockOnly(v as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="inStock" className="cursor-pointer text-sm font-normal flex-1">
                  Chỉ hiển thị sản phẩm còn hàng
                </Label>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full border-white/20 glass-card bg-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all"
                onClick={() => {
                  setPriceRange([0, 2000000])
                  setMinRating(0)
                  setInStockOnly(false)
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Đặt lại bộ lọc
              </Button>
            </Card>
          )}

          {/* Products Grid */}
          <div className="flex-1 space-y-6">
            {/* Active Filters */}
            {(minRating > 0 || inStockOnly) && (
              <div className="flex flex-wrap gap-2">
                {minRating > 0 && (
                  <Badge
                    variant="secondary"
                    className="glass-card border-white/20 flex items-center gap-2 px-3 py-1.5 hover:border-primary/30 transition-colors"
                  >
                    {minRating}★ trở lên
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge
                    variant="secondary"
                    className="glass-card border-white/20 flex items-center gap-2 px-3 py-1.5 hover:border-primary/30 transition-colors"
                  >
                    Còn hàng
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => setInStockOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card
                    className={`group border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl glass-card overflow-hidden cursor-pointer ${
                      product.featured ? "ring-2 ring-primary/30 shadow-lg" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge
                          className={
                            product.type === "finished"
                              ? "bg-gradient-to-r from-primary to-accent text-white border-0 shadow-md"
                              : "bg-gradient-to-r from-secondary to-accent text-white border-0 shadow-md"
                          }
                        >
                          {product.type === "finished" ? "Sản phẩm" : "Nguyên liệu"}
                        </Badge>
                      </div>
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
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
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

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border-white/20">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-sm text-muted-foreground mt-2">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && totalPages > 1 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Hiển thị</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-20 glass-card border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">sản phẩm mỗi trang</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} ({filteredProducts.length} sản phẩm)
                  </span>
                </div>
                <Pagination>
                  <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                            onClick={() => setCurrentPage(pageNumber)}
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
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-primary/10 cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
