import { useState, useEffect } from "react";
import {
  ProvinceListResponse,
  WardListResponse,
} from "@/lib/types";
import { locationService } from "@/lib/services/location-service";

// Hook for provinces with caching
export function useProvinces() {
  const [data, setData] = useState<ProvinceListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await locationService.getProvinces();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch provinces"
        );
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      locationService
        .getProvinces()
        .then(setData)
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to fetch provinces"
          );
          console.error("Error fetching provinces:", err);
        })
        .finally(() => setLoading(false));
    },
  };
}

// Hook for wards with caching
export function useWards(provinceCode: string | null) {
  const [data, setData] = useState<WardListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provinceCode) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchWards = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await locationService.getWards(provinceCode);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch wards");
        console.error("Error fetching wards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, [provinceCode]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      if (!provinceCode) return;

      setLoading(true);
      setError(null);
      locationService
        .getWards(provinceCode)
        .then(setData)
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to fetch wards"
          );
          console.error("Error fetching wards:", err);
        })
        .finally(() => setLoading(false));
    },
  };
}

// Hook for cache management
export function useLocationCache() {
  const [cacheInfo, setCacheInfo] = useState<{
    provinces: boolean;
    wardsCount: number;
    cacheDetails: {
      provinces?: { count: number; cached: boolean };
      wards?: { [provinceCode: string]: { count: number; cached: boolean } };
    };
  }>({
    provinces: false,
    wardsCount: 0,
    cacheDetails: {},
  });

  const updateCacheInfo = () => {
    setCacheInfo(locationService.getCacheInfo());
  };

  const clearCache = () => {
    locationService.clearCache();
    updateCacheInfo();
  };

  const isWardsCached = (provinceCode: string) => {
    return locationService.isWardsCached(provinceCode);
  };

  const isProvincesCached = () => {
    return locationService.isProvincesCached();
  };

  useEffect(() => {
    updateCacheInfo();
  }, []);

  return {
    cacheInfo,
    clearCache,
    refreshCacheInfo: updateCacheInfo,
    isWardsCached,
    isProvincesCached,
  };
}
