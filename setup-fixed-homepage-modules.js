// Homepage Management Example Data Setup - Fixed Types

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBKwVLWLTgLLfs8V0ptEvwywGoIwxm430A",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.firebasestorage.app",
  messagingSenderId: "651640696907",
  appId: "1:651640696907:web:d7c012c1280a08e0c69dce",
};

async function setupFixedHomepageModules() {
  console.log('🏠 Homepage Modülleri düzeltiliyor...\n');

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Doğru type yapısıyla homepage modülleri
    const modules = [
      {
        id: 'hero-section',
        key: 'hero-section',
        name: 'Ana Banner',
        description: 'Anasayfa hero bölümü',
        component: 'hero',
        active: true,
        order: 1,
        settings: {
          title: 'Son Dakika Haberler',
          subtitle: 'Türkiye ve dünyadan en güncel haberler',
          showLatestNews: true,
          itemCount: 5,
          autoUpdate: true,
          refreshInterval: 5000,
          layout: 'banner',
          displayStyle: 'detailed'
        },
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'breaking-news',
        key: 'breaking-news',
        name: 'Son Dakika Bandı',
        description: 'Akan haber bandı',
        component: 'breaking-news',
        active: true,
        order: 2,
        settings: {
          title: 'Son Dakika',
          itemCount: 10,
          autoUpdate: true,
          refreshInterval: 300000, // 5 dakika
          layout: 'slider',
          displayStyle: 'compact'
        },
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'featured-news',
        key: 'featured-news',
        name: 'Öne Çıkan Haberler',
        description: 'Öne çıkan haber grid\'i',
        component: 'featured-grid',
        active: true,
        order: 3,
        settings: {
          title: 'Öne Çıkan Haberler',
          layout: 'grid',
          itemCount: 6,
          showImages: true,
          categories: ['gundem', 'spor', 'ekonomi'],
          displayStyle: 'card'
        },
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'category-sections',
        key: 'category-sections',
        name: 'Kategori Bölümleri',
        description: 'Kategori bazlı haber bölümleri',
        component: 'category-sections',
        active: true,
        order: 4,
        settings: {
          title: 'Kategoriler',
          itemCount: 4,
          layout: 'list',
          showImages: true,
          categories: ['gundem', 'spor', 'ekonomi', 'teknoloji'],
          displayStyle: 'detailed'
        },
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'popular-news',
        key: 'popular-news',
        name: 'Popüler Haberler',
        description: 'En çok okunan haberler',
        component: 'popular-list',
        active: true,
        order: 5,
        settings: {
          title: 'En Çok Okunanlar',
          itemCount: 10,
          layout: 'list',
          showImages: false,
          displayStyle: 'compact'
        },
        createdAt: new Date(),
        lastModified: new Date()
      },
      {
        id: 'video-section',
        key: 'video-section',
        name: 'Video Haberler',
        description: 'Video içerikli haberler',
        component: 'video-news',
        active: false, // Başlangıçta kapalı
        order: 6,
        settings: {
          title: 'Video Haberler',
          layout: 'grid',
          itemCount: 8,
          showImages: true,
          autoUpdate: false,
          displayStyle: 'card'
        },
        createdAt: new Date(),
        lastModified: new Date()
      }
    ];

    console.log('🏠 Homepage modülleri ekleniyor...');
    for (const module of modules) {
      const docRef = await addDoc(collection(db, 'homepage_modules'), module);
      console.log(`✅ Modül eklendi: ${docRef.id} - ${module.name} ${module.active ? '(Aktif)' : '(Pasif)'}`);
    }

    console.log('\n🎉 Homepage modülleri başarıyla düzeltildi!');
    console.log('\n📊 ÖZET:');
    console.log(`🏠 ${modules.length} homepage modülü eklendi`);
    console.log('\n🔗 Test edin:');
    console.log('   http://localhost:3001/admin/dashboard/homepage-management');

  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

// Script'i çalıştır
setupFixedHomepageModules().catch(console.error);
