import axiosInstance from "./axios-instance";
import { API_CONSTANTS } from "./api-constants";
import type { ApiResponse, Province, Ward } from "./types";

/**
 * Fetch all provinces
 */
export async function fetchProvinces(): Promise<Province[]> {
  const response = await axiosInstance.get<ApiResponse<Province[]>>(
    API_CONSTANTS.ENDPOINTS.LOCATIONS.PROVINCES
  );
  return response.data.data || [];
}

/**
 * Fetch wards by province code
 */
export async function fetchWards(provinceCode: string): Promise<Ward[]> {
  if (!provinceCode) return [];

  const response = await axiosInstance.get<ApiResponse<Ward[]>>(
    API_CONSTANTS.ENDPOINTS.LOCATIONS.WARDS,
    {
      params: { provinceCode },
    }
  );
  return response.data.data || [];
}
