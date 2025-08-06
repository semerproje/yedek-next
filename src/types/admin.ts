// Admin Panel Type Definitions
export interface HomepageModule {
  id: string
  key: string
  name: string
  description: string
  component: string
  active: boolean
  order: number
  settings: ModuleSettings
  lastModified: Date
  createdAt: Date
}

export interface ModuleSettings {
  itemCount?: number
  categories?: string[]
  showImages?: boolean
  autoUpdate?: boolean
  refreshInterval?: number
  layout?: 'grid' | 'list' | 'slider' | 'banner'
  displayStyle?: 'compact' | 'detailed' | 'card'
  [key: string]: unknown
}

export interface CategoryManagement {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  active: boolean
  order: number
  parentId?: string
  newsCount?: number
  lastModified: Date
  createdAt: Date
}

export interface NewsModuleConfig {
  id: string
  moduleKey: string
  title: string
  categories: string[]
  newsIds: string[]
  manualSelection: boolean
  autoSelection: {
    enabled: boolean
    criteria: {
      category?: string[]
      tags?: string[]
      dateRange?: number // days
      minViews?: number
      featured?: boolean
    }
  }
  displaySettings: {
    count: number
    layout: 'grid' | 'list' | 'slider'
    showImage: boolean
    showSummary: boolean
    showCategory: boolean
    showDate: boolean
    showAuthor: boolean
  }
  active: boolean
  order: number
  lastModified: Date
}

export interface PublishingSchedule {
  id: string
  moduleKey: string
  newsId: string
  publishAt: Date
  unpublishAt?: Date
  status: 'scheduled' | 'published' | 'expired'
  priority: number
  createdBy: string
  createdAt: Date
}

export interface ModuleAnalytics {
  moduleKey: string
  date: string
  views: number
  clicks: number
  impressions: number
  ctr: number
  topNews: Array<{
    newsId: string
    title: string
    clicks: number
  }>
}

// Frontend Display Types
export interface DisplayNews {
  id: string
  title: string
  summary: string
  content?: string
  imageUrl: string
  category: string
  author: string
  publishedAt: Date
  views: number
  featured: boolean
  tags: string[]
  source?: string
  sourceUrl?: string
  images?: string[]
  videos?: string[]
}

export interface HomepageData {
  breakingNews: DisplayNews[]
  headlines: DisplayNews[]
  editorPicks: DisplayNews[]
  categoryNews: Record<string, DisplayNews[]>
  popularNews: DisplayNews[]
  weekendReads: DisplayNews[]
  videoHighlights: DisplayNews[]
  lastUpdated: Date
}
