import axios, { AxiosInstance, AxiosResponse } from "axios";

import { API_CONSTANTS } from "@/lib/api-constants";

export interface ApiSuccess<T> {
  code: number;
  message: string;
  data: T;
  error: null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONSTANTS.BASE_URL,
  timeout: API_CONSTANTS.REQUEST_TIMEOUT,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as any;
    const status = error?.response?.status as number | undefined;
    const hasTried = Boolean(originalRequest?._retry);

    if (
      status === 401 &&
      !hasTried &&
      typeof window !== "undefined" &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const res = await axios.post<ApiSuccess<TokenPair>>(
          `${API_CONSTANTS.BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        try {
          localStorage.clear();
        } catch {}
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

