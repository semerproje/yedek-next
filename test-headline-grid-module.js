// HeadlineNewsGrid modülü testi
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDPmT_6M2LnLCKxDo-yCXSRrYJaenckYHE",
  authDomain: "netnext-c50f6.firebaseapp.com",
  projectId: "netnext-c50f6",
  storageBucket: "netnext-c50f6.firebasestorage.app",
  messagingSenderId: "509219230439",
  appId: "1:509219230439:web:cd24ab1b8e0e9a8b4c3c81"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createHeadlineGridModule() {
  try {
    // HeadlineNewsGrid modülü oluştur
    const moduleData = {
      id: 'homepage-headline-grid-1',
      moduleType: 'headline-grid',
      title: 'Ana Sayfa - Manşet Haberleri',
      active: true,
      order: 3,
      manualNewsIds: [], // Otomatik seçim kullanacağız
      autoFetch: true,
      newsCount: 6,
      settings: {
        gridColumns: 3,
        showCategories: true,
        showAuthor: true,
        showDate: true,
        showViewCount: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📰 HeadlineNewsGrid modülü oluşturuluyor...');
    
    const docRef = await addDoc(collection(db, 'homepage_modules'), moduleData);
    
    console.log('✅ HeadlineNewsGrid modülü başarıyla oluşturuldu!');
    console.log('📋 Modül ID:', docRef.id);
    console.log('🎯 Modül Türü:', moduleData.moduleType);
    console.log('📊 Grid Sütunları:', moduleData.settings.gridColumns);
    console.log('📈 Haber Sayısı:', moduleData.newsCount);
    console.log('🔄 Otomatik Seçim:', moduleData.autoFetch ? 'Aktif' : 'Pasif');
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Modül oluşturma hatası:', error);
    throw error;
  }
}

// Test modülü çalıştır
if (require.main === module) {
  createHeadlineGridModule()
    .then(moduleId => {
      console.log(`\n🎉 Test tamamlandı! Modül ID: ${moduleId}`);
      console.log('🌐 Test URL: http://localhost:3000/admin/dashboard/homepage-management');
      console.log('👀 Önizleme URL: http://localhost:3000/preview/homepage');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test başarısız:', error);
      process.exit(1);
    });
}

module.exports = { createHeadlineGridModule };
