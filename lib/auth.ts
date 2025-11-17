import axiosInstance from "@/lib/axios-instance";
import type { ApiResponse } from "@/lib/types";
import { signInWithGoogle, type GoogleUser } from "./google-auth";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  roles?: string[];
  status?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  user: AuthUser;
  unreadNotificationCount?: number;
}

export async function loginExecute(input: LoginInput): Promise<AuthResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    input
  );
  return res.data.data;
}

export async function registerExecute(
  input: RegisterInput
): Promise<AuthResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    input
  );
  return res.data.data;
}

export async function getMeExecute(): Promise<MeResponse> {
  const res = await axiosInstance.get<ApiResponse<MeResponse>>("/auth/me");
  return res.data.data;
}

export function saveTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("access_token"));
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    const accessToken = await signInWithGoogle();

    // Send Google access token to backend for verification
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/google/verify",
      {
        googleToken: accessToken, // Send OAuth2 access_token
      }
    );

    return res.data.data;
  } catch (error: any) {
    console.error("❌ [Auth] Google login failed:", error?.response?.data || error?.message);
    
    // Throw with more detailed error message
    const errorMessage = error?.response?.data?.message || error?.message || "Google login failed";
    throw new Error(errorMessage);
  }
}

/**
 * Register with Google OAuth
 */
export async function registerWithGoogle(): Promise<AuthResponse> {
  try {
    const accessToken = await signInWithGoogle();

    // Send Google access token to backend for verification (same as login)
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/google/verify",
      {
        googleToken: accessToken, // Send OAuth2 access_token
      }
    );

    return res.data.data;
  } catch (error: any) {
    console.error("❌ [Auth] Google registration failed:", error?.response?.data || error?.message);
    
    // Throw with more detailed error message
    const errorMessage = error?.response?.data?.message || error?.message || "Google registration failed";
    throw new Error(errorMessage);
  }
}
