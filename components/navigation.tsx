"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ShoppingBag,
  Search,
  ChevronDown,
  Store,
  Hammer,
  UserPlus,
  Package,
  BarChart3,
  ShoppingCart,
  Info,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { clearTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/hooks/use-user";
import { useUnreadCount } from "@/lib/message-store";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [storeSubmenuOpen, setStoreSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { mounted, authed } = useAuth();
  const { user } = useUser();
  const unreadMessageCount = useUnreadCount();

  console.log(user);

  const userRoles = {
    isWorker: true,
    isStoreOwner: true,
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/jobs", label: "Công việc", icon: Briefcase },
    { href: "/shop", label: "Cửa hàng", icon: ShoppingBag },
    { href: "/blogs", label: "Blog", icon: BookOpen },
  ];

  const storeMenuItems = [
    { href: "/dashboard/store/info", label: "Thông tin cửa hàng", icon: Info },
    {
      href: "/dashboard/store/products",
      label: "Quản lý sản phẩm",
      icon: Package,
    },
    { href: "/dashboard/store/orders", label: "Đơn hàng", icon: ShoppingCart },
    {
      href: "/dashboard/store/messages",
      label: "Tin nhắn cửa hàng",
      icon: MessageSquare,
    },
    { href: "/dashboard/store/analytics", label: "Thống kê", icon: BarChart3 },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
          : "bg-background/80 backdrop-blur-xl border-b border-border/30"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-accent group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
                Handmade
              </span>
              <span className="text-[10px] text-muted-foreground hidden md:block">
                Kết nối nghệ nhân
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                className="relative hover:bg-accent/10 transition-all group"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300" />
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent/10 hidden lg:flex relative group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-accent/10 hidden md:flex relative group"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </Button>

            {mounted && authed && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/10 relative hidden md:flex group"
                  asChild
                >
                  <Link href="/messages">
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {unreadMessageCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-xs border-0 animate-pulse">
                        {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/10 relative hidden md:flex group"
                  asChild
                >
                  <Link href="/notifications">
                    <Bell className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                    {/* TODO: Connect with notification store */}
                    {false && (
                      <Badge className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-xs border-0 animate-pulse">
                        0
                      </Badge>
                    )}
                  </Link>
                </Button>
              </>
            )}

            {/* Show login buttons when not authenticated */}
            {mounted && !authed && (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  asChild
                >
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Show user menu when authenticated */}
            {mounted && authed && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-accent/10 rounded-xl px-3 py-2 transition-all group"
                >
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.full_name || user.username || "User"}
                      width={36}
                      height={36}
                      className="rounded-full object-cover w-9 h-9 group-hover:scale-110 transition-transform shadow-lg"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg">
                      {user?.full_name?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                  <span className="hidden md:inline text-sm font-medium max-w-[140px] truncate">
                    {user?.full_name || user?.username}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && mounted && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 glass-card border-white/20 rounded-2xl p-3 z-50 shadow-2xl animate-in slide-in-from-top-2">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10 mb-3">
                        <div className="flex items-center gap-3 mb-2">
                          {user?.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.full_name || user.username || "User"}
                              width={48}
                              height={48}
                              className="rounded-full object-cover w-12 h-12 shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {(
                                user?.full_name ||
                                user?.username ||
                                "U"
                              ).charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">
                              {user?.full_name ||
                                user?.username ||
                                "Người dùng"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                            Pro Member
                          </Badge>
                          <span className="text-muted-foreground">4.9 ⭐</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-accent/10 rounded-xl"
                          asChild
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Link href="/profile/1">
                            <User className="w-4 h-4 mr-3" />
                            Hồ sơ cá nhân
                          </Link>
                        </Button>

                        {userRoles.isWorker && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-accent/10 rounded-xl"
                            asChild
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Link href="/dashboard/worker">
                              <Hammer className="w-4 h-4 mr-3" />
                              Quản lý thợ
                            </Link>
                          </Button>
                        )}

                        {userRoles.isStoreOwner && (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              className="w-full justify-start hover:bg-accent/10 rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStoreSubmenuOpen(!storeSubmenuOpen);
                              }}
                            >
                              <Store className="w-4 h-4 mr-3" />
                              Quản lý cửa hàng
                              <ChevronRight
                                className={`w-4 h-4 ml-auto transition-transform ${
                                  storeSubmenuOpen ? "rotate-90" : ""
                                }`}
                              />
                            </Button>

                            {storeSubmenuOpen && (
                              <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
                                {storeMenuItems.map((item) => (
                                  <Button
                                    key={item.href}
                                    variant="ghost"
                                    className="w-full justify-start hover:bg-accent/10 rounded-xl text-sm"
                                    asChild
                                    onClick={() => {
                                      setUserMenuOpen(false);
                                      setStoreSubmenuOpen(false);
                                    }}
                                  >
                                    <Link href={item.href}>
                                      <item.icon className="w-3.5 h-3.5 mr-2" />
                                      {item.label}
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-accent/10 rounded-xl"
                          asChild
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Link href="/settings">
                            <Settings className="w-4 h-4 mr-3" />
                            Cài đặt
                          </Link>
                        </Button>
                      </div>

                      {(!userRoles.isWorker || !userRoles.isStoreOwner) && (
                        <div className="border-t border-white/10 mt-3 pt-3">
                          <p className="text-xs text-muted-foreground px-3 py-1 mb-1 font-medium">
                            Đăng ký
                          </p>
                          <div className="space-y-1">
                            {!userRoles.isWorker && (
                              <Button
                                variant="ghost"
                                className="w-full justify-start hover:bg-accent/10 rounded-xl"
                                asChild
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Link href="/apply/worker">
                                  <UserPlus className="w-4 h-4 mr-3" />
                                  Trở thành thợ
                                </Link>
                              </Button>
                            )}
                            {!userRoles.isStoreOwner && (
                              <Button
                                variant="ghost"
                                className="w-full justify-start hover:bg-accent/10 rounded-xl"
                                asChild
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Link href="/apply/store">
                                  <ShoppingBag className="w-4 h-4 mr-3" />
                                  Mở cửa hàng
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-white/10 mt-3 pt-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-red-500/10 text-red-500 rounded-xl"
                          onClick={() => {
                            clearTokens();
                            setUserMenuOpen(false);
                            router.push("/login");
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Đăng xuất
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-accent/10"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/10 rounded-xl"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={link.href}>
                    <link.icon className="w-4 h-4 mr-3" />
                    {link.label}
                  </Link>
                </Button>
              ))}

              {mounted && authed && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/messages">
                      <MessageSquare className="w-4 h-4 mr-3" />
                      Tin nhắn
                      {unreadMessageCount > 0 && (
                        <Badge className="ml-auto bg-gradient-to-r from-primary to-accent text-white border-0">
                          {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/notifications">
                      <Bell className="w-4 h-4 mr-3" />
                      Thông báo
                      {/* TODO: Connect with notification store */}
                    </Link>
                  </Button>
                </>
              )}
              {mounted && authed && (
                <div className="border-t border-border/50 pt-2 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/profile/1">
                      <User className="w-4 h-4 mr-3" />
                      Hồ sơ
                    </Link>
                  </Button>

                  {userRoles.isWorker && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent/10 rounded-xl"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/dashboard/worker">
                        <Hammer className="w-4 h-4 mr-3" />
                        Quản lý thợ
                      </Link>
                    </Button>
                  )}

                  {userRoles.isStoreOwner && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-accent/10 rounded-xl"
                        onClick={() => setStoreSubmenuOpen(!storeSubmenuOpen)}
                      >
                        <Store className="w-4 h-4 mr-3" />
                        Quản lý cửa hàng
                        <ChevronRight
                          className={`w-4 h-4 ml-auto transition-transform ${
                            storeSubmenuOpen ? "rotate-90" : ""
                          }`}
                        />
                      </Button>

                      {storeSubmenuOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-primary/20 pl-2">
                          {storeMenuItems.map((item) => (
                            <Button
                              key={item.href}
                              variant="ghost"
                              className="w-full justify-start hover:bg-accent/10 rounded-xl text-sm"
                              asChild
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setStoreSubmenuOpen(false);
                              }}
                            >
                              <Link href={item.href}>
                                <item.icon className="w-3.5 h-3.5 mr-2" />
                                {item.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 mr-3" />
                    ) : (
                      <Moon className="w-4 h-4 mr-3" />
                    )}
                    {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                  </Button>

                  <div className="border-t border-border/50 pt-2 mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-red-500/10 text-red-500 rounded-xl"
                      onClick={() => {
                        clearTokens();
                        setMobileMenuOpen(false);
                        router.push("/login");
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              )}

              {mounted && !authed && (
                <div className="border-t border-border/50 pt-2 mt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent/10 rounded-xl"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/login">
                      <User className="w-4 h-4 mr-3" />
                      Đăng nhập
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl mt-1"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/register">
                      <UserPlus className="w-4 h-4 mr-3" />
                      Đăng ký
                    </Link>
                  </Button>
                </div>
              )}

              {(!userRoles.isWorker || !userRoles.isStoreOwner) && (
                <div className="border-t border-border/50 pt-2 mt-2">
                  <p className="text-xs text-muted-foreground px-3 py-1 mb-1 font-medium">
                    Đăng ký
                  </p>
                  {!userRoles.isWorker && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent/10 rounded-xl"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/apply/worker">
                        <UserPlus className="w-4 h-4 mr-3" />
                        Trở thành thợ
                      </Link>
                    </Button>
                  )}
                  {!userRoles.isStoreOwner && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent/10 rounded-xl"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/apply/store">
                        <ShoppingBag className="w-4 h-4 mr-3" />
                        Mở cửa hàng
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
