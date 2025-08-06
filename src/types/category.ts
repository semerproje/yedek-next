// Kategori yönetim sistemi için types
import { News } from './homepage';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  active: boolean;
  order: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}

export interface CategoryNews {
  categoryId: string;
  newsId: string;
  order: number;
  featured: boolean;
  createdAt: Date | string | number;
}

export interface CategoryPageData {
  category: Category;
  news: News[];
  totalCount: number;
  page: number;
  limit: number;
}

// Kategori ayarları
export interface CategorySettings {
  showSummaryCards?: boolean;
  showThemes?: boolean;
  showKpiWidget?: boolean;
  showAiPanel?: boolean;
  showVideoPanel?: boolean;
  newsPerPage?: number;
  headerStyle?: 'default' | 'gradient' | 'minimal';
}
