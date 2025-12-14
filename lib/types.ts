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

// ===== NOTIFICATION TYPES =====
export * from "./types-notification";

// ===== SKILL TYPES =====
export interface Skill {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ===== LOCATION TYPES =====
export interface Province {
  code: string;
  name: string;
  name_en?: string;
  full_name?: string;
  full_name_en?: string;
  code_name?: string;
}

export interface Ward {
  code: string;
  name: string;
  name_en?: string;
  full_name?: string;
  full_name_en?: string;
  code_name?: string;
  province_code: string;
}

export interface ProvinceListResponse extends ApiResponse<Province[]> {}
export interface WardListResponse extends ApiResponse<Ward[]> {}

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

// ===== JOB REVIEW TYPES =====
export interface JobReview {
  id: string;
  job_request_id: string;
  reviewer_id: string;
  worker_id: string;
  skill_id?: string;
  rating: number;
  comment?: string;
  images: string[];
  is_verified: boolean;
  job_request?: {
    id: string;
    title: string;
    job_slug?: string;
  };
  reviewer?: User;
  worker?: User;
  skill?: Skill;
  created_at: string;
  updated_at?: string;
}

export interface CreateJobReviewDto {
  job_request_id: string;
  worker_id: string;
  skill_id?: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateJobReviewDto {
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface JobReviewQueryParams {
  page?: number;
  limit?: number;
  job_request_id?: string;
  worker_id?: string;
  reviewer_id?: string;
  skill_id?: string;
  min_rating?: number;
  sort_by?: 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
}

// ===== USER SKILL TYPES =====
export interface UserSkill {
  id: string;
  _id?: string;
  user_id?: string;
  userId?: string;
  skillId: string;
  skillName: string;
  level?: number | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience_years?: number;
  years_of_experience?: number;
  description?: string;
  portfolio_images?: string[];
  is_public?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserSkillDto {
  userId: string;
  skillId: string;
  proficiency_level?: number; // 1-10
  years_of_experience?: number; // ≥ 0
  experience_description?: string; // Max 500 chars
  is_public?: boolean;
}

export interface UpdateUserSkillDto {
  proficiency_level?: number; // 1-10
  years_of_experience?: number; // ≥ 0
  experience_description?: string; // Max 500 chars
  is_public?: boolean;
}


// ===== SKILL STATISTICS TYPES =====
export interface SkillStats {
  skill: Skill;
  worker_count: number;
  completed_jobs: number;
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
  top_workers?: User[];
}

export interface WorkerSkillStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<number, number>;
}
