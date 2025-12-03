"use client";

import { useEffect, useMemo, useState } from "react";
import { useSkills } from "@/hooks/use-skills";
import { useProvinces, useWards } from "@/hooks/use-location";
import { useJobFilters } from "@/hooks/use-job-filters";
import { useJobRequests } from "@/hooks/use-job-requests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
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
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JobCard } from "@/components/job/JobCard";

export default function JobsPage() {
  // Custom hooks for filter management
  const {
    filters,
    nearbyEnabled,
    searchInput,
    setSearchInput,
    hasActiveFilters,
    handleSearch,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleProvinceChange,
    handleWardChange,
    handleNearbyToggle,
    handleLocationUpdate,
  } = useJobFilters();

  // UI states
  const [filterOpen, setFilterOpen] = useState(false);
  const [tempDistance, setTempDistance] = useState([filters.radius || 50]);
  const [tempPriceRange, setTempPriceRange] = useState([
    filters.budget_min || 0,
    filters.budget_max || 5000000,
  ]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch skills and locations
  const { data: skills = [] } = useSkills();
  const { data: provincesData } = useProvinces();
  const provinces = provincesData?.data || [];
  
  const { data: wardsData } = useWards(filters.provinceCode || null);
  const wards = wardsData?.data || [];

  // Fetch jobs using TanStack Query hook
  const effectiveParams = {
    ...filters,
    priority: filters.priority === "" ? undefined : filters.priority,
    ...(nearbyEnabled
      ? {}
      : {
          lat: undefined,
          lng: undefined,
          radius: undefined,
        }),
  };

  const { data: jobData, isLoading, error } = useJobRequests(effectiveParams);

  // Extract jobs from response
  const jobs = useMemo(
    () => (Array.isArray(jobData?.data) ? jobData.data : []),
    [jobData?.data]
  );
  const total = jobData?.total || 0;

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Derived categories from skills
  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: "Tất cả",
        count: total,
        active: !filters.skill_id || filters.skill_id === "all",
      },
      ...skills.map((skill) => ({
        id: skill._id,
        name: skill.name,
        count: null, // Backend chưa hỗ trợ count theo skill
        active: filters.skill_id === skill._id,
      })),
    ];
  }, [skills, filters.skill_id, total]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("job-favorites");
    if (savedFavorites) {
      try {
        const favoritesArray = JSON.parse(savedFavorites);
        setFavorites(new Set(favoritesArray));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      "job-favorites",
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("✅ Location obtained:", location);
        handleLocationUpdate(location.lat, location.lng, filters.radius || 50);
        handleNearbyToggle(true);
        setLocationLoading(false);
      },
      (error) => {
        console.error("❌ Location error:", error.code, error.message);
        let errorMsg = "Không thể lấy vị trí của bạn. ";
        if (error.code === 1) {
          errorMsg +=
            "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt.";
        } else if (error.code === 2) {
          errorMsg += "Vị trí không khả dụng. Vui lòng bật GPS.";
        } else if (error.code === 3) {
          errorMsg += "Hết thời gian chờ. Vui lòng thử lại.";
        }
        alert(errorMsg);
        handleNearbyToggle(false);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Sync temp filter states when opening filter panel
  useEffect(() => {
    if (filterOpen) {
      setTempDistance([filters.radius || 50]);
      setTempPriceRange([
        filters.budget_min || 0,
        filters.budget_max || 5000000,
      ]);
    }
  }, [filterOpen, filters.radius, filters.budget_min, filters.budget_max]);

  // Debug: Check if jobs are sorted by distance
  useEffect(() => {
    if (nearbyEnabled && filters.lat && filters.lng && jobs.length > 0) {
      const distances = jobs.map(
        (j, i) =>
          `${i + 1}. ${j.title.substring(0, 35)} → ${
            j.distance_km !== undefined
              ? j.distance_km.toFixed(1) + "km"
              : "NO DISTANCE"
          }`
      );
      console.log("📊 Jobs sorted by distance:\n" + distances.join("\n"));
    } else if (jobs.length > 0) {
      console.log(
        "📊 Location disabled - showing all jobs without distance sorting"
      );
    }
  }, [jobs, nearbyEnabled, filters.lat, filters.lng]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / filters.limit)),
    [total, filters.limit]
  );
  const currentJobs = jobs || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8 pt-8">
        {/* Header with gradient */}
        <div className="relative rounded-3xl overflow-hidden p-8 bg-card border border-border shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {total} công việc
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-balance mb-2 text-foreground">
                Khám phá công việc
              </h1>
              <p className="text-muted-foreground">
                Tìm kiếm công việc thủ công phù hợp với kỹ năng của bạn
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/jobs/create">
                <Plus className="w-5 h-5 mr-2" />
                Đăng việc mới
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-12 h-12 bg-card border-input"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 border-input bg-card hover:bg-accent hover:text-accent-foreground"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Bộ lọc nâng cao
          </Button>
          <Button
            variant={nearbyEnabled ? "default" : "outline"}
            className={`h-12 border-input ${
              nearbyEnabled
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                : "bg-card hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => {
              if (nearbyEnabled) {
                handleNearbyToggle(false);
              } else {
                getUserLocation();
              }
            }}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Đang lấy vị trí...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                {nearbyEnabled ? "Đã bật vị trí" : "Gần tôi"}
              </>
            )}
          </Button>
        </div>

        {filterOpen && (
          <Card className="p-6 bg-card border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Filter className="w-5 h-5" />
                Bộ lọc nâng cao
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilterOpen(false)}
                aria-label="Đóng bộ lọc"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Distance Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Khoảng cách {nearbyEnabled ? "" : "(Cần bật vị trí)"}
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={tempDistance}
                    onValueChange={setTempDistance}
                    max={50}
                    step={1}
                    className="w-full"
                    disabled={!nearbyEnabled}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0 km</span>
                    <span className="font-medium text-primary">
                      {tempDistance[0]} km
                    </span>
                    <span>50 km</span>
                  </div>
                  {!nearbyEnabled && (
                    <p className="text-xs text-muted-foreground">
                      Bấm nút "Gần tôi" để lọc theo khoảng cách
                    </p>
                  )}
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
                    value={tempPriceRange}
                    onValueChange={setTempPriceRange}
                    max={5000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{(tempPriceRange[0] / 1000000).toFixed(1)}M</span>
                    <span>{(tempPriceRange[1] / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Skills Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Kỹ năng</Label>
                <Select
                  value={filters.skill_id || "all"}
                  onValueChange={(val) => {
                    handleFilterChange("skill_id", val === "all" ? "" : val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả kỹ năng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {skills.map((skill) => (
                      <SelectItem key={skill._id} value={skill._id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Province Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tỉnh/Thành phố</Label>
                <Select
                  value={filters.provinceCode || "all"}
                  onValueChange={(val) => {
                    handleProvinceChange(val === "all" ? undefined : val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả tỉnh/thành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ward Filter - Only show when province selected */}
              {filters.provinceCode && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Phường/Xã</Label>
                  <Select
                    value={filters.wardCode || "all"}
                    onValueChange={(val) => {
                      handleWardChange(val === "all" ? undefined : val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Status Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(val) =>
                    handleFilterChange(
                      "status",
                      val === "all" ? undefined : (val as any)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="OPEN">Đang mở</SelectItem>
                    <SelectItem value="IN_PROGRESS">Đang thực hiện</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Mức độ ưu tiên</Label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(val) =>
                    handleFilterChange(
                      "priority",
                      val === "all" ? "" : (val as any)
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="LOW">Thấp</SelectItem>
                    <SelectItem value="NORMAL">Bình thường</SelectItem>
                    <SelectItem value="HIGH">Cao</SelectItem>
                    <SelectItem value="URGENT">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tùy chọn khác</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.is_featured === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "is_featured",
                          checked === true ? true : undefined
                        )
                      }
                    />
                    <Label
                      htmlFor="featured"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Chỉ công việc nổi bật
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={filters.is_urgent === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange(
                          "is_urgent",
                          checked === true ? true : undefined
                        )
                      }
                    />
                    <Label
                      htmlFor="urgent"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Cần gấp
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 bg-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setTempDistance([50]);
                  setTempPriceRange([0, 5000000]);
                  handleClearFilters();
                  setFilterOpen(false);
                }}
              >
                Đặt lại
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                onClick={() => {
                  // Apply temp filters to actual filters
                  handleFilterChange("radius", tempDistance[0] as any);
                  handleFilterChange("budget_min", tempPriceRange[0] as any);
                  handleFilterChange("budget_max", tempPriceRange[1] as any);
                  setFilterOpen(false);
                }}
              >
                Áp dụng
              </Button>
            </div>
          </Card>
        )}

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {(categories || []).map((category) => (
            <Button
              key={category.id}
              variant={category.active ? "default" : "outline"}
              className={
                category.active
                  ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 whitespace-nowrap text-primary-foreground border-0"
                  : "bg-card border-input hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
              }
              onClick={() =>
                handleFilterChange(
                  "skill_id",
                  category.id === "all" ? "" : category.id
                )
              }
            >
              {category.name}
              {category.count !== null && (
                <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                  {category.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(currentJobs || []).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isFavorite={favorites.has(job.id)}
              nearbyEnabled={nearbyEnabled}
              onToggleFavorite={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFavorites((prev) => {
                  const newFavorites = new Set(prev);
                  if (newFavorites.has(job.id)) {
                    newFavorites.delete(job.id);
                  } else {
                    newFavorites.add(job.id);
                  }
                  return newFavorites;
                });
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent className="bg-card border border-border rounded-xl p-2 shadow-sm">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(filters.page - 1, 1))
                  }
                  className={`${
                    filters.page === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  }`}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= filters.page - 1 &&
                    pageNumber <= filters.page + 1);

                if (!showPage) {
                  if (
                    pageNumber === filters.page - 2 ||
                    pageNumber === filters.page + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={filters.page === pageNumber}
                      className={`cursor-pointer ${
                        filters.page === pageNumber
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-md"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(filters.page + 1, totalPages))
                  }
                  className={`${
                    filters.page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
