# 🎨 Handmade Marketplace Frontend

A modern, responsive frontend for a handmade crafts marketplace built with Next.js 14 and TypeScript.

## ✨ Features

### 🔐 Authentication System
- Login/Register with email validation
- Google OAuth integration
- Forgot password with OTP verification
- JWT token management with auto-refresh
- Protected routes and auth guards

### 💬 Real-time Messaging
- WebSocket-based real-time chat
- User presence tracking (online/offline status)
- Live time updates ("X minutes ago" auto-updating)
- Typing indicators
- Message status tracking (sent, delivered, read)
- Conversation management

### 🏪 Marketplace Features
- Product browsing and search
- Shop management
- Job postings and applications
- User profiles
- Notifications system

### 📱 Modern UI/UX
- Responsive design (mobile-first)
- Dark/light theme support
- Modern component library (shadcn/ui)
- Smooth animations and transitions
- Accessible design patterns

## 🛠️ Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Persistent stores** - Local storage integration

### Real-time Features
- **Socket.IO** - WebSocket communication
- **Event-driven architecture** - Real-time updates
- **Presence system** - User online/offline tracking

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Input validation** - Real-time form validation

## 📦 Project Structure

```
handmadefe/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── messages/          # Messaging components
│   ├── ui/                # UI components (shadcn/ui)
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── api-*.ts          # API clients
│   ├── *-store.ts        # Zustand stores
│   ├── types-*.ts        # TypeScript types
│   └── ...
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd handmadefe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing & Development

### Test Pages
The application includes comprehensive test pages for development:

- `/dashboard/auth-test` - Authentication testing
- `/dashboard/api-test` - API integration testing  
- `/dashboard/websocket-test` - WebSocket events monitoring
- `/dashboard/presence-test` - User presence testing
- `/dashboard/live-time-test` - Live time updates demo
- `/dashboard/status-test` - Message status components
- `/dashboard/messages-test` - Messaging features

### Development Tools
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - CSS utilities

## 📱 Key Features Deep Dive

### Real-time Presence System
```typescript
// Automatic presence tracking
const { isOnline, lastSeen } = useUserPresence(userId);

// Live time updates
const liveTimeText = useLiveTime(lastSeen, isOnline);
// "Just now" → "1 minute ago" → "2 minutes ago" (auto-updating)
```

### WebSocket Integration
```typescript
// Real-time events
messageSocket.on('user:online', handleUserOnline);
messageSocket.on('user:offline', handleUserOffline);
messageSocket.on('new:message', handleNewMessage);
messageSocket.on('message:typing:start', handleTypingStart);
```

### State Management
```typescript
// Persistent presence store
const { setUserOnline, setUserOffline } = usePresenceStore();

// Message store with real-time updates
const { messages, addMessage, updateTypingUsers } = useMessageStore();
```

## 🔧 Configuration

### API Integration
- RESTful API client with axios
- Automatic token refresh
- Error handling and retry logic
- Type-safe API calls

### WebSocket Configuration
- Auto-reconnection on disconnect
- Event-driven architecture
- Presence tracking
- Message delivery confirmation

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=production_google_client_id
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for the handmade crafts community**
