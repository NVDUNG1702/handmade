"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthExtended } from "@/hooks/use-auth-extended";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, ArrowLeft, Loader2, Sparkles, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otpVerified, setOtpVerified] = useState(false);
  
  const { verifyOtp, resetPassword, loading } = useAuthExtended();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.otp) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await verifyOtp(formData.email, formData.otp);
      setOtpVerified(true);
      setStep("password");
    } catch (error) {
      // Error already handled by useAuthExtended hook
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await resetPassword(formData.email, formData.otp, formData.newPassword, formData.confirmPassword);
      toast.success("Đặt lại mật khẩu thành công!");
      router.push("/login");
    } catch (error) {
      // Error already handled by useAuthExtended hook
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-3xl font-bold">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Handmade
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Tạo mật khẩu mới
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Bảo mật tài khoản
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            {step === "otp" 
              ? "Nhập mã OTP đã được gửi đến email của bạn để xác thực danh tính."
              : "Tạo mật khẩu mới mạnh mẽ để bảo vệ tài khoản của bạn."
            }
          </p>

          <div className="mt-12 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <div className="w-full h-full bg-gradient-to-br from-secondary/20 via-accent/20 to-primary/20 flex items-center justify-center">
                <Shield className="w-24 h-24 text-white/60" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-muted-foreground text-center">Bảo mật</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-primary rounded-full" />
            <span>Mã hóa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full" />
            <span>An toàn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full" />
            <span>Tin cậy</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                Handmade
              </span>
            </Link>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === "otp" ? "bg-primary" : "bg-primary"}`} />
            <div className="w-8 h-0.5 bg-border" />
            <div className={`w-3 h-3 rounded-full ${step === "password" ? "bg-primary" : "bg-border"}`} />
          </div>

          {step === "otp" ? (
            <>
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold">Xác thực OTP</h2>
                <p className="text-muted-foreground">
                  Nhập mã OTP đã được gửi đến{" "}
                  <span className="font-medium text-foreground">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    Mã OTP
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="123456"
                      value={formData.otp}
                      onChange={handleChange}
                      className="pl-10 h-12 text-center text-lg tracking-widest"
                      disabled={loading}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      Xác thực OTP
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold">Tạo mật khẩu mới</h2>
                <p className="text-muted-foreground">
                  Nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-12"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-12"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      Đặt lại mật khẩu
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
