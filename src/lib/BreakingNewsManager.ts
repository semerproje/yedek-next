// Singleton manager for breaking news to prevent multiple component instances
// from making simultaneous Firebase requests and flooding the console

import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { News } from '@/types/homepage';

class BreakingNewsManager {
  private static instance: BreakingNewsManager;
  private cache: News[] = [];
  private lastFetch: number = 0;
  private isLoading: boolean = false;
  private retryCount: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;
  
  private readonly fallbackNews: News[] = [
    {
      id: 'fallback-1',
      title: 'Son Dakika: Güncel haberler takip ediliyor',
      summary: 'Sistem aktif olarak haberleri izliyor',
      content: 'Sistem normal şekilde çalışıyor ve haberler takip ediliyor.',
      category: 'genel',
      images: [],
      author: 'Sistem',
      source: 'NetNext',
      createdAt: new Date(),
      publishedAt: new Date(),
      status: 'published',
      views: 0,
      tags: ['sistem', 'genel'],
      breaking: true,
      urgent: false,
      featured: false
    }
  ];

  private constructor() {}

  public static getInstance(): BreakingNewsManager {
    if (!BreakingNewsManager.instance) {
      BreakingNewsManager.instance = new BreakingNewsManager();
    }
    return BreakingNewsManager.instance;
  }

  public async getBreakingNews(newsCount: number = 5): Promise<News[]> {
    const now = Date.now();
    
    // Return cache if still valid
    if (this.cache.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log(`📋 Breaking News Manager: Returning cached data (${this.cache.length} items)`);
      return this.cache.slice(0, newsCount);
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('⏳ Breaking News Manager: Request in progress, returning cache or fallback');
      return this.cache.length > 0 ? this.cache.slice(0, newsCount) : this.fallbackNews.slice(0, newsCount);
    }

    // Check retry limit and cooldown
    if (this.retryCount >= this.MAX_RETRIES) {
      console.log('🚫 Breaking News Manager: Max retries reached, using fallback');
      return this.fallbackNews.slice(0, newsCount);
    }

    this.isLoading = true;

    try {
      console.log('🔄 Breaking News Manager: Fetching fresh data from Firebase...');
      
      const newsRef = collection(db, 'news');
      const breakingQuery = query(
        newsRef,
        where('breaking', '==', true),
        where('status', '==', 'published'),
        limit(20)
      );

      const querySnapshot = await getDocs(breakingQuery);
      const news: News[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        news.push({
          id: doc.id,
          title: data.title || 'Başlık Bulunamadı',
          summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
          content: data.content || '',
          category: data.category || 'genel',
          images: Array.isArray(data.images) ? data.images.map((img: any) => {
            if (typeof img === 'string') {
              return { url: img, caption: '', alt: '' };
            }
            return {
              url: img.url || img,
              caption: img.caption || '',
              alt: img.alt || ''
            };
          }) : [],
          author: data.author || 'Editör',
          source: data.source || 'NetNext',
          createdAt: data.createdAt,
          publishedAt: data.publishedAt,
          status: data.status || 'published',
          views: data.views || 0,
          tags: data.tags || [],
          breaking: data.breaking || false,
          urgent: data.urgent || false,
          featured: data.featured || false
        });
      });

      if (news.length > 0) {
        // Sort by date (newest first)
        const sortedNews = news.sort((a, b) => {
          const dateA = a.publishedAt?.toDate?.() || a.publishedAt || new Date(0);
          const dateB = b.publishedAt?.toDate?.() || b.publishedAt || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        this.cache = sortedNews;
        this.lastFetch = now;
        this.retryCount = 0; // Reset on success
        console.log(`✅ Breaking News Manager: Loaded ${sortedNews.length} breaking news items`);
        return sortedNews.slice(0, newsCount);
      } else {
        // Only log on first retry to prevent spam
        if (this.retryCount === 0) {
          console.log('⚠️ Breaking News Manager: No breaking news found, using fallback');
        }
        this.retryCount++;
        return this.fallbackNews.slice(0, newsCount);
      }

    } catch (error) {
      console.error('❌ Breaking News Manager: Error fetching breaking news:', error);
      this.retryCount++;
      return this.fallbackNews.slice(0, newsCount);
    } finally {
      this.isLoading = false;
      this.lastFetch = now;
    }
  }

  public clearCache(): void {
    this.cache = [];
    this.lastFetch = 0;
    this.retryCount = 0;
    this.isLoading = false;
  }

  public getStatus(): { cached: number; lastFetch: number; retryCount: number; isLoading: boolean } {
    return {
      cached: this.cache.length,
      lastFetch: this.lastFetch,
      retryCount: this.retryCount,
      isLoading: this.isLoading
    };
  }
}

export default BreakingNewsManager;
