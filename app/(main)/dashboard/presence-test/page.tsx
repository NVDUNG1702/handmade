"use client";

import { useState } from "react";
import { usePresenceStore } from "@/lib/presence-store";
import { useUserPresence } from "@/hooks/use-presence";
import { OnlineStatus } from "@/components/messages/online-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Users, UserCheck, UserX, Activity, Clock } from "lucide-react";

export default function PresenceTestPage() {
  const [testUserId, setTestUserId] = useState("user123");
  const [testUserName, setTestUserName] = useState("Test User");
  
  const { 
    userPresence, 
    setUserOnline, 
    setUserOffline, 
    updateUserPresence, 
    clearPresence 
  } = usePresenceStore();
  
  const { presence, isOnline, lastSeen } = useUserPresence(testUserId);

  const handleSetOnline = () => {
    setUserOnline(testUserId, new Date().toISOString());
    toast.success(`${testUserName} is now online`);
  };

  const handleSetOffline = () => {
    setUserOffline(testUserId, new Date().toISOString());
    toast.info(`${testUserName} is now offline`);
  };

  const handleTogglePresence = () => {
    const currentStatus = isOnline;
    updateUserPresence(testUserId, !currentStatus, !currentStatus ? new Date().toISOString() : undefined);
    toast.info(`${testUserName} is now ${!currentStatus ? 'online' : 'offline'}`);
  };

  const handleClearAll = () => {
    clearPresence();
    toast.info("Cleared all presence data");
  };

  const mockUsers = [
    { id: "user1", name: "Alice Johnson", avatar: "/avatar1.jpg" },
    { id: "user2", name: "Bob Smith", avatar: "/avatar2.jpg" },
    { id: "user3", name: "Carol Davis", avatar: "/avatar3.jpg" },
    { id: "user4", name: "David Wilson", avatar: "/avatar4.jpg" },
  ];

  const simulatePresenceUpdates = () => {
    mockUsers.forEach((user, index) => {
      setTimeout(() => {
        const isOnline = Math.random() > 0.5;
        updateUserPresence(
          user.id, 
          isOnline, 
          isOnline ? undefined : new Date(Date.now() - Math.random() * 3600000).toISOString()
        );
      }, index * 500);
    });
    toast.info("Simulating presence updates for mock users");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Real-time Presence Test</h1>
          <p className="text-muted-foreground">
            Test real-time user presence and online status
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Presence Controls
                </CardTitle>
                <CardDescription>
                  Test presence updates manually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Test User ID</Label>
                  <Input
                    id="userId"
                    value={testUserId}
                    onChange={(e) => setTestUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName">Test User Name</Label>
                  <Input
                    id="userName"
                    value={testUserName}
                    onChange={(e) => setTestUserName(e.target.value)}
                    placeholder="Enter user name"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleSetOnline}
                    className="flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Set Online
                  </Button>
                  <Button 
                    onClick={handleSetOffline}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Set Offline
                  </Button>
                </div>

                <Button 
                  onClick={handleTogglePresence}
                  variant="secondary"
                  className="w-full"
                >
                  Toggle Status
                </Button>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    onClick={simulatePresenceUpdates}
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Simulate Mock Users
                  </Button>
                  <Button 
                    onClick={handleClearAll}
                    variant="destructive"
                    className="w-full"
                  >
                    Clear All Presence
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Test User Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Test User</CardTitle>
                <CardDescription>
                  Real-time status of {testUserName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {testUserName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <OnlineStatus 
                      userId={testUserId}
                      size="md"
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{testUserName}</h4>
                    <OnlineStatus 
                      userId={testUserId}
                      showText={true}
                      size="sm"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>User ID:</span>
                    <code className="text-xs bg-muted px-1 rounded">{testUserId}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={isOnline ? "default" : "secondary"}>
                      {isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  {lastSeen && (
                    <div className="flex justify-between">
                      <span>Last Seen:</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(lastSeen).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {presence && (
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(presence.updatedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Users Presence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                All Users Presence
                <Badge variant="outline">{Object.keys(userPresence).length} users</Badge>
              </CardTitle>
              <CardDescription>
                Current presence data for all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(userPresence).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No presence data yet. Set some users online/offline to see data.
                  </p>
                ) : (
                  Object.values(userPresence).map((presence) => (
                    <div
                      key={presence.userId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {presence.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <OnlineStatus 
                            userId={presence.userId}
                            size="sm"
                            className="absolute -bottom-0.5 -right-0.5"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{presence.userId}</div>
                          <OnlineStatus 
                            userId={presence.userId}
                            showText={true}
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={presence.isOnline ? "default" : "secondary"}>
                          {presence.isOnline ? "Online" : "Offline"}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(presence.updatedAt).toLocaleTimeString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Users Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Mock Users Demo</CardTitle>
            <CardDescription>
              Demo with simulated users showing different online statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <OnlineStatus 
                      userId={user.id}
                      size="sm"
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{user.name}</div>
                    <OnlineStatus 
                      userId={user.id}
                      showText={true}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Info */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Presence Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-green-600">✅ Live Time Updates</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Tự động cập nhật "X phút trước" mỗi phút</li>
                  <li>• useLiveTime hook với setInterval</li>
                  <li>• Real-time presence + dynamic time</li>
                  <li>• Memory efficient cleanup</li>
                  <li>• Accurate time calculations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-600">🔄 WebSocket Events</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• user:online</li>
                  <li>• user:offline</li>
                  <li>• presence:update</li>
                  <li>• Auto presence detection</li>
                  <li>• Last seen timestamps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-yellow-600">⚠️ Backend Required</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• User presence tracking</li>
                  <li>• WebSocket presence events</li>
                  <li>• Auto-detect online/offline</li>
                  <li>• Presence broadcasting</li>
                  <li>• Last seen persistence</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
