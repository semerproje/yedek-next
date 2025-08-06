// AA API Constants and Types
export const AA_API_CONFIG = {
  BASE_URL: 'https://api.aa.com.tr',
  ENDPOINTS: {
    DISCOVER: '/abone/discover',
    SEARCH: '/abone/search',
    DOCUMENT: '/abone/document',
    SUBSCRIPTION: '/abone/subscription',
    TOKEN: '/abone/token',
    MULTITOKEN: '/abone/multitoken'
  },
  RATE_LIMIT: 500 // 500ms minimum request interval
};

export const AA_CATEGORIES = {
  1: 'Genel',
  2: 'Spor', 
  3: 'Ekonomi',
  4: 'Sağlık',
  5: 'Bilim-Teknoloji',
  6: 'Politika',
  7: 'Kültür-Sanat-Yaşam'
} as const;

export const AA_PRIORITIES = {
  1: 'Flaş',
  2: 'Acil', 
  3: 'Önemli',
  4: 'Rutin',
  5: 'Özel',
  6: 'Arşiv'
} as const;

export const AA_CONTENT_TYPES = {
  1: 'text',     // Haber
  2: 'picture',  // Fotoğraf
  3: 'video',    // Video
  4: 'file',     // Dosya
  5: 'graphic'   // Grafik
} as const;

export const AA_LANGUAGES = {
  'tr_TR': 'Türkçe',
  'en_US': 'İngilizce', 
  'ar_AR': 'Arapça'
} as const;

export interface AASearchFilters {
  q?: string;                    // Arama sorgusu
  limit?: number;                // Sonuç limiti
  offset?: number;               // Sayfalama offset
  filter_category?: number;      // Kategori ID (1-7)
  filter_type?: number;          // İçerik türü (1-5)
  filter_priority?: number;      // Öncelik seviyesi (1-6)
  filter_language?: string;      // Dil kodu (tr_TR, en_US, ar_AR)
  date_from?: string;           // Başlangıç tarihi (YYYY-MM-DD)
  date_to?: string;             // Bitiş tarihi (YYYY-MM-DD)
  keywords?: string;            // Anahtar kelimeler
}

export interface AANewsItem {
  id: string;
  title: string;
  brief: string;
  summary?: string;
  news_text?: string;
  category: string;
  category_id?: number;
  language: string;
  type: string;
  type_id?: number;
  priority: number;
  priority_name?: string;
  publishedAt: string;
  updatedAt: string;
  source: string;
  url: string;
  author?: string;
  keywords?: string[];
  media_ids?: string[];
  location?: string;
  tags?: string[];
}

export interface AAMediaItem {
  id: string;
  type: 'picture' | 'video' | 'graphic' | 'file';
  format: string;
  url: string;
  download_url?: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: {
    copyright?: string;
    location?: string;
    taken_at?: string;
  };
}

export interface AADiscoverResponse {
  categories: { id: number; name: string; }[];
  priorities: { id: number; name: string; }[];
  content_types: { id: number; name: string; }[];
  languages: { code: string; name: string; }[];
  bulletin_types?: any[];
  providers?: any[];
}

export interface AASearchResponse {
  success: boolean;
  data: {
    result: AANewsItem[];
    total: number;
    limit: number;
    offset: number;
  };
  usedUrl: string;
}

export interface AASubscriptionInfo {
  provider_name: string;
  package_name: string;
  allowed_categories: number[];
  allowed_types: number[];
  allowed_languages: string[];
  media_size_limits: {
    picture: number;
    video: number;
  };
  archive_access: boolean;
  daily_download_limit: number;
}

// Helper functions
export function getCategoryName(id: number): string {
  return AA_CATEGORIES[id as keyof typeof AA_CATEGORIES] || 'Bilinmeyen';
}

export function getPriorityName(id: number): string {
  return AA_PRIORITIES[id as keyof typeof AA_PRIORITIES] || 'Bilinmeyen';
}

export function getContentTypeName(id: number): string {
  return AA_CONTENT_TYPES[id as keyof typeof AA_CONTENT_TYPES] || 'text';
}

export function getLanguageName(code: string): string {
  return AA_LANGUAGES[code as keyof typeof AA_LANGUAGES] || 'Bilinmeyen';
}

export function buildSearchUrl(filters: AASearchFilters): string {
  const baseUrl = `${AA_API_CONFIG.BASE_URL}${AA_API_CONFIG.ENDPOINTS.SEARCH}`;
  return baseUrl;
}

export function buildDocumentUrl(typeId: string, format: string): string {
  return `${AA_API_CONFIG.BASE_URL}${AA_API_CONFIG.ENDPOINTS.DOCUMENT}/${typeId}/${format}`;
}

export function buildTokenUrl(typeId: string, format: string): string {
  return `${AA_API_CONFIG.BASE_URL}${AA_API_CONFIG.ENDPOINTS.TOKEN}/${typeId}/${format}`;
}
