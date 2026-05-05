/**
 * Constants for Grawizah platform
 */

export const BRAND_COLORS = {
  primary: {
    DEFAULT: '#6D28D9',
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  accent: {
    DEFAULT: '#3B82F6',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
};

export const USER_ROLES = {
  GUEST: 'guest',
  FREE_TRADER: 'free_trader',
  PREMIUM_TRADER: 'premium_trader',
  BUYER: 'buyer',
  ADMIN: 'admin',
} as const;

export const INQUIRY_STATUS = {
  OPEN: 'open',
  RESPONDED: 'responded',
  CLOSED: 'closed',
} as const;

export const INQUIRY_SOURCE = {
  CHAT: 'chat',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  RFQ: 'rfq',
} as const;

export const NOTIFICATION_CHANNEL = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  IN_APP: 'inapp',
} as const;

export const LEADERBOARD_WEIGHTS = {
  CONVERSION_RATE: 0.30,
  REPEAT_BUYER_RATE: 0.20,
  RESPONSE_RATE: 0.15,
  BUYER_RATING: 0.15,
  CATALOG_COMPLETENESS: 0.10,
  FULFILLMENT_SUCCESS: 0.10,
};

export const AI_LIMITS = {
  FREE_HS_CODE_DAILY: 3,
  PREMIUM_HS_CODE_DAILY: Infinity,
  RESPONSE_SUGGESTION_PREMIUM_ONLY: true,
  LEAD_SCORING_PREMIUM_ONLY: true,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const PRODUCT_CATEGORIES = [
  'Agriculture',
  'Textiles',
  'Electronics',
  'Machinery',
  'Chemicals',
  'Food & Beverage',
  'Automotive',
  'Construction Materials',
  'Furniture',
  'Handicrafts',
  'Other',
];

export const COUNTRIES = [
  'Indonesia',
  'USA',
  'China',
  'Japan',
  'Germany',
  'United Kingdom',
  'France',
  'India',
  'Brazil',
  'Australia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  // Add more as needed
];

export const CERTIFICATIONS = [
  'ISO 9001:2015',
  'ISO 22000',
  'HACCP',
  'GMP',
  'USDA Organic',
  'EU Organic (EOS)',
  'Rainforest Alliance',
  'Fairtrade',
  'MUI Halal',
  'JAKIM Halal',
  'IFANCA Halal',
  'FDA Registration',
  'CE Marking',
  'JAS',
];

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  DASHBOARD: '/dashboard',
  INTELLIGENCE: '/dashboard/intelligence',
  PRODUCTS: '/dashboard/products',
  INQUIRIES: '/dashboard/inquiries',
  LEADERBOARD: '/dashboard/leaderboard',
  SETTINGS: '/dashboard/settings',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  BUYERS: '/api/buyers',
  INQUIRIES: '/api/inquiries',
  LEADERBOARD: '/api/leaderboard',
  COMPANIES: '/api/companies',
  AI_HS_CODE: '/api/ai/hs-code',
  AI_LEAD_SCORE: '/api/ai/lead-score',
  AI_RESPONSE: '/api/ai/response-suggestion',
};

export const EXTERNAL_LINKS = {
  UN_COMTRADE: 'https://comtrade.un.org',
  GROQ_DOCS: 'https://console.groq.com/docs',
  SUPABASE_DOCS: 'https://supabase.com/docs',
};
