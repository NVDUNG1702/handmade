"use client";

import { useState } from "react";
import { useAuthExtended } from "@/hooks/use-auth-extended";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Shield, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordTestPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { forgotPassword, verifyOtp, resetPassword, loading } = useAuthExtended();

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      await forgotPassword(email);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      toast.error("Vui lòng nhập email và OTP");
      return;
    }

    try {
      await verifyOtp(email, otp);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await resetPassword(email, otp, newPassword, confirmPassword);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Forgot Password Test</h1>
          <p className="text-muted-foreground">
            Test forgot password flow với API thực
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1: Forgot Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Bước 1: Gửi OTP
              </CardTitle>
              <CardDescription>
                Gửi mã OTP đến email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button 
                onClick={handleForgotPassword}
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? "Đang gửi..." : "Gửi OTP"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Verify OTP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bước 2: Xác thực OTP
              </CardTitle>
              <CardDescription>
                Nhập mã OTP từ email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                  className="text-center tracking-widest"
                />
              </div>

              <Button 
                onClick={handleVerifyOtp}
                disabled={loading || !email || !otp}
                className="w-full"
                variant="outline"
              >
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Reset Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bước 3: Đặt lại mật khẩu
              </CardTitle>
              <CardDescription>
                Tạo mật khẩu mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button 
                onClick={handleResetPassword}
                disabled={loading || !email || !otp || !newPassword || !confirmPassword}
                className="w-full"
                variant="default"
              >
                {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Values */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
            <CardDescription>
              Thông tin hiện tại để debug
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Email:</strong> {email || "Chưa nhập"}
              </div>
              <div>
                <strong>OTP:</strong> {otp || "Chưa nhập"}
              </div>
              <div>
                <strong>New Password:</strong> {newPassword ? "••••••••" : "Chưa nhập"}
              </div>
              <div>
                <strong>Confirm Password:</strong> {confirmPassword ? "••••••••" : "Chưa nhập"}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? "Yes" : "No"}
              </div>
              <div>
                <strong>Password Match:</strong> {newPassword && confirmPassword ? (newPassword === confirmPassword ? "Yes" : "No") : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Nhập email và click "Gửi OTP"</p>
            <p><strong>2.</strong> Kiểm tra email để lấy mã OTP</p>
            <p><strong>3.</strong> Nhập OTP và click "Xác thực OTP"</p>
            <p><strong>4.</strong> Nhập mật khẩu mới và xác nhận</p>
            <p><strong>5.</strong> Click "Đặt lại mật khẩu" để hoàn thành</p>
            <Separator className="my-2" />
            <p className="text-muted-foreground">
              <strong>Lưu ý:</strong> Cần backend API hoạt động để test được đầy đủ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
