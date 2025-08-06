// Advanced AA News Crawler with AI Enhancement
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// AA Kategori Mapping
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

// Priority Mapping
const AA_PRIORITY_MAPPING = {
  '1': 'flash', // Flaş
  '2': 'urgent', // Acil
  '3': 'important', // Önemli
  '4': 'routine', // Rutin
  '5': 'special', // Özel
  '6': 'archive' // Arşiv
}

export class AdvancedAACrawler {
  constructor() {
    this.baseUrl = 'http://localhost:4000/api/aa-proxy'
    this.db = db
    this.storage = storage
  }

  // Kategori eşleştirme
  mapAACategory(aaCategoryId) {
    return AA_CATEGORY_MAPPING[aaCategoryId?.toString()] || 'gundem'
  }

  // Öncelik eşleştirme
  mapAAPriority(aaPriorityId) {
    return AA_PRIORITY_MAPPING[aaPriorityId?.toString()] || 'routine'
  }

  // AA'dan haberleri ara
  async searchNews(params = {}) {
    const defaultParams = {
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end_date: 'NOW',
      filter_category: '1,2,3,4,5,6,7,8,9,10,11,12,13,14',
      filter_type: '1,2,3', // Text, Fotoğraf, Video
      filter_language: '1', // Türkçe
      limit: 100,
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

  // Unsplash'tan ücretsiz görsel al
  async getUnsplashImage(searchQuery, fallbackQuery = 'news') {
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      if (!accessKey) return null

      const query = encodeURIComponent(searchQuery || fallbackQuery)
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${accessKey}`
      )
      
      if (!response.ok) throw new Error('Unsplash API hatası')
      
      const data = await response.json()
      return {
        url: data.urls.regular,
        thumbnailUrl: data.urls.thumb,
        description: data.description || data.alt_description,
        photographer: data.user.name,
        photographerUrl: data.user.links.html,
        downloadUrl: data.links.download_location
      }
    } catch (error) {
      console.error('Unsplash Error:', error)
      return null
    }
  }

  // AI ile görsel açıklaması oluştur
  async generateImageDescription(title, content) {
    try {
      // Bu kısmı AI servisi ile entegre edebilirsiniz
      // OpenAI, Google AI veya başka bir AI servisi
      const prompt = `Haber başlığı: "${title}"\nHaber içeriği: "${content?.substring(0, 500)}"\n\nBu haber için uygun bir görsel açıklaması oluştur (maksimum 50 kelime):`
      
      // Şimdilik basit bir açıklama döndürüyoruz
      return `${title?.split(' ').slice(0, 3).join(' ')} ile ilgili haber görseli`
    } catch (error) {
      console.error('AI Description Error:', error)
      return 'Haber görseli'
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
        publishedAt: serverTimestamp(),
        crawledAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        socialMediaShared: false,
        socialMediaPosts: [],
        aiEnhanced: false
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
  async formatNewsForFirebase(aaNews, details) {
    const category = this.mapAACategory(aaNews.category)
    const priority = this.mapAAPriority(aaNews.priority)
    
    // Görsel işleme
    let imageUrl = ''
    let images = []
    let unsplashImage = null
    
    if (details.photos && details.photos.length > 0) {
      // AA'dan gelen görseller varsa onları kullan
      imageUrl = details.photos[0].url
      images = details.photos.map(photo => ({
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl || photo.url,
        caption: photo.caption || '',
        photographer: photo.photographer || 'Anadolu Ajansı',
        width: photo.width,
        height: photo.height,
        source: 'aa'
      }))
    } else if (aaNews.type === 'text') {
      // Text haber ise Unsplash'tan görsel al
      const searchQuery = await this.generateImageDescription(details.title, details.content)
      unsplashImage = await this.getUnsplashImage(searchQuery)
      
      if (unsplashImage) {
        imageUrl = unsplashImage.url
        images = [{
          url: unsplashImage.url,
          thumbnailUrl: unsplashImage.thumbnailUrl,
          caption: unsplashImage.description,
          photographer: unsplashImage.photographer,
          photographerUrl: unsplashImage.photographerUrl,
          source: 'unsplash'
        }]
      }
    }

    // Video işleme
    const videos = details.videos ? details.videos.map(video => ({
      url: video.url,
      thumbnailUrl: video.thumbnailUrl || '',
      title: video.title || details.title,
      duration: video.duration || '',
      quality: video.quality || 'hd',
      source: 'aa'
    })) : []

    return {
      // Temel bilgiler
      title: details.title || aaNews.title,
      content: details.content || details.summary || '',
      summary: details.summary || details.title?.substring(0, 200) || '',
      
      // Kategori ve etiketler
      category: category,
      originalCategory: aaNews.category?.toString() || '',
      priority: priority,
      tags: details.tags || this.generateTags(details.title, details.content),
      
      // Medya içerikleri
      imageUrl: imageUrl,
      images: images,
      videos: videos,
      hasMedia: images.length > 0 || videos.length > 0,
      hasUnsplashImage: !!unsplashImage,
      
      // AA kaynak bilgileri
      source: 'anadolu_ajansi',
      sourceUrl: details.sourceUrl || '',
      originalId: aaNews.id,
      aaType: aaNews.type,
      groupId: aaNews.group_id || '',
      
      // Metadata
      author: details.author || 'Anadolu Ajansı',
      publishedAt: new Date(aaNews.date),
      location: details.location || '',
      
      // Durum
      status: 'published',
      featured: priority === 'flash' || priority === 'urgent',
      breaking: priority === 'flash',
      urgent: priority === 'urgent',
      
      // SEO
      slug: this.generateSlug(details.title),
      metaDescription: details.summary?.substring(0, 160) || '',
      
      // Analitik
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      
      // Sosyal medya
      socialMediaShared: false,
      socialMediaPosts: [],
      
      // AI Enhancement
      aiEnhanced: false,
      aiGeneratedTags: [],
      aiGeneratedSummary: ''
    }
  }

  // Etiket oluştur
  generateTags(title, content) {
    const text = `${title} ${content}`.toLowerCase()
    const commonWords = ['bir', 'bu', 'şu', 've', 'ile', 'için', 'olan', 'olan', 'dedi', 'etti', 'oldu', 'var', 'yok']
    
    const words = text.split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .slice(0, 10)
    
    return [...new Set(words)]
  }

  // Slug oluştur
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 100)
  }

  // Kategoriye göre haber çek
  async crawlByCategory(categoryId, limit = 50) {
    const searchParams = {
      filter_category: categoryId.toString(),
      limit: limit,
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
    
    console.log(`🏷️ Kategori ${categoryId} (${this.mapAACategory(categoryId)}) için crawler başlatılıyor...`)
    return await this.crawlAndSaveNews(searchParams)
  }

  // Tüm kategorileri tek tek çek
  async crawlAllCategories(limitPerCategory = 20) {
    console.log('🌍 Tüm kategoriler için crawler başlatılıyor...')
    
    const results = {
      totalCategories: Object.keys(AA_CATEGORY_MAPPING).length,
      categoryResults: {},
      overallStats: {
        saved: 0,
        skipped: 0,
        errors: 0,
        total: 0
      }
    }

    for (const [categoryId, categoryName] of Object.entries(AA_CATEGORY_MAPPING)) {
      console.log(`\n📂 Kategori işleniyor: ${categoryName} (${categoryId})`)
      
      try {
        const categoryResult = await this.crawlByCategory(categoryId, limitPerCategory)
        results.categoryResults[categoryName] = categoryResult
        
        // Genel istatistikleri güncelle
        results.overallStats.saved += categoryResult.saved
        results.overallStats.skipped += categoryResult.skipped
        results.overallStats.errors += categoryResult.errors
        results.overallStats.total += categoryResult.total
        
        // Kategoriler arası 2 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`❌ Kategori ${categoryName} hatası:`, error.message)
        results.categoryResults[categoryName] = { error: error.message }
      }
    }

    console.log('\n🎉 Tüm kategori crawling tamamlandı!')
    console.log('📊 GENEL ÖZET:')
    console.log(`📰 Toplam haber: ${results.overallStats.total}`)
    console.log(`✅ Kaydedilen: ${results.overallStats.saved}`)
    console.log(`⏭️ Atlanan: ${results.overallStats.skipped}`)
    console.log(`❌ Hatalı: ${results.overallStats.errors}`)

    return results
  }

  // Ana crawling fonksiyonu
  async crawlAndSaveNews(searchParams = {}) {
    try {
      console.log('🚀 AA Advanced Crawler başlatılıyor...')
      
      // 1. Haberleri ara
      const searchResult = await this.searchNews(searchParams)
      if (!searchResult.success) {
        throw new Error(searchResult.error)
      }

      console.log(`📰 ${searchResult.news.length} haber bulundu`)
      
      const results = {
        total: searchResult.news.length,
        saved: 0,
        skipped: 0,
        errors: 0,
        details: []
      }

      // 2. Her haber için işlem yap
      for (const [index, news] of searchResult.news.entries()) {
        console.log(`\n[${index + 1}/${searchResult.news.length}] İşleniyor: ${news.title}`)
        
        try {
          // Haber detayını al
          const detailResult = await this.getNewsDetail(news.id, news.type)
          if (!detailResult.success) {
            console.log(`❌ Detay alınamadı: ${detailResult.error}`)
            results.errors++
            continue
          }

          // Firebase formatına çevir
          const newsData = await this.formatNewsForFirebase(news, detailResult.details)
          
          // Firebase'e kaydet
          const saveResult = await this.saveNewsToFirebase(newsData)
          
          if (saveResult.success) {
            results.saved++
            results.details.push({
              id: news.id,
              firebaseId: saveResult.id,
              title: news.title,
              category: newsData.category,
              priority: newsData.priority,
              hasImages: newsData.images.length > 0,
              hasVideos: newsData.videos.length > 0,
              status: 'saved'
            })
          } else if (saveResult.reason === 'already_exists') {
            results.skipped++
          } else {
            results.errors++
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          console.log(`❌ Haber işleme hatası: ${error.message}`)
          results.errors++
        }
      }

      console.log('\n✅ Crawling tamamlandı!')
      return results

    } catch (error) {
      console.error('❌ Crawler genel hatası:', error)
      throw error
    }
  }
}

export default AdvancedAACrawler
