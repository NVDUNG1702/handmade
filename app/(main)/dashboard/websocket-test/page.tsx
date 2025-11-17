"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { messageSocket } from "@/lib/message-socket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Wifi, 
  WifiOff, 
  Send, 
  MessageCircle, 
  Users, 
  Activity,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function WebSocketTestPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [events, setEvents] = useState<Array<{
    type: string;
    data: any;
    timestamp: string;
  }>>([]);
  const [testConversationId, setTestConversationId] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);

  // Monitor connection status
  useEffect(() => {
    const checkConnection = () => {
      const connected = messageSocket.isConnected();
      setIsConnected(connected);
      setConnectionStatus(connected ? "connected" : "disconnected");
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add event listeners for monitoring
  useEffect(() => {
    const addEvent = (type: string, data: any) => {
      setEvents(prev => [{
        type,
        data,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 49)]); // Keep last 50 events
    };

    const handleConnect = () => {
      addEvent("connect", { message: "Connected to WebSocket" });
      setConnectionStatus("connected");
      toast.success("🔌 WebSocket connected!");
    };

    const handleDisconnect = (reason: string) => {
      addEvent("disconnect", { reason });
      setConnectionStatus("disconnected");
      toast.error("🔌 WebSocket disconnected: " + reason);
    };

    const handleConnectError = (error: Error) => {
      addEvent("connect_error", { error: error.message });
      setConnectionStatus("error");
      toast.error("❌ Connection error: " + error.message);
    };

    const handleNewMessage = (data: any) => {
      addEvent("new:message", data);
      toast.success("📥 New message received!");
    };

    const handleTypingStart = (data: any) => {
      addEvent("message:typing:start", data);
      toast.info("⌨️ User started typing");
    };

    const handleTypingStop = (data: any) => {
      addEvent("message:typing:stop", data);
      toast.info("⌨️ User stopped typing");
    };

    const handlePresenceUpdate = (data: any) => {
      addEvent("presence:update", data);
      toast.info("👤 User presence updated");
    };

    const handleUserOnline = (data: any) => {
      addEvent("user:online", data);
      toast.success("🟢 User came online");
    };

    const handleUserOffline = (data: any) => {
      addEvent("user:offline", data);
      toast.info("🔴 User went offline");
    };

    const handleMessageRead = (data: any) => {
      addEvent("message:read", data);
      toast.info("👁️ Message marked as read");
    };

    const handleJoinConversation = (data: any) => {
      addEvent("join:conversation", data);
      if (data.success) {
        toast.success("✅ Joined conversation successfully");
      } else {
        toast.error("❌ Failed to join conversation: " + data.error);
      }
    };

    // Add all event listeners
    messageSocket.on("connect", handleConnect);
    messageSocket.on("disconnect", handleDisconnect);
    messageSocket.on("connect_error", handleConnectError);
    messageSocket.on("new:message", handleNewMessage);
    messageSocket.on("message:typing:start", handleTypingStart);
    messageSocket.on("message:typing:stop", handleTypingStop);
    messageSocket.on("message:read", handleMessageRead);
    messageSocket.on("user:online", handleUserOnline);
    messageSocket.on("user:offline", handleUserOffline);
    messageSocket.on("presence:update", handlePresenceUpdate);
    messageSocket.on("join:conversation", handleJoinConversation);

    return () => {
      messageSocket.off("connect", handleConnect);
      messageSocket.off("disconnect", handleDisconnect);
      messageSocket.off("connect_error", handleConnectError);
      messageSocket.off("new:message", handleNewMessage);
      messageSocket.off("message:typing:start", handleTypingStart);
      messageSocket.off("message:typing:stop", handleTypingStop);
      messageSocket.off("message:read", handleMessageRead);
      messageSocket.off("user:online", handleUserOnline);
      messageSocket.off("user:offline", handleUserOffline);
      messageSocket.off("presence:update", handlePresenceUpdate);
      messageSocket.off("join:conversation", handleJoinConversation);
    };
  }, []);

  const handleConnect = async () => {
    if (!token) {
      toast.error("No token available");
      return;
    }

    try {
      setConnectionStatus("connecting");
      await messageSocket.connect(token);
      toast.success("Connected successfully!");
    } catch (error: any) {
      toast.error("Connection failed: " + error.message);
      setConnectionStatus("error");
    }
  };

  const handleDisconnect = () => {
    messageSocket.disconnect();
    setJoinedRooms([]);
    toast.info("Disconnected");
  };

  const handleJoinConversation = () => {
    if (!testConversationId.trim()) {
      toast.error("Please enter a conversation ID");
      return;
    }

    messageSocket.joinConversation(testConversationId);
    setJoinedRooms(prev => [...new Set([...prev, testConversationId])]);
    toast.info(`Joining conversation: ${testConversationId}`);
  };

  const handleLeaveConversation = (conversationId: string) => {
    messageSocket.leaveConversation(conversationId);
    setJoinedRooms(prev => prev.filter(id => id !== conversationId));
    toast.info(`Left conversation: ${conversationId}`);
  };

  const handleSendMessage = () => {
    if (!testConversationId.trim() || !testMessage.trim()) {
      toast.error("Please enter conversation ID and message");
      return;
    }

    messageSocket.sendMessage({
      conversation_id: testConversationId,
      content: testMessage,
      type: "text"
    });
    
    toast.info("Message sent via WebSocket");
    setTestMessage("");
  };

  const handleStartTyping = () => {
    if (!testConversationId.trim()) {
      toast.error("Please enter a conversation ID");
      return;
    }

    messageSocket.startTyping(testConversationId);
    toast.info("Started typing");
  };

  const handleStopTyping = () => {
    if (!testConversationId.trim()) {
      toast.error("Please enter a conversation ID");
      return;
    }

    messageSocket.stopTyping(testConversationId);
    toast.info("Stopped typing");
  };

  const clearEvents = () => {
    setEvents([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <WifiOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please login to test WebSocket connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WebSocket Test</h1>
          <p className="text-muted-foreground">
            Test real-time message WebSocket connection
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Connection Status & Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isConnected ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                  Connection Status
                </CardTitle>
                <CardDescription>
                  Current WebSocket connection state
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={
                      connectionStatus === "connected" ? "default" :
                      connectionStatus === "connecting" ? "secondary" :
                      connectionStatus === "error" ? "destructive" : "outline"
                    }
                  >
                    {connectionStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>User:</span>
                  <span className="text-sm">{user?.full_name || user?.username}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Token:</span>
                  <span className="text-xs font-mono">
                    {token ? `${token.substring(0, 20)}...` : "None"}
                  </span>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    onClick={handleConnect}
                    disabled={isConnected || connectionStatus === "connecting"}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    onClick={handleDisconnect}
                    disabled={!isConnected}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
                <CardDescription>
                  Test WebSocket functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conversationId">Conversation ID</Label>
                  <Input
                    id="conversationId"
                    placeholder="Enter conversation ID"
                    value={testConversationId}
                    onChange={(e) => setTestConversationId(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleJoinConversation}
                    disabled={!isConnected}
                    size="sm"
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                  <Button 
                    onClick={handleStartTyping}
                    disabled={!isConnected}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Start Typing
                  </Button>
                  <Button 
                    onClick={handleStopTyping}
                    disabled={!isConnected}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Stop Typing
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Test Message</Label>
                  <div className="flex gap-2">
                    <Input
                      id="message"
                      placeholder="Enter test message"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!isConnected}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Joined Rooms */}
                {joinedRooms.length > 0 && (
                  <div className="space-y-2">
                    <Label>Joined Conversations</Label>
                    <div className="space-y-1">
                      {joinedRooms.map(roomId => (
                        <div key={roomId} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm font-mono">{roomId}</span>
                          <Button
                            onClick={() => handleLeaveConversation(roomId)}
                            size="sm"
                            variant="ghost"
                          >
                            Leave
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Events Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Events Log
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{events.length} events</Badge>
                  <Button onClick={clearEvents} size="sm" variant="ghost">
                    Clear
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Real-time WebSocket events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No events yet. Connect and interact to see events.
                    </p>
                  ) : (
                    events.map((event, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.timestamp}
                          </span>
                        </div>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle>WebSocket Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-green-600">✅ Implemented</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Socket.IO client integration</li>
                  <li>• Connection management</li>
                  <li>• Event handling system</li>
                  <li>• Auto-reconnection</li>
                  <li>• Token refresh handling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-600">🔄 Real-time Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• New message events</li>
                  <li>• Typing indicators</li>
                  <li>• Read receipts</li>
                  <li>• Conversation join/leave</li>
                  <li>• Message status updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-yellow-600">⚠️ Backend Required</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• WebSocket server setup</li>
                  <li>• Real-time message broadcasting</li>
                  <li>• User presence tracking</li>
                  <li>• Typing event handling</li>
                  <li>• Authentication middleware</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
