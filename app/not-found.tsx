"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowLeft,
  Briefcase,
  ShoppingBag,
  BookOpen,
  Search,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-bl from-accent/10 to-secondary/10 rounded-full blur-3xl animate-bounce-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* 404 Number with gradient */}
          <div className="relative">
            <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none select-none">
              <span className="gradient-text animate-gradient-shift">404</span>
            </h1>
            <div className="absolute inset-0 blur-3xl opacity-30">
              <span className="text-[12rem] md:text-[16rem] font-bold gradient-text">
                404
              </span>
            </div>
          </div>

          {/* Glass card with message */}
          <div className="glass-card rounded-3xl p-8 md:p-12 space-y-6 border-2">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trang không tồn tại
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm. Có thể
                trang đã bị xóa, đổi tên hoặc không bao giờ tồn tại.
              </p>
            </div>

            {/* Search bar (optional - commented out for now) */}
            {/* <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div> */}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="lg"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
              <Button
                asChild
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 hover:scale-105 transition-all"
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </div>

          {/* Suggested links */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4 font-medium">
              Hoặc khám phá các trang phổ biến:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="gap-2 hover:bg-accent/10 rounded-xl group"
              >
                <Link href="/jobs">
                  <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Công việc
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="gap-2 hover:bg-accent/10 rounded-xl group"
              >
                <Link href="/shop">
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Cửa hàng
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="gap-2 hover:bg-accent/10 rounded-xl group"
              >
                <Link href="/blogs">
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
