// Additional types for Ultra Premium Homepage Module System
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'author';
  permissions: string[];
  avatar?: string;
  lastLogin: Date | string | number;
  active: boolean;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  order: number;
  active: boolean;
  newsCount: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}

export interface AnalyticsEvent {
  id: string;
  moduleId?: string;
  moduleType?: string;
  newsId?: string;
  action: 'view' | 'click' | 'share' | 'scroll' | 'impression';
  timestamp: Date | string | number;
  sessionId: string;
  userId?: string;
  metadata?: {
    position?: number;
    duration?: number;
    source?: string;
    referrer?: string;
    device?: string;
    browser?: string;
  };
}

export interface ModulePerformance {
  moduleId: string;
  moduleType: string;
  totalViews: number;
  totalClicks: number;
  totalImpressions: number;
  clickThroughRate: number;
  averageTimeSpent: number;
  bounceRate: number;
  conversionRate: number;
  engagementScore: number;
  period: {
    start: Date;
    end: Date;
  };
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  views: number;
  clicks: number;
  impressions: number;
  timeSpent: number;
  uniqueUsers: number;
}

export interface AIRecommendation {
  id: string;
  userId?: string;
  sessionId: string;
  newsId: string;
  score: number;
  reason: string;
  category: string;
  tags: string[];
  timestamp: Date | string | number;
  clicked: boolean;
  position: number;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: Date | string | number;
  expiresAt: Date | string | number;
  tags: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastCheck: Date | string | number;
  services: {
    firestore: boolean;
    firebase: boolean;
    cache: boolean;
    analytics: boolean;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    memoryUsage: number;
  };
}

// Enhanced Module Settings
export interface AdvancedModuleSettings extends ModuleSettings {
  // Caching
  cacheEnabled?: boolean;
  cacheDuration?: number; // in minutes
  cacheKey?: string;
  
  // Performance
  lazyLoad?: boolean;
  preloadImages?: boolean;
  infiniteScroll?: boolean;
  virtualization?: boolean;
  
  // Analytics
  trackViews?: boolean;
  trackClicks?: boolean;
  trackTime?: boolean;
  heatmapEnabled?: boolean;
  
  // Personalization
  personalizeContent?: boolean;
  userBehaviorWeight?: number;
  categoryPreferenceWeight?: number;
  recencyWeight?: number;
  
  // A/B Testing
  abTestEnabled?: boolean;
  abTestVariant?: string;
  abTestRatio?: number;
  
  // Content Filtering
  excludeCategories?: string[];
  includeOnlyCategories?: string[];
  excludeTags?: string[];
  includeOnlyTags?: string[];
  minViews?: number;
  maxAge?: number; // in hours
  
  // Display Settings
  responsiveBreakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  animations?: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'zoom' | 'flip';
    duration: number;
    easing: string;
  };
  
  // SEO
  seoOptimized?: boolean;
  structuredData?: boolean;
  canonicalUrl?: string;
  metaTags?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

// Enhanced Homepage Module
export interface EnhancedHomepageModule extends Omit<HomepageModule, 'settings'> {
  settings?: AdvancedModuleSettings;
  performance?: ModulePerformance;
  lastOptimized?: Date | string | number;
  optimizationScore?: number;
  version: string;
  dependencies?: string[];
  loadPriority: 'critical' | 'high' | 'normal' | 'low';
  fallbackComponent?: string;
  errorBoundary?: boolean;
}

// Admin Panel Types
export interface AdminDashboardStats {
  totalModules: number;
  activeModules: number;
  totalNews: number;
  publishedNews: number;
  totalUsers: number;
  activeUsers: number;
  todayViews: number;
  todayClicks: number;
  averageResponseTime: number;
  systemHealth: SystemHealth;
}

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  moduleType: string;
  componentName: string;
  defaultSettings: AdvancedModuleSettings;
  requiredFields: string[];
  optionalFields: string[];
  previewImage?: string;
  category: 'news' | 'media' | 'social' | 'analytics' | 'custom';
  tags: string[];
  author: string;
  version: string;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}

export interface BulkOperation {
  id: string;
  type: 'enable' | 'disable' | 'delete' | 'update' | 'reorder';
  targetIds: string[];
  parameters?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date | string | number;
  completedAt?: Date | string | number;
  error?: string;
  userId: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date | string | number;
  requestId: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Real-time Event Types
export interface RealtimeEvent {
  type: 'module_updated' | 'news_published' | 'breaking_news' | 'user_action' | 'system_alert';
  payload: any;
  timestamp: Date | string | number;
  source: string;
  userId?: string;
}

export interface WebSocketMessage {
  id: string;
  type: 'subscribe' | 'unsubscribe' | 'event' | 'ping' | 'pong';
  channel?: string;
  data?: any;
  timestamp: Date | string | number;
}

// Error Types
export interface SystemError {
  id: string;
  type: 'firestore' | 'cache' | 'api' | 'component' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context?: any;
  userId?: string;
  timestamp: Date | string | number;
  resolved: boolean;
  resolvedAt?: Date | string | number;
  resolvedBy?: string;
}

// Configuration Types
export interface SystemConfig {
  features: {
    realTimeUpdates: boolean;
    analytics: boolean;
    aiRecommendations: boolean;
    infiniteScroll: boolean;
    lazyLoading: boolean;
    serviceWorker: boolean;
    pushNotifications: boolean;
  };
  performance: {
    cacheDefaultDuration: number;
    maxConcurrentRequests: number;
    requestTimeout: number;
    retryAttempts: number;
    preloadThreshold: number;
  };
  analytics: {
    trackingEnabled: boolean;
    sessionTimeout: number;
    batchSize: number;
    flushInterval: number;
  };
  security: {
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
    allowedOrigins: string[];
    csrfProtection: boolean;
  };
}