// Firebase Entegrasyon ve Duplikasyon Önleme Sistemi

const { fetchEnhancedNews } = require('./aa-enhanced-system');

// Simulated Firebase functions (gerçek Firebase SDK ile değiştirin)
class FirebaseService {
  constructor() {
    this.db = null; // Firestore instance
    this.processedIds = new Set(); // Memory cache for processed IDs
    this.titleHashes = new Set(); // Memory cache for title hashes
  }
  
  // Initialize Firebase (gerçek implementasyon için)
  async initialize() {
    console.log('🔥 Firebase bağlantısı başlatılıyor...');
    // const { initializeApp } = require('firebase/app');
    // const { getFirestore } = require('firebase/firestore');
    // this.db = getFirestore(initializeApp(config));
    
    // Load existing IDs from database
    await this.loadExistingIds();
    console.log('✅ Firebase hazır');
  }
  
  // Mevcut haber ID'lerini yükle
  async loadExistingIds() {
    try {
      console.log('📊 Mevcut haber ID\'leri yükleniyor...');
      
      // Gerçek implementasyon:
      // const snapshot = await getDocs(collection(this.db, 'news'));
      // snapshot.forEach(doc => {
      //   const data = doc.data();
      //   if (data.aaId) this.processedIds.add(data.aaId);
      //   if (data.titleHash) this.titleHashes.add(data.titleHash);
      // });
      
      // Simülasyon için
      console.log(`💾 ${this.processedIds.size} mevcut ID yüklendi`);
    } catch (error) {
      console.error('❌ Mevcut ID\'ler yüklenemedi:', error.message);
    }
  }
  
  // Başlık hash'i oluştur
  createTitleHash(title) {
    return title.toLowerCase()
      .replace(/[^\w\s]/g, '') // Noktalama işaretlerini kaldır
      .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa çevir
      .trim();
  }
  
  // Duplikasyon kontrolü
  isDuplicate(newsItem) {
    const titleHash = this.createTitleHash(newsItem.title);
    
    // ID kontrolü
    if (this.processedIds.has(newsItem.aaId)) {
      return { isDupe: true, reason: 'ID already exists' };
    }
    
    // Başlık kontrolü
    if (this.titleHashes.has(titleHash)) {
      return { isDupe: true, reason: 'Similar title exists' };
    }
    
    return { isDupe: false };
  }
  
  // Haberi Firebase'e kaydet
  async saveNews(newsItem) {
    try {
      const dupeCheck = this.isDuplicate(newsItem);
      if (dupeCheck.isDupe) {
        console.log(`🔄 Duplikasyon atlandı [${dupeCheck.reason}]: ${newsItem.title}`);
        return { success: false, reason: dupeCheck.reason };
      }
      
      // Kayıt için hazırla
      const firebaseData = {
        ...newsItem,
        titleHash: this.createTitleHash(newsItem.title),
        savedAt: new Date(),
        
        // Firebase özel alanları
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        viewCount: 0,
        likeCount: 0,
        shareCount: 0
      };
      
      // Gerçek implementasyon:
      // const docRef = await addDoc(collection(this.db, 'news'), firebaseData);
      // console.log(`✅ Haber kaydedildi: ${docRef.id}`);
      
      // Simülasyon
      console.log(`✅ Haber kaydedildi: ${newsItem.title}`);
      
      // Cache'e ekle
      this.processedIds.add(newsItem.aaId);
      this.titleHashes.add(firebaseData.titleHash);
      
      return { success: true, id: `doc_${Date.now()}` };
      
    } catch (error) {
      console.error(`❌ Kayıt hatası [${newsItem.aaId}]:`, error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Toplu kaydetme
  async saveMultipleNews(newsArray) {
    const results = {
      saved: 0,
      skipped: 0,
      errors: 0,
      details: []
    };
    
    console.log(`\n💾 ${newsArray.length} haber kaydediliyor...`);
    
    for (const newsItem of newsArray) {
      const result = await this.saveNews(newsItem);
      
      if (result.success) {
        results.saved++;
      } else if (result.reason) {
        results.skipped++;
        results.details.push({
          title: newsItem.title,
          reason: result.reason
        });
      } else {
        results.errors++;
        results.details.push({
          title: newsItem.title,
          error: result.error
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n📊 KAYIT SONUÇLARI:');
    console.log('==================');
    console.log(`✅ Kaydedilen: ${results.saved}`);
    console.log(`🔄 Atlanan: ${results.skipped}`);
    console.log(`❌ Hatalı: ${results.errors}`);
    
    if (results.details.length > 0 && results.details.length <= 10) {
      console.log('\n📝 Detaylar:');
      results.details.forEach((detail, index) => {
        console.log(`${index + 1}. ${detail.title.substring(0, 50)}...`);
        console.log(`   Sebep: ${detail.reason || detail.error}`);
      });
    }
    
    return results;
  }
  
  // Mevcut haberleri güncelleme (AA görseli varsa telifsiz görseli kaldır)
  async updateNewsWithAAImages(newsId, newImages) {
    try {
      console.log(`🔄 Haber görselleri güncelleniyor: ${newsId}`);
      
      // Mevcut haberi bul
      // const docRef = doc(this.db, 'news', newsId);
      // const docSnap = await getDoc(docRef);
      
      // if (docSnap.exists()) {
      //   const currentData = docSnap.data();
      //   const currentImages = currentData.images || [];
      //   
      //   // Telifsiz görselleri kaldır
      //   const filteredImages = currentImages.filter(img => !img.isFree);
      //   
      //   // Yeni AA görsellerini ekle
      //   const updatedImages = [...filteredImages, ...newImages];
      //   
      //   await updateDoc(docRef, {
      //     images: updatedImages,
      //     hasImages: updatedImages.length > 0,
      //     freeImage: null,
      //     updatedAt: new Date()
      //   });
      //   
      //   console.log(`✅ Görsel güncellendi: ${updatedImages.length} görsel`);
      // }
      
      // Simülasyon
      console.log(`✅ ${newImages.length} AA görseli eklendi, telifsiz görseller kaldırıldı`);
      
    } catch (error) {
      console.error(`❌ Görsel güncelleme hatası [${newsId}]:`, error.message);
    }
  }
  
  // Kategori istatistikleri güncelle
  async updateCategoryStats() {
    try {
      console.log('📊 Kategori istatistikleri güncelleniyor...');
      
      // Gerçek implementasyon:
      // const categoryCounts = {};
      // const snapshot = await getDocs(collection(this.db, 'news'));
      // 
      // snapshot.forEach(doc => {
      //   const data = doc.data();
      //   if (data.categories) {
      //     data.categories.forEach(cat => {
      //       categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      //     });
      //   }
      // });
      // 
      // await setDoc(doc(this.db, 'stats', 'categories'), {
      //   counts: categoryCounts,
      //   updatedAt: new Date()
      // });
      
      console.log('✅ Kategori istatistikleri güncellendi');
      
    } catch (error) {
      console.error('❌ İstatistik güncelleme hatası:', error.message);
    }
  }
}

// Ana işlem fonksiyonu
async function runNewsSync(options = {}) {
  const {
    limit = 50,
    category = null,
    updateStats = true
  } = options;
  
  const firebase = new FirebaseService();
  
  try {
    // Firebase'i başlat
    await firebase.initialize();
    
    console.log('\n🚀 Haber senkronizasyon işlemi başlıyor...');
    console.log(`📊 Limit: ${limit}, Kategori: ${category || 'Tümü'}`);
    
    // AA'dan haberleri çek
    const result = await fetchEnhancedNews({
      limit: limit,
      category: category,
      includeImages: true,
      includeVideos: true
    });
    
    if (!result.news || result.news.length === 0) {
      console.log('⚠️ Çekilecek haber bulunamadı');
      return;
    }
    
    console.log(`\n📥 ${result.news.length} haber AA'dan alındı`);
    
    // Firebase'e kaydet
    const saveResults = await firebase.saveMultipleNews(result.news);
    
    // İstatistikleri güncelle
    if (updateStats && saveResults.saved > 0) {
      await firebase.updateCategoryStats();
    }
    
    console.log('\n🎯 Senkronizasyon tamamlandı!');
    console.log(`📊 Toplam işlem: ${result.news.length} haber`);
    console.log(`✅ Kaydedilen: ${saveResults.saved}`);
    console.log(`🔄 Atlanan: ${saveResults.skipped}`);
    
    return {
      totalProcessed: result.news.length,
      saved: saveResults.saved,
      skipped: saveResults.skipped,
      errors: saveResults.errors,
      stats: result.stats
    };
    
  } catch (error) {
    console.error('💥 Senkronizasyon hatası:', error.message);
    throw error;
  }
}

// Zamanlanmış görev (cron job için)
async function scheduledNewsSync() {
  const schedules = [
    { name: 'Genel Haberler', options: { limit: 30 } },
    { name: 'Spor Haberleri', options: { limit: 15, category: 'spor' } },
    { name: 'Ekonomi Haberleri', options: { limit: 15, category: 'ekonomi' } },
    { name: 'Video Haberler', options: { limit: 10, includeImages: false } }
  ];
  
  console.log('⏰ Zamanlanmış haber senkronizasyonu başlıyor...');
  console.log(`📅 ${new Date().toLocaleString('tr-TR')}`);
  
  for (const schedule of schedules) {
    try {
      console.log(`\n🔄 ${schedule.name} senkronizasyonu...`);
      await runNewsSync(schedule.options);
      
      // Senkronizasyonlar arası bekleme
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ ${schedule.name} hatası:`, error.message);
    }
  }
  
  console.log('\n✅ Zamanlanmış senkronizasyon tamamlandı!');
}

// Test fonksiyonu
async function testFirebaseIntegration() {
  try {
    console.log('🧪 Firebase entegrasyon testi...\n');
    
    // Küçük bir test
    const result = await runNewsSync({ limit: 5 });
    
    console.log('\n📊 Test Sonuçları:');
    console.log('=================');
    console.log(`İşlenen: ${result.totalProcessed}`);
    console.log(`Kaydedilen: ${result.saved}`);
    console.log(`Atlanan: ${result.skipped}`);
    console.log(`Hatalı: ${result.errors}`);
    
    console.log('\n✅ Firebase entegrasyon testi tamamlandı!');
    
  } catch (error) {
    console.error('💥 Test hatası:', error.message);
  }
}

// Eğer doğrudan çalıştırılırsa test et
if (require.main === module) {
  testFirebaseIntegration();
}

module.exports = {
  FirebaseService,
  runNewsSync,
  scheduledNewsSync,
  testFirebaseIntegration
};
