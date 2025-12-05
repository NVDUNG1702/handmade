import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export interface JobFilters {
  page: number;
  limit: number;
  keyword: string;
  status:
    | "OPEN"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED"
    | undefined;
  skill_id: string;
  city: string;
  district: string;
  provinceCode: string | undefined;
  ward: string;
  wardCode: string | undefined;
  priority: "" | "LOW" | "NORMAL" | "HIGH" | "URGENT";
  budget_min: number | undefined;
  budget_max: number | undefined;
  radius: number | undefined;
  lat: number | undefined;
  lng: number | undefined;
  is_featured?: boolean;
  is_urgent?: boolean;
}

export function useJobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 6,
    keyword: "",
    status: undefined,
    skill_id: "",
    city: "",
    district: "",
    provinceCode: undefined,
    ward: "",
    wardCode: undefined,
    priority: "",
    budget_min: undefined,
    budget_max: undefined,
    radius: undefined,
    lat: undefined,
    lng: undefined,
    is_featured: undefined,
    is_urgent: undefined,
  });

  const [nearbyEnabled, setNearbyEnabled] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Build URLSearchParams from filters
  const buildQueryFromFilters = (
    f: JobFilters,
    nearby: boolean
  ): URLSearchParams => {
    const params = new URLSearchParams();
    const entries: Record<string, string | number | boolean | undefined> = {
      page: f.page,
      limit: f.limit,
      keyword: f.keyword || undefined,
      status: f.status || undefined,
      skill_id: f.skill_id || undefined,
      city: f.city || undefined,
      district: f.district || undefined,
      provinceCode: f.provinceCode || undefined,
      ward: f.ward || undefined,
      wardCode: f.wardCode || undefined,
      priority: f.priority || undefined,
      budget_min: f.budget_min,
      budget_max: f.budget_max,
      radius: nearby ? f.radius : undefined,
      lat: nearby ? f.lat : undefined,
      lng: nearby ? f.lng : undefined,
      nearby: nearby ? 1 : undefined,
      is_featured: f.is_featured ? true : undefined,
      is_urgent: f.is_urgent ? true : undefined,
    };

    Object.entries(entries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && `${value}` !== "") {
        params.set(key, String(value));
      }
    });
    return params;
  };

  const pushFiltersToUrl = (nextFilters: JobFilters, nextNearby: boolean) => {
    const params = buildQueryFromFilters(nextFilters, nextNearby);
    router.push(`/jobs?${params.toString()}`);
  };

  // Initialize filters from URL once
  useEffect(() => {
    const sp = searchParams;
    if (!sp) return;

    const getStr = (k: string) => sp.get(k) || "";
    const getNum = (k: string): number | undefined => {
      const v = sp.get(k);
      if (v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };
    const getBool = (k: string): boolean | undefined => {
      const v = sp.get(k);
      if (v === null || v === "") return undefined;
      return v === "true" || v === "1";
    };

    const initFilters: JobFilters = {
      page: getNum("page") || 1,
      limit: getNum("limit") || 6,
      keyword: getStr("keyword"),
      status: (sp.get("status") as JobFilters["status"]) || undefined,
      skill_id: getStr("skill_id"),
      city: getStr("city"),
      district: getStr("district"),
      provinceCode: (sp.get("provinceCode") || undefined) as string | undefined,
      ward: getStr("ward"),
      wardCode: (sp.get("wardCode") || undefined) as string | undefined,
      priority: (sp.get("priority") as JobFilters["priority"]) || "",
      budget_min: getNum("budget_min"),
      budget_max: getNum("budget_max"),
      radius: getNum("radius"),
      lat: getNum("lat"),
      lng: getNum("lng"),
      is_featured: getBool("is_featured"),
      is_urgent: getBool("is_urgent"),
    };

    setFilters(initFilters);

    const nearbyFromUrl = sp.get("nearby");
    const enabled =
      !!nearbyFromUrl ||
      (initFilters.lat !== undefined &&
        initFilters.lng !== undefined &&
        initFilters.radius !== undefined);
    setNearbyEnabled(enabled);

    if (initFilters.keyword) setSearchInput(initFilters.keyword);
  }, [searchParams]); // Add searchParams dependency

  const handleSearch = (value: string) => {
    setFilters((prev) => {
      const next = { ...prev, keyword: value, page: 1 } as JobFilters;
      pushFiltersToUrl(next, nearbyEnabled);
      return next;
    });
  };

  const handleFilterChange = (
    key: keyof JobFilters,
    value: JobFilters[typeof key]
  ) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value, page: 1 } as JobFilters;
      pushFiltersToUrl(next, nearbyEnabled);
      return next;
    });
  };

  const handleClearFilters = () => {
    const cleared: JobFilters = {
      page: 1,
      limit: 6,
      keyword: "",
      status: undefined,
      skill_id: "",
      city: "",
      district: "",
      provinceCode: undefined,
      ward: "",
      wardCode: undefined,
      priority: "",
      budget_min: undefined,
      budget_max: undefined,
      radius: undefined,
      lat: undefined,
      lng: undefined,
      is_featured: undefined,
      is_urgent: undefined,
    };
    setFilters(cleared);
    setNearbyEnabled(false);
    setSearchInput("");
    pushFiltersToUrl(cleared, false);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => {
      const next = { ...prev, page } as JobFilters;
      pushFiltersToUrl(next, nearbyEnabled);
      return next;
    });
  };

  const handleProvinceChange = (provinceCode: string | undefined) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        provinceCode,
        ward: "",
        wardCode: undefined,
        page: 1,
      } as JobFilters;
      pushFiltersToUrl(next, nearbyEnabled);
      return next;
    });
  };

  const handleWardChange = (wardCode: string | undefined) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        wardCode,
        ward: "", // Will be set by parent component
        page: 1,
      } as JobFilters;
      pushFiltersToUrl(next, nearbyEnabled);
      return next;
    });
  };

  const handleNearbyToggle = (enabled: boolean) => {
    setNearbyEnabled(enabled);
    if (!enabled) {
      setFilters((prev) => {
        const next = {
          ...prev,
          lat: undefined,
          lng: undefined,
          radius: undefined,
          page: 1,
        } as JobFilters;
        pushFiltersToUrl(next, false);
        return next;
      });
    }
  };

  const handleLocationUpdate = (lat: number, lng: number, radius?: number) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        lat,
        lng,
        radius: radius ?? prev.radius ?? 50,
        page: 1,
      } as JobFilters;
      pushFiltersToUrl(next, true);
      return next;
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.keyword !== "" ||
      filters.status !== undefined ||
      filters.skill_id !== "" ||
      filters.provinceCode !== undefined ||
      filters.wardCode !== undefined ||
      filters.priority !== "" ||
      filters.budget_min !== undefined ||
      filters.budget_max !== undefined ||
      filters.is_featured === true ||
      filters.is_urgent === true ||
      nearbyEnabled
    );
  }, [filters, nearbyEnabled]);

  return {
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
  };
}
