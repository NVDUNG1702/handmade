export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  UPLOAD_URL:
    process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:4000/uploads",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000",
  REQUEST_TIMEOUT: 10000,
  ENDPOINTS: {
    // Skills
    SKILLS: {
      LIST: "/skills",
      DETAIL: "/skills/:id",
      STATS: "/skills/:skillId/stats",
    },
    // Locations
    LOCATIONS: {
      PROVINCES: "/locations/provinces",
      WARDS: "/locations/wards",
    },
    BLOGS: {
      LIST: "/blogs",
      DETAIL: "/blogs/:id",
      DETAIL_BY_SLUG: "/blogs/slug/:slug",
      LATEST: "/blogs/latest",
      FEATURED: "/blogs/featured",
    },
    JOB_REQUESTS: {
      LIST: "/job-requests",
      DETAIL: "/job-requests/:id",
      PROPOSALS_LIST: "/job-requests/:id/proposals",
    },
    JOB_REVIEWS: {
      CREATE: "/job-requests/:jobId/reviews",
      LIST: "/job-reviews",
      BY_JOB: "/job-requests/:jobId/reviews",
      BY_WORKER: "/users/:userId/job-reviews",
      BY_SKILL: "/skills/:skillId/reviews",
      DETAIL: "/job-reviews/:id",
      UPDATE: "/job-reviews/:id",
      DELETE: "/job-reviews/:id",
    },
    USERS: {
      SKILLS: "/skills/user-skills/:userId",
      COMPLETED_JOBS: "/users/:userId/completed-jobs",
    },
  },
  QUERY: {
    PAGE: "page",
    LIMIT: "limit",
    SEARCH: "search",
    SORT: "sort",
    ORDER: "order",
  },
} as const;
