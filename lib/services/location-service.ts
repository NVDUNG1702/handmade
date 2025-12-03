import axiosInstance from "@/lib/axios-instance";
import { API_CONSTANTS } from "@/lib/api-constants";
import {
  ProvinceListResponse,
  WardListResponse,
} from "@/lib/types";

// Cache keys
const CACHE_KEYS = {
  PROVINCES: "handmade_provinces_cache",
  WARDS: "handmade_wards_cache",
} as const;

// Cache expiry time (24 hours)
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class LocationService {
  // Generic cache getter
  private getFromCache<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheData: CacheData<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is expired
      if (now > cacheData.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  // Generic cache setter
  private setToCache<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;

    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + CACHE_EXPIRY,
      };

      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  }

  // Fetch provinces with caching
  async getProvinces(): Promise<ProvinceListResponse> {
    // Check cache first
    const cached = this.getFromCache<ProvinceListResponse>(
      CACHE_KEYS.PROVINCES
    );
    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      const { data } = await axiosInstance.get<ProvinceListResponse>(
        API_CONSTANTS.ENDPOINTS.LOCATIONS.PROVINCES
      );

      // Cache the result
      this.setToCache(CACHE_KEYS.PROVINCES, data);

      return data;
    } catch (error) {
      console.error("❌ Error fetching provinces:", error);
      throw error;
    }
  }

  // Fetch wards with caching
  async getWards(provinceCode: string): Promise<WardListResponse> {
    const cacheKey = `${CACHE_KEYS.WARDS}_${provinceCode}`;

    // Check cache first
    const cached = this.getFromCache<WardListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      const { data } = await axiosInstance.get<WardListResponse>(
        `${API_CONSTANTS.ENDPOINTS.LOCATIONS.WARDS}?provinceCode=${provinceCode}`
      );

      // Cache the result
      this.setToCache(cacheKey, data);

      return data;
    } catch (error) {
      console.error(
        `❌ Error fetching wards for province ${provinceCode}:`,
        error
      );
      throw error;
    }
  }

  // Clear all location cache
  clearCache(): void {
    if (typeof window === "undefined") return;

    try {
      // Clear provinces cache
      localStorage.removeItem(CACHE_KEYS.PROVINCES);

      // Clear all wards cache
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_KEYS.WARDS)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  // Get cache info
  getCacheInfo(): {
    provinces: boolean;
    wardsCount: number;
    cacheDetails: {
      provinces?: { count: number; cached: boolean };
      wards?: { [provinceCode: string]: { count: number; cached: boolean } };
    };
  } {
    if (typeof window === "undefined")
      return { provinces: false, wardsCount: 0, cacheDetails: {} };

    const provinces =
      this.getFromCache<ProvinceListResponse>(CACHE_KEYS.PROVINCES) !== null;

    const keys = Object.keys(localStorage);
    const wardsCount = keys.filter((key) =>
      key.startsWith(CACHE_KEYS.WARDS)
    ).length;

    // Get detailed cache info
    const cacheDetails: any = {};

    // Provinces cache details
    const provincesCache = this.getFromCache<ProvinceListResponse>(
      CACHE_KEYS.PROVINCES
    );
    if (provincesCache) {
      cacheDetails.provinces = {
        count: provincesCache.data.length,
        cached: true,
      };
    } else {
      cacheDetails.provinces = { cached: false };
    }

    // Wards cache details
    cacheDetails.wards = {};
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEYS.WARDS)) {
        const provinceCode = key.replace(`${CACHE_KEYS.WARDS}_`, "");
        const wardCache = this.getFromCache<WardListResponse>(key);
        if (wardCache) {
          cacheDetails.wards[provinceCode] = {
            count: wardCache.data.length,
            cached: true,
          };
        }
      }
    });

    return { provinces, wardsCount, cacheDetails };
  }

  // Check if specific province wards are cached
  isWardsCached(provinceCode: string): boolean {
    if (typeof window === "undefined") return false;

    const cacheKey = `${CACHE_KEYS.WARDS}_${provinceCode}`;
    const cached = this.getFromCache<WardListResponse>(cacheKey);
    return cached !== null;
  }

  // Check if provinces are cached
  isProvincesCached(): boolean {
    if (typeof window === "undefined") return false;

    const cached = this.getFromCache<ProvinceListResponse>(
      CACHE_KEYS.PROVINCES
    );
    return cached !== null;
  }
}

// Export singleton instance
export const locationService = new LocationService();
