"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles, User, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function RegisterFormBeautiful() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { register, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.username || !formData.password || !formData.full_name) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Đăng ký thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Đăng ký Google thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Đăng ký Google thất bại");
    } finally {
      setIsGoogleLoading(false);
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
          
          <h1 className="text-4xl font-bold mt-8 mb-4 leading-tight">
            Tham gia{" "}
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              cộng đồng sáng tạo
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Khởi đầu hành trình sáng tạo của bạn. Kết nối với nghệ nhân, chia sẻ tài năng và khám phá thế giới handmade đầy màu sắc.
          </p>

          <div className="mt-12 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/handmade-crafts-marketplace-with-artisan-products.jpg"
                alt="Handmade marketplace"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))';
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">500+</div>
              <div className="text-sm text-muted-foreground text-center">Nghệ nhân</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-primary rounded-full" />
            <span>Miễn phí</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full" />
            <span>Dễ dàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full" />
            <span>Sáng tạo</span>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
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

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Đăng ký</h2>
            <p className="text-muted-foreground">Tạo tài khoản mới để bắt đầu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Họ và tên *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="pl-9 h-11"
                    disabled={isLoading || loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Tên đăng nhập *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-9 h-11"
                    disabled={isLoading || loading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 h-11"
                  disabled={isLoading || loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9 h-11"
                  disabled={isLoading || loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 pr-10 h-11"
                  disabled={isLoading || loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading || loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                className="rounded border-input text-primary focus:ring-primary" 
                required
              />
              <span className="text-muted-foreground">
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                  Chính sách bảo mật
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || loading}
              className="w-full h-11 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white font-medium shadow-sm"
            >
              {isLoading || loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  Tạo tài khoản
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading || isLoading || loading}
              className="h-11"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {isGoogleLoading ? "Đang xử lý..." : "Đăng ký với Google"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
