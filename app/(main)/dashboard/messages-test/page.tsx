"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useConversations } from "@/hooks/use-messages";
import { messageApi, conversationApi } from "@/lib/api-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { MessageCircle, Send, Users, Search } from "lucide-react";

export default function MessagesTestPage() {
  const { user } = useAuth();
  const { conversations, isLoading, refetch } = useConversations();
  const [recipientSlug, setRecipientSlug] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (step: string, success: boolean, data: any) => {
    const result = {
      step,
      success,
      data,
      timestamp: new Date().toLocaleTimeString(),
    };
    setResults(prev => [result, ...prev]);
  };

  const testSendMessageBySlug = async () => {
    if (!recipientSlug || !messageContent) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const result = await messageApi.sendMessageBySlug({
        recipient_slug: recipientSlug,
        content: messageContent,
        type: "text",
      });
      addResult("Send Message by Slug", true, result);
      toast.success("✅ Gửi tin nhắn thành công!");
      setMessageContent("");
      refetch();
    } catch (error: any) {
      addResult("Send Message by Slug", false, error?.response?.data || error);
      toast.error("❌ Gửi tin nhắn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const testCreateConversationBySlug = async () => {
    if (!recipientSlug) {
      toast.error("Vui lòng nhập recipient slug");
      return;
    }

    setLoading(true);
    try {
      const result = await conversationApi.createConversationBySlug({
        recipient_slug: recipientSlug,
      });
      addResult("Create Conversation by Slug", true, result);
      toast.success("✅ Tạo conversation thành công!");
      refetch();
    } catch (error: any) {
      addResult("Create Conversation by Slug", false, error?.response?.data || error);
      toast.error("❌ Tạo conversation thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const testGetConversations = async () => {
    if (!user?.id) {
      toast.error("User chưa đăng nhập");
      return;
    }

    setLoading(true);
    try {
      const result = await conversationApi.getConversations(user.id, {
        page: 1,
        limit: 20,
      });
      addResult("Get Conversations", true, result);
      toast.success("✅ Lấy danh sách conversation thành công!");
    } catch (error: any) {
      addResult("Get Conversations", false, error?.response?.data || error);
      toast.error("❌ Lấy danh sách conversation thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const testSearchMessages = async () => {
    if (!user?.id || !searchQuery) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    setLoading(true);
    try {
      const result = await messageApi.searchMessages(user.id, {
        query: searchQuery,
        page: 1,
        limit: 20,
      });
      addResult("Search Messages", true, result);
      toast.success("✅ Tìm kiếm tin nhắn thành công!");
    } catch (error: any) {
      addResult("Search Messages", false, error?.response?.data || error);
      toast.error("❌ Tìm kiếm tin nhắn thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-muted-foreground">
            Bạn cần đăng nhập để test message system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages API Test</h1>
          <p className="text-muted-foreground">
            Test message system với backend thực
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Test Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Parameters</CardTitle>
                <CardDescription>
                  Nhập thông tin để test APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientSlug">Recipient Slug</Label>
                  <Input
                    id="recipientSlug"
                    type="text"
                    placeholder="username-slug"
                    value={recipientSlug}
                    onChange={(e) => setRecipientSlug(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messageContent">Message Content</Label>
                  <Input
                    id="messageContent"
                    type="text"
                    placeholder="Xin chào!"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="searchQuery">Search Query</Label>
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="từ khóa tìm kiếm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
                <CardDescription>
                  Thực hiện các API calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={testSendMessageBySlug}
                  disabled={loading || !recipientSlug || !messageContent}
                  className="w-full"
                  variant="default"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Testing..." : "Send Message by Slug"}
                </Button>

                <Button
                  onClick={testCreateConversationBySlug}
                  disabled={loading || !recipientSlug}
                  className="w-full"
                  variant="outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {loading ? "Testing..." : "Create Conversation"}
                </Button>

                <Button
                  onClick={testGetConversations}
                  disabled={loading}
                  className="w-full"
                  variant="secondary"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {loading ? "Testing..." : "Get Conversations"}
                </Button>

                <Button
                  onClick={testSearchMessages}
                  disabled={loading || !searchQuery}
                  className="w-full"
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Testing..." : "Search Messages"}
                </Button>

                <Separator />

                <Button
                  onClick={clearResults}
                  variant="ghost"
                  className="w-full"
                >
                  Clear Results
                </Button>
              </CardContent>
            </Card>

            {/* Current Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Conversations
                  <Badge variant="outline">{conversations.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Đang tải...</div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Chưa có conversation nào
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.slice(0, 5).map((conv) => (
                      <div key={conv._id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">
                            {conv.sender?.full_name || conv.sender?.username}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage?.content || "Chưa có tin nhắn"}
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default">{conv.unreadCount}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Test Results
                  <Badge variant="outline">{results.length} tests</Badge>
                </CardTitle>
                <CardDescription>
                  Kết quả API calls theo thời gian thực
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có kết quả test nào
                    </p>
                  ) : (
                    results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.success
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={result.success ? "default" : "destructive"}
                            >
                              {result.success ? "✅ SUCCESS" : "❌ ERROR"}
                            </Badge>
                            <span className="font-medium">{result.step}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {result.timestamp}
                          </span>
                        </div>
                        <pre className="text-xs bg-background/50 p-2 rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Info */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Message APIs</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><strong>POST</strong> /message/send-by-slug</li>
                  <li><strong>GET</strong> /message/conversation/:id</li>
                  <li><strong>GET</strong> /message/search/:userId</li>
                  <li><strong>PUT</strong> /message/read/:messageId</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Conversation APIs</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><strong>GET</strong> /message/conversations/:userId</li>
                  <li><strong>POST</strong> /conversation/create-by-slug</li>
                  <li><strong>POST</strong> /conversation/block-by-slug</li>
                  <li><strong>POST</strong> /conversation/block/:id</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
