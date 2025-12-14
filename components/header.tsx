"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Menu,
  X,
  Home,
  Briefcase,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Store,
  Hammer,
  UserPlus,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const userRoles = {
    isWorker: true,
    isStoreOwner: false,
  };

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/jobs", label: "Công việc", icon: Briefcase },
    { href: "/blogs", label: "Blog", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent group-hover:scale-110 transition-transform shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Handmade
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="hover:bg-white/10 transition-colors"
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-white/10 hidden md:flex"
              aria-label={
                theme === "dark"
                  ? "Chuyển sang chế độ sáng"
                  : "Chuyển sang chế độ tối"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Messages */}
            <Link href="/messages">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10 relative hidden md:flex"
                aria-label="Tin nhắn"
              >
                <MessageSquare className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-xs border-0">
                  3
                </Badge>
              </Button>
            </Link>

            {/* Notifications */}
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10 relative hidden md:flex"
                aria-label="Thông báo"
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-xs border-0">
                  5
                </Badge>
              </Button>
            </Link>

            {/* User Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold hover:scale-110 transition-transform shadow-lg"
              >
                N
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 w-64 glass-card backdrop-filter backdrop-blur-sm bg-opacity-50 border-white/20 rounded-xl p-2 z-50 shadow-xl top-15">
                    <div className="p-3 border-b border-white/10 mb-2">
                      <p className="font-semibold">Nguyễn Văn A</p>
                      <p className="text-sm text-muted-foreground">
                        nguyenvana@example.com
                      </p>
                    </div>

                    <Link
                      href="/my-profile"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white/10"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Hồ sơ
                      </Button>
                    </Link>

                    {userRoles.isWorker && (
                      <Link
                        href="/dashboard/worker"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-white/10"
                        >
                          <Hammer className="w-4 h-4 mr-2" />
                          Quản lý thợ
                        </Button>
                      </Link>
                    )}

                    {userRoles.isStoreOwner && (
                      <Link
                        href="/dashboard/store"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-white/10"
                        >
                          <Store className="w-4 h-4 mr-2" />
                          Quản lý cửa hàng
                        </Button>
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </Button>
                    </Link>

                    {(!userRoles.isWorker || !userRoles.isStoreOwner) && (
                      <div className="border-t border-white/10 mt-2 pt-2">
                        <p className="text-xs text-muted-foreground px-3 py-1 mb-1">
                          Đăng ký
                        </p>
                        {!userRoles.isWorker && (
                          <Link
                            href="/apply/worker"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start hover:bg-white/10"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Trở thành thợ
                            </Button>
                          </Link>
                        )}
                        {!userRoles.isStoreOwner && (
                          <Link
                            href="/apply/store"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start hover:bg-white/10"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Mở cửa hàng
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="border-t border-white/10 mt-2 pt-2">
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-white/10 text-red-500"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Đăng xuất
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-white/10"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/10"
                  >
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}

              <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Tin nhắn
                  <Badge className="ml-auto bg-gradient-to-r from-primary to-accent text-white border-0">
                    3
                  </Badge>
                </Button>
              </Link>

              <Link
                href="/notifications"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-white/10"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Thông báo
                  <Badge className="ml-auto bg-gradient-to-r from-primary to-accent text-white border-0">
                    5
                  </Badge>
                </Button>
              </Link>

              <div className="border-t border-white/10 pt-2 mt-2">
                <Link
                  href="/my-profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Hồ sơ
                  </Button>
                </Link>

                {userRoles.isWorker && (
                  <Link
                    href="/dashboard/worker"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-white/10"
                    >
                      <Hammer className="w-4 h-4 mr-2" />
                      Quản lý thợ
                    </Button>
                  </Link>
                )}

                {userRoles.isStoreOwner && (
                  <Link
                    href="/dashboard/store"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-white/10"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Quản lý cửa hàng
                    </Button>
                  </Link>
                )}

                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full justify-start hover:bg-white/10"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 mr-2" />
                  ) : (
                    <Moon className="w-4 h-4 mr-2" />
                  )}
                  {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                </Button>
              </div>

              {(!userRoles.isWorker || !userRoles.isStoreOwner) && (
                <div className="border-t border-white/10 pt-2 mt-2">
                  <p className="text-xs text-muted-foreground px-3 py-1 mb-1">
                    Đăng ký
                  </p>
                  {!userRoles.isWorker && (
                    <Link
                      href="/apply/worker"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white/10"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Trở thành thợ
                      </Button>
                    </Link>
                  )}
                  {!userRoles.isStoreOwner && (
                    <Link
                      href="/apply/store"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white/10"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Mở cửa hàng
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              <div className="border-t border-white/10 pt-2 mt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white/10 text-red-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
