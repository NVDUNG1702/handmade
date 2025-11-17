"use client";

import { useAuth } from "@/components/auth-provider";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

function AuthTestContent() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Auth Test Dashboard</h1>
            <p className="text-muted-foreground">
              Kiểm tra authentication system
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin người dùng
              </CardTitle>
              <CardDescription>
                Thông tin tài khoản hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>
                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user?.full_name || "Chưa có tên"}</h3>
                  <p className="text-sm text-muted-foreground">@{user?.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                
                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                )}

                {user?.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Tham gia: {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {user?.roles?.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
                <Badge variant={user?.status ? "default" : "destructive"}>
                  {user?.status ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Auth Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái xác thực</CardTitle>
              <CardDescription>
                Thông tin về phiên đăng nhập
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập"}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">User ID:</span>
                  <span className="text-sm font-mono">{user?.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium">Token:</span>
                  <span className="text-sm text-muted-foreground">
                    {typeof window !== "undefined" && localStorage.getItem("access_token") 
                      ? "Có token" 
                      : "Không có token"
                    }
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Raw User Data:</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Các hành động để test auth system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (typeof window !== "undefined") {
                    console.log("LocalStorage:", {
                      access_token: localStorage.getItem("access_token"),
                      refresh_token: localStorage.getItem("refresh_token"),
                      user: localStorage.getItem("user"),
                      auth_storage: localStorage.getItem("auth-storage"),
                    });
                  }
                }}
              >
                Log Storage
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  toast.info("Test notification!");
                }}
              >
                Test Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthTestPage() {
  return (
    <ProtectedRoute>
      <AuthTestContent />
    </ProtectedRoute>
  );
}
