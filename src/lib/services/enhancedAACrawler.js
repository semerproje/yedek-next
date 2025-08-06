// Enhanced AA Crawler with Firebase Integration and Category Management

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'

// Firebase config - gerçek config'inizi buraya ekleyin
const firebaseConfig = {
  // Firebase yapılandırmanız buraya gelecek
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// AA Kategori Mapping - Admin panelinden güncellenebilir
const AA_CATEGORY_MAPPING = {
  '1': 'gundem',
  '2': 'spor', 
  '3': 'ekonomi',
  '4': 'saglik',
  '5': 'teknoloji',
  '6': 'politika',
  '7': 'kultur',
  '8': 'magazin',
  '9': 'cevre',
  '10': 'egitim',
  '11': 'dunya',
  '12': 'ekonomi',
  '13': 'magazin',
  '14': 'din'
}

// Enhanced AA Crawler Class
export class EnhancedAACrawler {
  constructor() {
    this.baseUrl = 'http://localhost:4000/api/aa-proxy'
    this.db = db
  }

  // Kategori eşleştirme
  mapAACategory(aaCategoryId) {
    return AA_CATEGORY_MAPPING[aaCategoryId?.toString()] || 'gundem'
  }

  // AA'dan haber ara
  async searchNews(params = {}) {
    const defaultParams = {
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Son 24 saat
      end_date: 'NOW',
      filter_category: '1,2,3,4,5,6,7,8,9,10,11,12,13,14', // Tüm kategoriler
      filter_type: '2,3', // Fotoğraf ve video
      filter_language: '1', // Türkçe
      limit: 50,
      ...params
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          params: defaultParams
        })
      })

      const data = await response.json()
      
      if (!data.success || !data.data?.data?.result) {
        throw new Error(data.error || 'Haber arama başarısız')
      }

      return {
        news: data.data.data.result,
        total: data.data.data.total,
        success: true
      }
    } catch (error) {
      console.error('AA Search Error:', error)
      return { success: false, error: error.message, news: [], total: 0 }
    }
  }

  // Haber detayını al
  async getNewsDetail(newsId, type) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'document',
          newsId: newsId,
          type: type,
          format: type === 'text' ? 'newsml29' : 'web'
        })
      })

      const data = await response.json()
      
      if (!data.success || !data.details) {
        throw new Error(data.error || 'Haber detayı alınamadı')
      }

      return { success: true, details: data.details }
    } catch (error) {
      console.error('AA Detail Error:', error)
      return { success: false, error: error.message }
    }
  }

  // Firebase'de var olan haberi kontrol et
  async isNewsExists(originalId) {
    try {
      const q = query(
        collection(this.db, 'news'),
        where('originalId', '==', originalId),
        where('source', '==', 'anadolu_ajansi')
      )
      
      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error('News exists check error:', error)
      return false
    }
  }

  // Haberi Firebase'e kaydet
  async saveNewsToFirebase(newsData) {
    try {
      // Mevcut haber kontrolü
      const exists = await this.isNewsExists(newsData.originalId)
      if (exists) {
        console.log(`⚠️ Haber zaten mevcut: ${newsData.originalId}`)
        return { success: false, reason: 'already_exists' }
      }

      // Firebase formatına çevir
      const firebaseData = {
        ...newsData,
        publishedAt: Timestamp.fromDate(new Date(newsData.publishedAt)),
        crawledAt: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        views: 0
      }

      const docRef = await addDoc(collection(this.db, 'news'), firebaseData)
      
      console.log(`✅ Haber kaydedildi: ${docRef.id} - ${newsData.title}`)
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Firebase save error:', error)
      return { success: false, error: error.message }
    }
  }

  // AA haberini Firebase formatına çevir
  formatNewsForFirebase(aaNews, details) {
    return {
      // Temel bilgiler
      title: details.title || aaNews.title,
      content: details.content || details.summary || '',
      summary: details.summary || details.title?.substring(0, 200) || '',
      
      // Kategori ve etiketler
      category: this.mapAACategory(aaNews.category),
      originalCategory: aaNews.category?.toString() || '',
      tags: details.tags || [],
      
      // Medya içerikleri
      imageUrl: details.imageUrl || (details.photos?.[0]?.url) || '',
      images: details.photos || [],
      videos: details.videos || [],
      hasMedia: (details.photos?.length > 0) || (details.videos?.length > 0),
      
      // AA kaynak bilgileri
      source: 'anadolu_ajansi',
      sourceUrl: details.sourceUrl || '',
      originalId: aaNews.id,
      aaType: aaNews.type,
      groupId: aaNews.group_id || '',
      
      // Metadata
      author: details.author || 'Anadolu Ajansı',
      publishedAt: aaNews.date,
      
      // Durum
      status: 'published',
      featured: false,
      
      // Analitik
      views: 0
    }
  }

  // Toplu haber çekme ve kaydetme
  async crawlAndSaveNews(searchParams = {}) {
    console.log('🚀 AA Crawler başlatılıyor...')
    
    try {
      // 1. Haberleri ara
      const searchResult = await this.searchNews(searchParams)
      if (!searchResult.success) {
        throw new Error(searchResult.error)
      }

      console.log(`📰 ${searchResult.news.length} haber bulundu (Toplam: ${searchResult.total})`)
      
      const results = {
        total: searchResult.news.length,
        saved: 0,
        skipped: 0,
        errors: 0,
        details: []
      }

      // 2. Her haber için detay al ve kaydet
      for (const [index, news] of searchResult.news.entries()) {
        console.log(`\n[${index + 1}/${searchResult.news.length}] İşleniyor: ${news.title}`)
        
        try {
          // Detay al
          const detailResult = await this.getNewsDetail(news.id, news.type)
          if (!detailResult.success) {
            console.log(`❌ Detay alınamadı: ${detailResult.error}`)
            results.errors++
            results.details.push({
              id: news.id,
              title: news.title,
              status: 'error',
              reason: detailResult.error
            })
            continue
          }

          // Firebase formatına çevir
          const newsData = this.formatNewsForFirebase(news, detailResult.details)
          
          // Firebase'e kaydet
          const saveResult = await this.saveNewsToFirebase(newsData)
          
          if (saveResult.success) {
            results.saved++
            results.details.push({
              id: news.id,
              firebaseId: saveResult.id,
              title: news.title,
              category: newsData.category,
              status: 'saved'
            })
          } else if (saveResult.reason === 'already_exists') {
            results.skipped++
            results.details.push({
              id: news.id,
              title: news.title,
              status: 'skipped',
              reason: 'already_exists'
            })
          } else {
            results.errors++
            results.details.push({
              id: news.id,
              title: news.title,
              status: 'error',
              reason: saveResult.error
            })
          }

          // Rate limiting - AA API'sini aşırı yüklememek için
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          console.log(`❌ Haber işleme hatası: ${error.message}`)
          results.errors++
          results.details.push({
            id: news.id,
            title: news.title,
            status: 'error',
            reason: error.message
          })
        }
      }

      // 3. Sonuç raporu
      console.log('\n🎉 AA Crawler tamamlandı!')
      console.log('📊 ÖZET RAPOR:')
      console.log(`📰 Toplam haber: ${results.total}`)
      console.log(`✅ Kaydedilen: ${results.saved}`)
      console.log(`⏭️ Atlanan: ${results.skipped}`)
      console.log(`❌ Hatalı: ${results.errors}`)

      // Kategori bazında özet
      const categoryStats = {}
      results.details.filter(d => d.status === 'saved').forEach(item => {
        const cat = item.category || 'bilinmeyen'
        categoryStats[cat] = (categoryStats[cat] || 0) + 1
      })

      console.log('\n📂 Kategori Dağılımı:')
      Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} haber`)
      })

      return results

    } catch (error) {
      console.error('❌ Crawler genel hatası:', error)
      throw error
    }
  }

  // Belirli kategorideki haberleri çek
  async crawlByCategory(categoryId, limit = 20) {
    const searchParams = {
      filter_category: categoryId.toString(),
      limit: limit
    }
    
    console.log(`🏷️ Kategori ${categoryId} için crawler başlatılıyor...`)
    return await this.crawlAndSaveNews(searchParams)
  }

  // Son dakika haberlerini çek
  async crawlBreakingNews() {
    const searchParams = {
      start_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Son 2 saat
      filter_category: '1', // Genel/Gündem
      limit: 10
    }
    
    console.log('🚨 Son dakika haberleri çekiliyor...')
    return await this.crawlAndSaveNews(searchParams)
  }
}

// Kullanım örnekleri
async function testEnhancedCrawler() {
  const crawler = new EnhancedAACrawler()
  
  try {
    // Tüm kategorilerden son 24 saatteki haberleri çek
    await crawler.crawlAndSaveNews()
    
    // Veya belirli bir kategori
    // await crawler.crawlByCategory(3, 10) // Ekonomi kategorisinden 10 haber
    
    // Veya son dakika
    // await crawler.crawlBreakingNews()
    
  } catch (error) {
    console.error('Test hatası:', error)
  }
}

// Export for use in other files
export default EnhancedAACrawler

// Eğer bu dosya doğrudan çalıştırılıyorsa test et
if (typeof require !== 'undefined' && require.main === module) {
  testEnhancedCrawler()
}
