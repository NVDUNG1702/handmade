"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnlineStatus } from "@/components/messages/online-status";
import { useLiveTime, useFormattedLastSeen } from "@/hooks/use-live-time";
import { usePresenceStore } from "@/lib/presence-store";

export default function LiveTimeTestPage() {
  const [testUserId] = useState("test-user-123");
  const { setUserOnline, setUserOffline, getUserPresence } = usePresenceStore();
  const userPresence = getUserPresence(testUserId);

  // Test different timestamps
  const [testTimestamps] = useState([
    new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
    new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSetOnline = () => {
    setUserOnline(testUserId, new Date().toISOString());
  };

  const handleSetOffline = (timestamp: string) => {
    setUserOffline(testUserId, timestamp);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Live Time Test</h1>
        <div className="text-sm text-muted-foreground">
          Current Time: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSetOnline} variant="default">
              Set Online
            </Button>
            {testTimestamps.map((timestamp, index) => {
              const date = new Date(timestamp);
              const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
              return (
                <Button
                  key={index}
                  onClick={() => handleSetOffline(timestamp)}
                  variant="outline"
                  size="sm"
                >
                  {diffMinutes < 1 ? "Just now" : 
                   diffMinutes < 60 ? `${diffMinutes}m ago` :
                   diffMinutes < 1440 ? `${Math.floor(diffMinutes/60)}h ago` :
                   `${Math.floor(diffMinutes/1440)}d ago`}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <OnlineStatus 
                userId={testUserId}
                size="lg"
                showText={true}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>User Presence:</strong>
                <pre className="mt-2 p-2 bg-muted rounded text-xs">
                  {JSON.stringify(userPresence, null, 2)}
                </pre>
              </div>
              
              <div>
                <strong>Live Updates:</strong>
                <div className="mt-2 space-y-1">
                  <div>Online: {userPresence?.isOnline ? "✅" : "❌"}</div>
                  <div>Last Seen: {userPresence?.lastSeen || "N/A"}</div>
                  <div>Updated At: {userPresence?.updatedAt || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Time Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Live Time Examples</CardTitle>
          <p className="text-sm text-muted-foreground">
            These will update automatically every minute
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testTimestamps.map((timestamp, index) => {
              return (
                <LiveTimeExample 
                  key={index}
                  timestamp={timestamp}
                  label={`Example ${index + 1}`}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• <strong>useLiveTime hook:</strong> Tự động cập nhật text mỗi phút</p>
            <p>• <strong>Real-time updates:</strong> "vừa xong" → "1 phút trước" → "2 phút trước"</p>
            <p>• <strong>Auto intervals:</strong> setInterval(60000) để update mỗi phút</p>
            <p>• <strong>Memory efficient:</strong> Cleanup intervals khi component unmount</p>
            <p>• <strong>Accurate time:</strong> Tính toán lại từ timestamp gốc mỗi lần update</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LiveTimeExample({ timestamp, label }: { timestamp: string; label: string }) {
  const liveText = useLiveTime(timestamp, false);
  const formattedTime = useFormattedLastSeen(timestamp);

  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-muted-foreground">
        {new Date(timestamp).toLocaleString()}
      </div>
      <div className="space-y-1">
        <div className="text-sm">
          <span className="font-medium">Live:</span> {liveText}
        </div>
        <div className="text-sm">
          <span className="font-medium">Formatted:</span> {formattedTime}
        </div>
      </div>
    </div>
  );
}
