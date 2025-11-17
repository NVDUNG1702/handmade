"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Settings } from "lucide-react";

export default function LayoutTestPage() {
  // Generate mock data for testing scroll
  const mockMessages = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    content: `This is test message number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    sender: `User ${i % 5 + 1}`,
    time: `${10 + (i % 12)}:${String(i % 60).padStart(2, '0')}`,
  }));

  const mockConversations = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Conversation ${i + 1}`,
    lastMessage: `Last message in conversation ${i + 1}`,
    time: `${i % 24}h ago`,
    unread: i % 3 === 0 ? i % 10 : 0,
  }));

  return (
    <div className="flex bg-background overflow-hidden h-screen-minus-nav">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r flex-shrink-0 h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold mb-4">Layout Test</h2>
            <div className="flex gap-2">
              <Badge variant="outline">Conversations: {mockConversations.length}</Badge>
              <Badge variant="outline">Messages: {mockMessages.length}</Badge>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                {mockConversations.map((conv) => (
                  <Card key={conv.id} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{conv.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                          {conv.unread > 0 && (
                            <Badge variant="default" className="h-5 min-w-[20px] text-xs">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex-shrink-0">
            <Button className="w-full" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col h-full max-h-full">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-background flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Test Conversation</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.id % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.id % 2 === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.sender} • {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area - Fixed */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Send</Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info */}
      <div className="w-64 border-l flex-shrink-0 h-full">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex-shrink-0">
            <h3 className="font-semibold">Layout Info</h3>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Screen Height</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline">calc(100vh - header)</Badge>
                    <div className="text-xs text-muted-foreground">
                      Mobile: 100vh - 4rem (64px)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Desktop: 100vh - 4.5rem (72px)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Overflow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">overflow-hidden</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Flex Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="secondary">flex flex-col</Badge>
                    <Badge variant="secondary">flex-1</Badge>
                    <Badge variant="secondary">flex-shrink-0</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Scroll Areas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs">
                      • Left: Conversations list
                    </div>
                    <div className="text-xs">
                      • Center: Messages area
                    </div>
                    <div className="text-xs">
                      • Right: Info panel
                    </div>
                  </CardContent>
                </Card>

                {/* Add more content to test scroll */}
                {Array.from({ length: 10 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="p-3">
                      <div className="text-xs">Test item {i + 1}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
