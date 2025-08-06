// Test script for AA News Service functionality
import { AANewsService, DEFAULT_AA_CREDENTIALS } from './src/lib/aa-news-service.js';

async function testAANewsService() {
  console.log('🔍 AA News Service Test Başlatılıyor...\n');
  
  const aaService = new AANewsService(DEFAULT_AA_CREDENTIALS);
  
  console.log('📋 Kullanılan Credentials:');
  console.log('- Username:', DEFAULT_AA_CREDENTIALS.username);
  console.log('- Base URL:', DEFAULT_AA_CREDENTIALS.baseUrl);
  console.log('- Password:', '*'.repeat(DEFAULT_AA_CREDENTIALS.password.length));
  console.log('');
  
  // 1. Connection Test
  console.log('🔌 1. Bağlantı Testi...');
  try {
    const connectionResult = await aaService.testConnection();
    console.log('✅ Bağlantı Sonucu:', connectionResult);
  } catch (error) {
    console.error('❌ Bağlantı Hatası:', error.message);
  }
  console.log('');
  
  // 2. News Search Test
  console.log('📰 2. Haber Arama Testi...');
  try {
    const searchResult = await aaService.searchNews({ 
      limit: 5,
      language: 'tr'
    });
    
    console.log('📊 Arama Sonucu:');
    console.log('- Success:', searchResult.response.success);
    console.log('- Message:', searchResult.response.message);
    console.log('- Total:', searchResult.response.total || 'N/A');
    
    if (searchResult.data?.result) {
      console.log('- Bulunan Haber Sayısı:', searchResult.data.result.length);
      
      console.log('\n📋 İlk 3 Haber:');
      searchResult.data.result.slice(0, 3).forEach((news, index) => {
        console.log(`\n${index + 1}. Haber:`);
        console.log('  - ID:', news.id);
        console.log('  - Başlık:', news.title?.substring(0, 50) + '...');
        console.log('  - Kategori:', news.category);
        console.log('  - Tarih:', news.date);
        console.log('  - Tip:', news.type);
      });
    }
  } catch (error) {
    console.error('❌ Haber Arama Hatası:', error.message);
  }
  console.log('');
  
  // 3. Category Search Test
  console.log('🏷️ 3. Kategori Bazlı Arama Testi...');
  try {
    const categoryResult = await aaService.searchNews({ 
      category: ['1', '2'], // Politik ve Ekonomi
      limit: 3
    });
    
    console.log('📊 Kategori Arama Sonucu:');
    console.log('- Success:', categoryResult.response.success);
    console.log('- Total:', categoryResult.response.total || 'N/A');
    
    if (categoryResult.data?.result) {
      console.log('- Kategori Haberleri:', categoryResult.data.result.length);
    }
  } catch (error) {
    console.error('❌ Kategori Arama Hatası:', error.message);
  }
  
  console.log('\n✅ Test Tamamlandı!');
}

// Run test
testAANewsService().catch(console.error);
