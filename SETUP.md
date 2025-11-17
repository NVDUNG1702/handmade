# Setup Instructions

## Environment Configuration

1. Copy environment file:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your backend API URL:
```bash
# Update this to your backend URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

## Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

## Backend Integration

This frontend is configured to work with the Handmade backend API. Make sure your backend is running on the configured URL in `.env.local`.

### API Endpoints Used:
- `/auth/login` - User login
- `/auth/register` - User registration
- `/auth/google` - Google OAuth login
- `/auth/google/register` - Google OAuth registration
- `/auth/me` - Get current user
- `/auth/refresh-token` - Refresh access token
- `/blogs` - List blogs with pagination
- `/blogs/featured` - Featured blogs
- `/blogs/:id` - Blog detail
- `/job-requests` - List job requests with pagination
- `/job-requests/:id` - Job request detail

### Features Implemented:
- ✅ API client with axios and token refresh
- ✅ Authentication (login/register/logout)
- ✅ Google OAuth integration (login/register)
- ✅ Blog listing and detail pages
- ✅ Job listing and detail pages
- ✅ Featured blogs on homepage
- ✅ Navigation with auth state
- ✅ WebSocket support for real-time features
- ✅ Responsive design with Tailwind CSS
