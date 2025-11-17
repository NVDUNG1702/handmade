"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function LoginFormBeautiful() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Đăng nhập Google thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Đăng nhập Google thất bại");
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
            Chào mừng trở lại với{" "}
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              cộng đồng thủ công
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kết nối với hàng nghìn nghệ nhân tài năng, khám phá những sản phẩm handmade độc đáo và chia sẻ đam mê sáng tạo của bạn.
          </p>

          <div className="mt-12 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/artisan-crafting-handmade-products-in-workshop.jpg"
                alt="Handmade crafts"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))';
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">1000+</div>
              <div className="text-sm text-muted-foreground text-center">Sản phẩm</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-primary rounded-full" />
            <span>Uy tín</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full" />
            <span>Chất lượng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full" />
            <span>Độc đáo</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
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

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Đăng nhập</h2>
            <p className="text-muted-foreground">Nhập thông tin của bạn để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  disabled={isLoading || loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  disabled={isLoading || loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading || loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-input text-primary focus:ring-primary" 
                />
                <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-primary/80 font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || loading}
              className="w-full h-12 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white font-medium shadow-sm"
            >
              {isLoading || loading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="ml-2 w-5 h-5" />
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
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading || loading}
              className="h-11"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
              {isGoogleLoading ? "Đang xử lý..." : "Đăng nhập với Google"}
            </Button>
            
            <Button variant="outline" className="h-11 bg-transparent" disabled>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook (Coming Soon)
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
