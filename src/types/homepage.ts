export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  images: Array<{url: string; caption?: string; alt?: string}>;
  author: string;
  source: string;
  createdAt: Date | string | number;
  publishedAt: Date | string | number;
  status: string;
  views: number;
  tags: string[];
  breaking: boolean;
  urgent: boolean;
  featured?: boolean;
}

export interface ModuleSettings {
  leftSideCount?: number;
  rightSideCount?: number;
  autoRefreshMinutes?: number;
  showWeather?: boolean;
  showCurrency?: boolean;
  breakingNewsSpeed?: number;
  gridColumns?: number;
  showCategories?: boolean;
  maxItems?: number;
  sortBy?: 'views' | 'publishedAt' | 'featured';
  enableAutoplay?: boolean;
  autoplaySpeed?: number;
  showAuthor?: boolean;
  showDate?: boolean;
  showViews?: boolean;
  // BreakingNewsBar specific settings
  autoRotate?: boolean;
  rotateInterval?: number;
  showIcon?: boolean;
  backgroundColor?: 'red' | 'blue' | 'black';
}

export interface HomepageModule {
  id: string;
  title: string;
  moduleType: 'main-visual' | 'breaking-bar' | 'headline-grid' | 'editor-picks' | 'popular-sidebar' | 'video-highlights' | 'weekend-reads' | 'ai-recommendations' | 'news-programs' | 'sticky-banner';
  componentName: string;
  category?: string;
  manualNewsIds: string[];
  autoFetch: boolean;
  newsCount: number;
  displayType: 'slider' | 'grid' | 'list' | 'banner' | 'sidebar' | 'visual';
  active: boolean;
  order: number;
  lastUpdated: Date | string | number;
  settings?: ModuleSettings;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
}
