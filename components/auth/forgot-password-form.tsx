"use client";

import { useState } from "react";
import { useAuthExtended } from "@/hooks/use-auth-extended";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading } = useAuthExtended();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      // Error already handled by useAuthExtended hook
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setEmail("");
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
              Đừng lo lắng!
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
              Chúng tôi sẽ giúp bạn
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            Quên mật khẩu là chuyện bình thường. Chỉ cần nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu ngay lập tức.
          </p>

          <div className="mt-12 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/artisan-crafting-handmade-products-in-workshop.jpg"
                alt="Handmade crafts"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))';
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-muted-foreground text-center">Hỗ trợ</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-primary rounded-full" />
            <span>Nhanh chóng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full" />
            <span>Bảo mật</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-accent rounded-full" />
            <span>Đơn giản</span>
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

          {!submitted ? (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Quên mật khẩu?</h2>
                <p className="text-muted-foreground">Nhập email của bạn để nhận mã OTP đặt lại mật khẩu</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      Gửi mã OTP
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Kiểm tra email của bạn</h2>
                  <p className="text-muted-foreground">
                    Chúng tôi đã gửi mã OTP đến{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
                  <button
                    onClick={handleTryAgain}
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    thử lại
                  </button>
                </p>
                
                <div className="space-y-3">
                  <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                    <Button className="w-full h-12 bg-gradient-to-r from-secondary via-accent to-primary hover:opacity-90 transition-opacity text-white">
                      Nhập mã OTP
                    </Button>
                  </Link>
                  
                  <Link href="/login">
                    <Button variant="outline" className="w-full h-12">
                      Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
