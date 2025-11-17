"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Heart,
  Package,
  Sparkles,
  MapPin,
  Store,
  TrendingUp,
  X,
  Scissors,
  Palette,
  Hammer,
  Sparkle,
  Shirt,
  Gem,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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

export default function ShopPage() {
  const [mainView, setMainView] = useState<"products" | "stores">("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [productType, setProductType] = useState<"all" | "finished" | "materials">("all")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [maxDistance, setMaxDistance] = useState(10)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  const [currentProductPage, setCurrentProductPage] = useState(1)
  const [currentStorePage, setCurrentStorePage] = useState(1)
  const [itemsPerPageProducts, setItemsPerPageProducts] = useState(9)
  const [itemsPerPageStores, setItemsPerPageStores] = useState(9)

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [productIndicatorStyle, setProductIndicatorStyle] = useState({ left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const mainTabsRef = useRef<HTMLDivElement>(null)
  const productTabsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const updateMainIndicator = () => {
      if (mainTabsRef.current) {
        const activeButton = mainTabsRef.current.querySelector('[data-state="active"]') as HTMLElement
        if (activeButton) {
          setIndicatorStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateMainIndicator()
      setMounted(true)
    }, 0)

    window.addEventListener("resize", updateMainIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateMainIndicator)
    }
  }, [mainView])

  useLayoutEffect(() => {
    const updateProductIndicator = () => {
      if (productTabsRef.current) {
        const activeButton = productTabsRef.current.querySelector('[data-state="active"]') as HTMLElement
        if (activeButton) {
          setProductIndicatorStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          })
        }
      }
    }

    const timer = setTimeout(() => {
      updateProductIndicator()
    }, 0)

    window.addEventListener("resize", updateProductIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", updateProductIndicator)
    }
  }, [productType])

  const craftCategories = [
    { id: "leather", name: "Da thủ công", icon: Scissors, color: "text-amber-500" },
    { id: "knitting", name: "Đan len/móc", icon: Sparkle, color: "text-pink-500" },
    { id: "embroidery", name: "Thêu", icon: Sparkle, color: "text-purple-500" },
    { id: "jewelry", name: "Trang sức", icon: Gem, color: "text-cyan-500" },
    { id: "woodwork", name: "Gỗ", icon: Hammer, color: "text-orange-500" },
    { id: "pottery", name: "Gốm sứ", icon: Palette, color: "text-blue-500" },
    { id: "painting", name: "Vẽ/Tranh", icon: Palette, color: "text-red-500" },
    { id: "sewing", name: "May vá", icon: Shirt, color: "text-green-500" },
  ]

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
      shop: "Len Việt Store",
      shopLocation: "Hà Nội",
      distance: 2.3,
      featured: true,
      discount: 22,
      inStock: true,
      type: "materials",
      category: "knitting",
    },
    {
      id: 2,
      name: "Da bò thật cao cấp A4",
      description: "Da bò nguyên tấm, độ dày 1.5mm, màu nâu vintage",
      price: 280000,
      originalPrice: null,
      rating: 5.0,
      reviews: 156,
      sold: 890,
      image: "/brown-leather-sheet.jpg",
      shop: "Da Thủ Công HN",
      shopLocation: "Hà Nội",
      distance: 1.8,
      featured: true,
      discount: 0,
      inStock: true,
      type: "materials",
      category: "leather",
    },
    {
      id: 3,
      name: "Túi da handmade vintage",
      description: "Túi da bò thật 100%, thiết kế vintage, khâu tay thủ công",
      price: 1200000,
      originalPrice: 1500000,
      rating: 5.0,
      reviews: 89,
      sold: 234,
      image: "/portfolio-leather-bag-1.jpg",
      shop: "Leather Art Studio",
      shopLocation: "Hà Nội",
      distance: 3.2,
      featured: true,
      discount: 20,
      inStock: true,
      type: "finished",
      category: "leather",
    },
    {
      id: 4,
      name: "Bộ kim đan 12 size",
      description: "Kim đan inox cao cấp, từ size 2.0mm đến 8.0mm",
      price: 120000,
      originalPrice: 150000,
      rating: 4.8,
      reviews: 445,
      sold: 2100,
      image: "/knitting-needles-set.jpg",
      shop: "Dụng Cụ Handmade",
      shopLocation: "TP.HCM",
      distance: 5.2,
      featured: false,
      discount: 20,
      inStock: true,
      type: "materials",
      category: "knitting",
    },
    {
      id: 5,
      name: "Khăn len đan tay",
      description: "Khăn len đan tay 100% handmade, mềm mại, ấm áp",
      price: 450000,
      originalPrice: null,
      rating: 4.9,
      reviews: 167,
      sold: 456,
      image: "/knitting-wool-scarf-tutorial.jpg",
      shop: "Knit With Love",
      shopLocation: "Hà Nội",
      distance: 2.8,
      featured: true,
      discount: 0,
      inStock: true,
      type: "finished",
      category: "knitting",
    },
    {
      id: 6,
      name: "Hạt gỗ tự nhiên 500g",
      description: "Hạt gỗ tròn nhiều size, đã đánh bóng, màu gỗ tự nhiên",
      price: 85000,
      originalPrice: null,
      rating: 4.7,
      reviews: 189,
      sold: 670,
      image: "/wooden-beads-natural.jpg",
      shop: "Phụ Kiện Handmade",
      shopLocation: "Đà Nẵng",
      distance: 3.7,
      featured: false,
      discount: 0,
      inStock: true,
      type: "materials",
      category: "jewelry",
    },
    {
      id: 7,
      name: "Vòng tay bạc handmade",
      description: "Vòng tay bạc 925 thủ công, thiết kế độc đáo",
      price: 850000,
      originalPrice: null,
      rating: 5.0,
      reviews: 123,
      sold: 345,
      image: "/silver-charms-jewelry-making.jpg",
      shop: "Silver Craft",
      shopLocation: "TP.HCM",
      distance: 4.5,
      featured: false,
      discount: 0,
      inStock: true,
      type: "finished",
      category: "jewelry",
    },
    {
      id: 8,
      name: "Vải canvas Hàn Quốc",
      description: "Vải canvas dày dặn, nhiều màu, khổ 1.5m",
      price: 65000,
      originalPrice: 80000,
      rating: 4.9,
      reviews: 567,
      sold: 3400,
      image: "/colorful-canvas-fabric-rolls.jpg",
      shop: "Vải Handmade VN",
      shopLocation: "Hà Nội",
      distance: 4.1,
      featured: true,
      discount: 19,
      inStock: true,
      type: "materials",
      category: "sewing",
    },
    {
      id: 9,
      name: "Bộ charm bạc 925 mix",
      description: "50 charm bạc thật đa dạng mẫu mã cho trang sức",
      price: 450000,
      originalPrice: null,
      rating: 5.0,
      reviews: 234,
      sold: 450,
      image: "/silver-charms-jewelry-making.jpg",
      shop: "Charm & Beads",
      shopLocation: "TP.HCM",
      distance: 6.5,
      featured: false,
      discount: 0,
      inStock: true,
      type: "materials",
      category: "jewelry",
    },
  ]

  const stores = [
    {
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
      specialties: ["knitting"],
      categories: ["materials", "finished"],
      productCount: 450,
      verified: true,
      responseTime: "Trong vòng 1 giờ",
      openTime: "8:00 - 20:00",
    },
    {
      id: 2,
      name: "Da Thủ Công HN",
      description: "Cung cấp da bò, da dê thật 100% và dụng cụ làm đồ da. Cam kết chất lượng tốt nhất.",
      logo: "/leather-store-logo.jpg",
      cover: "/brown-leather-sheet.jpg",
      rating: 5.0,
      reviews: 890,
      location: "45 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội",
      distance: 1.8,
      phone: "0987 654 321",
      email: "info@dathucong.vn",
      specialties: ["leather"],
      categories: ["materials", "finished"],
      productCount: 320,
      verified: true,
      responseTime: "Trong vòng 30 phút",
      openTime: "9:00 - 21:00",
    },
    {
      id: 3,
      name: "Leather Art Studio",
      description: "Xưởng sản xuất và bán lẻ đồ da handmade cao cấp. Nhận đặt hàng theo yêu cầu.",
      logo: "/leather-art-logo.jpg",
      cover: "/portfolio-leather-bag-1.jpg",
      rating: 5.0,
      reviews: 567,
      location: "78 Láng Hạ, Đống Đa, Hà Nội",
      distance: 3.2,
      phone: "0901 234 567",
      email: "hello@leatherart.vn",
      specialties: ["leather"],
      categories: ["finished"],
      productCount: 180,
      verified: true,
      responseTime: "Trong vòng 2 giờ",
      openTime: "10:00 - 19:00",
    },
    {
      id: 4,
      name: "Dụng Cụ Handmade",
      description: "Siêu thị dụng cụ và phụ kiện handmade đa dạng. Giá cả phải chăng, chất lượng đảm bảo.",
      logo: "/craft-tools-logo.jpg",
      cover: "/knitting-needles-set.jpg",
      rating: 4.8,
      reviews: 2100,
      location: "234 Lê Văn Sỹ, Quận 3, TP.HCM",
      distance: 5.2,
      phone: "0938 765 432",
      email: "support@dungcuhandmade.vn",
      specialties: ["knitting", "embroidery", "sewing", "jewelry"],
      categories: ["materials"],
      productCount: 890,
      verified: true,
      responseTime: "Trong vòng 1 giờ",
      openTime: "8:30 - 21:30",
    },
    {
      id: 5,
      name: "Knit With Love",
      description: "Cửa hàng đồ đan móc handmade. Mỗi sản phẩm đều được làm bằng tình yêu và tâm huyết.",
      logo: "/knitting-store-logo.jpg",
      cover: "/knitting-wool-scarf-tutorial.jpg",
      rating: 4.9,
      reviews: 678,
      location: "56 Hoàng Cầu, Đống Đa, Hà Nội",
      distance: 2.8,
      phone: "0945 678 901",
      email: "hello@knitwithlove.vn",
      specialties: ["knitting"],
      categories: ["finished"],
      productCount: 210,
      verified: true,
      responseTime: "Trong vòng 3 giờ",
      openTime: "9:00 - 18:00",
    },
    {
      id: 6,
      name: "Phụ Kiện Handmade",
      description: "Chuyên cung cấp phụ kiện làm trang sức, móc khóa, và đồ trang trí handmade.",
      logo: "/accessories-logo.jpg",
      cover: "/wooden-beads-natural.jpg",
      rating: 4.7,
      reviews: 456,
      location: "89 Trần Phú, Hải Châu, Đà Nẵng",
      distance: 3.7,
      phone: "0912 345 789",
      email: "info@phukienhandmade.vn",
      specialties: ["jewelry", "embroidery"],
      categories: ["materials"],
      productCount: 560,
      verified: false,
      responseTime: "Trong vòng 4 giờ",
      openTime: "8:00 - 20:00",
    },
    {
      id: 7,
      name: "Silver Craft",
      description: "Xưởng chế tác trang sức bạc handmade. Thiết kế độc đáo, chất lượng cao cấp.",
      logo: "/silver-craft-logo.jpg",
      cover: "/silver-charms-jewelry-making.jpg",
      rating: 5.0,
      reviews: 789,
      location: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      distance: 4.5,
      phone: "0909 876 543",
      email: "contact@silvercraft.vn",
      specialties: ["jewelry"],
      categories: ["finished", "materials"],
      productCount: 340,
      verified: true,
      responseTime: "Trong vòng 1 giờ",
      openTime: "9:30 - 20:30",
    },
    {
      id: 8,
      name: "Vải Handmade VN",
      description: "Nhập khẩu và phân phối vải canvas, vải thô, vải cotton cho handmade. Giá sỉ lẻ tốt nhất.",
      logo: "/fabric-store-logo.jpg",
      cover: "/colorful-canvas-fabric-rolls.jpg",
      rating: 4.9,
      reviews: 1567,
      location: "67 Giải Phóng, Hai Bà Trưng, Hà Nội",
      distance: 4.1,
      phone: "0976 543 210",
      email: "sales@vaihandmade.vn",
      specialties: ["sewing", "embroidery"],
      categories: ["materials"],
      productCount: 720,
      verified: true,
      responseTime: "Trong vòng 2 giờ",
      openTime: "7:30 - 21:00",
    },
  ]

  const filteredProducts = products.filter((product) => {
    if (productType !== "all" && product.type !== productType) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    if (product.distance > maxDistance) return false
    if (product.rating < minRating) return false
    if (inStockOnly && !product.inStock) return false
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredStores = stores.filter((store) => {
    if (selectedCategories.length > 0 && !selectedCategories.some((cat) => store.specialties.includes(cat)))
      return false
    if (store.distance > maxDistance) return false
    if (store.rating < minRating) return false
    if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPageProducts)
  const startProductIndex = (currentProductPage - 1) * itemsPerPageProducts
  const endProductIndex = startProductIndex + itemsPerPageProducts
  const currentProducts = filteredProducts.slice(startProductIndex, endProductIndex)

  const totalStorePages = Math.ceil(filteredStores.length / itemsPerPageStores)
  const startStoreIndex = (currentStorePage - 1) * itemsPerPageStores
  const endStoreIndex = startStoreIndex + itemsPerPageStores
  const currentStores = filteredStores.slice(startStoreIndex, endStoreIndex)

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 pt-6 md:pt-8">
        <div className="relative rounded-3xl overflow-hidden glass-card border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {mainView === "products"
                        ? `${filteredProducts.length} sản phẩm`
                        : `${filteredStores.length} cửa hàng`}
                    </span>
                  </div>
                  <Badge className="bg-gradient-to-r from-secondary/20 to-accent/20 text-foreground border-secondary/30">
                    Uy tín • Chất lượng
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
                  Cửa hàng Handmade
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {mainView === "products"
                    ? "Khám phá hàng nghìn sản phẩm handmade độc đáo và nguyên liệu chất lượng cao từ các nghệ nhân uy tín"
                    : "Kết nối với các cửa hàng handmade uy tín, chuyên nghiệp và đam mê nghệ thuật thủ công"}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl transition-all duration-300 shadow-lg relative group w-full lg:w-auto"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="font-semibold">Giỏ hàng</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-secondary border-2 border-background shadow-lg">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={mainView} onValueChange={(v) => setMainView(v as any)} className="w-full">
          <TabsList
            className="grid w-full max-w-md mx-auto grid-cols-2 glass-card border-white/20 h-12 p-1 relative"
            ref={mainTabsRef}
          >
            <div
              className="absolute h-[calc(100%-8px)] bg-gradient-to-r from-primary to-accent rounded-md transition-all duration-300 ease-out z-0"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                top: "4px",
                opacity: mounted ? 1 : 0,
              }}
            />
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground hover:text-foreground/80 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="font-medium">Sản phẩm</span>
            </TabsTrigger>
            <TabsTrigger
              value="stores"
              className="flex items-center gap-2 relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground hover:text-foreground/80 transition-colors"
            >
              <Store className="w-4 h-4" />
              <span className="font-medium">Cửa hàng</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 mt-6">
            <Tabs value={productType} onValueChange={(v) => setProductType(v as any)} className="w-full">
              <TabsList
                className="grid w-full max-w-2xl mx-auto grid-cols-3 glass-card border-white/20 h-11 p-1 relative"
                ref={productTabsRef}
              >
                <div
                  className="absolute h-[calc(100%-8px)] bg-gradient-to-r from-primary to-accent rounded-md transition-all duration-300 ease-out z-0"
                  style={{
                    left: `${productIndicatorStyle.left}px`,
                    width: `${productIndicatorStyle.width}px`,
                    top: "4px",
                    opacity: mounted ? 1 : 0,
                  }}
                />
                <TabsTrigger
                  value="all"
                  className="relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground hover:text-foreground/80 font-medium transition-colors"
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="finished"
                  className="relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground hover:text-foreground/80 font-medium transition-colors"
                >
                  Sản phẩm hoàn thiện
                </TabsTrigger>
                <TabsTrigger
                  value="materials"
                  className="relative z-10 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent data-[state=inactive]:text-foreground hover:text-foreground/80 font-medium transition-colors"
                >
                  Nguyên liệu
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
              <Button
                variant="outline"
                className="h-12 border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-all"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="font-medium">Bộ lọc</span>
                {(selectedCategories.length > 0 || minRating > 0 || inStockOnly) && (
                  <Badge className="ml-2 bg-primary text-primary-foreground border-0 shadow-sm">
                    {selectedCategories.length + (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="flex gap-6">
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

                  {/* Craft Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Ngành nghề thủ công</Label>
                    <div className="space-y-2.5">
                      {craftCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.id} className="flex items-center space-x-3 group">
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                              htmlFor={category.id}
                              className="flex items-center gap-2 cursor-pointer text-sm font-normal group-hover:text-primary transition-colors flex-1"
                            >
                              <Icon className={`w-4 h-4 ${category.color}`} />
                              {category.name}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
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

                  {/* Distance */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <Label className="text-sm font-bold text-foreground">Khoảng cách tối đa</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[maxDistance]}
                        onValueChange={(v) => setMaxDistance(v[0])}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{maxDistance} km từ bạn</span>
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
                      setSelectedCategories([])
                      setPriceRange([0, 1000000])
                      setMaxDistance(10)
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
                {(selectedCategories.length > 0 || minRating > 0 || inStockOnly) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const category = craftCategories.find((c) => c.id === catId)
                      return (
                        <Badge
                          key={catId}
                          variant="secondary"
                          className="glass-card border-white/20 flex items-center gap-2 px-3 py-1.5 hover:border-primary/30 transition-colors"
                        >
                          {category?.name}
                          <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                            onClick={() => toggleCategory(catId)}
                          />
                        </Badge>
                      )
                    })}
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

                          {/* Shop Info */}
                          <div className="flex items-center gap-2 text-sm pt-2 border-t border-white/10">
                            <Store className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium truncate">{product.shop}</span>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-primary">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs font-medium">{product.distance}km</span>
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
                              onClick={(e) => {
                                e.preventDefault() // Prevent link navigation when adding to cart
                                setCartCount(cartCount + 1)
                              }}
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
                {filteredProducts.length > 0 && totalProductPages > 1 && (
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Hiển thị</span>
                        <Select
                          value={itemsPerPageProducts.toString()}
                          onValueChange={(value) => {
                            setItemsPerPageProducts(Number(value))
                            setCurrentProductPage(1)
                          }}
                        >
                          <SelectTrigger className="w-20 glass-card border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">sản phẩm mỗi trang</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Trang {currentProductPage} / {totalProductPages} ({filteredProducts.length} sản phẩm)
                      </span>
                    </div>
                    <Pagination className="mt-8">
                      <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentProductPage((prev) => Math.max(prev - 1, 1))}
                            className={`${
                              currentProductPage === 1
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-primary/10 cursor-pointer"
                            }`}
                          />
                        </PaginationItem>

                        {[...Array(totalProductPages)].map((_, index) => {
                          const pageNumber = index + 1
                          const showPage =
                            pageNumber === 1 ||
                            pageNumber === totalProductPages ||
                            (pageNumber >= currentProductPage - 1 && pageNumber <= currentProductPage + 1)

                          if (!showPage) {
                            if (pageNumber === currentProductPage - 2 || pageNumber === currentProductPage + 2) {
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
                                onClick={() => setCurrentProductPage(pageNumber)}
                                isActive={currentProductPage === pageNumber}
                                className={`cursor-pointer ${
                                  currentProductPage === pageNumber
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
                            onClick={() => setCurrentProductPage((prev) => Math.min(prev + 1, totalProductPages))}
                            className={`${
                              currentProductPage === totalProductPages
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
          </TabsContent>

          <TabsContent value="stores" className="space-y-6 mt-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Tìm kiếm cửa hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 glass-card border-white/20 focus:border-primary/50 transition-colors text-base"
                />
              </div>
              <Button
                variant="outline"
                className="h-12 border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-all"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="font-medium">Bộ lọc</span>
                {(selectedCategories.length > 0 || minRating > 0) && (
                  <Badge className="ml-2 bg-primary text-primary-foreground border-0 shadow-sm">
                    {selectedCategories.length + (minRating > 0 ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="flex gap-6">
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

                  {/* Craft Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-foreground">Chuyên môn</Label>
                    <div className="space-y-2.5">
                      {craftCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.id} className="flex items-center space-x-3 group">
                            <Checkbox
                              id={`store-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <Label
                              htmlFor={`store-${category.id}`}
                              className="flex items-center gap-2 cursor-pointer text-sm font-normal group-hover:text-primary transition-colors flex-1"
                            >
                              <Icon className={`w-4 h-4 ${category.color}`} />
                              {category.name}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <Label className="text-sm font-bold text-foreground">Khoảng cách tối đa</Label>
                    <div className="space-y-3">
                      <Slider
                        value={[maxDistance]}
                        onValueChange={(v) => setMaxDistance(v[0])}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{maxDistance} km từ bạn</span>
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

                  {/* Reset */}
                  <Button
                    variant="outline"
                    className="w-full border-white/20 glass-card bg-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all"
                    onClick={() => {
                      setSelectedCategories([])
                      setMaxDistance(10)
                      setMinRating(0)
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Đặt lại bộ lọc
                  </Button>
                </Card>
              )}

              {/* Stores Grid */}
              <div className="flex-1 space-y-6">
                {/* Active Filters */}
                {(selectedCategories.length > 0 || minRating > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((catId) => {
                      const category = craftCategories.find((c) => c.id === catId)
                      return (
                        <Badge
                          key={catId}
                          variant="secondary"
                          className="glass-card border-white/20 flex items-center gap-2 px-3 py-1.5 hover:border-primary/30 transition-colors"
                        >
                          {category?.name}
                          <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
                            onClick={() => toggleCategory(catId)}
                          />
                        </Badge>
                      )
                    })}
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
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {currentStores.map((store) => (
                    <Card
                      key={store.id}
                      className="group border-white/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl glass-card overflow-hidden cursor-pointer"
                    >
                      {/* Store Cover */}
                      <div className="relative h-36 overflow-hidden bg-muted">
                        <Image
                          src={store.cover || "/placeholder.svg"}
                          alt={store.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {store.verified && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-500 text-white border-0 flex items-center gap-1.5 shadow-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Đã xác minh
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Store Info */}
                      <div className="p-5 space-y-4">
                        {/* Logo and Name */}
                        <div className="flex items-start gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 flex-shrink-0 -mt-12 bg-background shadow-lg">
                            <Image
                              src={store.logo || "/placeholder.svg"}
                              alt={store.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <h3 className="font-bold text-lg mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                              {store.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {store.description}
                            </p>
                          </div>
                        </div>

                        {/* Rating & Products */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{store.rating}</span>
                            <span className="text-muted-foreground text-xs">({store.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-medium">{store.productCount} sản phẩm</span>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2">
                          {store.specialties.map((specialtyId) => {
                            const specialty = craftCategories.find((c) => c.id === specialtyId)
                            if (!specialty) return null
                            const Icon = specialty.icon
                            return (
                              <Badge
                                key={specialtyId}
                                variant="secondary"
                                className="glass-card border-white/20 flex items-center gap-1.5 px-2.5 py-1"
                              >
                                <Icon className={`w-3.5 h-3.5 ${specialty.color}`} />
                                <span className="text-xs">{specialty.name}</span>
                              </Badge>
                            )
                          })}
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2">
                          {store.categories.includes("finished") && (
                            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-xs shadow-sm">
                              Sản phẩm hoàn thiện
                            </Badge>
                          )}
                          {store.categories.includes("materials") && (
                            <Badge className="bg-gradient-to-r from-secondary to-accent text-white border-0 text-xs shadow-sm">
                              Nguyên liệu
                            </Badge>
                          )}
                        </div>

                        {/* Location & Distance */}
                        <div className="flex items-start gap-2 text-sm pt-3 border-t border-white/10">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-muted-foreground line-clamp-1 text-xs leading-relaxed">
                              {store.location}
                            </p>
                            <p className="text-primary font-semibold mt-1">{store.distance} km từ bạn</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{store.openTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Award className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{store.responseTime}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/shop/${store.id}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 shadow-md group/btn">
                              <Store className="w-4 h-4 mr-2" />
                              <span className="font-medium">Xem cửa hàng</span>
                              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-all"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-white/20 glass-card bg-transparent hover:bg-primary/10 hover:border-primary/30 transition-all"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {filteredStores.length === 0 && (
                  <div className="text-center py-16 glass-card rounded-2xl border-white/20">
                    <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">Không tìm thấy cửa hàng phù hợp</p>
                    <p className="text-sm text-muted-foreground mt-2">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                  </div>
                )}

                {/* Pagination */}
                {filteredStores.length > 0 && totalStorePages > 1 && (
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Hiển thị</span>
                        <Select
                          value={itemsPerPageStores.toString()}
                          onValueChange={(value) => {
                            setItemsPerPageStores(Number(value))
                            setCurrentStorePage(1)
                          }}
                        >
                          <SelectTrigger className="w-20 glass-card border-white/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">cửa hàng mỗi trang</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Trang {currentStorePage} / {totalStorePages} ({filteredStores.length} cửa hàng)
                      </span>
                    </div>
                    <Pagination>
                      <PaginationContent className="glass-card border-white/20 rounded-xl p-2">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentStorePage((prev) => Math.max(prev - 1, 1))}
                            className={`${
                              currentStorePage === 1
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-primary/10 cursor-pointer"
                            }`}
                          />
                        </PaginationItem>

                        {[...Array(totalStorePages)].map((_, index) => {
                          const pageNumber = index + 1
                          const showPage =
                            pageNumber === 1 ||
                            pageNumber === totalStorePages ||
                            (pageNumber >= currentStorePage - 1 && pageNumber <= currentStorePage + 1)

                          if (!showPage) {
                            if (pageNumber === currentStorePage - 2 || pageNumber === currentStorePage + 2) {
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
                                onClick={() => setCurrentStorePage(pageNumber)}
                                isActive={currentStorePage === pageNumber}
                                className={`cursor-pointer ${
                                  currentStorePage === pageNumber
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
                            onClick={() => setCurrentStorePage((prev) => Math.min(prev + 1, totalStorePages))}
                            className={`${
                              currentStorePage === totalStorePages
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
