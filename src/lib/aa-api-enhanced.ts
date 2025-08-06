import { collection, addDoc, query, where, getDocs, doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import { safeUpdateDoc } from './safe-firebase-utils'

export interface AAApiCredentials {
  username: string
  password: string
  baseUrl: string
}

// AA API için doğru credentials (kılavuzdan)
export const DEFAULT_AA_CREDENTIALS: AAApiCredentials = {
  username: '3010229',
  password: '8vWhT6Vt',
  baseUrl: 'https://api.aa.com.tr/abone'
}

// AA API Kategori Kodları (kılavuzdan - test sonuçlarıyla güncellenmiş)
export const AA_CATEGORY_CODES = {
  '1': 'Genel',
  '2': 'Spor',
  '3': 'Ekonomi',
  '4': 'Sağlık',
  '5': 'Bilim, Teknoloji', // Test sonucunda virgül ile geldi
  '6': 'Politika',
  '7': 'Kültür, Sanat, Yaşam' // Test sonucunda virgül ile geldi
} as const

// AA API Öncelik Kodları (kılavuzdan - test sonuçlarıyla güncellenmiş)
export const AA_PRIORITY_CODES = {
  '1': 'Flaş', // "1 Flaş" olarak geldi
  '2': 'Acil', // "2 Acil" olarak geldi  
  '3': 'Önemli', // "3 Önemli" olarak geldi
  '4': 'Rutin', // "4 Rutin" olarak geldi
  '5': 'Özel', // "5 Özel" olarak geldi
  '6': 'Arşiv' // "6 Arşiv" olarak geldi
} as const

// AA API İçerik Türü Kodları (kılavuzdan)
export const AA_TYPE_CODES = {
  '1': 'Haber',
  '2': 'Fotoğraf',
  '3': 'Video',
  '4': 'Dosya',
  '5': 'Grafik'
} as const

// Bizim header kategorilerimiz ile AA kategorilerinin eşleşmesi (test sonuçlarıyla güncellenmiş)
export const AA_TO_HEADER_CATEGORY_MAPPING: Record<string, string> = {
  // AA kategorilerini bizim header kategorilerimize eşleştir
  'Genel': 'Gündem',
  'Spor': 'Spor',
  'Ekonomi': 'Ekonomi',
  'Sağlık': 'Gündem', // Sağlık haberlerini Gündem'e yönlendir
  'Bilim, Teknoloji': 'Teknoloji', // Test sonucundaki format
  'Politika': 'Politika',
  'Kültür, Sanat, Yaşam': 'Kültür' // Test sonucundaki format
}

export interface AADiscoverResponse {
  category: Array<{ id: string; name: string }>
  priority: Array<{ id: string; name: string }>
  bulletin: Array<{ id: string; name: string }>
  type: Array<{ id: string; name: string }>
  language: Array<{ id: string; name: string }>
  provider: Array<{ id: string; name: string }>
}

export interface AASearchParams {
  start_date: string        // ISO format: 2016-08-30T10:45:00Z
  end_date: string          // ISO format veya "NOW"
  filter_category?: string  // Kategori ID'si
  filter_priority?: string  // Öncelik ID'si
  filter_type?: string      // İçerik türü ID'si
  filter_language?: string  // Dil ID'si
  search_string?: string    // Anahtar kelime
  offset?: number           // Sayfalama başlangıcı
  limit?: number            // Sayfa boyutu
}

export interface AASearchResult {
  documents: AANewsDocument[]
  total: number
  offset: number
  limit: number
}

export interface AANewsDocument {
  id: string
  type: string
  title: string
  content?: string
  text?: string
  body?: string
  description?: string
  summary?: string
  date: string
  category: string
  categoryName?: string
  enhancedCategory?: string
  priority?: string
  package?: string
  language?: string
  groupId?: string
  imageUrls?: string[]
  fallbackImageUrl?: string
  metadata?: {
    author?: string
    location?: string
    keywords?: string[]
    [key: string]: any
  }
  // AI Enhancement fields
  aiProcessed?: boolean
  inferredFromTitle?: boolean
  categoryHints?: string[]
}

export interface AASubscriptionInfo {
  provider: string[]
  package: string[]
  category: string[]
  type: string[]
  language: string[]
  photo_size: string[]
  video_size: string[]
  graph_size: string[]
  archive_days: number
  download_limit: number
}

// Rate limiting için son istek zamanı
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500 // 500ms minimum gecikme (kılavuzdan)

// Rate limiting fonksiyonu
async function waitForRateLimit(): Promise<void> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  
  lastRequestTime = Date.now()
}

// HTTP Basic Auth header oluşturma
function createAuthHeader(credentials: AAApiCredentials): string {
  const auth = btoa(`${credentials.username}:${credentials.password}`)
  return `Basic ${auth}`
}

export class AAApiService {
  private credentials: AAApiCredentials
  private isServerSide: boolean
  
  constructor(credentials: AAApiCredentials = DEFAULT_AA_CREDENTIALS) {
    this.credentials = credentials
    this.isServerSide = typeof window === 'undefined'
  }

  // Server-side için direkt API çağrısı, client-side için proxy kullan
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    if (this.isServerSide) {
      // Server-side: Direkt AA API çağrısı
      await waitForRateLimit()
      
      const headers: Record<string, string> = {
        'Authorization': createAuthHeader(this.credentials),
        'Content-Type': 'application/json'
      }

      const options: RequestInit = {
        method,
        headers
      }

      if (body && method === 'POST') {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      
      if (!response.ok) {
        throw new Error(`AA API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } else {
      // Client-side: Proxy üzerinden
      const action = endpoint.split('/').pop() || 'unknown'
      
      const proxyBody: any = { action }
      if (body) {
        proxyBody.params = body
      }

      const response = await fetch('/api/aa-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proxyBody)
      })

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Proxy request failed')
      }

      return result.data
    }
  }

  // 1. discover - Filtre parametrelerini getir
  async discover(language: string = 'tr_TR'): Promise<AADiscoverResponse> {
    try {
      if (this.isServerSide) {
        return await this.makeRequest(`${this.credentials.baseUrl}/discover/${language}`)
      } else {
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'discover',
            params: { language }
          })
        })

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data
      }
    } catch (error) {
      console.error('AA discover error:', error)
      throw error
    }
  }

  // 2. search - Filtrelenmiş haber listesi
  async search(params: AASearchParams): Promise<AASearchResult> {
    try {
      console.log('🔍 AA API search çağrısı başlatılıyor:', {
        start_date: params.start_date,
        end_date: params.end_date,
        filter_category: params.filter_category,
        filter_type: params.filter_type,
        limit: params.limit,
        offset: params.offset
      })

      let result: any
      
      if (this.isServerSide) {
        console.log('🖥️ Server-side AA API çağrısı yapılıyor...')
        result = await this.makeRequest(`${this.credentials.baseUrl}/search/`, 'POST', params)
      } else {
        console.log('🌐 Client-side proxy çağrısı yapılıyor...')
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'search',
            params
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Proxy response error:', response.status, errorText)
          throw new Error(`Proxy error: ${response.status}`)
        }

        const proxyResult = await response.json()
        console.log('📥 Proxy response:', {
          success: proxyResult.success,
          hasData: !!proxyResult.data,
          dataType: typeof proxyResult.data
        })
        
        if (!proxyResult.success) {
          console.error('❌ Proxy result error:', proxyResult.error)
          throw new Error(proxyResult.error)
        }

        result = proxyResult.data
      }
      
      console.log('📊 AA API search sonucu:', {
        result: result?.data?.result?.length || 0,
        total: result?.data?.total || 0,
        responseStructure: result ? Object.keys(result) : []
      })

      // Dönen haberleri işleyelim - AA API nested response structure: result.data.result
      const newsData = result?.data || result
      if (newsData?.result) {
        const processedDocuments = newsData.result.map((doc: any) => this.processAADocument(doc))
        console.log('✅ Haberler işlendi, ilk haber:', processedDocuments[0]?.title || 'Bulunamadı')
        
        // AA API response formatını bizim beklediğimiz formata çevir
        return {
          documents: processedDocuments,
          total: newsData.total || 0,
          offset: newsData.offset || 0,
          limit: newsData.limit || newsData.result.length
        }
      } else {
        console.log('⚠️ Hiç haber dökümanı bulunamadı - yapı:', Object.keys(newsData || {}))
        return {
          documents: [],
          total: 0,
          offset: 0,
          limit: 0
        }
      }
    } catch (error) {
      console.error('❌ AA search error:', error)
      throw error
    }
  }

  // 3. subscription - Abonelik bilgilerini getir
  async getSubscription(): Promise<AASubscriptionInfo> {
    try {
      if (this.isServerSide) {
        return await this.makeRequest(`${this.credentials.baseUrl}/subscription/`)
      } else {
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'subscription'
          })
        })

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data
      }
    } catch (error) {
      console.error('AA subscription error:', error)
      throw error
    }
  }

  // 4. document - İçerik indir
  async getDocument(typeId: string, format: string): Promise<any> {
    try {
      if (this.isServerSide) {
        await waitForRateLimit()
        
        const response = await fetch(`${this.credentials.baseUrl}/document/${typeId}/${format}`, {
          method: 'GET',
          headers: {
            'Authorization': createAuthHeader(this.credentials)
          }
        })

        if (!response.ok) {
          throw new Error(`AA API document error: ${response.status} ${response.statusText}`)
        }

        return await response.text() // NewsML29 format döner
      } else {
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'document',
            params: { typeId, format }
          })
        })

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data
      }
    } catch (error) {
      console.error('AA document error:', error)
      throw error
    }
  }

  // 5. token - Geçici indirme bağlantısı
  async getToken(typeId: string, format: string): Promise<string> {
    try {
      if (this.isServerSide) {
        await waitForRateLimit()
        
        const response = await fetch(`${this.credentials.baseUrl}/token/${typeId}/${format}`, {
          method: 'GET',
          headers: {
            'Authorization': createAuthHeader(this.credentials)
          },
          redirect: 'manual' // 302 yönlendirmesini manuel yakala
        })

        if (response.status === 302) {
          const location = response.headers.get('Location')
          if (location) {
            return location
          }
        }

        throw new Error(`AA API token error: ${response.status} ${response.statusText}`)
      } else {
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'token',
            params: { typeId, format }
          })
        })

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data
      }
    } catch (error) {
      console.error('AA token error:', error)
      throw error
    }
  }

  // 6. multitoken - Seri içerik indirme bağlantıları
  async getMultiToken(groupId: string, format: string): Promise<string[]> {
    try {
      if (this.isServerSide) {
        await waitForRateLimit()
        
        const response = await fetch(`${this.credentials.baseUrl}/multitoken/${groupId}/${format}`, {
          method: 'GET',
          headers: {
            'Authorization': createAuthHeader(this.credentials),
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`AA API multitoken error: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        return result.tokens || []
      } else {
        const response = await fetch('/api/aa-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'multitoken',
            params: { groupId, format }
          })
        })

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.status}`)
        }

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error)
        }

        return result.data.tokens || []
      }
    } catch (error) {
      console.error('AA multitoken error:', error)
      throw error
    }
  }

  // AA dökümanını işleme - Test sonuçlarına göre güncellenmiş
  private processAADocument(doc: any): AANewsDocument {
    // Debug: Log the document structure to see what we're working with
    console.log('🔍 Processing AA document:', {
      id: doc.id,
      category: doc.category,
      categoryType: typeof doc.category,
      allFields: Object.keys(doc)
    })

    // AA kategorisini bizim header kategorimize çevir
    const rawCategory = doc.category || '1' // Default to '1' (Genel) if undefined
    const aaCategoryName = AA_CATEGORY_CODES[rawCategory as keyof typeof AA_CATEGORY_CODES] || 'Genel'
    const headerCategory = AA_TO_HEADER_CATEGORY_MAPPING[aaCategoryName] || 'Gündem'

    console.log('🏷️ Category mapping:', {
      raw: rawCategory,
      aaName: aaCategoryName,
      headerCategory: headerCategory
    })

    // Fallback image URL oluştur
    const fallbackImageUrl = this.generateFallbackImageUrl(headerCategory)

    // İçerik alanını belirle (farklı alan adları olabilir)
    const content = doc.content || doc.text || doc.body || doc.description || doc.summary || ''

    // Medya türüne göre özel işleme
    const imageUrls: string[] = []
    let mediaType = 'text'
    
    if (doc.type === 'picture' && doc.group_id) {
      // Fotoğraf grubundan resim URL'leri çıkar
      mediaType = 'image'
      // AA API'den resim URL'lerini almak için group_id kullanılabilir
    } else if (doc.type === 'video' && doc.group_id) {
      // Video grubu
      mediaType = 'video'
    }

    const processedDoc: AANewsDocument = {
      id: doc.id || '',
      type: doc.type || mediaType,
      title: doc.title || '',
      content,
      date: doc.date || new Date().toISOString(),
      category: rawCategory, // Ensure this is never undefined
      categoryName: aaCategoryName,
      enhancedCategory: headerCategory,
      priority: doc.priority || '4', // Default to 'Rutin'
      package: doc.package || '',
      language: doc.language || '1', // Default to Turkish
      groupId: doc.group_id || null,
      imageUrls,
      fallbackImageUrl,
      metadata: {
        ...doc.metadata,
        originalType: doc.type,
        groupId: doc.group_id
      },
      aiProcessed: true,
      inferredFromTitle: false,
      categoryHints: [aaCategoryName, headerCategory]
    }

    console.log('✅ Processed document category check:', {
      id: processedDoc.id,
      category: processedDoc.category,
      categoryType: typeof processedDoc.category
    })

    return processedDoc
  }

  // Kategori bazlı fallback image URL'i oluştur
  private generateFallbackImageUrl(category: string): string {
    const categoryImageMap: Record<string, string> = {
      'Gündem': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
      'Politika': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop',
      'Ekonomi': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      'Spor': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      'Dünya': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'Teknoloji': 'https://picsum.photos/800/600?seed=technology',
      'Kültür': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop'
    }

    return categoryImageMap[category] || categoryImageMap['Gündem']
  }

  // Medya grubu içeriklerini getir (test sonuçlarında group_id olan içerikler için)
  async getMediaGroupContent(groupId: string, format: string = 'newsml29'): Promise<string[]> {
    try {
      console.log(`📸 AA API getMediaGroupContent: ${groupId} medya grubu alınıyor...`)
      const tokens = await this.getMultiToken(groupId, format)
      console.log(`📸 AA API: ${tokens.length} medya token'ı alındı`)
      return tokens
    } catch (error) {
      console.error('Media group content error:', error)
      return []
    }
  }

  // Gelişmiş haber arama - Test sonuçlarındaki büyük veri havuzunu verimli kullanmak için
  async searchNewsAdvanced(options: {
    category?: string
    priority?: string
    type?: string
    searchKeyword?: string
    hoursBack?: number
    limit?: number
    offset?: number
  }): Promise<AASearchResult> {
    const {
      category,
      priority,
      type = '1', // Varsayılan olarak sadece text
      searchKeyword,
      hoursBack = 24,
      limit = 50,
      offset = 0
    } = options

    const now = new Date()
    // AA aboneliğimiz 15 günlük arşiv erişimi sağlıyor, maksimum 15 gün geriye gidebiliriz
    const maxHoursBack = Math.min(hoursBack, 15 * 24) // Maksimum 15 gün (360 saat)
    const startTime = new Date(now.getTime() - maxHoursBack * 60 * 60 * 1000)

    console.log('🔍 SearchNewsAdvanced parametreleri:', {
      category,
      priority,
      type,
      searchKeyword,
      hoursBack: maxHoursBack,
      limit,
      offset,
      timeRange: `${startTime.toISOString()} - ${now.toISOString()}`
    })

    const searchParams: AASearchParams = {
      start_date: startTime.toISOString(),
      end_date: 'NOW',
      filter_type: type,
      filter_language: '1', // Türkçe
      limit: Math.min(limit, 100),
      offset
    }

    // Opsiyonel filtreler
    if (category) searchParams.filter_category = category
    if (priority) searchParams.filter_priority = priority
    if (searchKeyword) searchParams.search_string = searchKeyword

    try {
      const result = await this.search(searchParams)
      console.log(`🔍 AA API searchNewsAdvanced: ${result.documents?.length || 0}/${result.total || 0} haber bulundu`)
      return result
    } catch (error) {
      console.error('Advanced news search error:', error)
      return { documents: [], total: 0, offset, limit }
    }
  }

  // Güncel haberleri getir (son 24 saat) - Test sonuçlarına göre optimize edilmiş
  async getLatestNews(category?: string, limit: number = 50): Promise<AANewsDocument[]> {
    const now = new Date()
    // AA aboneliğimiz 15 günlük arşiv erişimi sağlıyor, 10 gün geriye gidelim
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)

    console.log('📅 GetLatestNews parametreleri:', {
      category,
      limit,
      timeRange: `${tenDaysAgo.toISOString()} - ${now.toISOString()}`,
      archiveLimit: '15 gün (abonelik limiti)'
    })

    const searchParams: AASearchParams = {
      start_date: tenDaysAgo.toISOString(),
      end_date: 'NOW',
      filter_type: '1', // Sadece haber metinleri
      filter_language: '1', // Türkçe
      limit: Math.min(limit, 100), // API'den maksimum 100'er haber çek
      offset: 0
    }

    // Kategori filtresi ekle - test sonuçlarındaki kategori formatına uygun
    if (category && Object.values(AA_CATEGORY_CODES).includes(category as any)) {
      const categoryId = Object.keys(AA_CATEGORY_CODES).find(
        key => AA_CATEGORY_CODES[key as keyof typeof AA_CATEGORY_CODES] === category
      )
      if (categoryId) {
        searchParams.filter_category = categoryId
        console.log(`🏷️ Kategori filtresi eklendi: ${category} (ID: ${categoryId})`)
      }
    } else {
      console.log('🏷️ Kategori filtresi kullanılmıyor, tüm kategoriler')
    }

    console.log('🔍 Final search params:', searchParams)

    try {
      const result = await this.search(searchParams)
      console.log(`📊 AA API getLatestNews: ${result.documents?.length || 0} haber alındı (toplam: ${result.total || 0})`)
      
      if (result.documents && result.documents.length > 0) {
        console.log('✅ İlk 3 haber başlığı:', result.documents.slice(0, 3).map(d => d.title))
      } else {
        console.log('⚠️ Hiç haber bulunamadı!')
        
        // Fallback: Try with even wider range
        console.log('🔄 Daha geniş tarih aralığı deneniyor (son 15 gün)...')
        const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        
        const fallbackParams = {
          ...searchParams,
          start_date: fifteenDaysAgo.toISOString()
        }
        
        const fallbackResult = await this.search(fallbackParams)
        console.log(`📊 Fallback sonucu: ${fallbackResult.documents?.length || 0} haber alındı (toplam: ${fallbackResult.total || 0})`)
        
        return fallbackResult.documents || []
      }
      
      return result.documents || []
    } catch (error) {
      console.error('❌ Latest news fetch error:', error)
      return []
    }
  }

  // Firebase'e haber kaydet - Enhanced with slug generation
  async saveNewsToFirebase(news: AANewsDocument[]): Promise<{ success: number; errors: number }> {
    let successCount = 0
    let errorCount = 0

    for (const newsItem of news) {
      try {
        // Validate required fields before attempting to save
        if (!newsItem.id || !newsItem.title || !newsItem.category) {
          console.error('❌ Invalid news item - missing required fields:', {
            id: newsItem.id,
            title: newsItem.title,
            category: newsItem.category
          })
          errorCount++
          continue
        }

        // Haber slug'ını oluştur
        const newsSlug = this.createNewsSlug(newsItem.title, newsItem.id)
        
        // Duplicate kontrolü
        const existingQuery = query(
          collection(db, 'aa_news'),
          where('id', '==', newsItem.id)
        )
        const existingDocs = await getDocs(existingQuery)

        // Ensure all fields are properly defined before saving
        const enhancedNewsItem = {
          id: newsItem.id,
          type: newsItem.type || 'text',
          title: newsItem.title,
          content: newsItem.content || '',
          date: newsItem.date || new Date().toISOString(),
          category: newsItem.category, // This should never be undefined now
          categoryName: newsItem.categoryName || 'Genel',
          enhancedCategory: newsItem.enhancedCategory || 'Gündem',
          priority: newsItem.priority || '4',
          package: newsItem.package || '',
          language: newsItem.language || '1',
          groupId: newsItem.groupId || null,
          imageUrls: newsItem.imageUrls || [],
          fallbackImageUrl: newsItem.fallbackImageUrl || '',
          metadata: newsItem.metadata || {},
          aiProcessed: newsItem.aiProcessed || true,
          inferredFromTitle: newsItem.inferredFromTitle || false,
          categoryHints: newsItem.categoryHints || [],
          slug: newsSlug,
          url: `/haber/${newsSlug}`,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          status: 'active'
        }

        console.log('💾 Saving news item:', {
          id: enhancedNewsItem.id,
          category: enhancedNewsItem.category,
          title: enhancedNewsItem.title.substring(0, 50) + '...'
        })

        if (existingDocs.empty) {
          // Yeni haber ekle
          await addDoc(collection(db, 'aa_news'), enhancedNewsItem)
          successCount++
          console.log(`✅ Yeni haber kaydedildi: ${newsSlug}`)
        } else {
          // Mevcut haberi güncelle
          const docRef = doc(db, 'aa_news', existingDocs.docs[0].id)
          const updateData = {
            ...enhancedNewsItem,
            createdAt: existingDocs.docs[0].data()?.createdAt || Timestamp.now()
          }
          const result = await safeUpdateDoc(docRef, updateData)
          
          if (result.success) {
            successCount++
            console.log(`♻️ Haber güncellendi: ${newsSlug}`)
          } else {
            console.error('❌ Update failed:', result.error)
            errorCount++
          }
        }
      } catch (error) {
        console.error('❌ Save news error:', error)
        console.error('❌ Failed news item:', {
          id: newsItem?.id,
          title: newsItem?.title,
          category: newsItem?.category
        })
        errorCount++
      }
    }

    console.log(`📊 Save summary: ${successCount} success, ${errorCount} errors`)
    return { success: successCount, errors: errorCount }
  }

  // Haber slug oluştur (SEO friendly URL)
  private createNewsSlug(title: string, id: string): string {
    // Türkçe karakterleri değiştir
    const turkishChars: Record<string, string> = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    }
    
    let slug = title.toLowerCase()
    
    // Türkçe karakterleri değiştir
    Object.keys(turkishChars).forEach(char => {
      slug = slug.replace(new RegExp(char, 'g'), turkishChars[char])
    })
    
    // Sadece harf, rakam ve boşluk bırak
    slug = slug.replace(/[^a-z0-9\s]/g, '')
    
    // Boşlukları tire ile değiştir
    slug = slug.replace(/\s+/g, '-')
    
    // Ardışık tireleri tek tire yap
    slug = slug.replace(/-+/g, '-')
    
    // Başındaki ve sonundaki tireleri temizle
    slug = slug.replace(/^-+|-+$/g, '')
    
    // Çok uzun ise kısalt (75 karakter)
    if (slug.length > 75) {
      slug = slug.substring(0, 75).replace(/-[^-]*$/, '')
    }
    
    // Sonuna ID'nin son 5 hanesini ekle (daha kısa ve temiz)
    const shortId = id.slice(-5)
    return `haber-${slug}-${shortId}`
  }
}

// Default export
export const aaApiService = new AAApiService()
