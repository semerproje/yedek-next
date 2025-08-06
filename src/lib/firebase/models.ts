// Firestore Data Models
export interface AANewsDocument {
  id: string;
  aa_id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  priority: 'manset' | 'flas' | 'acil' | 'rutin';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
  source: 'AA';
  originalData: any; // Raw AA API data
  
  // AI Enhancement
  aiEnhanced: boolean;
  aiGeneratedSummary?: string;
  aiGeneratedTags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  
  // Media
  hasPhotos: boolean;
  hasVideos: boolean;
  hasDocuments: boolean;
  mediaUrls?: string[];
  
  // Analytics
  viewCount: number;
  shareCount: number;
  
  // Metadata
  author?: string;
  tags?: string[];
  slug?: string;
}

export interface AACategoryMapping {
  id: string;
  aa_id: number;
  aa_name: string;
  site_category: string;
  site_name: string;
  active: boolean;
  priority: 'manset' | 'flas' | 'acil' | 'rutin';
  createdAt: Date;
  updatedAt: Date;
}

export interface AAAutoSchedule {
  id: string;
  name: string;
  category: string;
  interval: number; // minutes
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  maxNews: number;
  priority: 'manset' | 'flas' | 'acil' | 'rutin';
  aiEnhance: boolean;
  photoDownload: boolean;
  videoDownload: boolean;
  
  // Advanced settings
  keywords?: string[];
  excludeKeywords?: string[];
  minLength?: number;
  maxLength?: number;
  customCron?: string;
  
  // Additional properties for ultra premium automation
  categories?: string[];
  newsCount?: number;
  filters?: {
    priority?: string;
    keywords?: string[];
    excludeKeywords?: string[];
    minLength?: number;
    maxLength?: number;
  };
  aiEnhancement?: boolean;
  seoOptimization?: boolean;
  autoPublish?: boolean;
  
  // Notifications
  notifications?: {
    email?: string[];
    slack?: string;
    webhook?: string;
  };
  
  // Stats
  totalRuns: number;
  totalNewsProcessed: number;
  lastRunSuccess: boolean;
  lastRunError?: string;
  stats?: {
    success: number;
    errors: number;
    processed: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AASystemStats {
  id: string;
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  scheduledNews: number;
  archivedNews: number;
  lastFetch: Date;
  totalSchedules: number;
  activeSchedules: number;
  aiEnhancedNews: number;
  totalViewCount: number;
  avgProcessingTime: number;
  successRate: number;
  updatedAt: Date;
}

export interface AAAPILog {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST';
  params: any;
  responseTime: number;
  success: boolean;
  error?: string;
  responseData?: any;
  newsProcessed?: number;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface AISettings {
  id: string;
  geminiApiKey: string;
  enhanceTitle: boolean;
  enhanceContent: boolean;
  generateSummary: boolean;
  generateTags: boolean;
  seoOptimization: boolean;
  autoTranslate: boolean;
  contentQuality: 'conservative' | 'balanced' | 'creative';
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  updatedAt: Date;
}
