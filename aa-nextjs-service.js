// Next.js Optimized AA News Service

import { fetchEnhancedNews } from './aa-enhanced-system';

// Next.js API route handler için
export class AANewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 dakika
  }
  
  // Cache kontrolü
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }
  
  // Cache'e kaydet
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  // Ana haber listesi
  async getLatestNews(options = {}) {
    const {
      limit = 20,
      category = null,
      page = 1,
      includeContent = false
    } = options;
    
    const cacheKey = `latest_${limit}_${category}_${page}_${includeContent}`;
    
    // Cache kontrolü
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    try {
      const result = await fetchEnhancedNews({
        limit: limit * page, // Pagination için
        category,
        includeImages: true,
        includeVideos: true
      });
      
      // Sayfalama
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNews = result.news.slice(startIndex, endIndex);
      
      // İçerik kontrolü
      const processedNews = paginatedNews.map(news => {
        if (!includeContent) {
          // API response'unda content'i kaldır
          const { content, ...newsWithoutContent } = news;
          return {
            ...newsWithoutContent,
            hasContent: !!content,
            contentLength: content ? content.length : 0
          };
        }
        return news;
      });
      
      const responseData = {
        news: processedNews,
        pagination: {
          currentPage: page,
          totalNews: result.news.length,
          hasNextPage: endIndex < result.news.length,
          hasPrevPage: page > 1
        },
        stats: result.stats,
        timestamp: result.timestamp,
        fromCache: false
      };
      
      // Cache'e kaydet
      this.setCachedData(cacheKey, responseData);
      
      return responseData;
      
    } catch (error) {
      throw new Error(`Haber alma hatası: ${error.message}`);
    }
  }
  
  // Kategoriye göre haberler
  async getNewsByCategory(category, options = {}) {
    const { limit = 15, includeContent = false } = options;
    
    const cacheKey = `category_${category}_${limit}_${includeContent}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    try {
      const result = await fetchEnhancedNews({
        limit,
        category,
        includeImages: true,
        includeVideos: true
      });
      
      const responseData = {
        category,
        news: result.news.map(news => includeContent ? news : {
          ...news,
          content: undefined,
          hasContent: !!news.content
        }),
        stats: result.stats,
        timestamp: result.timestamp,
        fromCache: false
      };
      
      this.setCachedData(cacheKey, responseData);
      return responseData;
      
    } catch (error) {
      throw new Error(`Kategori haberleri alma hatası: ${error.message}`);
    }
  }
  
  // Video haberler
  async getVideoNews(limit = 10) {
    const cacheKey = `video_news_${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    try {
      const result = await fetchEnhancedNews({
        limit: limit * 2, // Video haberleri az olabileceği için fazla çek
        includeImages: false,
        includeVideos: true
      });
      
      // Sadece video olan haberleri filtrele
      const videoNews = result.news
        .filter(news => news.videos.length > 0 || news.type === 'video')
        .slice(0, limit);
      
      const responseData = {
        news: videoNews,
        count: videoNews.length,
        timestamp: result.timestamp,
        fromCache: false
      };
      
      this.setCachedData(cacheKey, responseData);
      return responseData;
      
    } catch (error) {
      throw new Error(`Video haber alma hatası: ${error.message}`);
    }
  }
  
  // Fotoğraf galerisi haberleri
  async getPhotoGalleries(limit = 10) {
    const cacheKey = `photo_galleries_${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    try {
      const result = await fetchEnhancedNews({
        limit: limit * 2,
        includeImages: true,
        includeVideos: false
      });
      
      // Çoklu görseli olan haberleri filtrele
      const photoGalleries = result.news
        .filter(news => news.images.length > 1)
        .slice(0, limit);
      
      const responseData = {
        galleries: photoGalleries,
        count: photoGalleries.length,
        timestamp: result.timestamp,
        fromCache: false
      };
      
      this.setCachedData(cacheKey, responseData);
      return responseData;
      
    } catch (error) {
      throw new Error(`Fotoğraf galerisi alma hatası: ${error.message}`);
    }
  }
  
  // Anasayfa için optimized data
  async getHomepageData() {
    const cacheKey = 'homepage_data';
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
    
    try {
      // Paralel olarak farklı kategorilerden haberleri çek
      const [
        mainNews,
        sportsNews,
        economyNews,
        videoNews,
        photoGalleries
      ] = await Promise.all([
        this.getLatestNews({ limit: 8, includeContent: false }),
        this.getNewsByCategory('spor', { limit: 4 }),
        this.getNewsByCategory('ekonomi', { limit: 4 }),
        this.getVideoNews(3),
        this.getPhotoGalleries(3)
      ]);
      
      const responseData = {
        mainNews: mainNews.news,
        sportsNews: sportsNews.news,
        economyNews: economyNews.news,
        videoNews: videoNews.news,
        photoGalleries: photoGalleries.galleries,
        lastUpdated: new Date(),
        fromCache: false
      };
      
      this.setCachedData(cacheKey, responseData);
      return responseData;
      
    } catch (error) {
      throw new Error(`Anasayfa verileri alma hatası: ${error.message}`);
    }
  }
  
  // Arama fonksiyonu
  async searchNews(query, options = {}) {
    const { limit = 10, category = null } = options;
    
    try {
      // Tüm haberleri al ve ara
      const result = await fetchEnhancedNews({
        limit: 100, // Arama için daha fazla haber al
        category
      });
      
      const searchTerms = query.toLowerCase().split(' ');
      
      // Basit arama algoritması
      const searchResults = result.news.filter(news => {
        const searchText = `${news.title} ${news.summary || ''} ${news.content || ''}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      }).slice(0, limit);
      
      return {
        query,
        results: searchResults,
        count: searchResults.length,
        timestamp: new Date()
      };
      
    } catch (error) {
      throw new Error(`Arama hatası: ${error.message}`);
    }
  }
  
  // Cache temizleme
  clearCache() {
    this.cache.clear();
    return { success: true, message: 'Cache temizlendi' };
  }
  
  // Cache istatistikleri
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      cacheKeys: Array.from(this.cache.keys()),
      cacheTimeout: this.cacheTimeout
    };
  }
}

// Singleton instance
const aaNewsService = new AANewsService();

// Next.js API Routes için helper fonksiyonlar
export async function getServerSideProps(context) {
  const { category, page = 1, limit = 20 } = context.query;
  
  try {
    const newsData = await aaNewsService.getLatestNews({
      category: category || null,
      page: parseInt(page),
      limit: parseInt(limit),
      includeContent: false
    });
    
    return {
      props: {
        newsData,
        error: null
      },
      revalidate: 300 // 5 dakika
    };
  } catch (error) {
    return {
      props: {
        newsData: null,
        error: error.message
      }
    };
  }
}

// API route handlers
export const apiHandlers = {
  // GET /api/news
  async latest(req, res) {
    try {
      const { category, page = 1, limit = 20, includeContent = false } = req.query;
      
      const data = await aaNewsService.getLatestNews({
        category: category || null,
        page: parseInt(page),
        limit: parseInt(limit),
        includeContent: includeContent === 'true'
      });
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET /api/news/category/[category]
  async byCategory(req, res) {
    try {
      const { category } = req.query;
      const { limit = 15, includeContent = false } = req.query;
      
      const data = await aaNewsService.getNewsByCategory(category, {
        limit: parseInt(limit),
        includeContent: includeContent === 'true'
      });
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET /api/news/video
  async video(req, res) {
    try {
      const { limit = 10 } = req.query;
      const data = await aaNewsService.getVideoNews(parseInt(limit));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET /api/news/galleries
  async galleries(req, res) {
    try {
      const { limit = 10 } = req.query;
      const data = await aaNewsService.getPhotoGalleries(parseInt(limit));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET /api/news/homepage
  async homepage(req, res) {
    try {
      const data = await aaNewsService.getHomepageData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // GET /api/news/search
  async search(req, res) {
    try {
      const { q, category, limit = 10 } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Arama terimi gerekli' });
      }
      
      const data = await aaNewsService.searchNews(q, {
        category: category || null,
        limit: parseInt(limit)
      });
      
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // POST /api/news/cache/clear
  async clearCache(req, res) {
    try {
      const result = aaNewsService.clearCache();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default aaNewsService;
