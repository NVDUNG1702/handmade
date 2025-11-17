// API Response Types
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  error?: any;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  slug?: string;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  roles?: string[];
  status?: boolean;
  avatar_url?: string;
  cover_url?: string;
  phone?: string;
  bio?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  user: AuthUser;
  unreadNotificationCount?: number;
}

// Job Request Types (matching backend JobRequestResponseDto)
export interface JobRequestItem {
  id: string;
  title: string;
  job_slug?: string;
  description: string;
  images?: string[];
  required_skill: {
    id: string;
    name: string;
    description?: string;
  };
  is_favorited?: boolean;
  distance_km?: number;

  // Location
  location: string;
  city?: string;
  district?: string;
  ward?: string;
  provinceCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;

  // Budget
  budget_min: number;
  budget_max: number;
  currency: string;

  // Time
  deadline: Date | string;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";

  // User info
  created_by: User;
  created_by_public?: {
    slug?: string;
    avatar?: string;
    name?: string;
  };
  assigned_to?: User;

  // Stats
  view_count: number;
  application_count: number;

  // Features
  is_featured: boolean;
  is_urgent: boolean;

  // Contact
  contact_info?: {
    phone?: string;
    email?: string;
    address?: string;
    is_public?: boolean;
  };

  // Timestamps
  created_at?: Date | string;
  updated_at?: Date | string;

  // Computed fields
  days_remaining: number;
  distance?: number;
  travel_time?: number;
  google_maps_url?: string;
  url?: string;
  directions_url?: string;
  street_view_url?: string;
  area_url?: string;
  location_info?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    formatted_address: string;
  };
}

// Blog Types (matching backend BlogResponseDto)
export interface Author {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export interface BlogItem {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  cover_url?: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  // SEO fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  canonical_url?: string;

  // Stats
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;

  // Author
  author?: Author;

  // Timestamps
  created_at: Date | string;
  updated_at: Date | string;
}

// Legacy types for backward compatibility
export interface LegacyJobRequestItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  image_url?: string;
  skills: string[];
  budget: string;
  location: string;
  postedDate: string;
  customer: string;
  customerRating: number;
  featured: boolean;
  nearShop?: boolean;
  shopName?: string;
}

export interface LegacyBlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
}
