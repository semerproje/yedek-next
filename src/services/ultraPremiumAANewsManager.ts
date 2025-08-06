// Ultra Premium AA News Manager - Complete automation and manual control
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit, writeBatch, getDoc } from 'firebase/firestore';
import ultraPremiumAAService from './ultraPremiumAAService';
import { AANewsItem, AASearchParams } from '@/types/aa-news';
import { categoryMappingService } from './categoryMappingService';

export interface ProcessedNews {
  id: string;
  aa_id: string;
  aa_group_id?: string;
  title: string;
  original_title: string;
  summary: string;
  content: string;
  original_content: string;
  category: string;
  aa_category_id: number;
  author: string;
  source: string;
  publish_date: Date;
  created_at: Date;
  updated_at: Date;
  status: 'draft' | 'published' | 'archived';
  seo_url: string;
  seo_title?: string;
  meta_description?: string;
  tags: string[];
  keywords: string[];
  images: string[];
  videos: string[];
  views: number;
  likes: number;
  featured: boolean;
  breaking_news: boolean;
  urgent: boolean;
  ai_enhanced: boolean;
  duplicate_group?: string;
  original_aa_date: Date;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  processing_errors?: string[];
  // NewsML 2.9 specific fields
  newsmlFormat?: boolean;
  newsmlDocumentId?: string;
  contentType?: 'text' | 'photo' | 'video' | 'document' | 'graphic';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  language?: 'tr' | 'en' | 'ar';
}

export interface AutoFetchSchedule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  categories: number[];
  fetch_interval_minutes: number;
  max_news_per_fetch: number;
  auto_publish: boolean;
  ai_enhancement: boolean;
  image_search: boolean;
  duplicate_detection: boolean;
  filters: {
    priority: number[];
    types: number[];
    keywords?: string;
    exclude_keywords?: string;
  };
  last_run?: Date;
  next_run?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DuplicateGroup {
  id: string;
  title_similarity: number;
  content_similarity: number;
  news_ids: string[];
  master_news_id: string;
  created_at: Date;
}

class UltraPremiumAANewsManager {
  private newsCollection = 'processed_news';
  private scheduleCollection = 'auto_fetch_schedules';
  private duplicateCollection = 'duplicate_groups';

  // Get single news by ID
  async getNewsById(id: string): Promise<ProcessedNews | null> {
    try {
      const newsDoc = await getDocs(query(
        collection(db, this.newsCollection),
        where('id', '==', id)
      ));
      
      if (!newsDoc.empty) {
        const data = newsDoc.docs[0].data();
        return {
          ...data,
          created_at: data.created_at?.toDate(),
          updated_at: data.updated_at?.toDate(),
          publish_date: data.publish_date?.toDate(),
          original_aa_date: data.original_aa_date?.toDate()
        } as ProcessedNews;
      }
      
      return null;
    } catch (error) {
      console.error('Get news by ID error:', error);
      return null;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const allNews = await this.getAllNews({ limit: 10000 });
      const published = allNews.filter(n => n.status === 'published');
      const draft = allNews.filter(n => n.status === 'draft');
      const lastFetch = allNews.length > 0 ? 
        Math.max(...allNews.map(n => n.created_at.getTime())) : 
        Date.now();

      return {
        total_news: allNews.length,
        published_news: published.length,
        draft_news: draft.length,
        last_fetch: new Date(lastFetch).toISOString()
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {
        total_news: 0,
        published_news: 0,
        draft_news: 0,
        last_fetch: new Date().toISOString()
      };
    }
  }

  // Manual fetch with full control
  async manualFetch(params: {
    categories?: number[];
    keywords?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    auto_process?: boolean;
    auto_publish?: boolean;
  }): Promise<{ success: boolean; fetched: number; processed: number; errors: string[] }> {
    const result = {
      success: false,
      fetched: 0,
      processed: 0,
      errors: [] as string[]
    };

    try {
      console.log('🚀 Manual AA fetch started', params);

      // Get category mappings for filtering
      const mappings = await categoryMappingService.getActiveMappings();
      const aaCategories = params.categories || mappings.map(m => m.aa_id);

      // Prepare search parameters
      const searchParams: AASearchParams = {
        filter_category: aaCategories,
        search_string: params.keywords,
        start_date: params.start_date,
        end_date: params.end_date || 'NOW',
        limit: params.limit || 50,
        filter_type: [1], // Text news only
        filter_language: [1] // Turkish only
      };

      // Fetch from AA API
      const searchResult = await ultraPremiumAAService.search(searchParams);
      
      if (!searchResult?.data.result) {
        result.errors.push('AA API\'den veri alınamadı');
        return result;
      }

      result.fetched = searchResult.data.result.length;
      console.log(`📥 ${result.fetched} haber AA API'den alındı`);

      // Process each news item
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const aaNews of searchResult.data.result) {
        try {
          // Check if already exists
          const exists = await this.checkNewsExists(aaNews.id);
          if (exists) {
            console.log(`⏭️ Haber zaten mevcut: ${aaNews.id}`);
            continue;
          }

          // Process the news
          let processedNews = await this.processAANews(aaNews);
          
          if (params.auto_process) {
            processedNews = await this.enhanceWithAI(processedNews);
          }

          if (params.auto_publish) {
            processedNews.status = 'published';
          }

          // Add to batch
          const newsRef = doc(db, this.newsCollection, processedNews.id);
          batch.set(newsRef, processedNews);
          batchCount++;

          // Commit batch every 500 operations (Firestore limit)
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }

          result.processed++;
        } catch (error) {
          result.errors.push(`Haber işleme hatası (${aaNews.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
      }

      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
      }

      // Detect and merge duplicates
      if (result.processed > 0) {
        await this.detectAndMergeDuplicates();
      }

      result.success = true;
      console.log(`✅ Manual fetch completed: ${result.processed}/${result.fetched} processed`);

    } catch (error) {
      result.errors.push(`Manual fetch error: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      console.error('Manual fetch error:', error);
    }

    return result;
  }

  // Auto fetch with schedules
  async runAutoFetch(): Promise<{ success: boolean; schedules_run: number; total_processed: number; errors: string[] }> {
    const result = {
      success: false,
      schedules_run: 0,
      total_processed: 0,
      errors: [] as string[]
    };

    try {
      console.log('🤖 Auto fetch started');

      // Get active schedules
      const schedules = await this.getActiveSchedules();
      
      for (const schedule of schedules) {
        try {
          // Check if it's time to run
          if (!this.shouldRunSchedule(schedule)) {
            continue;
          }

          console.log(`⏰ Running schedule: ${schedule.name}`);

          // Run the fetch
          const fetchResult = await this.manualFetch({
            categories: schedule.categories,
            limit: schedule.max_news_per_fetch,
            auto_process: schedule.ai_enhancement,
            auto_publish: schedule.auto_publish,
            keywords: schedule.filters.keywords
          });

          result.total_processed += fetchResult.processed;
          result.schedules_run++;

          // Update schedule
          await this.updateScheduleLastRun(schedule.id);

          if (fetchResult.errors.length > 0) {
            result.errors.push(`Schedule ${schedule.name}: ${fetchResult.errors.join(', ')}`);
          }

        } catch (error) {
          result.errors.push(`Schedule error (${schedule.name}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
      }

      result.success = true;
      console.log(`✅ Auto fetch completed: ${result.schedules_run} schedules, ${result.total_processed} news processed`);

    } catch (error) {
      result.errors.push(`Auto fetch error: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      console.error('Auto fetch error:', error);
    }

    return result;
  }

  // Process AA news item to our format
  private async processAANews(aaNews: AANewsItem): Promise<ProcessedNews> {
    // Get site category mapping
    const siteCategory = await categoryMappingService.getSiteCategoryByAAId(aaNews.category_id) || 'gundem';
    
    // Generate SEO URL
    const seoUrl = this.generateSeoUrl(aaNews.title);
    
    // Parse date
    const publishDate = new Date(aaNews.date);
    const now = new Date();

    return {
      id: `aa_${aaNews.id}_${Date.now()}`,
      aa_id: aaNews.id,
      aa_group_id: aaNews.group_id,
      title: aaNews.title,
      original_title: aaNews.title,
      summary: aaNews.summary || aaNews.title,
      content: aaNews.content || aaNews.summary || aaNews.title,
      original_content: aaNews.content || aaNews.summary || aaNews.title,
      category: siteCategory,
      aa_category_id: aaNews.category_id,
      author: 'Anadolu Ajansı',
      source: 'AA',
      publish_date: publishDate,
      created_at: now,
      updated_at: now,
      status: 'draft',
      seo_url: seoUrl,
      tags: aaNews.tags || [],
      keywords: [],
      images: aaNews.images || [],
      videos: aaNews.videos || [],
      views: 0,
      likes: 0,
      featured: false,
      breaking_news: aaNews.priority_id <= 2, // High priority = breaking news
      urgent: aaNews.priority_id === 1, // Highest priority = urgent
      ai_enhanced: false,
      original_aa_date: publishDate,
      processing_status: 'pending'
    };
  }

  // Enhance news with AI
  private async enhanceWithAI(news: ProcessedNews): Promise<ProcessedNews> {
    try {
      console.log(`🤖 AI enhancing: ${news.title}`);
      
      const enhanced = await ultraPremiumAAService.processNewsWithAI({
        id: news.aa_id,
        title: news.title,
        summary: news.summary,
        content: news.content,
        type: 1,
        date: news.publish_date.toISOString(),
        category_id: news.aa_category_id,
        priority_id: news.urgent ? 1 : 2,
        language_id: 1,
        provider_id: 1
      });

      return {
        ...news,
        title: enhanced.title || news.title,
        summary: enhanced.summary || news.summary,
        content: enhanced.content || news.content,
        seo_url: enhanced.seo_url || news.seo_url,
        tags: enhanced.tags || news.tags,
        images: enhanced.images || news.images,
        ai_enhanced: true,
        processing_status: 'completed',
        updated_at: new Date()
      };
    } catch (error) {
      console.error('AI enhancement error:', error);
      return {
        ...news,
        processing_status: 'failed',
        processing_errors: [error instanceof Error ? error.message : 'AI enhancement failed']
      };
    }
  }

  // Detect and merge duplicates
  async detectAndMergeDuplicates(): Promise<{ duplicates_found: number; groups_created: number }> {
    try {
      console.log('🔍 Detecting duplicates...');
      
      // Get recent news for duplicate detection
      const newsRef = collection(db, this.newsCollection);
      const q = query(
        newsRef, 
        where('created_at', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const newsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcessedNews));

      let duplicatesFound = 0;
      let groupsCreated = 0;
      const processedIds = new Set<string>();

      // Compare each news with others
      for (let i = 0; i < newsList.length; i++) {
        if (processedIds.has(newsList[i].id)) continue;

        const duplicates = [newsList[i].id];
        
        for (let j = i + 1; j < newsList.length; j++) {
          if (processedIds.has(newsList[j].id)) continue;

          const similarity = this.calculateSimilarity(newsList[i], newsList[j]);
          
          if (similarity > 0.8) { // 80% similarity threshold
            duplicates.push(newsList[j].id);
            processedIds.add(newsList[j].id);
            duplicatesFound++;
          }
        }

        if (duplicates.length > 1) {
          // Create duplicate group
          await this.createDuplicateGroup(duplicates, newsList[i].id);
          groupsCreated++;
        }

        processedIds.add(newsList[i].id);
      }

      console.log(`✅ Duplicate detection completed: ${duplicatesFound} duplicates, ${groupsCreated} groups`);
      return { duplicates_found: duplicatesFound, groups_created: groupsCreated };

    } catch (error) {
      console.error('Duplicate detection error:', error);
      return { duplicates_found: 0, groups_created: 0 };
    }
  }

  // Calculate similarity between two news items
  private calculateSimilarity(news1: ProcessedNews, news2: ProcessedNews): number {
    // Simple similarity calculation based on title and content
    const titleSimilarity = this.stringSimilarity(news1.title, news2.title);
    const contentSimilarity = this.stringSimilarity(news1.content.substring(0, 500), news2.content.substring(0, 500));
    
    return (titleSimilarity * 0.7) + (contentSimilarity * 0.3);
  }

  // String similarity calculation (Jaccard similarity)
  private stringSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // Create duplicate group
  private async createDuplicateGroup(newsIds: string[], masterNewsId: string): Promise<void> {
    try {
      const groupId = `dup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const duplicateGroup: DuplicateGroup = {
        id: groupId,
        title_similarity: 0.8, // Simplified
        content_similarity: 0.8, // Simplified
        news_ids: newsIds,
        master_news_id: masterNewsId,
        created_at: new Date()
      };

      await setDoc(doc(db, this.duplicateCollection, groupId), duplicateGroup);

      // Update news items with duplicate group reference
      const batch = writeBatch(db);
      for (const newsId of newsIds) {
        if (newsId !== masterNewsId) {
          const newsRef = doc(db, this.newsCollection, newsId);
          batch.update(newsRef, { 
            duplicate_group: groupId,
            status: 'archived' // Archive duplicates
          });
        }
      }
      await batch.commit();

    } catch (error) {
      console.error('Create duplicate group error:', error);
    }
  }

  // Mapping methods for AA data to NewsML 2.9
  private mapAACategory(categoryId: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'genel',
      2: 'politika', 
      3: 'ekonomi',
      4: 'spor',
      5: 'teknoloji',
      6: 'saglik',
      7: 'egitim',
      8: 'kultur',
      9: 'cevre',
      10: 'ulasim',
      11: 'turizm',
      12: 'tarim',
      13: 'enerji',
      14: 'adalet',
      15: 'gundem'
    };
    return categoryMap[categoryId] || 'gundem';
  }

  private mapAAPriority(priorityId: number): 'urgent' | 'high' | 'normal' | 'low' {
    const priorityMap: { [key: number]: 'urgent' | 'high' | 'normal' | 'low' } = {
      1: 'urgent',
      2: 'high', 
      3: 'normal',
      4: 'low'
    };
    return priorityMap[priorityId] || 'normal';
  }

  private mapAALanguage(languageId: number): 'tr' | 'en' | 'ar' {
    const languageMap: { [key: number]: 'tr' | 'en' | 'ar' } = {
      1: 'tr', // Turkish
      2: 'en', // English
      3: 'ar'  // Arabic
    };
    return languageMap[languageId] || 'tr';
  }

  private mapAAContentType(typeId: number): 'text' | 'photo' | 'video' | 'document' | 'graphic' {
    const typeMap: { [key: number]: 'text' | 'photo' | 'video' | 'document' | 'graphic' } = {
      1: 'text',
      2: 'photo',
      3: 'video', 
      4: 'document',
      5: 'graphic'
    };
    return typeMap[typeId] || 'text';
  }

  // Utility methods
  private generateSeoUrl(title: string): string {
    return title
      .toLowerCase()
      .replace(/[şÇüğıöÖÜĞİŞÇ]/g, (char) => {
        const map: { [key: string]: string } = {
          'ş': 's', 'Ş': 's', 'ç': 'c', 'Ç': 'c',
          'ü': 'u', 'Ü': 'u', 'ğ': 'g', 'Ğ': 'g',
          'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async checkNewsExists(aaId: string): Promise<boolean> {
    try {
      const newsRef = collection(db, this.newsCollection);
      const q = query(newsRef, where('aa_id', '==', aaId), limit(1));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Check news exists error:', error);
      return false;
    }
  }

  private async getActiveSchedules(): Promise<AutoFetchSchedule[]> {
    try {
      const schedulesRef = collection(db, this.scheduleCollection);
      const q = query(schedulesRef, where('active', '==', true));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AutoFetchSchedule));
    } catch (error) {
      console.error('Get active schedules error:', error);
      return [];
    }
  }

  private shouldRunSchedule(schedule: AutoFetchSchedule): boolean {
    if (!schedule.last_run) return true;
    
    const now = new Date();
    const lastRun = schedule.last_run instanceof Date ? schedule.last_run : new Date(schedule.last_run);
    const intervalMs = schedule.fetch_interval_minutes * 60 * 1000;
    
    return (now.getTime() - lastRun.getTime()) >= intervalMs;
  }

  private async updateScheduleLastRun(scheduleId: string): Promise<void> {
    try {
      const scheduleRef = doc(db, this.scheduleCollection, scheduleId);
      await setDoc(scheduleRef, { 
        last_run: new Date(),
        next_run: new Date(Date.now() + (30 * 60 * 1000)) // Next run in 30 minutes (default)
      }, { merge: true });
    } catch (error) {
      console.error('Update schedule last run error:', error);
    }
  }

  // Public methods for admin interface
  async getAllNews(params: { limit?: number; category?: string; status?: string } = {}): Promise<ProcessedNews[]> {
    try {
      const newsRef = collection(db, this.newsCollection);
      let q = query(newsRef, orderBy('created_at', 'desc'));
      
      if (params.category) {
        q = query(newsRef, where('category', '==', params.category), orderBy('created_at', 'desc'));
      }
      
      if (params.status) {
        q = query(newsRef, where('status', '==', params.status), orderBy('created_at', 'desc'));
      }
      
      if (params.limit) {
        q = query(q, limit(params.limit));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcessedNews));
    } catch (error) {
      console.error('Get all news error:', error);
      return [];
    }
  }

  async updateNewsStatus(newsId: string, status: 'draft' | 'published' | 'archived'): Promise<void> {
    try {
      const newsRef = doc(db, this.newsCollection, newsId);
      await setDoc(newsRef, { 
        status, 
        updated_at: new Date() 
      }, { merge: true });
    } catch (error) {
      console.error('Update news status error:', error);
      throw error;
    }
  }

  async deleteNews(newsId: string): Promise<void> {
    try {
      const newsRef = doc(db, this.newsCollection, newsId);
      await deleteDoc(newsRef);
    } catch (error) {
      console.error('Delete news error:', error);
      throw error;
    }
  }

  // Bulk publish multiple news
  async bulkPublish(newsIds: string[]): Promise<{success: number, failed: number, errors: string[]}> {
    const result = { success: 0, failed: 0, errors: [] as string[] };
    
    const batch = writeBatch(db);
    
    for (const newsId of newsIds) {
      try {
        const newsRef = doc(db, this.newsCollection, newsId);
        batch.update(newsRef, {
          status: 'published',
          updated_at: new Date()
        });
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to publish ${newsId}: ${error}`);
      }
    }
    
    try {
      await batch.commit();
      console.log(`✅ Bulk published ${result.success} news items`);
    } catch (error) {
      console.error('❌ Bulk publish batch failed:', error);
      result.errors.push(`Batch commit failed: ${error}`);
    }
    
    return result;
  }

  // Process news with AI
  async processWithAI(newsId: string): Promise<ProcessedNews | null> {
    try {
      const news = await this.getNewsById(newsId);
      if (!news) {
        throw new Error('News not found');
      }

      // Mark as processing
      await this.updateNewsStatus(newsId, 'processing' as any);

      // Use AI service to enhance
      const enhanced = await ultraPremiumAAService.enhanceWithGemini({
        id: news.id,
        title: news.title,
        content: news.content,
        summary: news.summary,
        type: 1,
        date: news.original_aa_date.toISOString(),
        category_id: news.aa_category_id,
        priority_id: 1,
        language_id: 1,
        provider_id: 1
      });

      if (enhanced) {
        // Update with AI enhanced content
        const updates = {
          title: enhanced.title || news.title,
          content: enhanced.content || news.content,
          summary: enhanced.summary || news.summary,
          seo_title: enhanced.seo_title || enhanced.title,
          meta_description: enhanced.meta_description || enhanced.summary,
          tags: [...(news.tags || []), ...(enhanced.tags || [])],
          keywords: [...(news.keywords || []), ...(enhanced.keywords || [])],
          ai_enhanced: true,
          processing_status: 'completed',
          updated_at: new Date()
        };

        const newsRef = doc(db, this.newsCollection, newsId);
        await setDoc(newsRef, updates, { merge: true });

        return { ...news, ...updates } as ProcessedNews;
      }

      return news;
    } catch (error) {
      console.error('❌ AI processing failed:', error);
      await this.updateNewsStatus(newsId, 'failed' as any);
      throw error;
    }
  }

  // Find duplicate news
  async findDuplicates(): Promise<DuplicateGroup[]> {
    try {
      const newsSnapshot = await getDocs(collection(db, this.newsCollection));
      const allNews = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcessedNews));
      
      const duplicateGroups: DuplicateGroup[] = [];
      const processed = new Set<string>();

      for (let i = 0; i < allNews.length; i++) {
        if (processed.has(allNews[i].id)) continue;

        const currentNews = allNews[i];
        const duplicates = [currentNews.id];

        for (let j = i + 1; j < allNews.length; j++) {
          if (processed.has(allNews[j].id)) continue;

          const otherNews = allNews[j];
          const similarity = this.stringSimilarity(currentNews.title, otherNews.title);

          if (similarity > 0.8) { // 80% similarity threshold
            duplicates.push(otherNews.id);
            processed.add(otherNews.id);
          }
        }

        if (duplicates.length > 1) {
          const duplicateGroup: DuplicateGroup = {
            id: `dup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title_similarity: 0.8,
            content_similarity: 0.8,
            news_ids: duplicates,
            master_news_id: duplicates[0],
            created_at: new Date()
          };

          duplicateGroups.push(duplicateGroup);
          
          // Save to database
          await setDoc(doc(db, this.duplicateCollection, duplicateGroup.id), duplicateGroup);
        }

        processed.add(currentNews.id);
      }

      return duplicateGroups;
    } catch (error) {
      console.error('❌ Duplicate detection failed:', error);
      throw error;
    }
  }

  // Update news
  async updateNews(newsId: string, updates: Partial<ProcessedNews>): Promise<ProcessedNews | null> {
    try {
      const newsRef = doc(db, this.newsCollection, newsId);
      
      const updateData = {
        ...updates,
        updated_at: new Date()
      };

      await setDoc(newsRef, updateData, { merge: true });
      
      return await this.getNewsById(newsId);
    } catch (error) {
      console.error('❌ News update failed:', error);
      throw error;
    }
  }

  // Duplicate News Management
  async mergeDuplicateNews(duplicateIds: string[]): Promise<{ success: boolean; merged: number }> {
    try {
      const batch = writeBatch(db);
      let merged = 0;

      // Keep the first ID, delete the rest
      const [keepId, ...deleteIds] = duplicateIds;

      for (const deleteId of deleteIds) {
        const docRef = doc(db, 'processed_news', deleteId);
        batch.delete(docRef);
        merged++;
      }

      await batch.commit();

      return { success: true, merged };
    } catch (error) {
      console.error('Merge duplicate news error:', error);
      throw error;
    }
  }

  // Google News Validation
  async validateGoogleNews(newsData: any[]): Promise<{
    valid: any[];
    invalid: { news: any; reasons: string[] }[];
  }> {
    const valid: any[] = [];
    const invalid: { news: any; reasons: string[] }[] = [];

    for (const news of newsData) {
      const reasons: string[] = [];

      // Title validation
      if (!news.title || news.title.length < 10) {
        reasons.push('Title too short (min 10 characters)');
      }
      if (news.title && news.title.length > 100) {
        reasons.push('Title too long (max 100 characters)');
      }

      // Content validation
      if (!news.content || news.content.length < 100) {
        reasons.push('Content too short (min 100 characters)');
      }

      // Date validation
      if (!news.publish_date) {
        reasons.push('Publish date missing');
      }

      // Image validation
      if (!news.images || news.images.length === 0) {
        reasons.push('No images found');
      }

      if (reasons.length === 0) {
        valid.push(news);
      } else {
        invalid.push({ news, reasons });
      }
    }

    return { valid, invalid };
  }

  // Schedule Execution
  async runSchedule(scheduleId: string): Promise<{ success: boolean; message: string; processed?: number }> {
    try {
      // Get schedule details
      const scheduleRef = doc(db, 'auto_fetch_schedules', scheduleId);
      const scheduleDoc = await getDoc(scheduleRef);

      if (!scheduleDoc.exists()) {
        return { success: false, message: 'Schedule not found' };
      }

      const schedule = scheduleDoc.data() as AutoFetchSchedule;

      if (!schedule.active) {
        return { success: false, message: 'Schedule is inactive' };
      }

      // Run manual fetch with schedule parameters
      const fetchResult = await this.manualFetch({
        categories: schedule.categories,
        limit: 50,
        auto_process: true,
        auto_publish: schedule.auto_publish
      });

      // Update schedule last run time
      await setDoc(scheduleRef, {
        ...schedule,
        last_run: new Date()
      }, { merge: true });

      return {
        success: true,
        message: `Schedule executed successfully`,
        processed: fetchResult.processed
      };
    } catch (error) {
      console.error('Run schedule error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Schedule execution failed'
      };
    }
  }

}

export const ultraPremiumAANewsManager = new UltraPremiumAANewsManager();
export default ultraPremiumAANewsManager;
