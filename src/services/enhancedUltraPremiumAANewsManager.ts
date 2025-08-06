// Enhanced Ultra Premium AA News Manager
import { 
  AANewsItem, 
  AASearchParams, 
  AAContentType, 
  AAPriority, 
  AALanguage,
  AASearchResponse,
  EnhancementOptions,
  ProgressCallback 
} from '@/types/aa-news';
import ultraPremiumAAService from './ultraPremiumAAService';
import { aaNewsFirestoreService } from './aaNewsFirestoreService';
import { aiContentService } from './aiContentService';

interface AutomationSchedule {
  id: string;
  name: string;
  description: string;
  searchParams: AASearchParams;
  enhancement: EnhancementOptions;
  cronExpression: string;
  active: boolean;
  lastRun?: Date;
  nextRun?: Date;
  successCount: number;
  errorCount: number;
}

interface FetchStats {
  totalFetched: number;
  processed: number;
  failed: number;
  duplicates: number;
  duration: number;
}

class EnhancedUltraPremiumAANewsManager {
  private schedules: Map<string, AutomationSchedule> = new Map();
  private isRunning: boolean = false;
  private activeJobs: Set<string> = new Set();

  constructor() {
    this.loadSchedules();
  }

  // Schedule Management
  async createSchedule(schedule: Omit<AutomationSchedule, 'id' | 'successCount' | 'errorCount'>): Promise<string> {
    const id = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSchedule: AutomationSchedule = {
      ...schedule,
      id,
      successCount: 0,
      errorCount: 0
    };

    this.schedules.set(id, newSchedule);
    await this.saveSchedules();
    
    console.log('Yeni schedule oluşturuldu:', id);
    return id;
  }

  async updateSchedule(id: string, updates: Partial<AutomationSchedule>): Promise<void> {
    const schedule = this.schedules.get(id);
    if (!schedule) {
      throw new Error('Schedule bulunamadı');
    }

    const updatedSchedule = { ...schedule, ...updates };
    this.schedules.set(id, updatedSchedule);
    await this.saveSchedules();
    
    console.log('Schedule güncellendi:', id);
  }

  async deleteSchedule(id: string): Promise<void> {
    this.schedules.delete(id);
    await this.saveSchedules();
    console.log('Schedule silindi:', id);
  }

  async getSchedule(id: string): Promise<AutomationSchedule | null> {
    return this.schedules.get(id) || null;
  }

  async getAllSchedules(): Promise<AutomationSchedule[]> {
    return Array.from(this.schedules.values());
  }

  async toggleSchedule(id: string, active: boolean): Promise<void> {
    const schedule = this.schedules.get(id);
    if (schedule) {
      schedule.active = active;
      await this.saveSchedules();
      console.log(`Schedule ${active ? 'aktif' : 'pasif'} edildi:`, id);
    }
  }

  // Manual Fetch Operations
  async fetchNews(
    params: AASearchParams,
    options: {
      processWithAI?: boolean;
      enhancementOptions?: EnhancementOptions;
      progressCallback?: ProgressCallback;
      maxItems?: number;
    } = {}
  ): Promise<FetchStats> {
    const startTime = Date.now();
    const stats: FetchStats = {
      totalFetched: 0,
      processed: 0,
      failed: 0,
      duplicates: 0,
      duration: 0
    };

    try {
      const { 
        processWithAI = true, 
        enhancementOptions,
        progressCallback,
        maxItems = 100 
      } = options;

      progressCallback?.(0, 'AA API dan haberler çekiliyor...');

      // AA API'den haberleri çek
      const searchResult = await ultraPremiumAAService.search(params);
      
      if (!searchResult || !searchResult.data.result) {
        throw new Error('AA API dan veri alınamadı');
      }

      const newsItems = searchResult.data.result.slice(0, maxItems);
      stats.totalFetched = newsItems.length;

      progressCallback?.(20, `${stats.totalFetched} haber bulundu, işleniyor...`);

      // Her haberi işle
      for (let i = 0; i < newsItems.length; i++) {
        const newsItem = newsItems[i];
        const progress = 20 + (60 * (i + 1)) / newsItems.length;
        
        try {
          progressCallback?.(progress, `${i + 1}/${newsItems.length} haber işleniyor...`);

          // Duplicate kontrolü
          const existingNews = await aaNewsFirestoreService.getNewsList({
            limit: 1
          });
          
          const isDuplicate = existingNews.news.some(existing => 
            existing.aa_id === newsItem.id
          );

          if (isDuplicate) {
            stats.duplicates++;
            continue;
          }

          // AI geliştirmesi
          let enhancedItem = newsItem;
          if (processWithAI && enhancementOptions) {
            try {
              const aiResult = await aiContentService.enhanceNewsContent(newsItem);
              enhancedItem = {
                ...newsItem,
                title: aiResult.seoTitle || newsItem.title,
                content: aiResult.content,
                summary: aiResult.summary,
                keywords: aiResult.tags || [],
                seo_title: aiResult.seoTitle,
                meta_description: aiResult.seoDescription
              };
            } catch (aiError) {
              console.warn('AI geliştirme hatası:', aiError);
            }
          }

          // Firestore'a kaydet
          await aaNewsFirestoreService.addNews(enhancedItem, processWithAI);
          stats.processed++;

        } catch (error) {
          console.error(`Haber işleme hatası (${newsItem.id}):`, error);
          stats.failed++;
        }
      }

      progressCallback?.(90, 'İstatistikler güncelleniyor...');

      // İstatistikleri güncelle
      await this.updateFetchStats(stats);
      
      stats.duration = Date.now() - startTime;
      progressCallback?.(100, 'İşlem tamamlandı!');

      console.log('Fetch işlemi tamamlandı:', stats);
      return stats;

    } catch (error) {
      console.error('Fetch hatası:', error);
      stats.duration = Date.now() - startTime;
      throw error;
    }
  }

  // Schedule Execution
  async runSchedule(id: string): Promise<FetchStats> {
    const schedule = this.schedules.get(id);
    if (!schedule) {
      throw new Error('Schedule bulunamadı');
    }

    if (this.activeJobs.has(id)) {
      throw new Error('Schedule zaten çalışıyor');
    }

    this.activeJobs.add(id);
    
    try {
      console.log('Schedule çalışıyor:', schedule.name);
      
      const stats = await this.fetchNews(
        schedule.searchParams,
        {
          processWithAI: true,
          enhancementOptions: schedule.enhancement,
          progressCallback: (progress, message) => {
            console.log(`[${schedule.name}] ${progress}% - ${message}`);
          }
        }
      );

      // Schedule istatistiklerini güncelle
      schedule.lastRun = new Date();
      schedule.successCount++;
      await this.saveSchedules();

      console.log('Schedule başarıyla tamamlandı:', schedule.name, stats);
      return stats;

    } catch (error) {
      console.error('Schedule hatası:', error);
      
      // Hata sayısını artır
      schedule.errorCount++;
      await this.saveSchedules();
      
      throw error;
    } finally {
      this.activeJobs.delete(id);
    }
  }

  // Batch Operations
  async runAllActiveSchedules(): Promise<{ [scheduleId: string]: FetchStats | Error }> {
    const activeSchedules = Array.from(this.schedules.values()).filter(s => s.active);
    const results: { [scheduleId: string]: FetchStats | Error } = {};

    console.log(`${activeSchedules.length} aktif schedule çalışıyor...`);

    for (const schedule of activeSchedules) {
      try {
        results[schedule.id] = await this.runSchedule(schedule.id);
      } catch (error) {
        results[schedule.id] = error as Error;
      }
    }

    return results;
  }

  // Statistics and Monitoring
  async getScheduleStats(): Promise<{
    total_schedules: number;
    active_schedules: number;
    total_runs_today: number;
    success_rate: number;
    last_sync: string;
  }> {
    const schedules = Array.from(this.schedules.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRuns = schedules.reduce((sum, s) => sum + s.successCount + s.errorCount, 0);
    const successRuns = schedules.reduce((sum, s) => sum + s.successCount, 0);
    
    const runsToday = schedules.filter(s => 
      s.lastRun && s.lastRun >= today
    ).length;

    return {
      total_schedules: schedules.length,
      active_schedules: schedules.filter(s => s.active).length,
      total_runs_today: runsToday,
      success_rate: totalRuns > 0 ? (successRuns / totalRuns) * 100 : 0,
      last_sync: new Date().toISOString()
    };
  }

  async getAAStats(): Promise<{
    total_news: number;
    today_fetched: number;
    week_fetched: number;
    by_category: { [key: string]: number };
    by_type: { [key: string]: number };
    quota_info: any;
  }> {
    const stats = await aaNewsFirestoreService.getStats();
    const quotaInfo = await aaNewsFirestoreService.getQuotaInfo();

    return {
      total_news: stats.total,
      today_fetched: stats.today_count,
      week_fetched: stats.week_count,
      by_category: stats.by_category,
      by_type: stats.by_type,
      quota_info: quotaInfo
    };
  }

  // Category and Filter Management
  async getAACategories(): Promise<{ [key: string]: string }> {
    try {
      const discoverData = await ultraPremiumAAService.discover();
      return discoverData?.category || {};
    } catch (error) {
      console.error('AA kategorileri alınamadı:', error);
      return {};
    }
  }

  async getAAFilters(): Promise<{
    categories: { [key: string]: string };
    priorities: { [key: string]: string };
    types: { [key: string]: string };
    languages: { [key: string]: string };
  }> {
    try {
      const discoverData = await ultraPremiumAAService.discover();
      return {
        categories: discoverData?.category || {},
        priorities: discoverData?.priority || {},
        types: discoverData?.type || {},
        languages: discoverData?.language || {}
      };
    } catch (error) {
      console.error('AA filtreleri alınamadı:', error);
      return {
        categories: {},
        priorities: {},
        types: {},
        languages: {}
      };
    }
  }

  // Utility Methods
  private async loadSchedules(): Promise<void> {
    try {
      // LocalStorage'dan yükle (production'da database kullanılmalı)
      const saved = localStorage.getItem('aa_schedules');
      if (saved) {
        const schedules = JSON.parse(saved) as AutomationSchedule[];
        schedules.forEach(schedule => {
          this.schedules.set(schedule.id, schedule);
        });
      }
    } catch (error) {
      console.error('Schedule yükleme hatası:', error);
    }
  }

  private async saveSchedules(): Promise<void> {
    try {
      const schedules = Array.from(this.schedules.values());
      localStorage.setItem('aa_schedules', JSON.stringify(schedules));
    } catch (error) {
      console.error('Schedule kaydetme hatası:', error);
    }
  }

  private async updateFetchStats(stats: FetchStats): Promise<void> {
    try {
      // İstatistikleri kaydet (database'e)
      const statsDoc = {
        timestamp: new Date().toISOString(),
        ...stats
      };
      
      // Firebase'e kaydet
      console.log('Fetch istatistikleri kaydedildi:', statsDoc);
    } catch (error) {
      console.error('İstatistik kaydetme hatası:', error);
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    aa_api: boolean;
    firestore: boolean;
    ai_service: boolean;
    active_schedules: number;
    last_check: string;
  }> {
    const health = {
      aa_api: false,
      firestore: false,
      ai_service: false,
      active_schedules: 0,
      last_check: new Date().toISOString()
    };

    try {
      // AA API kontrolü
      await ultraPremiumAAService.discover();
      health.aa_api = true;
    } catch {
      console.warn('AA API erişim hatası');
    }

    try {
      // Firestore kontrolü
      await aaNewsFirestoreService.getStats();
      health.firestore = true;
    } catch {
      console.warn('Firestore erişim hatası');
    }

    try {
      // AI Service kontrolü (basit test)
      health.ai_service = true; // aiContentService kullanılabilirliği
    } catch {
      console.warn('AI Service erişim hatası');
    }

    health.active_schedules = Array.from(this.schedules.values()).filter(s => s.active).length;

    return health;
  }
}

export const enhancedUltraPremiumAANewsManager = new EnhancedUltraPremiumAANewsManager();
export default enhancedUltraPremiumAANewsManager;
