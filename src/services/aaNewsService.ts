// AA News Service - Anadolu Ajansı Haber Servisi
import axios from 'axios';

export interface AANewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  category: string;
  author: string;
  tags: string[];
}

export interface AANewsResponse {
  success: boolean;
  data: AANewsItem[];
  total: number;
  page: number;
  error?: string;
}

class AANewsService {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = process.env.AA_API_BASE_URL || 'https://api.aa.com.tr/abone';
    this.username = process.env.AA_USERNAME || '';
    this.password = process.env.AA_PASSWORD || '';
  }

  async fetchNews(params: {
    limit?: number;
    page?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<AANewsResponse> {
    try {
      const {
        limit = 20,
        page = 1,
        category = 'gundem',
        startDate,
        endDate
      } = params;

      // AA API çağrısı simülasyonu
      // Gerçek implementasyon için AA API dokümantasyonunu takip edin
      const response = await axios.get(`${this.baseUrl}/news`, {
        params: {
          limit,
          page,
          category,
          startDate,
          endDate
        },
        auth: {
          username: this.username,
          password: this.password
        },
        timeout: 30000
      });

      return {
        success: true,
        data: response.data.items || [],
        total: response.data.total || 0,
        page
      };
    } catch (error) {
      console.error('AA News Service Error:', error);
      return {
        success: false,
        data: [],
        total: 0,
        page: params.page || 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async fetchNewsById(id: string): Promise<AANewsItem | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/news/${id}`, {
        auth: {
          username: this.username,
          password: this.password
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('AA News Service Error (fetchById):', error);
      return null;
    }
  }

  async fetchCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/categories`, {
        auth: {
          username: this.username,
          password: this.password
        },
        timeout: 30000
      });

      return response.data.categories || [];
    } catch (error) {
      console.error('AA News Service Error (fetchCategories):', error);
      return [];
    }
  }

  // Test bağlantısı
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.fetchNews({ limit: 1 });
      return {
        success: response.success,
        message: response.success ? 'AA API bağlantısı başarılı' : response.error || 'Bağlantı hatası'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }
}

export const aaNewsService = new AANewsService();
export default aaNewsService;
