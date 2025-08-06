#!/usr/bin/env node

/**
 * Anasayfa Modülleri Mock Data Test Script
 * Tüm modüllerin mock data ile doğru çalıştığını test eder
 */

import { 
  mockNewsData, 
  getNewsByModule, 
  getFeaturedNews, 
  getBreakingNews, 
  getUrgentNews,
  getNewsByCategory,
  getRandomNews 
} from './src/data/mockNewsData.js';

console.log('🧪 ANASAYFA MODÜLLERİ MOCK DATA TESTİ\n');

// 1. Ana modüller test
console.log('📰 ANA MODÜLLER TESTİ:');
const modules = [
  'mainVisualHeadline',
  'headlineNewsGrid', 
  'popularNews',
  'editorPicks',
  'videoHighlights',
  'aiRecommendation',
  'weekendReads',
  'newsPrograms'
];

modules.forEach(moduleName => {
  const moduleNews = getNewsByModule(moduleName);
  console.log(`✅ ${moduleName}: ${moduleNews.length} haber`);
  
  if (moduleNews.length > 0) {
    console.log(`   📝 Örnek: "${moduleNews[0].title.substring(0, 50)}..."`);
    console.log(`   👤 Yazar: ${moduleNews[0].author}`);
    console.log(`   📊 Görüntüleme: ${moduleNews[0].views.toLocaleString()}`);
    console.log(`   🏷️ Kategori: ${moduleNews[0].category}`);
  }
  console.log('');
});

// 2. Özel fonksiyonlar test
console.log('🔍 ÖZEL FONKSİYONLAR TESTİ:');

const featuredNews = getFeaturedNews(5);
console.log(`✅ Öne Çıkan Haberler: ${featuredNews.length} haber`);

const breakingNews = getBreakingNews();
console.log(`🚨 Son Dakika Haberleri: ${breakingNews.length} haber`);

const urgentNews = getUrgentNews();
console.log(`⚡ Acil Haberler: ${urgentNews.length} haber`);

const techNews = getNewsByCategory('teknoloji', 3);
console.log(`💻 Teknoloji Haberleri: ${techNews.length} haber`);

const randomNews = getRandomNews(3);
console.log(`🎲 Rastgele Haberler: ${randomNews.length} haber`);

console.log('\n📊 TOPLAM İSTATİSTİKLER:');
const allNews = Object.values(mockNewsData).flat();
console.log(`📰 Toplam Haber Sayısı: ${allNews.length}`);
console.log(`🏷️ Benzersiz Kategori Sayısı: ${[...new Set(allNews.map(n => n.category))].length}`);
console.log(`✍️ Benzersiz Yazar Sayısı: ${[...new Set(allNews.map(n => n.author))].length}`);
console.log(`👁️ Toplam Görüntüleme: ${allNews.reduce((sum, n) => sum + n.views, 0).toLocaleString()}`);

// 3. Veri bütünlüğü kontrolleri
console.log('\n🔧 VERİ BÜTÜNLÜĞÜ KONTROLLERI:');

let errors = 0;

allNews.forEach((news, index) => {
  // Zorunlu alanlar kontrolü
  const requiredFields = ['id', 'title', 'summary', 'content', 'category', 'author', 'source', 'status', 'breaking', 'urgent', 'featured', 'views', 'tags'];
  
  requiredFields.forEach(field => {
    if (news[field] === undefined || news[field] === null) {
      console.log(`❌ Haber ${index + 1}: '${field}' alanı eksik`);
      errors++;
    }
  });

  // Images array kontrolü
  if (!news.images || !Array.isArray(news.images) || news.images.length === 0) {
    console.log(`⚠️ Haber ${index + 1}: 'images' alanı eksik veya boş`);
  }

  // URL formatı kontrolü
  if (news.images && news.images.length > 0) {
    news.images.forEach((img, imgIndex) => {
      if (!img.url || !img.url.startsWith('http')) {
        console.log(`❌ Haber ${index + 1}, Görsel ${imgIndex + 1}: Geçersiz URL`);
        errors++;
      }
    });
  }
});

if (errors === 0) {
  console.log('✅ Tüm veri bütünlüğü kontrolleri başarılı!');
} else {
  console.log(`❌ ${errors} adet veri hatası bulundu!`);
}

console.log('\n🎉 TEST TAMAMLANDI!');
console.log('\n📋 ÖNERİLER:');
console.log('1. Bu mock data tüm anasayfa modüllerinde kullanılabilir');
console.log('2. Firebase bağlantısı olmadığında fallback olarak çalışır');
console.log('3. Her modül kendi data subset\'ini kullanır');
console.log('4. Yardımcı fonksiyonlar ile esnek veri erişimi sağlanır');
console.log('5. Tüm haberler Türkçe ve profesyonel içeriklidir');

console.log('\n🚀 KULLANIM ÖRNEKLERİ:');
console.log('```javascript');
console.log('import { getNewsByModule } from "@/data/mockNewsData";');
console.log('const mainNews = getNewsByModule("mainVisualHeadline");');
console.log('const featuredNews = getFeaturedNews(5);');
console.log('const techNews = getNewsByCategory("teknoloji", 3);');
console.log('```');
