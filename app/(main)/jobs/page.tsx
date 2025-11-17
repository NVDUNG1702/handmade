"use client"

import { useEffect, useMemo, useState } from "react"
import axiosInstance from "@/lib/axios-instance"
import { API_CONSTANTS } from "@/lib/api-constants"
import type { ApiResponse, JobRequestItem, PaginatedResult } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Briefcase,
  Heart,
  TrendingUp,
  Sparkles,
  X,
  SlidersHorizontal,
  Navigation,
  Eye,
} from "lucide-react"
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

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [distance, setDistance] = useState([10])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6
  const [jobs, setJobs] = useState<JobRequestItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const categories = [
    { name: "Tất cả", count: 234, active: true },
    { name: "Thêu", count: 45, active: false },
    { name: "Đan len", count: 32, active: false },
    { name: "Làm túi", count: 28, active: false },
    { name: "Trang sức", count: 56, active: false },
    { name: "Gốm sứ", count: 19, active: false },
  ] || []

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('job-favorites')
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites)
        setFavorites(new Set(favoritesArray))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('job-favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  // Fetch jobs from BE
  useEffect(() => {
    let isMounted = true
    const fetchJobs = async () => {
      setIsLoading(true)
      setErrorMessage("")
      try {
        const params: Record<string, string | number> = {
          [API_CONSTANTS.QUERY.PAGE]: currentPage,
          [API_CONSTANTS.QUERY.LIMIT]: jobsPerPage,
        }
        if (searchQuery.trim()) params[API_CONSTANTS.QUERY.SEARCH] = searchQuery.trim()
        const res = await axiosInstance.get<ApiResponse<PaginatedResult<JobRequestItem>>>(
          API_CONSTANTS.ENDPOINTS.JOB_REQUESTS.LIST,
          { params }
        )
        if (!isMounted) return
        
        // Handle flexible response structure like handmade-fe
        const responseData = res.data.data
        
        let jobsData: JobRequestItem[] = []
        let totalCount = 0
        
        if (responseData && typeof responseData === "object") {
          if (responseData.data && Array.isArray(responseData.data)) {
            jobsData = responseData.data
            totalCount = responseData.total || responseData.data.length
          } else if (Array.isArray(responseData)) {
            jobsData = responseData
            totalCount = responseData.length
          } else {
            // Try other possible fields
            const possibleFields = ["jobs", "items", "results", "list"]
            for (const field of possibleFields) {
              if (responseData[field] && Array.isArray(responseData[field])) {
                jobsData = responseData[field]
                totalCount = responseData.total || responseData[field].length
                break
              }
            }
          }
        }
        
        // Ensure jobsData is always an array
        const safeJobsData = Array.isArray(jobsData) ? jobsData : []
        setJobs(safeJobsData)
        setTotal(totalCount)
      } catch (err) {
        setErrorMessage("Không thể tải danh sách công việc.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void fetchJobs()
    return () => {
      isMounted = false
    }
  }, [currentPage, searchQuery])

  const totalPages = useMemo(() => Math.max(1, Math.ceil((total || 0) / jobsPerPage)), [total])
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = jobs || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8 pt-8">
        {/* Header with gradient */}
        <div className="relative rounded-3xl overflow-hidden p-8 glass-card border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
            <Badge className="bg-primary/10 text-primary border-primary/20">{total} công việc</Badge>
            </div>
            <h1 className="text-4xl font-bold text-balance mb-2">Khám phá công việc</h1>
            <p className="text-muted-foreground">Tìm kiếm công việc thủ công phù hợp với kỹ năng của bạn</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass-card border-white/20"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 border-white/20 glass-card bg-transparent"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Bộ lọc nâng cao
          </Button>
          <Button variant="outline" className="h-12 border-white/20 glass-card bg-transparent">
            <Navigation className="w-4 h-4 mr-2" />
            Gần cửa hàng
          </Button>
        </div>

        {filterOpen && (
          <Card className="p-6 glass-card border-white/20 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Bộ lọc nâng cao
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setFilterOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Distance Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Khoảng cách (km)
                </Label>
                <div className="space-y-2">
                  <Slider value={distance} onValueChange={setDistance} max={50} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0 km</span>
                    <span className="font-medium text-primary">{distance[0]} km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Mức giá (VNĐ)
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{(priceRange[0] / 1000000).toFixed(1)}M</span>
                    <span>{(priceRange[1] / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Near Shop Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tùy chọn khác</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nearShop" />
                    <Label htmlFor="nearShop" className="text-sm font-normal cursor-pointer">
                      Gần cửa hàng nguyên liệu
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                      Chỉ công việc nổi bật
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urgent" />
                    <Label htmlFor="urgent" className="text-sm font-normal cursor-pointer">
                      Cần gấp ({"<"} 3 ngày)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" className="flex-1 bg-transparent">
                Đặt lại
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">Áp dụng</Button>
            </div>
          </Card>
        )}

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {(categories || []).map((category, index) => (
            <Button
              key={index}
              variant={category.active ? "default" : "outline"}
              className={
                category.active
                  ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 whitespace-nowrap"
                  : "border-white/20 glass-card whitespace-nowrap"
              }
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 bg-white/20">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(currentJobs || []).map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card
                className={`border-white/20 hover:border-white/40 transition-all hover:scale-[1.02] glass-card group relative overflow-hidden flex flex-col ${
                  job.is_featured ? "ring-2 ring-primary/50" : ""
                }`}
              >
                {job.is_featured && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-br from-primary to-accent text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Nổi bật
                    </div>
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={job.images?.[0] || "/placeholder.svg"}
                    alt={job.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                    {job.required_skill?.name || "Công việc"}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{job.description}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-accent/10 shrink-0 bg-transparent"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setFavorites(prev => {
                          const newFavorites = new Set(prev)
                          if (newFavorites.has(job.id)) {
                            newFavorites.delete(job.id)
                          } else {
                            newFavorites.add(job.id)
                          }
                          return newFavorites
                        })
                      }}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.has(job.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {job.required_skill?.name || 'Kỹ năng'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-700 border-green-300' :
                        job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        job.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                        'bg-red-100 text-red-700 border-red-300'
                      }`}
                    >
                      {job.status === 'OPEN' ? 'Mở' :
                       job.status === 'IN_PROGRESS' ? 'Đang làm' :
                       job.status === 'COMPLETED' ? 'Hoàn thành' : 'Hủy'}
                    </Badge>
                    {job.is_urgent && (
                      <Badge variant="destructive" className="bg-red-500 text-white border-0">
                        Gấp
                      </Badge>
                    )}
                    {job.priority === 'HIGH' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                        Ưu tiên cao
                      </Badge>
                    )}
                  </div>

                  {job.distance_km && job.distance_km < 5 && (
                    <div className="flex items-center gap-2 text-sm bg-accent/10 text-accent px-3 py-2 rounded-lg border border-accent/20 mb-4">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium truncate">Gần bạn: {job.distance_km.toFixed(1)}km</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium flex-shrink-0">
                      {job.created_by?.full_name?.charAt(0) || 'C'}
                    </div>
                    <span className="font-medium truncate">{job.created_by?.full_name || 'Khách hàng'}</span>
                    <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">Ngân sách</span>
                      </div>
                      <p className="font-semibold text-primary text-sm">
                        {job.budget_min?.toLocaleString('vi-VN')} - {job.budget_max?.toLocaleString('vi-VN')} {job.currency || 'VND'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">Địa điểm</span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {job.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">Thời hạn</span>
                      </div>
                      <p className="text-sm font-medium">
                        {job.days_remaining ? `${job.days_remaining} ngày` : 'Không giới hạn'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">Ứng viên</span>
                      </div>
                      <p className="text-sm font-medium">
                        {job.application_count || 0} người
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {job.view_count || 0} lượt xem
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(job.created_at || '').toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {favorites.has(job.id) && (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 mt-auto">
                    Ứng tuyển ngay
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-primary/10 cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
