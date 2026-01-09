/**
 * API Endpoints
 * 
 * Centralized location for all API endpoints
 * Update with your actual API endpoints
 */
export const Endpoints = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh',
    VERIFY_TOKEN: '/api/auth/verify',
  },

  // User endpoints
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/password',
  },

  // Product endpoints
  PRODUCTS: {
    BASE: '/api/products',
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    SEARCH: '/api/products/search',
  },

  // Order endpoints
  ORDERS: {
    BASE: '/api/orders',
    LIST: '/api/orders',
    CREATE: '/api/orders',
    DETAIL: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
  },

  // Health check
  HEALTH: {
    CHECK: '/api/health',
    READY: '/api/health/ready',
    LIVE: '/api/health/live',
  },
} as const;
