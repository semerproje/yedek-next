import { useState, useEffect } from 'react'
import { HomepageDataService, NewsModuleService } from '@/lib/services/homepageService'
import { DisplayNews, HomepageData, NewsModuleConfig } from '@/types/admin'

// Homepage data hook for frontend components
export const useHomepageData = () => {
  const [data, setData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const homepageData = await HomepageDataService.getHomepageData()
      setData(homepageData)
      setError(null)
    } catch (err) {
      console.error('Homepage data fetch error:', err)
      setError('Veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = async () => {
    await fetchData()
  }

  return { data, loading, error, refetch }
}

// Enhanced news service with admin configuration support
export class EnhancedNewsService {
  static async getNewsForModule(moduleKey: string): Promise<DisplayNews[]> {
    try {
      const config = await NewsModuleService.getModuleConfig(moduleKey)
      if (!config || !config.active) {
        return []
      }

      if (config.manualSelection && config.newsIds.length > 0) {
        return await this.getNewsByIds(config.newsIds)
      } else if (config.autoSelection.enabled) {
        return await this.getNewsByCriteria(config)
      }

      return []
    } catch (error) {
      console.error(`Error getting news for module ${moduleKey}:`, error)
      return []
    }
  }

  private static async getNewsByIds(newsIds: string[]): Promise<DisplayNews[]> {
    try {
      // Implementation would fetch specific news by IDs from Firebase
      // This is a placeholder for the actual Firebase query
      return []
    } catch (error) {
      console.error('Error fetching news by IDs:', error)
      return []
    }
  }

  private static async getNewsByCriteria(config: NewsModuleConfig): Promise<DisplayNews[]> {
    try {
      // Implementation would build dynamic Firebase query based on criteria
      // This is a placeholder for the actual Firebase query
      return []
    } catch (error) {
      console.error('Error fetching news by criteria:', error)
      return []
    }
  }

  // Get news with fallback to default data for development
  static async getNewsWithFallback(moduleKey: string, fallbackData: DisplayNews[] = []): Promise<DisplayNews[]> {
    try {
      const adminNews = await this.getNewsForModule(moduleKey)
      if (adminNews.length > 0) {
        return adminNews
      }
      
      // Fallback to provided data or default empty array
      return fallbackData
    } catch (error) {
      console.error(`Fallback news fetch for ${moduleKey}:`, error)
      return fallbackData
    }
  }
}
