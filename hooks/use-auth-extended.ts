"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import * as authExtended from "@/lib/auth-extended";
import { OtpType } from "@/lib/auth-extended";
import { toast } from "sonner";

export function useAuthExtended() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Forgot password
  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const result = await authExtended.forgotPasswordExecute({ 
        email, 
        type: OtpType.FORGOT_PASSWORD 
      });
      toast.success(result.message || "OTP đã được gửi đến email của bạn");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi gửi OTP";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const result = await authExtended.verifyOtpExecute({ 
        email, 
        otp, 
        type: OtpType.FORGOT_PASSWORD 
      });
      toast.success(result.message || "Xác thực OTP thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "OTP không hợp lệ";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    try {
      const result = await authExtended.resetPasswordExecute({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success(result.message || "Đặt lại mật khẩu thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi đặt lại mật khẩu";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    try {
      const result = await authExtended.changePasswordExecute({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(result.message || "Đổi mật khẩu thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi đổi mật khẩu";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: authExtended.UpdateProfileInput) => {
    setLoading(true);
    try {
      const result = await authExtended.updateProfileExecute(data);
      
      // Update user in auth store
      updateUser(result.user);
      
      toast.success("Cập nhật thông tin thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi cập nhật thông tin";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    setLoading(true);
    try {
      const result = await authExtended.uploadAvatarExecute(file);
      
      // Update user avatar in auth store
      updateUser({ avatar_url: result.avatar_url });
      
      toast.success(result.message || "Cập nhật ảnh đại diện thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi tải ảnh lên";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload cover
  const uploadCover = async (file: File) => {
    setLoading(true);
    try {
      const result = await authExtended.uploadCoverExecute(file);
      
      // Update user cover in auth store
      updateUser({ cover_url: result.cover_url });
      
      toast.success(result.message || "Cập nhật ảnh bìa thành công");
      return result;
    } catch (error: any) {
      const message = error?.message || "Có lỗi xảy ra khi tải ảnh lên";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    forgotPassword,
    verifyOtp,
    resetPassword,
    changePassword,
    updateProfile,
    uploadAvatar,
    uploadCover,
  };
}
