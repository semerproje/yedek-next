// Firestore Services for Ultra Premium AA Manager
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { 
  AANewsDocument, 
  AACategoryMapping, 
  AAAutoSchedule, 
  AASystemStats, 
  AAAPILog,
  AISettings 
} from './models';

// Collections
const COLLECTIONS = {
  NEWS: 'aa_news',
  CATEGORIES: 'aa_categories',
  SCHEDULES: 'aa_schedules',
  STATS: 'aa_stats',
  LOGS: 'aa_api_logs',
  AI_SETTINGS: 'ai_settings'
} as const;

// News Service
export class AANewsService {
  static async createNews(newsData: Omit<AANewsDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, COLLECTIONS.NEWS), {
      ...newsData,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      shareCount: 0
    });
    return docRef.id;
  }

  static async updateNews(id: string, updates: Partial<AANewsDocument>): Promise<void> {
    const newsRef = doc(db, COLLECTIONS.NEWS, id);
    await updateDoc(newsRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteNews(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.NEWS, id));
  }

  static async getNews(id: string): Promise<AANewsDocument | null> {
    const docSnap = await getDoc(doc(db, COLLECTIONS.NEWS, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AANewsDocument;
    }
    return null;
  }

  static async getNewsByAAId(aaId: string): Promise<AANewsDocument | null> {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('aa_id', '==', aaId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as AANewsDocument;
    }
    return null;
  }

  static async getAllNews(filters?: {
    category?: string;
    priority?: string;
    status?: string;
    aiEnhanced?: boolean;
    hasPhotos?: boolean;
    limit?: number;
  }): Promise<AANewsDocument[]> {
    let q = query(collection(db, COLLECTIONS.NEWS), orderBy('createdAt', 'desc'));

    if (filters?.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.priority && filters.priority !== 'all') {
      q = query(q, where('priority', '==', filters.priority));
    }
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.aiEnhanced !== undefined) {
      q = query(q, where('aiEnhanced', '==', filters.aiEnhanced));
    }
    if (filters?.hasPhotos !== undefined) {
      q = query(q, where('hasPhotos', '==', filters.hasPhotos));
    }
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AANewsDocument));
  }

  static async incrementViewCount(id: string): Promise<void> {
    const newsRef = doc(db, COLLECTIONS.NEWS, id);
    await updateDoc(newsRef, {
      viewCount: increment(1)
    });
  }

  static async searchNews(searchTerm: string, limitCount = 50): Promise<AANewsDocument[]> {
    // Simple text search - for advanced search, consider using Algolia or similar
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const allNews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AANewsDocument));

    // Client-side filtering for simplicity
    return allNews.filter(news => 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.aa_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (news.content && news.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}

// Category Service
export class AACategoryService {
  static async createMapping(mapping: Omit<AACategoryMapping, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
      ...mapping,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  static async updateMapping(id: string, updates: Partial<AACategoryMapping>): Promise<void> {
    const mappingRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(mappingRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async getAllMappings(): Promise<AACategoryMapping[]> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy('aa_id'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AACategoryMapping));
  }

  static async getMappingByAAId(aaId: number): Promise<AACategoryMapping | null> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), where('aa_id', '==', aaId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as AACategoryMapping;
    }
    return null;
  }

  static async initializeDefaultMappings(): Promise<void> {
    const defaultMappings = [
      { aa_id: 1, aa_name: 'Gündem', site_category: 'gundem', site_name: 'Gündem', active: true, priority: 'manset' as const },
      { aa_id: 2, aa_name: 'Ekonomi', site_category: 'ekonomi', site_name: 'Ekonomi', active: true, priority: 'flas' as const },
      { aa_id: 3, aa_name: 'Spor', site_category: 'spor', site_name: 'Spor', active: true, priority: 'rutin' as const },
      { aa_id: 4, aa_name: 'Teknoloji', site_category: 'teknoloji', site_name: 'Teknoloji', active: true, priority: 'rutin' as const },
      { aa_id: 5, aa_name: 'Sağlık', site_category: 'saglik', site_name: 'Sağlık', active: true, priority: 'rutin' as const },
      { aa_id: 6, aa_name: 'Kültür', site_category: 'kultur', site_name: 'Kültür', active: false, priority: 'rutin' as const },
      { aa_id: 7, aa_name: 'Dünya', site_category: 'dunya', site_name: 'Dünya', active: true, priority: 'acil' as const },
      { aa_id: 8, aa_name: 'Politika', site_category: 'politika', site_name: 'Politika', active: true, priority: 'manset' as const }
    ];

    const batch = writeBatch(db);
    const now = new Date();

    for (const mapping of defaultMappings) {
      const docRef = doc(collection(db, COLLECTIONS.CATEGORIES));
      batch.set(docRef, {
        ...mapping,
        createdAt: now,
        updatedAt: now
      });
    }

    await batch.commit();
  }
}

// Schedule Service
export class AAScheduleService {
  static async createSchedule(schedule: Omit<AAAutoSchedule, 'id' | 'createdAt' | 'updatedAt' | 'totalRuns' | 'totalNewsProcessed' | 'lastRunSuccess'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, COLLECTIONS.SCHEDULES), {
      ...schedule,
      totalRuns: 0,
      totalNewsProcessed: 0,
      lastRunSuccess: true,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  }

  static async updateSchedule(id: string, updates: Partial<AAAutoSchedule>): Promise<void> {
    const scheduleRef = doc(db, COLLECTIONS.SCHEDULES, id);
    await updateDoc(scheduleRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async getSchedule(id: string): Promise<AAAutoSchedule | null> {
    const scheduleDoc = await getDoc(doc(db, COLLECTIONS.SCHEDULES, id));
    if (!scheduleDoc.exists()) {
      return null;
    }
    return {
      id: scheduleDoc.id,
      ...scheduleDoc.data()
    } as AAAutoSchedule;
  }

  static async deleteSchedule(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.SCHEDULES, id));
  }

  static async getAllSchedules(): Promise<AAAutoSchedule[]> {
    const q = query(collection(db, COLLECTIONS.SCHEDULES), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AAAutoSchedule));
  }

  static async getActiveSchedules(): Promise<AAAutoSchedule[]> {
    const q = query(
      collection(db, COLLECTIONS.SCHEDULES), 
      where('enabled', '==', true),
      orderBy('nextRun')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AAAutoSchedule));
  }

  static async updateScheduleStats(id: string, success: boolean, newsProcessed = 0, error?: string): Promise<void> {
    const scheduleRef = doc(db, COLLECTIONS.SCHEDULES, id);
    const now = new Date();
    const nextRun = new Date(now.getTime() + (60 * 1000)); // Default 1 minute for testing
    
    await updateDoc(scheduleRef, {
      lastRun: now,
      nextRun: nextRun,
      totalRuns: increment(1),
      totalNewsProcessed: increment(newsProcessed),
      lastRunSuccess: success,
      lastRunError: error || null,
      updatedAt: now
    });
  }
}

// Stats Service
export class AAStatsService {
  static async getStats(): Promise<AASystemStats> {
    const statsDoc = await getDoc(doc(db, COLLECTIONS.STATS, 'system'));
    if (statsDoc.exists()) {
      return { id: statsDoc.id, ...statsDoc.data() } as AASystemStats;
    }
    
    // Create initial stats if not exists
    const initialStats: Omit<AASystemStats, 'id'> = {
      totalNews: 0,
      publishedNews: 0,
      draftNews: 0,
      scheduledNews: 0,
      archivedNews: 0,
      lastFetch: new Date(),
      totalSchedules: 0,
      activeSchedules: 0,
      aiEnhancedNews: 0,
      totalViewCount: 0,
      avgProcessingTime: 0,
      successRate: 100,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, COLLECTIONS.STATS, 'system'), initialStats);
    return { id: 'system', ...initialStats };
  }

  static async updateStats(updates: Partial<AASystemStats>): Promise<void> {
    const statsRef = doc(db, COLLECTIONS.STATS, 'system');
    await updateDoc(statsRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async recalculateStats(): Promise<void> {
    // Get actual counts from collections
    const [newsSnapshot, schedulesSnapshot] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.NEWS)),
      getDocs(collection(db, COLLECTIONS.SCHEDULES))
    ]);

    const news = newsSnapshot.docs.map(doc => doc.data() as AANewsDocument);
    const schedules = schedulesSnapshot.docs.map(doc => doc.data() as AAAutoSchedule);

    const stats = {
      totalNews: news.length,
      publishedNews: news.filter(n => n.status === 'published').length,
      draftNews: news.filter(n => n.status === 'draft').length,
      scheduledNews: news.filter(n => n.status === 'scheduled').length,
      archivedNews: news.filter(n => n.status === 'archived').length,
      lastFetch: news.length > 0 ? new Date(Math.max(...news.map(n => n.createdAt.getTime()))) : new Date(),
      totalSchedules: schedules.length,
      activeSchedules: schedules.filter(s => s.enabled).length,
      aiEnhancedNews: news.filter(n => n.aiEnhanced).length,
      totalViewCount: news.reduce((sum, n) => sum + (n.viewCount || 0), 0),
      avgProcessingTime: 1200, // Default value
      successRate: 95 // Default value
    };

    await this.updateStats(stats);
  }
}

// API Log Service
export class AAAPILogService {
  static async createLog(logData: Omit<AAAPILog, 'id' | 'timestamp'>): Promise<string> {
    // Filter out undefined values to prevent Firebase errors
    const cleanLogData = Object.entries(logData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const docRef = await addDoc(collection(db, COLLECTIONS.LOGS), {
      ...cleanLogData,
      timestamp: new Date()
    });
    return docRef.id;
  }

  static async getRecentLogs(limitCount = 100): Promise<AAAPILog[]> {
    const q = query(
      collection(db, COLLECTIONS.LOGS), 
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AAAPILog));
  }

  static async getLogsByDateRange(startDate: Date, endDate: Date): Promise<AAAPILog[]> {
    const q = query(
      collection(db, COLLECTIONS.LOGS),
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AAAPILog));
  }

  static async logOperation(operation: {
    operation: string;
    endpoint: string;
    status: 'success' | 'error';
    response_time: number;
    parameters: any;
    result_count?: number;
    error_message?: string;
  }): Promise<string> {
    try {
      const logData: Omit<AAAPILog, 'id' | 'timestamp'> = {
        endpoint: operation.endpoint,
        method: 'POST',
        params: operation.parameters || {},
        responseTime: operation.response_time || 0,
        success: operation.status === 'success',
        error: operation.error_message || undefined,
        newsProcessed: operation.result_count || 0
      };

      return await this.createLog(logData);
    } catch (error) {
      console.error('❌ Error logging operation:', error);
      throw error;
    }
  }
}

// AI Settings Service
export class AISettingsService {
  static async getSettings(): Promise<AISettings> {
    const settingsDoc = await getDoc(doc(db, COLLECTIONS.AI_SETTINGS, 'default'));
    if (settingsDoc.exists()) {
      return { id: settingsDoc.id, ...settingsDoc.data() } as AISettings;
    }
    
    // Create default settings if not exists
    const defaultSettings: Omit<AISettings, 'id'> = {
      geminiApiKey: 'AIzaSyDLgOamVt9EjmPd-W8YJN8DOxquebT_WI0',
      enhanceTitle: true,
      enhanceContent: true,
      generateSummary: true,
      generateTags: true,
      seoOptimization: true,
      autoTranslate: false,
      contentQuality: 'balanced',
      maxTokens: 1000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      updatedAt: new Date()
    };
    
    await updateDoc(doc(db, COLLECTIONS.AI_SETTINGS, 'default'), defaultSettings);
    return { id: 'default', ...defaultSettings };
  }

  static async updateSettings(updates: Partial<AISettings>): Promise<void> {
    const settingsRef = doc(db, COLLECTIONS.AI_SETTINGS, 'default');
    await updateDoc(settingsRef, {
      ...updates,
      updatedAt: new Date()
    });
  }
}

// Real-time listeners
export class AARealtimeService {
  static subscribeToNews(callback: (news: AANewsDocument[]) => void) {
    const q = query(collection(db, COLLECTIONS.NEWS), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AANewsDocument));
      callback(news);
    });
  }

  static subscribeToStats(callback: (stats: AASystemStats) => void) {
    return onSnapshot(doc(db, COLLECTIONS.STATS, 'system'), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as AASystemStats);
      }
    });
  }

  static subscribeToSchedules(callback: (schedules: AAAutoSchedule[]) => void) {
    const q = query(collection(db, COLLECTIONS.SCHEDULES), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const schedules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AAAutoSchedule));
      callback(schedules);
    });
  }
}
