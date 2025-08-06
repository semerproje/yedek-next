// Ultra Premium Homepage Module Firestore Services
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
import { db } from '../firebase/config';
import { HomepageModule, News } from '@/types/homepage';

// Collections
const COLLECTIONS = {
  HOMEPAGE_MODULES: 'homepage_modules',
  NEWS: 'news',
  CATEGORIES: 'categories',
  USERS: 'users',
  ANALYTICS: 'analytics'
} as const;

// Homepage Module Service
export class HomepageModuleService {
  static async createModule(moduleData: Omit<HomepageModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, COLLECTIONS.HOMEPAGE_MODULES), {
      ...moduleData,
      createdAt: now,
      updatedAt: now,
      lastUpdated: now
    });
    return docRef.id;
  }

  static async updateModule(id: string, updates: Partial<HomepageModule>): Promise<void> {
    const moduleRef = doc(db, COLLECTIONS.HOMEPAGE_MODULES, id);
    await updateDoc(moduleRef, {
      ...updates,
      updatedAt: new Date(),
      lastUpdated: new Date()
    });
  }

  static async deleteModule(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.HOMEPAGE_MODULES, id));
  }

  static async getModule(id: string): Promise<HomepageModule | null> {
    const docSnap = await getDoc(doc(db, COLLECTIONS.HOMEPAGE_MODULES, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as HomepageModule;
    }
    return null;
  }

  static async getAllModules(): Promise<HomepageModule[]> {
    const q = query(collection(db, COLLECTIONS.HOMEPAGE_MODULES), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HomepageModule));
  }

  static async getActiveModules(): Promise<HomepageModule[]> {
    const q = query(
      collection(db, COLLECTIONS.HOMEPAGE_MODULES), 
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HomepageModule));
  }

  static async getModulesByType(moduleType: string): Promise<HomepageModule[]> {
    const q = query(
      collection(db, COLLECTIONS.HOMEPAGE_MODULES), 
      where('moduleType', '==', moduleType),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HomepageModule));
  }

  static async updateModuleOrder(modules: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    
    modules.forEach(({ id, order }) => {
      const moduleRef = doc(db, COLLECTIONS.HOMEPAGE_MODULES, id);
      batch.update(moduleRef, { 
        order, 
        updatedAt: new Date() 
      });
    });

    await batch.commit();
  }

  static async toggleModuleActive(id: string, active: boolean): Promise<void> {
    const moduleRef = doc(db, COLLECTIONS.HOMEPAGE_MODULES, id);
    await updateDoc(moduleRef, {
      active,
      updatedAt: new Date()
    });
  }

  static async bulkToggleModules(ids: string[], active: boolean): Promise<void> {
    const batch = writeBatch(db);
    
    ids.forEach(id => {
      const moduleRef = doc(db, COLLECTIONS.HOMEPAGE_MODULES, id);
      batch.update(moduleRef, { 
        active, 
        updatedAt: new Date() 
      });
    });

    await batch.commit();
  }

  static async initializeDefaultModules(): Promise<void> {
    const defaultModules: Omit<HomepageModule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Son Dakika Haberleri',
        moduleType: 'breaking-bar',
        componentName: 'BreakingNewsBar',
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 5,
        displayType: 'banner',
        active: true,
        order: 1,
        lastUpdated: new Date(),
        settings: {
          autoRotate: true,
          rotateInterval: 5000,
          backgroundColor: 'red',
          showIcon: true
        }
      },
      {
        title: 'Ana Manşet',
        moduleType: 'main-visual',
        componentName: 'MainVisualHeadline',
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 5,
        displayType: 'slider',
        active: true,
        order: 2,
        lastUpdated: new Date(),
        settings: {
          enableAutoplay: true,
          autoplaySpeed: 5000,
          showAuthor: true,
          showDate: true
        }
      },
      {
        title: 'Güncel Haberler',
        moduleType: 'headline-grid',
        componentName: 'HeadlineNewsGrid',
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 12,
        displayType: 'grid',
        active: true,
        order: 3,
        lastUpdated: new Date(),
        settings: {
          gridColumns: 3,
          showCategories: true,
          sortBy: 'publishedAt'
        }
      },
      {
        title: 'Editör Seçimleri',
        moduleType: 'editor-picks',
        componentName: 'EditorPicks',
        manualNewsIds: [],
        autoFetch: false,
        newsCount: 6,
        displayType: 'grid',
        active: true,
        order: 4,
        lastUpdated: new Date(),
        settings: {
          showAuthor: true,
          showViews: true
        }
      },
      {
        title: 'Video Haberler',
        moduleType: 'video-highlights',
        componentName: 'VideoHighlights',
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 8,
        displayType: 'grid',
        active: true,
        order: 5,
        lastUpdated: new Date(),
        settings: {
          showAuthor: false,
          showDate: true
        }
      },
      {
        title: 'AI Öneriler',
        moduleType: 'ai-recommendations',
        componentName: 'AiRecommendationPanel',
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 10,
        displayType: 'sidebar',
        active: true,
        order: 6,
        lastUpdated: new Date(),
        settings: {
          maxItems: 10,
          showViews: true
        }
      }
    ];

    const batch = writeBatch(db);
    const now = new Date();

    for (const moduleData of defaultModules) {
      const docRef = doc(collection(db, COLLECTIONS.HOMEPAGE_MODULES));
      batch.set(docRef, {
        ...moduleData,
        createdAt: now,
        updatedAt: now
      });
    }

    await batch.commit();
  }
}

// News Service for Homepage
export class HomepageNewsService {
  static async getNewsForModule(module: HomepageModule): Promise<News[]> {
    let q;
    
    if (module.manualNewsIds.length > 0 && !module.autoFetch) {
      // Manual selection - get specific news by IDs
      const newsPromises = module.manualNewsIds.map(id => 
        getDoc(doc(db, COLLECTIONS.NEWS, id))
      );
      const newsSnapshots = await Promise.all(newsPromises);
      return newsSnapshots
        .filter(snap => snap.exists())
        .map(snap => ({ id: snap.id, ...snap.data() } as News));
    } else {
      // Auto fetch based on module type and settings
      q = query(collection(db, COLLECTIONS.NEWS));
      
      // Add filters based on module type
      switch (module.moduleType) {
        case 'breaking-bar':
          q = query(q, where('breaking', '==', true), where('status', '==', 'published'));
          break;
        case 'main-visual':
          q = query(q, where('featured', '==', true), where('status', '==', 'published'));
          break;
        case 'video-highlights':
          q = query(q, where('images', '!=', null), where('status', '==', 'published'));
          break;
        default:
          q = query(q, where('status', '==', 'published'));
      }

      // Add category filter if specified
      if (module.category && module.category !== 'all') {
        q = query(q, where('category', '==', module.category));
      }

      // Add sorting
      const sortBy = module.settings?.sortBy || 'publishedAt';
      q = query(q, orderBy(sortBy, 'desc'));

      // Add limit
      q = query(q, limit(module.newsCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as News));
    }
  }

  static async getBreakingNews(limitCount = 5): Promise<News[]> {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('breaking', '==', true),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  }

  static async getFeaturedNews(limitCount = 5): Promise<News[]> {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  }

  static async getNewsByCategory(category: string, limitCount = 10): Promise<News[]> {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  }

  static async getVideoNews(limitCount = 8): Promise<News[]> {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('images', '!=', null),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as News));
  }

  static async incrementNewsViews(newsId: string): Promise<void> {
    const newsRef = doc(db, COLLECTIONS.NEWS, newsId);
    await updateDoc(newsRef, {
      views: increment(1)
    });
  }
}

// Analytics Service
export class HomepageAnalyticsService {
  static async trackModuleView(moduleId: string, moduleType: string): Promise<void> {
    const analyticsRef = doc(collection(db, COLLECTIONS.ANALYTICS));
    await addDoc(collection(db, COLLECTIONS.ANALYTICS), {
      moduleId,
      moduleType,
      action: 'view',
      timestamp: new Date(),
      sessionId: 'anonymous', // You can implement proper session tracking
      userId: null // You can track logged-in users
    });
  }

  static async trackNewsClick(newsId: string, moduleId: string, moduleType: string): Promise<void> {
    const analyticsRef = doc(collection(db, COLLECTIONS.ANALYTICS));
    await addDoc(collection(db, COLLECTIONS.ANALYTICS), {
      newsId,
      moduleId,
      moduleType,
      action: 'click',
      timestamp: new Date(),
      sessionId: 'anonymous',
      userId: null
    });
  }

  static async getModulePerformance(moduleId: string, days = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      collection(db, COLLECTIONS.ANALYTICS),
      where('moduleId', '==', moduleId),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const analytics = querySnapshot.docs.map(doc => doc.data());
    
    return {
      totalViews: analytics.filter(a => a.action === 'view').length,
      totalClicks: analytics.filter(a => a.action === 'click').length,
      clickThroughRate: analytics.length > 0 ? 
        (analytics.filter(a => a.action === 'click').length / analytics.filter(a => a.action === 'view').length) * 100 : 0,
      dailyStats: this.groupAnalyticsByDay(analytics)
    };
  }

  private static groupAnalyticsByDay(analytics: any[]): any[] {
    const grouped = analytics.reduce((acc, item) => {
      const date = new Date(item.timestamp.toDate()).toDateString();
      if (!acc[date]) {
        acc[date] = { views: 0, clicks: 0 };
      }
      if (item.action === 'view') acc[date].views++;
      if (item.action === 'click') acc[date].clicks++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, stats]) => ({
      date,
      ...stats
    }));
  }
}

// Real-time Listeners
export class HomepageRealtimeService {
  static subscribeToModules(callback: (modules: HomepageModule[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.HOMEPAGE_MODULES), 
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const modules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HomepageModule));
      callback(modules);
    });
  }

  static subscribeToBreakingNews(callback: (news: News[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('breaking', '==', true),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as News));
      callback(news);
    });
  }

  static subscribeToFeaturedNews(callback: (news: News[]) => void) {
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as News));
      callback(news);
    });
  }

  static subscribeToModuleNews(moduleId: string, callback: (news: News[]) => void) {
    // This would require a more complex setup with module configuration
    // For now, we'll implement a simple news subscription
    const q = query(
      collection(db, COLLECTIONS.NEWS),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(10)
    );
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as News));
      callback(news);
    });
  }
}