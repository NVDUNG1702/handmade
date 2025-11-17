import axiosInstance from "@/lib/axios-instance";
import type { ApiResponse } from "@/lib/types";

// Extended auth functions for forgot password, OTP, etc.

// OTP Types matching backend
export enum OtpType {
  FORGOT_PASSWORD = 'forgot_password',
  EMAIL_VERIFICATION = 'email_verification',
  PHONE_VERIFICATION = 'phone_verification',
}

export interface ForgotPasswordInput {
  email: string;
  type: OtpType;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
  type: OtpType;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  address?: string;
}

// Forgot password
export async function forgotPasswordExecute(input: ForgotPasswordInput): Promise<{
  message: string;
  expiresIn: number;
  email: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    message: string;
    expiresIn: number;
    email: string;
  }>>("/auth/forgot-password", input);
  return res.data.data;
}

// Verify OTP
export async function verifyOtpExecute(input: VerifyOtpInput): Promise<{
  message: string;
  otpId: string;
  email: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    message: string;
    otpId: string;
    email: string;
  }>>("/auth/verify-otp", input);
  return res.data.data;
}

// Reset password
export async function resetPasswordExecute(input: ResetPasswordInput): Promise<{
  message: string;
  email: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    message: string;
    email: string;
  }>>("/auth/reset-password", input);
  return res.data.data;
}

// Change password
export async function changePasswordExecute(input: ChangePasswordInput): Promise<{
  message: string;
}> {
  const res = await axiosInstance.put<ApiResponse<{
    message: string;
  }>>("/auth/change-password", input);
  return res.data.data;
}

// Update profile
export async function updateProfileExecute(input: UpdateProfileInput): Promise<{
  user: any; // Will be typed properly when we have the full user type
}> {
  const res = await axiosInstance.put<ApiResponse<{
    user: any;
  }>>("/auth/profile", input);
  return res.data.data;
}

// Upload avatar
export async function uploadAvatarExecute(file: File): Promise<{
  avatar_url: string;
  message: string;
}> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axiosInstance.post<ApiResponse<{
    avatar_url: string;
    message: string;
  }>>("/auth/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
}

// Upload cover image
export async function uploadCoverExecute(file: File): Promise<{
  cover_url: string;
  message: string;
}> {
  const formData = new FormData();
  formData.append("cover", file);

  const res = await axiosInstance.post<ApiResponse<{
    cover_url: string;
    message: string;
  }>>("/auth/upload-cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
}

// Refresh token
export async function refreshTokenExecute(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>>("/auth/refresh-token", { refreshToken });
  return res.data.data;
}

// Logout
export async function logoutExecute(refreshToken: string): Promise<{
  message: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    message: string;
  }>>("/auth/logout", { refreshToken });
  return res.data.data;
}

// Logout all devices
export async function logoutAllExecute(): Promise<{
  message: string;
}> {
  const res = await axiosInstance.post<ApiResponse<{
    message: string;
  }>>("/auth/logout-all");
  return res.data.data;
}
