"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

// Simple test query
const useTestQuery = () => {
  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        message: "React Query hoạt động tốt!",
        timestamp: new Date().toISOString(),
        data: {
          users: 150,
          messages: 1250,
          conversations: 45,
        }
      };
    },
    staleTime: 5000, // 5 seconds
  });
};

export default function QueryTestPage() {
  const { data, isLoading, error, refetch, isFetching } = useTestQuery();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">React Query Test</h1>
          <p className="text-muted-foreground">
            Kiểm tra React Query đã hoạt động chưa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Query Status
                {isLoading || isFetching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : error ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>
                Trạng thái của React Query
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Loading</div>
                  <Badge variant={isLoading ? "default" : "secondary"}>
                    {isLoading ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Fetching</div>
                  <Badge variant={isFetching ? "default" : "secondary"}>
                    {isFetching ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Error</div>
                  <Badge variant={error ? "destructive" : "secondary"}>
                    {error ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Data</div>
                  <Badge variant={data ? "default" : "secondary"}>
                    {data ? "Available" : "None"}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={() => refetch()} 
                disabled={isLoading || isFetching}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refetch Data
              </Button>
            </CardContent>
          </Card>

          {/* Data Card */}
          <Card>
            <CardHeader>
              <CardTitle>Query Data</CardTitle>
              <CardDescription>
                Dữ liệu trả về từ query
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Đang tải...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  <XCircle className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Có lỗi xảy ra</div>
                  <div className="text-sm">{(error as Error).message}</div>
                </div>
              ) : data ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-2">
                      ✅ {data.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(data.timestamp).toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {data.data.users}
                      </div>
                      <div className="text-xs text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {data.data.messages}
                      </div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {data.data.conversations}
                      </div>
                      <div className="text-xs text-muted-foreground">Conversations</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw Data */}
        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
              <CardDescription>
                Dữ liệu thô từ query (JSON)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Nếu thấy "React Query hoạt động tốt!" → Setup thành công</p>
            <p><strong>2.</strong> Click "Refetch Data" để test lại query</p>
            <p><strong>3.</strong> Mở DevTools để xem React Query Devtools (chỉ trong development)</p>
            <p><strong>4.</strong> Nếu có lỗi → Kiểm tra console để debug</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
