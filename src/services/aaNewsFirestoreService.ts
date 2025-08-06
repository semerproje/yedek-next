// Enhanced AA News Firestore Service
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  writeBatch,
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { 
  AANewsDocument, 
  AANewsItem, 
  AASearchParams, 
  AAContentType, 
  AAPriority, 
  AALanguage, 
  NewsStatus,
  AAQuotaInfo 
} from '@/types/aa-news';
import ultraPremiumAAService from './ultraPremiumAAService';
import { aiContentService } from './aiContentService';

export class AANewsFirestoreService {
  private readonly collectionName = 'aa_news';
  private readonly quotaCollectionName = 'aa_quota';

  // Haber ekleme
  async addNews(newsItem: AANewsItem, processWithAI: boolean = true): Promise<string> {
    try {
      // AA News Item'ı AANewsDocument'e dönüştür
      const newsDocument = await this.convertAAItemToDocument(newsItem, processWithAI);
      
      // Firestore'a kaydet
      const docRef = await addDoc(collection(db, this.collectionName), newsDocument);
      
      // Medya dosyalarını alt koleksiyona kaydet
      if (newsItem.images || newsItem.videos) {
        await this.saveMediaFiles(docRef.id, newsItem);
      }
      
      // Kotayı güncelle
      await this.updateQuota();
      
      console.log('Haber başarıyla kaydedildi:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Haber kaydetme hatası:', error);
      throw error;
    }
  }

  // Toplu haber ekleme
  async addMultipleNews(newsItems: AANewsItem[], processWithAI: boolean = true): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const docIds: string[] = [];
      
      for (const newsItem of newsItems) {
        const newsDocument = await this.convertAAItemToDocument(newsItem, processWithAI);
        const docRef = doc(collection(db, this.collectionName));
        batch.set(docRef, newsDocument);
        docIds.push(docRef.id);
      }
      
      await batch.commit();
      
      // Kotayı güncelle
      await this.updateQuota(newsItems.length);
      
      console.log(`${newsItems.length} haber başarıyla kaydedildi`);
      return docIds;
    } catch (error) {
      console.error('Toplu haber kaydetme hatası:', error);
      throw error;
    }
  }

  // Haber getirme
  async getNewsById(id: string): Promise<AANewsDocument | null> {
    try {
      const docSnap = await getDoc(doc(db, this.collectionName, id));
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AANewsDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Haber getirme hatası:', error);
      throw error;
    }
  }

  // Haber listesi getirme
  async getNewsList(params: {
    category?: string;
    type?: AAContentType;
    priority?: AAPriority;
    language?: AALanguage;
    status?: NewsStatus;
    limit?: number;
    startAfter?: DocumentSnapshot;
    orderByField?: 'date' | 'created_at' | 'views';
    orderDirection?: 'asc' | 'desc';
  } = {}): Promise<{ news: AANewsDocument[]; lastDoc?: DocumentSnapshot }> {
    try {
      const {
        category,
        type,
        priority,
        language,
        status,
        limit: queryLimit = 20,
        startAfter: startAfterDoc,
        orderByField = 'date',
        orderDirection = 'desc'
      } = params;

      let q = query(collection(db, this.collectionName));

      // Filtreler
      if (category) {
        q = query(q, where('category', '==', category));
      }
      if (type) {
        q = query(q, where('type', '==', type));
      }
      if (priority) {
        q = query(q, where('priority', '==', priority));
      }
      if (language) {
        q = query(q, where('language', '==', language));
      }
      if (status) {
        q = query(q, where('status', '==', status));
      }

      // Sıralama
      q = query(q, orderBy(orderByField, orderDirection));

      // Limit
      q = query(q, limit(queryLimit));

      // Pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const news: AANewsDocument[] = [];
      let lastDoc: DocumentSnapshot | undefined;

      querySnapshot.forEach((doc) => {
        news.push({ id: doc.id, ...doc.data() } as AANewsDocument);
        lastDoc = doc;
      });

      return { news, lastDoc };
    } catch (error) {
      console.error('Haber listesi getirme hatası:', error);
      throw error;
    }
  }

  // Haber güncelleme
  async updateNews(id: string, updates: Partial<AANewsDocument>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      await updateDoc(doc(db, this.collectionName, id), updateData);
      console.log('Haber güncellendi:', id);
    } catch (error) {
      console.error('Haber güncelleme hatası:', error);
      throw error;
    }
  }

  // Haber silme
  async deleteNews(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
      // Alt koleksiyonları da sil
      await this.deleteSubCollections(id);
      console.log('Haber silindi:', id);
    } catch (error) {
      console.error('Haber silme hatası:', error);
      throw error;
    }
  }

  // Arama
  async searchNews(searchTerm: string, filters: {
    category?: string;
    type?: AAContentType;
    limit?: number;
  } = {}): Promise<AANewsDocument[]> {
    try {
      // Firestore tam metin arama desteklemediği için basit filtreleme
      const { news } = await this.getNewsList({
        category: filters.category,
        type: filters.type,
        limit: filters.limit || 50
      });

      // Client-side filtering
      const searchTermLower = searchTerm.toLowerCase();
      const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTermLower) ||
        item.summary.toLowerCase().includes(searchTermLower) ||
        item.content.toLowerCase().includes(searchTermLower) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchTermLower))
      );

      return filteredNews;
    } catch (error) {
      console.error('Haber arama hatası:', error);
      throw error;
    }
  }

  // Son dakika haberleri
  async getBreakingNews(limit: number = 10): Promise<AANewsDocument[]> {
    try {
      const { news } = await this.getNewsList({
        limit,
        orderByField: 'date',
        orderDirection: 'desc'
      });

      return news.filter(item => item.breaking_news || item.urgent);
    } catch (error) {
      console.error('Son dakika haberleri getirme hatası:', error);
      throw error;
    }
  }

  // Kategoriye göre haberler
  async getNewsByCategory(category: string, limit: number = 20): Promise<AANewsDocument[]> {
    try {
      const { news } = await this.getNewsList({
        category,
        limit,
        status: NewsStatus.PUBLISHED
      });

      return news;
    } catch (error) {
      console.error('Kategori haberleri getirme hatası:', error);
      throw error;
    }
  }

  // İstatistikler
  async getStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    by_category: { [key: string]: number };
    by_type: { [key: string]: number };
    today_count: number;
    week_count: number;
  }> {
    try {
      const { news } = await this.getNewsList({ limit: 1000 });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: news.length,
        published: news.filter(n => n.status === NewsStatus.PUBLISHED).length,
        draft: news.filter(n => n.status === NewsStatus.DRAFT).length,
        by_category: {} as { [key: string]: number },
        by_type: {} as { [key: string]: number },
        today_count: news.filter(n => new Date(n.created_at) >= today).length,
        week_count: news.filter(n => new Date(n.created_at) >= weekAgo).length
      };

      // Kategori istatistikleri
      news.forEach(item => {
        stats.by_category[item.category] = (stats.by_category[item.category] || 0) + 1;
        stats.by_type[item.type.toString()] = (stats.by_type[item.type.toString()] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('İstatistik hesaplama hatası:', error);
      throw error;
    }
  }

  // Kota bilgisi getirme
  async getQuotaInfo(): Promise<AAQuotaInfo> {
    try {
      const quotaDoc = await getDoc(doc(db, this.quotaCollectionName, 'current'));
      
      if (quotaDoc.exists()) {
        return quotaDoc.data() as AAQuotaInfo;
      }

      // Default kota bilgisi
      const defaultQuota: AAQuotaInfo = {
        daily_limit: 1000,
        used_today: 0,
        remaining: 1000,
        concurrent_limit: 5,
        rate_limit_ms: 500,
        archive_days: 30,
        last_reset: new Date().toISOString()
      };

      await updateDoc(doc(db, this.quotaCollectionName, 'current'), defaultQuota);
      return defaultQuota;
    } catch (error) {
      console.error('Kota bilgisi getirme hatası:', error);
      throw error;
    }
  }

  // Private helper methods

  private async convertAAItemToDocument(
    newsItem: AANewsItem, 
    processWithAI: boolean
  ): Promise<Omit<AANewsDocument, 'id'>> {
    const now = new Date().toISOString();
    
    let enhancedContent = {
      title: newsItem.title,
      content: newsItem.content,
      summary: newsItem.summary
    };

    // AI ile geliştir
    if (processWithAI) {
      try {
        const aiEnhanced = await aiContentService.enhanceNewsContent(newsItem);
        enhancedContent = {
          title: aiEnhanced.seoTitle || newsItem.title,
          content: aiEnhanced.content,
          summary: aiEnhanced.summary
        };
      } catch (error) {
        console.warn('AI geliştirme hatası:', error);
      }
    }

    const document: Omit<AANewsDocument, 'id'> = {
      // Temel bilgiler
      title: enhancedContent.title,
      type: newsItem.type as AAContentType,
      date: newsItem.date,
      category: this.mapAACategory(newsItem.category_id),
      priority: newsItem.priority_id as AAPriority,
      language: newsItem.language_id as AALanguage,
      provider: 'AA',

      // İçerik
      content: enhancedContent.content,
      summary: enhancedContent.summary,
      keywords: newsItem.tags || [],

      // Medya
      photos: newsItem.images || [],
      videos: newsItem.videos || [],
      documents: [],

      // AA Spesifik
      aa_id: newsItem.id,
      group_id: newsItem.group_id,
      category_id: newsItem.category_id,
      priority_id: newsItem.priority_id,
      language_id: newsItem.language_id,
      provider_id: newsItem.provider_id,

      // İşleme bilgileri
      processed: processWithAI,
      ai_enhanced: processWithAI,
      seo_url: this.generateSeoUrl(enhancedContent.title),

      // Sistem bilgileri
      created_at: now,
      updated_at: now,
      fetched_at: now,
      status: NewsStatus.DRAFT,

      // Analitik
      views: 0,
      likes: 0,
      shares: 0,

      // Kategorileme
      tags: newsItem.tags || [],
      featured: false,
      breaking_news: newsItem.priority_id === AAPriority.FLAS,
      urgent: newsItem.priority_id <= AAPriority.MANSET
    };

    return document;
  }

  private mapAACategory(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Gündem',
      2: 'Spor', 
      3: 'Ekonomi',
      4: 'Politika',
      5: 'Dünya',
      6: 'Teknoloji',
      7: 'Kültür',
      8: 'Sağlık',
      // Daha fazla kategori eklenebilir
    };

    return categoryMap[categoryId] || 'Genel';
  }

  private generateSeoUrl(title: string): string {
    return title
      .toLowerCase()
      .replace(/[çğıöşü]/g, (char) => {
        const map: { [key: string]: string } = {
          'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
        };
        return map[char] || char;
      })
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async saveMediaFiles(docId: string, newsItem: AANewsItem): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Fotoğrafları kaydet
      if (newsItem.images) {
        newsItem.images.forEach((imageUrl, index) => {
          const mediaDoc = doc(collection(db, this.collectionName, docId, 'media'));
          batch.set(mediaDoc, {
            type: 'photo',
            url: imageUrl,
            title: `Fotoğraf ${index + 1}`,
            format: 'jpg'
          });
        });
      }

      // Videoları kaydet
      if (newsItem.videos) {
        newsItem.videos.forEach((videoUrl, index) => {
          const mediaDoc = doc(collection(db, this.collectionName, docId, 'media'));
          batch.set(mediaDoc, {
            type: 'video',
            url: videoUrl,
            title: `Video ${index + 1}`,
            format: 'mp4'
          });
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Medya dosyaları kaydetme hatası:', error);
    }
  }

  private async deleteSubCollections(docId: string): Promise<void> {
    try {
      // Media alt koleksiyonunu sil
      const mediaSnapshot = await getDocs(collection(db, this.collectionName, docId, 'media'));
      const batch = writeBatch(db);
      
      mediaSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Alt koleksiyon silme hatası:', error);
    }
  }

  private async updateQuota(count: number = 1): Promise<void> {
    try {
      const quotaRef = doc(db, this.quotaCollectionName, 'current');
      const quotaDoc = await getDoc(quotaRef);
      
      if (quotaDoc.exists()) {
        const currentQuota = quotaDoc.data() as AAQuotaInfo;
        const updatedQuota: Partial<AAQuotaInfo> = {
          used_today: currentQuota.used_today + count,
          remaining: Math.max(0, currentQuota.remaining - count)
        };
        
        await updateDoc(quotaRef, updatedQuota);
      }
    } catch (error) {
      console.error('Kota güncelleme hatası:', error);
    }
  }
}

export const aaNewsFirestoreService = new AANewsFirestoreService();
export default aaNewsFirestoreService;
