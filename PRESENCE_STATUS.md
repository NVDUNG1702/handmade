# Real-time Presence Status - Implementation Review

## ✅ FRONTEND - Đã hoàn chỉnh

### 1. WebSocket Events Handler
- ✅ `user:online` - Nhận thông báo user online
- ✅ `user:offline` - Nhận thông báo user offline  
- ✅ `presence:update` - Nhận cập nhật presence
- ✅ Event listeners đã được setup trong `MessageSocketProvider`

### 2. Presence Store (Zustand)
- ✅ `setUserOnline(userId, timestamp)` - Set user online
- ✅ `setUserOffline(userId, lastSeen)` - Set user offline
- ✅ `updateUserPresence(userId, isOnline, lastSeen)` - Update presence
- ✅ `getUserPresence(userId)` - Get user presence
- ✅ `isUserOnline(userId)` - Check if user online

### 3. UI Components
- ✅ `OnlineStatus` component với real-time updates
- ✅ `useUserPresence` hook
- ✅ Integration trong Messages page và ConversationList
- ✅ Fallback to static data nếu không có real-time

### 4. Test Pages
- ✅ `/dashboard/presence-test` - Test presence functionality
- ✅ `/dashboard/websocket-test` - Monitor WebSocket events

## ⚠️ BACKEND - Cần fix một số vấn đề

### ✅ Đã có (hoạt động):
1. **User Disconnect Logic** (`message.gateway.ts:488-563`)
   - ✅ Update `last_seen` trong database khi user disconnect
   - ✅ Tìm related users qua conversations
   - ✅ Emit `user:offline` event với `last_seen` timestamp
   - ✅ Chỉ gửi cho users đang online

2. **Connection Tracking** (`socket.service.ts`)
   - ✅ `isUserOnline(userId)` - Check user online via Redis
   - ✅ `addClient/removeClient` - Track connections
   - ✅ Redis-based connection management

### ❌ Thiếu (cần fix):

#### 1. **User Online Notification**
**Vấn đề:** Message Gateway KHÔNG gọi `handleUserConnect` khi user connect

**Hiện tại:** Chỉ có logic trong `socket.service.ts` nhưng không được sử dụng
```typescript
// socket.service.ts:202 - Có code nhưng không được gọi
client.broadcast.emit('user:online', { userId });
```

**Cần fix:** Thêm vào `message.gateway.ts:handleConnection`
```typescript
async handleConnection(client: AuthenticatedSocket): Promise<void> {
  // ... existing code ...
  
  // ❌ THIẾU: Emit user:online event
  if (userId) {
    // Lấy related users và emit user:online
    const relatedUsers = await this.getRelatedUsers(userId);
    const timestamp = new Date().toISOString();
    
    for (const relatedUserId of relatedUsers) {
      const isOnline = await this.socketService.isUserOnline(relatedUserId);
      if (isOnline) {
        await this.socketService.sendToUser(relatedUserId, 'user:online', {
          userId: userId,
          timestamp: timestamp
        });
      }
    }
  }
}
```

#### 2. **Presence Update Handler**
**Thiếu:** Handler cho `presence:update` event

**Cần thêm:**
```typescript
@SubscribeMessage('presence:update')
async handlePresenceUpdate(
  @MessageBody() data: { isOnline: boolean },
  @ConnectedSocket() client: AuthenticatedSocket,
) {
  if (!client.userId) return { error: 'Unauthorized' };
  
  const timestamp = new Date().toISOString();
  
  // Update database
  await this.userModel.findByIdAndUpdate(client.userId, {
    last_seen: data.isOnline ? null : new Date(),
    updated_at: new Date()
  });
  
  // Broadcast to related users
  const relatedUsers = await this.getRelatedUsers(client.userId);
  for (const userId of relatedUsers) {
    const isOnline = await this.socketService.isUserOnline(userId);
    if (isOnline) {
      await this.socketService.sendToUser(userId, 'presence:update', {
        userId: client.userId,
        isOnline: data.isOnline,
        lastSeen: data.isOnline ? undefined : timestamp
      });
    }
  }
  
  return { success: true };
}
```

#### 3. **Helper Method cho Related Users**
**Thiếu:** Method để lấy related users (đã có logic trong disconnect nhưng cần extract)

**Cần thêm:**
```typescript
private async getRelatedUsers(userId: string): Promise<string[]> {
  const userConversations = await this.conversationModel
    .find({
      $or: [
        { user1_id: new Types.ObjectId(userId) },
        { user2_id: new Types.ObjectId(userId) },
      ],
    })
    .select('user1_id user2_id')
    .lean()
    .exec();

  const relatedUserIds = new Set<string>();
  for (const conv of userConversations) {
    const otherUserId = conv.user1_id.toString() === userId
      ? conv.user2_id.toString()
      : conv.user1_id.toString();
    relatedUserIds.add(otherUserId);
  }

  return Array.from(relatedUserIds);
}
```

## 🔄 Event Flow Hiện Tại

### ✅ User Disconnect (Hoạt động)
```
User disconnects → Backend detects
→ Update last_seen in DB
→ Find related users via conversations  
→ Emit 'user:offline' với last_seen
→ Frontend receives và update presence store
→ UI updates với "Last seen X minutes ago"
```

### ❌ User Connect (Không hoạt động)
```
User connects → Backend connects socket
→ ❌ KHÔNG emit 'user:online' 
→ ❌ Frontend không nhận được notification
→ ❌ UI không update real-time
```

## 🎯 Kết luận

### Frontend: 100% sẵn sàng ✅
- Event handlers ✅
- Presence store ✅  
- UI components ✅
- Test pages ✅

### Backend: 70% hoàn thành ⚠️
- User offline: ✅ Hoạt động
- User online: ❌ Cần fix
- Presence update: ❌ Cần thêm
- Connection tracking: ✅ Hoạt động

### Cần làm:
1. **Fix user:online emission** trong handleConnection
2. **Thêm presence:update handler**
3. **Extract getRelatedUsers method**
4. **Test end-to-end** với 2 users

Sau khi fix 3 điểm trên, real-time presence sẽ hoạt động hoàn chỉnh! 🚀
