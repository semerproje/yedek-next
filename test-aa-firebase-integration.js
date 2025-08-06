// Test Enhanced AA Crawler Firebase Integration

import { EnhancedAACrawler } from './src/lib/services/enhancedAACrawler.js';

async function testFirebaseCrawler() {
  console.log('🧪 Enhanced AA Crawler Firebase Test Başlatılıyor...\n');
  
  try {
    const crawler = new EnhancedAACrawler();
    
    // Test 1: Basit arama
    console.log('📋 Test 1: AA Haber Arama');
    const searchResult = await crawler.searchNews({
      limit: 3,
      filter_category: '1,2', // Gündem ve Spor
    });
    
    if (searchResult.success) {
      console.log(`✅ ${searchResult.news.length} haber bulundu`);
      searchResult.news.forEach((news, index) => {
        console.log(`   ${index + 1}. ${news.title} (Kategori: ${news.category})`);
      });
    } else {
      console.log(`❌ Arama başarısız: ${searchResult.error}`);
    }
    
    // Test 2: Bir haberin detayını al
    if (searchResult.success && searchResult.news.length > 0) {
      console.log('\n📄 Test 2: Haber Detayı');
      const firstNews = searchResult.news[0];
      const detailResult = await crawler.getNewsDetail(firstNews.id, firstNews.type);
      
      if (detailResult.success) {
        console.log(`✅ Detay alındı: ${detailResult.details.title || 'Başlık yok'}`);
        console.log(`   İçerik uzunluğu: ${detailResult.details.content?.length || 0} karakter`);
      } else {
        console.log(`❌ Detay alınamadı: ${detailResult.error}`);
      }
    }
    
    // Test 3: Kategori mapping
    console.log('\n🏷️ Test 3: Kategori Mapping');
    const testCategories = ['1', '2', '3', '4', '5'];
    testCategories.forEach(catId => {
      const mapped = crawler.mapAACategory(catId);
      console.log(`   AA Kategori ${catId} → ${mapped}`);
    });
    
    console.log('\n🎉 Test tamamlandı!');
    
  } catch (error) {
    console.error('❌ Test hatası:', error);
  }
}

testFirebaseCrawler().catch(console.error);
