import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  HomepageModule, 
  CategoryManagement, 
  NewsModuleConfig, 
  PublishingSchedule,
  DisplayNews,
  HomepageData
} from '@/types/admin'

// Homepage Module Management
export class HomepageModuleService {
  private static readonly COLLECTION = 'homepage_modules'

  static async getModules(): Promise<HomepageModule[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().lastModified?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as HomepageModule[]
    } catch (error) {
      console.error('Error fetching homepage modules:', error)
      return []
    }
  }

  static async createModule(module: Omit<HomepageModule, 'id' | 'createdAt' | 'lastModified'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...module,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating homepage module:', error)
      throw error
    }
  }

  static async updateModule(id: string, updates: Partial<HomepageModule>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, id)
      
      // Önce dokümanın var olup olmadığını kontrol et
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        console.log(`Module ${id} does not exist, creating it...`)
        // Eğer dokuman yoksa, önce oluştur
        await setDoc(docRef, {
          id: id,
          key: id,
          name: updates.name || 'New Module',
          description: updates.description || '',
          component: updates.component || 'generic',
          active: updates.active ?? false,
          order: updates.order ?? 0,
          settings: updates.settings || {},
          createdAt: new Date(),
          lastModified: new Date(),
          ...updates
        })
      } else {
        // Dokuman varsa güncelle
        await updateDoc(docRef, {
          ...updates,
          lastModified: new Date()
        })
      }
    } catch (error) {
      console.error('Error updating homepage module:', error)
      throw error
    }
  }

  static async deleteModule(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, id))
    } catch (error) {
      console.error('Error deleting homepage module:', error)
      throw error
    }
  }

  static async reorderModules(moduleIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db)
      moduleIds.forEach((id, index) => {
        const moduleRef = doc(db, this.COLLECTION, id)
        batch.update(moduleRef, { 
          order: index,
          lastModified: Timestamp.now()
        })
      })
      await batch.commit()
    } catch (error) {
      console.error('Error reordering modules:', error)
      throw error
    }
  }
}

// Category Management
export class CategoryService {
  private static readonly COLLECTION = 'categories'

  static async getCategories(): Promise<CategoryManagement[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().lastModified?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as CategoryManagement[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  static async createCategory(category: Omit<CategoryManagement, 'id' | 'createdAt' | 'lastModified' | 'newsCount'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...category,
        newsCount: 0,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  static async updateCategory(id: string, updates: Partial<CategoryManagement>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION, id), {
        ...updates,
        lastModified: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, id))
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

// News Module Configuration
export class NewsModuleService {
  private static readonly COLLECTION = 'news_module_configs'

  static async getModuleConfigs(): Promise<NewsModuleConfig[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().lastModified?.toDate() || new Date()
      })) as NewsModuleConfig[]
    } catch (error) {
      console.error('Error fetching news module configs:', error)
      return []
    }
  }

  static async getModuleConfig(moduleKey: string): Promise<NewsModuleConfig | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('moduleKey', '==', moduleKey),
        limit(1)
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) return null
      
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().lastModified?.toDate() || new Date()
      } as NewsModuleConfig
    } catch (error) {
      console.error('Error fetching module config:', error)
      return null
    }
  }

  static async createModuleConfig(config: Omit<NewsModuleConfig, 'id' | 'lastModified'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...config,
        lastModified: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating module config:', error)
      throw error
    }
  }

  static async updateModuleConfig(id: string, updates: Partial<NewsModuleConfig>): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION, id), {
        ...updates,
        lastModified: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating module config:', error)
      throw error
    }
  }
}

// Publishing Schedule
export class PublishingService {
  private static readonly COLLECTION = 'publishing_schedule'

  static async getScheduledContent(): Promise<PublishingSchedule[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        orderBy('publishAt', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishAt: doc.data().publishAt?.toDate() || new Date(),
        unpublishAt: doc.data().unpublishAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as PublishingSchedule[]
    } catch (error) {
      console.error('Error fetching scheduled content:', error)
      return []
    }
  }

  static async scheduleContent(schedule: Omit<PublishingSchedule, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...schedule,
        publishAt: Timestamp.fromDate(schedule.publishAt),
        unpublishAt: schedule.unpublishAt ? Timestamp.fromDate(schedule.unpublishAt) : null,
        createdAt: Timestamp.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error scheduling content:', error)
      throw error
    }
  }

  static async updateSchedule(id: string, updates: Partial<PublishingSchedule>): Promise<void> {
    try {
      const updateData: any = { ...updates }
      if (updates.publishAt) {
        updateData.publishAt = Timestamp.fromDate(updates.publishAt)
      }
      if (updates.unpublishAt) {
        updateData.unpublishAt = Timestamp.fromDate(updates.unpublishAt)
      }
      
      await updateDoc(doc(db, this.COLLECTION, id), updateData)
    } catch (error) {
      console.error('Error updating schedule:', error)
      throw error
    }
  }
}

// Homepage Data Fetcher
export class HomepageDataService {
  static async getHomepageData(): Promise<HomepageData> {
    try {
      // Get all active modules and their configurations
      const modules = await HomepageModuleService.getModules()
      const activeModules = modules.filter(m => m.active)
      
      const data: HomepageData = {
        breakingNews: [],
        headlines: [],
        editorPicks: [],
        categoryNews: {},
        popularNews: [],
        weekendReads: [],
        videoHighlights: [],
        lastUpdated: new Date()
      }

      // Fetch news for each module based on its configuration
      for (const moduleItem of activeModules) {
        const config = await NewsModuleService.getModuleConfig(moduleItem.key)
        if (!config) continue

        const news = await this.getNewsForModule(config)
        
        switch (moduleItem.key) {
          case 'breaking-news':
            data.breakingNews = news
            break
          case 'headlines':
            data.headlines = news
            break
          case 'editor-picks':
            data.editorPicks = news
            break
          case 'popular-news':
            data.popularNews = news
            break
          case 'weekend-reads':
            data.weekendReads = news
            break
          case 'video-highlights':
            data.videoHighlights = news
            break
          default:
            // Category-specific news
            if (config.categories.length > 0) {
              config.categories.forEach(category => {
                if (!data.categoryNews[category]) {
                  data.categoryNews[category] = []
                }
                data.categoryNews[category] = news
              })
            }
        }
      }

      return data
    } catch (error) {
      console.error('Error fetching homepage data:', error)
      throw error
    }
  }

  private static async getNewsForModule(config: NewsModuleConfig): Promise<DisplayNews[]> {
    try {
      if (config.manualSelection && config.newsIds.length > 0) {
        // Manual selection - get specific news by IDs
        return await this.getNewsByIds(config.newsIds)
      } else if (config.autoSelection.enabled) {
        // Auto selection based on criteria
        return await this.getNewsByCriteria(config)
      }
      
      return []
    } catch (error) {
      console.error('Error fetching news for module:', error)
      return []
    }
  }

  private static async getNewsByIds(newsIds: string[]): Promise<DisplayNews[]> {
    try {
      const newsPromises = newsIds.map(id => getDoc(doc(db, 'news', id)))
      const newsSnapshots = await Promise.all(newsPromises)
      
      return newsSnapshots
        .filter(snapshot => snapshot.exists())
        .map(snapshot => ({
          id: snapshot.id,
          ...snapshot.data(),
          publishedAt: snapshot.data()?.publishedAt?.toDate() || new Date()
        })) as DisplayNews[]
    } catch (error) {
      console.error('Error fetching news by IDs:', error)
      return []
    }
  }

  private static async getNewsByCriteria(config: NewsModuleConfig): Promise<DisplayNews[]> {
    try {
      let q = query(collection(db, 'news'))
      
      // Apply filters based on criteria
      if (config.autoSelection.criteria.category && config.autoSelection.criteria.category.length > 0) {
        q = query(q, where('category', 'in', config.autoSelection.criteria.category))
      }
      
      if (config.autoSelection.criteria.featured) {
        q = query(q, where('featured', '==', true))
      }
      
      if (config.autoSelection.criteria.minViews) {
        q = query(q, where('views', '>=', config.autoSelection.criteria.minViews))
      }
      
      // Order by date and limit
      q = query(q, orderBy('publishedAt', 'desc'), limit(config.displaySettings.count))
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate() || new Date()
      })) as DisplayNews[]
    } catch (error) {
      console.error('Error fetching news by criteria:', error)
      return []
    }
  }
}
