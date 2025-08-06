// AA API Test Dosyası - Enhanced API ile test fonksiyonları
import { aaApiService, AA_CATEGORY_CODES, AA_PRIORITY_CODES } from '../lib/aa-api-enhanced'

export async function testAAApiConnection() {
  console.log('🔄 AA API Enhanced Bağlantı Testi Başlatıldı...')
  
  try {
    // 1. Discover fonksiyonu testi
    console.log('\n1️⃣ Discover API Test...')
    const discoverResult = await aaApiService.discover('tr_TR')
    console.log('✅ Discover başarılı:', discoverResult)
    
    // 2. Subscription bilgileri testi
    console.log('\n2️⃣ Subscription API Test...')
    const subscriptionResult = await aaApiService.getSubscription()
    console.log('✅ Subscription başarılı:', subscriptionResult)
    
    // 3. Son 24 saatin haberleri testi
    console.log('\n3️⃣ Latest News API Test...')
    const latestNews = await aaApiService.getLatestNews(undefined, 5)
    console.log('✅ Latest News başarılı:', latestNews.length, 'haber bulundu')
    latestNews.forEach((news, index) => {
      console.log(`  ${index + 1}. ${news.title} (${news.enhancedCategory})`)
    })
    
    // 4. Kategori bazlı haber testi
    console.log('\n4️⃣ Category News API Test...')
    const sportsNews = await aaApiService.getLatestNews('Spor', 3)
    console.log('✅ Sports News başarılı:', sportsNews.length, 'spor haberi bulundu')
    
    // 5. Firebase kaydetme testi
    if (latestNews.length > 0) {
      console.log('\n5️⃣ Firebase Save Test...')
      const saveResult = await aaApiService.saveNewsToFirebase([latestNews[0]]) // Sadece ilk haberi test et
      console.log('✅ Firebase Save Test:', saveResult)
    }
    
    console.log('\n🎉 TÜM TESTLER BAŞARILI!')
    return {
      success: true,
      discover: discoverResult,
      subscription: subscriptionResult,
      latestNews: latestNews.length,
      sportsNews: sportsNews.length
    }
    
  } catch (error: any) {
    console.error('❌ AA API Test Hatası:', error)
    return {
      success: false,
      error: error?.message || 'Bilinmeyen hata'
    }
  }
}

// Test işlemini başlatmak için global fonksiyon
if (typeof window !== 'undefined') {
  (window as any).testAAApi = testAAApiConnection
}
