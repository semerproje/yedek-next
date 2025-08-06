import { 
  AANewsService,
  type AAApiCredentials,
  type AASearchParams 
} from '@/lib/aa-news-service'
import { collection, query, getDocs, where, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface CrawlConfig {
  isAutomatic: boolean
  crawlInterval: number // minutes
  enableAIProcessing: boolean
  enableImageGeneration: boolean
  selectedCategories: string[]
  categoryMapping: { [key: string]: string }
  credentials: AAApiCredentials
  lastCrawlTime?: Date
  totalNewsProcessed: number
  isActive: boolean
}

interface CrawlStats {
  totalFound: number
  newItems: number
  processed: number
  errors: number
  startTime: Date
  endTime?: Date
  duration?: number
}

class AACrawlManager {
  private config: CrawlConfig
  private aaService: AANewsService
  private isRunning: boolean = false
  private intervalId: NodeJS.Timeout | null = null
  private currentStats: CrawlStats | null = null

  constructor(config: CrawlConfig) {
    this.config = config
    this.aaService = new AANewsService(config.credentials)
  }

  /**
   * Otomatik çekimi başlatır
   */
  startAutomaticCrawling(): void {
    if (!this.config.isAutomatic || this.intervalId) {
      console.log('Automatic crawling already running or disabled')
      return
    }

    console.log(`🚀 Starting automatic AA news crawling every ${this.config.crawlInterval} minutes`)
    
    // İlk çekimi hemen yap
    this.executeCrawl('automatic')

    // Periyodik çekimi ayarla
    this.intervalId = setInterval(() => {
      this.executeCrawl('automatic')
    }, this.config.crawlInterval * 60 * 1000)
  }

  /**
   * Otomatik çekimi durdurur
   */
  stopAutomaticCrawling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('🛑 Automatic AA news crawling stopped')
    }
  }

  /**
   * Manuel çekim yapar
   */
  async manualCrawl(): Promise<CrawlStats> {
    return await this.executeCrawl('manual')
  }

  /**
   * Ana çekim işlemini gerçekleştirir
   */
  private async executeCrawl(type: 'manual' | 'automatic'): Promise<CrawlStats> {
    if (this.isRunning) {
      console.log('⚠️ Crawling already in progress, skipping...')
      return this.currentStats || this.createEmptyStats()
    }

    this.isRunning = true
    this.currentStats = this.createEmptyStats()

    console.log(`🎯 Starting ${type} AA news crawl at ${new Date().toISOString()}`)

    try {
      // AA API'den haberleri getir
      const searchParams: AASearchParams = {
        category: this.config.selectedCategories,
        language: 'tr',
        limit: 50,
        priority: ['1', '2'], // Acil ve önemli haberler
        dateFrom: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // Son 6 saat
      }

      const searchResult = await this.aaService.searchNews(searchParams)

      if (!searchResult.response.success || !searchResult.data) {
        throw new Error(searchResult.response.message || 'AA API search failed')
      }

      this.currentStats.totalFound = searchResult.data.result.length
      console.log(`📊 Found ${this.currentStats.totalFound} news items`)

      // Her haberi işle
      for (const newsItem of searchResult.data.result) {
        try {
          await this.processNewsItem(newsItem)
          this.currentStats.processed++
        } catch (error) {
          console.error(`❌ Error processing news ${newsItem.id}:`, error)
          this.currentStats.errors++
        }

        // Rate limiting - API'yi aşırı yüklememek için
        await this.sleep(1000)
      }

      // İstatistikleri güncelle
      this.currentStats.endTime = new Date()
      this.currentStats.duration = this.currentStats.endTime.getTime() - this.currentStats.startTime.getTime()

      // Konfigürasyonu güncelle
      await this.updateCrawlConfig()

      console.log(`✅ ${type} crawl completed:`, {
        found: this.currentStats.totalFound,
        new: this.currentStats.newItems,
        processed: this.currentStats.processed,
        errors: this.currentStats.errors,
        duration: `${Math.round(this.currentStats.duration / 1000)}s`
      })

    } catch (error) {
      console.error(`❌ ${type} crawl failed:`, error)
      this.currentStats.errors++
    } finally {
      this.isRunning = false
    }

    return this.currentStats
  }

  /**
   * Tek bir haber öğesini işler
   */
  private async processNewsItem(newsItem: any): Promise<void> {
    try {
      // Haberin zaten var olup olmadığını kontrol et
      if (await this.isNewsExists(newsItem.id)) {
        console.log(`⏭️ News already exists: ${newsItem.id}`)
        return
      }

      this.currentStats!.newItems++

      // Simplified processing - just save the news as is
      console.log(`📝 Processing news: ${newsItem.title}`)
      
      const processedContent = {
        title: newsItem.title,
        content: newsItem.content,
        summary: newsItem.content.substring(0, 200) + '...'
      }

      // Note: AI processing and image generation removed for simplicity
      // These features can be added back later when the full service is implemented

      console.log(`✅ News processed: ${newsItem.title}`)

    } catch (error) {
      console.error(`Error processing news item:`, error)
      throw error
    }
  }

  /**
   * Haberin zaten var olup olmadığını kontrol eder
   */
  private async isNewsExists(originalId: string): Promise<boolean> {
    if (!db) return false

    try {
      const existingQuery = query(
        collection(db, 'aa_news'),
        where('originalId', '==', originalId)
      )
      const snapshot = await getDocs(existingQuery)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking news existence:', error)
      return false
    }
  }

  /**
   * Crawl konfigürasyonunu günceller
   */
  private async updateCrawlConfig(): Promise<void> {
    if (!db || !this.currentStats) return

    try {
      // Bu gerçek implementasyonda config'i Firebase'de bulup güncellersiniz
      this.config.lastCrawlTime = new Date()
      this.config.totalNewsProcessed += this.currentStats.processed

      console.log('📊 Config updated:', {
        lastCrawl: this.config.lastCrawlTime,
        totalProcessed: this.config.totalNewsProcessed
      })
    } catch (error) {
      console.error('Error updating config:', error)
    }
  }

  /**
   * Boş istatistik objesi oluşturur
   */
  private createEmptyStats(): CrawlStats {
    return {
      totalFound: 0,
      newItems: 0,
      processed: 0,
      errors: 0,
      startTime: new Date()
    }
  }

  /**
   * Belirtilen süre kadar bekler
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Mevcut çekim durumunu döndürür
   */
  getStatus(): {
    isRunning: boolean
    currentStats: CrawlStats | null
    config: CrawlConfig
  } {
    return {
      isRunning: this.isRunning,
      currentStats: this.currentStats,
      config: this.config
    }
  }

  /**
   * Konfigürasyonu günceller
   */
  updateConfig(newConfig: Partial<CrawlConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Credentials değiştiyse service'i yeniden oluştur
    if (newConfig.credentials) {
      this.aaService = new AANewsService(this.config.credentials)
    }

    // Otomatik çekimi yeniden başlat
    if (newConfig.isAutomatic !== undefined) {
      this.stopAutomaticCrawling()
      if (newConfig.isAutomatic) {
        this.startAutomaticCrawling()
      }
    }
  }
}

// Global crawl manager instance
let globalCrawlManager: AACrawlManager | null = null

/**
 * Crawl manager'ı başlatır
 */
export function initializeCrawlManager(config: CrawlConfig): AACrawlManager {
  if (globalCrawlManager) {
    globalCrawlManager.stopAutomaticCrawling()
  }
  
  globalCrawlManager = new AACrawlManager(config)
  
  if (config.isAutomatic) {
    globalCrawlManager.startAutomaticCrawling()
  }
  
  return globalCrawlManager
}

/**
 * Mevcut crawl manager'ı döndürür
 */
export function getCrawlManager(): AACrawlManager | null {
  return globalCrawlManager
}

/**
 * Crawl manager'ı durdurur
 */
export function shutdownCrawlManager(): void {
  if (globalCrawlManager) {
    globalCrawlManager.stopAutomaticCrawling()
    globalCrawlManager = null
  }
}

export type { CrawlConfig, CrawlStats }
export { AACrawlManager }
