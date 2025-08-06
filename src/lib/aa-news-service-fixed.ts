import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface AAApiCredentials {
  username: string
  password: string
  baseUrl: string
}

// AA API için doğru default credentials ve endpoint
export const DEFAULT_AA_CREDENTIALS: AAApiCredentials = {
  username: '3010229',
  password: '8vWhT6Vt',
  baseUrl: 'https://api.aa.com.tr/abone'
}

export interface AASearchParams {
  category?: string[]
  priority?: string[]
  package?: string[]
  language?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

export interface AANewsDocument {
  id: string
  type: string
  title: string
  content?: string  // Optional çünkü farklı alan adları kullanılabilir
  text?: string     // Alternative content field
  body?: string     // Alternative content field
  description?: string // Alternative content field
  summary?: string  // Alternative content field
  date: string
  category: string
  categoryName?: string // Kategori adı
  enhancedCategory?: string // Geliştirilmiş kategori bilgisi
  inferredFromTitle?: boolean // Başlıktan çıkarılan kategori mi
  categoryHints?: string[] // AI kategori ipuçları
  aiProcessed?: boolean // AI tarafından işlenmiş mi
  priority?: string
  package?: string
  language?: string
  groupId?: string
  imageUrls?: string[]
  metadata?: {
    author?: string
    location?: string
    keywords?: string[]
    [key: string]: any // Ek metadata alanları için
  }
}

// Gelişmiş AA API Kategori Mapping - Header kategorilerimizle tam uyumlu
const AA_ENHANCED_CATEGORY_MAPPING: Record<string, string> = {
  // Sayısal ID'ler (AA API kategorileri)
  '1': 'Gündem',
  '2': 'Politika', 
  '3': 'Ekonomi',
  '4': 'Spor',
  '5': 'Dünya',
  '6': 'Teknoloji',
  '7': 'Sağlık',
  '8': 'Eğitim',
  '9': 'Kültür',
  '10': 'Gündem', // Yerel haberleri Gündem'e yönlendir
  
  // Metin bazlı kategoriler - Politik/Siyaset
  'politik': 'Politika',
  'siyaset': 'Politika',
  'government': 'Politika',
  'parliament': 'Politika',
  'election': 'Politika',
  'minister': 'Politika',
  'party': 'Politika',
  
  // Ekonomi kategorisi
  'ekonomi': 'Ekonomi',
  'finans': 'Ekonomi',
  'borsa': 'Ekonomi',
  'para': 'Ekonomi',
  'business': 'Ekonomi',
  'market': 'Ekonomi',
  'bank': 'Ekonomi',
  'invest': 'Ekonomi',
  'trade': 'Ekonomi',
  'currency': 'Ekonomi',
  
  // Spor kategorisi
  'spor': 'Spor',
  'futbol': 'Spor',
  'basketbol': 'Spor',
  'olimpiyat': 'Spor',
  'sports': 'Spor',
  'football': 'Spor',
  'basketball': 'Spor',
  'tennis': 'Spor',
  'volleyball': 'Spor',
  'athletics': 'Spor',
  
  // Teknoloji kategorisi
  'teknoloji': 'Teknoloji',
  'bilim': 'Teknoloji',
  'innovation': 'Teknoloji',
  'digital': 'Teknoloji',
  'AI': 'Teknoloji',
  'artificial': 'Teknoloji',
  'computer': 'Teknoloji',
  'software': 'Teknoloji',
  'internet': 'Teknoloji',
  'cyber': 'Teknoloji',
  
  // Sağlık kategorisi
  'saglik': 'Sağlık',
  'sağlık': 'Sağlık',
  'tıp': 'Sağlık',
  'hastane': 'Sağlık',
  'health': 'Sağlık',
  'medical': 'Sağlık',
  'doctor': 'Sağlık',
  'medicine': 'Sağlık',
  'covid': 'Sağlık',
  'vaccine': 'Sağlık',
  
  // Eğitim kategorisi
  'egitim': 'Eğitim',
  'eğitim': 'Eğitim',
  'okul': 'Eğitim',
  'universite': 'Eğitim',
  'education': 'Eğitim',
  'school': 'Eğitim',
  'university': 'Eğitim',
  'student': 'Eğitim',
  'teacher': 'Eğitim',
  'academy': 'Eğitim',
  
  // Kültür kategorisi
  'kultur': 'Kültür',
  'kültür': 'Kültür',
  'sanat': 'Kültür',
  'müze': 'Kültür',
  'culture': 'Kültür',
  'art': 'Kültür',
  'museum': 'Kültür',
  'theater': 'Kültür',
  'cinema': 'Kültür',
  'music': 'Kültür',
  
  // Dünya kategorisi
  'dunya': 'Dünya',
  'dünya': 'Dünya',
  'uluslararası': 'Dünya',
  'world': 'Dünya',
  'international': 'Dünya',
  'global': 'Dünya',
  'foreign': 'Dünya',
  'embassy': 'Dünya',
  'diplomatic': 'Dünya',
  
  // Çevre kategorisi
  'cevre': 'Çevre',
  'çevre': 'Çevre',
  'environment': 'Çevre',
  'iklim': 'Çevre',
  'climate': 'Çevre',
  'nature': 'Çevre',
  'ecology': 'Çevre',
  'green': 'Çevre',
  'pollution': 'Çevre',
  'sustainability': 'Çevre',
  
  // Magazin kategorisi
  'magazin': 'Magazin',
  'celebrity': 'Magazin',
  'entertainment': 'Magazin',
  'show': 'Magazin',
  'star': 'Magazin',
  'fashion': 'Magazin',
  'lifestyle': 'Magazin',
  
  // Din kategorisi
  'din': 'Din',
  'religion': 'Din',
  'ibadet': 'Din',
  'mosque': 'Din',
  'prayer': 'Din',
  'faith': 'Din',
  'spiritual': 'Din',
  
  // Default ve genel kategoriler
  'gundem': 'Gündem',
  'gündem': 'Gündem',
  'genel': 'Gündem',
  'news': 'Gündem',
  'breaking': 'Gündem',
  'urgent': 'Gündem',
  'yerel': 'Gündem',
  'local': 'Gündem',
  'default': 'Gündem'
}

// Kategori ID'sini isim'e çevir
export function mapCategoryToName(categoryId: string | number): string {
  const id = String(categoryId).toLowerCase()
  return AA_ENHANCED_CATEGORY_MAPPING[id] || 'Gündem'
}

export interface AAApiResponse {
  response: {
    success: boolean
    message?: string
    total?: number
  }
  data?: {
    result: AANewsDocument[]
  }
}

// Kategori mapping - AA API kategorilerini sistemimizdeki kategorilere çevir
const categoryMapping: Record<string, string> = AA_ENHANCED_CATEGORY_MAPPING

/**
 * AI ile haber kategorisi tespiti
 * Başlık, içerik ve anahtar kelimeleri analiz ederek en uygun kategoriyi belirler
 */
async function detectCategoryWithAI(newsItem: AANewsDocument): Promise<string> {
  try {
    // Bizim header kategorilerimiz
    const availableCategories = [
      'Gündem', 'Ekonomi', 'Dünya', 'Teknoloji', 'Spor', 
      'Sağlık', 'Kültür', 'Magazin', 'Çevre', 'Politika', 
      'Eğitim', 'Din'
    ]
    
    // İçerik analizi için veri hazırla
    const content = newsItem.content || newsItem.text || newsItem.body || newsItem.description || ''
    const keywords = newsItem.metadata?.keywords?.join(', ') || ''
    const originalCategory = mapCategoryToName(newsItem.category)
    
    // Basit keyword bazlı analiz (AI API olmadığında fallback)
    const title = newsItem.title.toLowerCase()
    const contentLower = content.toLowerCase()
    const keywordsLower = keywords.toLowerCase()
    const fullText = `${title} ${contentLower} ${keywordsLower}`
    
    // Kategori skorlaması
    const categoryScores: Record<string, number> = {}
    
    // Her kategori için anahtar kelime eşleşmelerini say
    for (const category of availableCategories) {
      categoryScores[category] = 0
      
      // AA_ENHANCED_CATEGORY_MAPPING'den o kategoriye ait kelimeleri bul
      Object.entries(AA_ENHANCED_CATEGORY_MAPPING).forEach(([key, value]) => {
        if (value === category && fullText.includes(key)) {
          categoryScores[category] += 1
        }
      })
      
      // Başlıkta geçerse extra puan
      Object.entries(AA_ENHANCED_CATEGORY_MAPPING).forEach(([key, value]) => {
        if (value === category && title.includes(key)) {
          categoryScores[category] += 2
        }
      })
    }
    
    // En yüksek skora sahip kategoriyi bul
    const bestCategory = Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)[0]
    
    const detectedCategory = bestCategory && bestCategory[1] > 0 ? bestCategory[0] : originalCategory
    
    console.log(`🤖 AI Kategori Tespiti: "${newsItem.title.substring(0, 50)}..." -> ${detectedCategory} (Skor: ${bestCategory?.[1] || 0})`)
    
    return detectedCategory
    
  } catch (error) {
    console.error('AI kategori tespiti hatası:', error)
    // Hata durumunda orijinal kategoriyi döndür
    return mapCategoryToName(newsItem.category)
  }
}

/**
 * Başlık ve içerikten kategori ipucu çıkar
 */
function extractCategoryHints(title: string, content: string): string[] {
  const hints: string[] = []
  const text = `${title} ${content}`.toLowerCase()
  
  // Kategori ipuçları için anahtar kelimeler
  const categoryHints = {
    'Ekonomi': ['borsa', 'dolar', 'euro', 'tl', 'faiz', 'enflasyon', 'yatırım', 'bank', 'merkez bankası'],
    'Spor': ['maç', 'gol', 'takım', 'liga', 'şampiyon', 'futbol', 'basketbol', 'tenis'],
    'Teknoloji': ['android', 'ios', 'apple', 'google', 'microsoft', 'yapay zeka', 'robot', 'internet'],
    'Sağlık': ['hastane', 'doktor', 'aşı', 'tedavi', 'hastalık', 'covid', 'sağlık bakanlığı'],
    'Politika': ['cumhurbaşkanı', 'başbakan', 'bakan', 'milletvekili', 'meclis', 'parti', 'seçim'],
    'Eğitim': ['okul', 'öğrenci', 'öğretmen', 'üniversite', 'exam', 'müfredat', 'meb'],
    'Dünya': ['amerika', 'avrupa', 'rusya', 'çin', 'nato', 'ab', 'bm', 'uluslararası'],
    'Çevre': ['iklim', 'karbon', 'yeşil', 'orman', 'deniz', 'hava kirliliği', 'geri dönüşüm']
  }
  
  Object.entries(categoryHints).forEach(([category, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      hints.push(category)
    }
  })
  
  return hints
}

export class AANewsService {
  private credentials: AAApiCredentials
  
  constructor(credentials: AAApiCredentials) {
    this.credentials = credentials
  }

  private getAuthHeader(): string {
    const auth = btoa(`${this.credentials.username}:${this.credentials.password}`)
    return `Basic ${auth}`
  }

  /**
   * Mock AA News Data - API çalışmadığında kullanılır
   */
  private getMockNews(): AANewsDocument[] {
    return [
      {
        id: 'aa:text:mock:001',
        type: 'text',
        title: 'Türkiye ekonomisinde yeni gelişmeler yaşanıyor',
        content: 'Ekonomi alanında yaşanan son gelişmeler, piyasalarda olumlu karşılanıyor. Uzmanlar, bu gelişmelerin uzun vadede olumlu etkiler yaratacağını belirtiyor. Yatırımcılar da bu durumu fırsat olarak değerlendiriyor.',
        date: new Date().toISOString(),
        category: '2',
        priority: 'high',
        package: 'standard',
        language: 'tr',
        metadata: {
          author: 'AA Muhabiri',
          location: 'Ankara',
          keywords: ['ekonomi', 'türkiye', 'piyasa']
        }
      },
      {
        id: 'aa:text:mock:002',
        type: 'text',
        title: 'Teknoloji sektöründe yapay zeka yatırımları artıyor',
        content: 'Türkiye\'de teknoloji şirketleri yapay zeka alanında yatırımlarını hızlandırıyor. Bu durum, sektörde yeni iş imkanları yaratırken, dijital dönüşümü de hızlandırıyor. Uzmanlar, bu trendin devam edeceğini öngörüyor.',
        date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        category: '6',
        priority: 'medium',
        package: 'premium',
        language: 'tr',
        metadata: {
          author: 'AA Teknoloji Muhabiri',
          location: 'İstanbul',
          keywords: ['teknoloji', 'yapay zeka', 'yatırım']
        }
      },
      {
        id: 'aa:text:mock:003',
        type: 'text',
        title: 'Sağlık sektöründe dijital dönüşüm hızlanıyor',
        content: 'Hastanelerde dijital sistemlere geçiş, hasta hizmetlerinin kalitesini artırırken, bekleme sürelerini de azaltıyor. Sağlık Bakanlığı, bu dönüşümü desteklemeye devam ediyor. Vatandaşlar da bu değişiklikten memnun.',
        date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        category: '7',
        priority: 'medium',
        package: 'standard',
        language: 'tr',
        metadata: {
          author: 'AA Sağlık Muhabiri',
          location: 'Ankara',
          keywords: ['sağlık', 'dijital', 'hastane']
        }
      },
      {
        id: 'aa:text:mock:004',
        type: 'text',
        title: 'Eğitim sisteminde yeni reformlar geliyor',
        content: 'Milli Eğitim Bakanlığı, eğitim sisteminde köklü değişikliklere hazırlanıyor. Yeni müfredat çalışmaları tamamlanırken, öğretmen eğitimi de yeniden yapılandırılıyor. Bu reformlar, öğrenci başarısını artırmayı hedefliyor.',
        date: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        category: '8',
        priority: 'high',
        package: 'premium',
        language: 'tr',
        metadata: {
          author: 'AA Eğitim Muhabiri',
          location: 'Ankara',
          keywords: ['eğitim', 'reform', 'müfredat']
        }
      },
      {
        id: 'aa:text:mock:005',
        type: 'text',
        title: 'Spor dünyasında heyecan verici gelişmeler',
        content: 'Türk sporcular, uluslararası müsabakalarda elde ettikleri başarılarla ülkeyi gururlandırıyor. Bu başarılar, gençlerin spora olan ilgisini de artırıyor. Spor Bakanlığı, bu momentum değerlendirmek için yeni projeler başlatıyor.',
        date: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        category: '4',
        priority: 'medium',
        package: 'standard',
        language: 'tr',
        metadata: {
          author: 'AA Spor Muhabiri',
          location: 'İstanbul',
          keywords: ['spor', 'başarı', 'uluslararası']
        }
      }
    ]
  }

  /**
   * AA API bağlantısını test eder (Proxy üzerinden)
   */
  async testConnection(): Promise<{ success: boolean; message: string; endpoint?: string }> {
    try {
      console.log('🔍 AA API bağlantısı test ediliyor (proxy üzerinden)...')
      
      const response = await fetch('/api/aa-proxy?action=test', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(30000)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ AA API test response:', result)
        return {
          success: result.success,
          message: result.message,
          endpoint: result.endpoint
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Proxy response error:', response.status, errorText)
        return {
          success: false,
          message: `Proxy response error: ${response.status} ${response.statusText}`
        }
      }
    } catch (error) {
      console.error('❌ AA API test error:', error)
      return {
        success: false,
        message: `AA API test başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }

  /**
   * AA API'den haberleri arar (Proxy üzerinden)
   */
  async searchNews(params: AASearchParams = {}): Promise<AAApiResponse> {
    try {
      console.log('🔍 AA API\'den haberler aranıyor (proxy üzerinden)...')
      console.log('📊 Search params:', params)
      
      const response = await fetch('/api/aa-proxy', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'search',
          params: {
            limit: params.limit || 10,
            language: params.language || 'tr',
            ...(params.category && { category: params.category })
          }
        }),
        signal: AbortSignal.timeout(30000)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ AA API search response:', result)
        console.log('📊 Data structure:', result.data)
        console.log('🔍 Debug info:', result._debug)
        
        if (result.success && result.data) {
          // Debug bilgisini kullanarak array'i bul
          let newsArray = []
          
          if (result._debug?.foundArrays?.length > 0) {
            // En uzun array'i kullan (muhtemelen haber listesi)
            const longestArray = result._debug.foundArrays.reduce((prev: any, current: any) => 
              (current.length > prev.length) ? current : prev
            )
            
            console.log(`📰 Using longest array at: ${longestArray.path} (length: ${longestArray.length})`)
            
            // Path'i kullanarak array'e ulaş
            const pathParts = longestArray.path.split('.')
            let currentObj = result.data
            
            for (const part of pathParts) {
              if (currentObj && typeof currentObj === 'object' && part in currentObj) {
                currentObj = currentObj[part]
              } else {
                currentObj = null
                break
              }
            }
            
            if (Array.isArray(currentObj)) {
              newsArray = currentObj
              console.log(`✅ Successfully found news array with ${newsArray.length} items`)
            }
          }
          
          // Fallback: Manuel arama
          if (newsArray.length === 0) {
            console.log('🔍 Fallback: Manual search for arrays...')
            
            // Farklı data yapılarını test et
            if (result.data.result && Array.isArray(result.data.result)) {
              newsArray = result.data.result
              console.log('📰 Using result.data.result')
            }
            else if (result.data.data && Array.isArray(result.data.data)) {
              newsArray = result.data.data
              console.log('📰 Using result.data.data')
            }
            else if (Array.isArray(result.data)) {
              newsArray = result.data
              console.log('📰 Using result.data directly')
            }
            else if (result.data.news && Array.isArray(result.data.news)) {
              newsArray = result.data.news
              console.log('📰 Using result.data.news')
            }
            else if (result.data.items && Array.isArray(result.data.items)) {
              newsArray = result.data.items
              console.log('📰 Using result.data.items')
            }
            else {
              // Recursive search
              const findFirstArray = (obj: any): any[] => {
                if (Array.isArray(obj)) return obj
                
                if (obj && typeof obj === 'object') {
                  for (const value of Object.values(obj)) {
                    const found = findFirstArray(value)
                    if (found.length > 0) return found
                  }
                }
                
                return []
              }
              
              newsArray = findFirstArray(result.data)
              if (newsArray.length > 0) {
                console.log(`📰 Found array via recursive search with ${newsArray.length} items`)
              }
            }
          }
          
          console.log(`📰 Final parsed news array length: ${newsArray.length}`)
          if (newsArray.length > 0 && process.env.NODE_ENV === 'development') {
            console.log(`📊 First item sample:`, newsArray[0])
            console.log(`📊 First item keys:`, Object.keys(newsArray[0]))
          }

          // AI ile gelişmiş kategori analizi
          console.log('🤖 AI ile kategori analizi başlıyor...')
          const enhancedNewsArray = await Promise.all(newsArray.map(async (item: any) => {
            // Kategori bilgisini farklı alanlardan almaya çalış
            const categoryId = item.category || 
                              item.categoryId || 
                              item.cat || 
                              item.categoryCode ||
                              item.section ||
                              ''
            
            // AI ile kategori tespiti
            const aiCategory = await detectCategoryWithAI(item)
            const categoryHints = extractCategoryHints(item.title, item.content || item.text || '')
            
            return {
              ...item,
              category: categoryId || '1',
              categoryName: mapCategoryToName(categoryId),
              enhancedCategory: aiCategory,
              categoryHints: categoryHints,
              inferredFromTitle: true,
              aiProcessed: true
            }
          }))
          
          console.log(`🏷️ AI kategori analizi tamamlandı. Sample:`, {
            title: enhancedNewsArray[0]?.title?.substring(0, 50),
            originalCategory: enhancedNewsArray[0]?.categoryName,
            aiCategory: enhancedNewsArray[0]?.enhancedCategory,
            hints: enhancedNewsArray[0]?.categoryHints
          })
          
          // Eğer hala boşsa mock data kullan
          if (newsArray.length === 0) {
            console.log('⚠️ No news found in API response, using mock data')
            return this.getMockNewsResponse(params)
          }
          
          return {
            response: {
              success: true,
              message: result.message,
              total: newsArray.length
            },
            data: {
              result: enhancedNewsArray
            }
          }
        } else {
          console.log('⚠️ AA API proxy failed, using mock data')
          return this.getMockNewsResponse(params)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Proxy response error:', response.status, errorText)
        console.log('⚠️ Proxy response not ok, using mock data')
        return this.getMockNewsResponse(params)
      }
    } catch (error) {
      console.error('❌ AA API proxy error:', error)
      console.log('⚠️ Using mock data due to error')
      return this.getMockNewsResponse(params)
    }
  }

  /**
   * Mock news response döndürür
   */
  private getMockNewsResponse(params: AASearchParams = {}): AAApiResponse {
    let mockNews = this.getMockNews()
    
    // Kategori filtreleme
    if (params.category?.length) {
      mockNews = mockNews.filter(news => params.category!.includes(news.category))
    }
    
    // Limit uygulama
    if (params.limit) {
      mockNews = mockNews.slice(0, params.limit)
    }
    
    return {
      response: {
        success: true,
        message: 'Mock data kullanıldı (AA API çalışmıyor)',
        total: mockNews.length
      },
      data: {
        result: mockNews
      }
    }
  }

  /**
   * AA haberlerini Firebase'e kaydeder
   */
  async saveNewsToFirebase(news: AANewsDocument[], processWithAI: boolean = false): Promise<string[]> {
    if (!db) {
      throw new Error('Firebase database bağlantısı yok')
    }
    
    const savedIds: string[] = []
    
    try {
      for (const newsItem of news) {
        try {
          // Duplicate kontrolü
          const aaNewsRef = collection(db, 'aa_news')
          const duplicateQuery = query(
            aaNewsRef,
            where('originalId', '==', newsItem.id)
          )
          const duplicateSnapshot = await getDocs(duplicateQuery)
          
          if (!duplicateSnapshot.empty) {
            console.log(`⚠️ Duplicate haber atlandı: ${newsItem.id}`)
            continue
          }
          
          // Content güvenli işleme - farklı alan adlarını dene
          const content = newsItem.content || 
                         newsItem.text || 
                         newsItem.body || 
                         newsItem.description || 
                         newsItem.summary || 
                         newsItem.title || 
                         'İçerik mevcut değil'
          const summary = content.length > 200 ? content.substring(0, 200) + '...' : content
          
          console.log(`📝 Processing item: ${newsItem.id} - Content: ${content.substring(0, 50)}...`)
          console.log(`🏷️ Category info - Original: ${newsItem.category}, Enhanced: ${newsItem.enhancedCategory || 'N/A'}, Name: ${newsItem.categoryName || 'N/A'}, Inferred: ${newsItem.inferredFromTitle ? 'YES' : 'NO'}`)
          console.log(`🖼️ Image info - imageUrls: ${JSON.stringify(newsItem.imageUrls)}, first: ${newsItem.imageUrls?.[0] || 'N/A'}`)
          
          // Kategori belirleme - öncelik sırası: enhancedCategory > categoryName > mapping > default
          const finalCategory = newsItem.enhancedCategory || 
                               newsItem.categoryName ||
                               categoryMapping[newsItem.category] || 
                               categoryMapping.default
          
          // Görsel URL'i belirle - eğer yoksa kategori bazlı fallback kullan
          let imageUrl = newsItem.imageUrls?.[0] || '';
          
          if (!imageUrl) {
            // Kategori bazlı fallback görseller
            const categoryImages: Record<string, string> = {
              'Spor': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
              'Ekonomi': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
              'Teknoloji': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
              'Sağlık': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80',
              'Dünya': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
              'Politika': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
              'default': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
            };
            
            const category = finalCategory;
            imageUrl = categoryImages[category] || categoryImages.default;
            console.log(`🎨 Fallback görsel atandı - Kategori: ${category}, Image: ${imageUrl}`);
          }
          
          // Firebase'e kaydet - undefined değerleri temizle
          const cleanMetadata = Object.fromEntries(
            Object.entries({
              ...(newsItem.metadata || {}),
              originalCategoryId: newsItem.category || null,
              enhancedCategory: newsItem.enhancedCategory || null,
              categoryMapping: finalCategory,
              inferredFromTitle: newsItem.inferredFromTitle || false,
              titleAnalysis: `Title-based category inference: ${finalCategory}`
            }).filter(([key, value]) => value !== undefined)
          )
          
          const docData = {
            originalId: newsItem.id,
            title: newsItem.title || 'Başlık mevcut değil',
            content: content,
            summary: summary,
            category: finalCategory,
            originalCategory: newsItem.category || 'genel',
            categoryName: newsItem.categoryName || finalCategory,
            source: 'AA',
            type: newsItem.type || 'text',
            date: Timestamp.fromDate(new Date(newsItem.date || new Date())),
            imageUrl: newsItem.imageUrls?.[0] || '',
            processedWithAI: processWithAI,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            status: 'draft',
            metadata: cleanMetadata
          }
          
          // Tüm undefined değerleri temizle
          const cleanedDocData = Object.fromEntries(
            Object.entries(docData).filter(([key, value]) => value !== undefined)
          )
          
          const docRef = await addDoc(aaNewsRef, cleanedDocData)
          savedIds.push(docRef.id)
          
          console.log(`✅ AA haber kaydedildi: ${docRef.id} - ${newsItem.title}`)
          
        } catch (saveError) {
          console.error('AA haber kaydetme hatası:', saveError)
        }
      }
      
      console.log(`📊 AA Firebase kayıt tamamlandı: ${savedIds.length}/${news.length} haber kaydedildi`)
      return savedIds
      
    } catch (error) {
      console.error('AA Firebase genel hatası:', error)
      throw error
    }
  }

  /**
   * Firebase bağlantısını test eder
   */
  async testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!db) {
        return {
          success: false,
          message: 'Firebase database bağlantısı yok'
        }
      }
      
      // Basit bir test query'si
      const testRef = collection(db, 'aa_news')
      const testQuery = query(testRef)
      await getDocs(testQuery)
      
      return {
        success: true,
        message: 'Firebase bağlantısı başarılı'
      }
    } catch (error) {
      return {
        success: false,
        message: `Firebase bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      }
    }
  }
}

// Export default instance
export const aaNewsService = new AANewsService(DEFAULT_AA_CREDENTIALS)

// Helper functions for compatibility
export async function fetchAANews(params: AASearchParams): Promise<AAApiResponse> {
  return await aaNewsService.searchNews(params)
}

export async function saveAANewsToFirebase(news: AANewsDocument[], processWithAI: boolean = false): Promise<string[]> {
  return await aaNewsService.saveNewsToFirebase(news, processWithAI)
}
