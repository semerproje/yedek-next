// Homepage Management Example Data Setup

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

async function setupHomepageExamples() {
  console.log('🏠 Homepage Management örnek verileri ekleniyor...\n');

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Örnek Kategoriler
    const categories = [
      {
        name: 'Gündem',
        slug: 'gundem',
        description: 'En son gündem haberleri',
        color: '#EF4444',
        textColor: '#FFFFFF',
        isActive: true,
        order: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Spor',
        slug: 'spor',
        description: 'Spor dünyasından haberler',
        color: '#10B981',
        textColor: '#FFFFFF',
        isActive: true,
        order: 2,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Ekonomi',
        slug: 'ekonomi',
        description: 'Ekonomi ve finans haberleri',
        color: '#3B82F6',
        textColor: '#FFFFFF',
        isActive: true,
        order: 3,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Teknoloji',
        slug: 'teknoloji',
        description: 'Teknoloji ve inovasyon',
        color: '#8B5CF6',
        textColor: '#FFFFFF',
        isActive: true,
        order: 4,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Sağlık',
        slug: 'saglik',
        description: 'Sağlık ve yaşam haberleri',
        color: '#F59E0B',
        textColor: '#FFFFFF',
        isActive: true,
        order: 5,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    console.log('📂 Kategoriler ekleniyor...');
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), category);
      console.log(`✅ Kategori eklendi: ${docRef.id} - ${category.name}`);
    }

    // 2. Örnek Homepage Modülleri
    const modules = [
      {
        id: 'hero-section',
        name: 'Ana Banner',
        type: 'hero',
        isActive: true,
        order: 1,
        config: {
          title: 'Son Dakika Haberler',
          subtitle: 'Türkiye ve dünyadan en güncel haberler',
          showLatestNews: true,
          newsCount: 5,
          autoSlide: true,
          slideInterval: 5000,
          backgroundColor: '#1F2937',
          textColor: '#FFFFFF'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'breaking-news',
        name: 'Son Dakika Bandı',
        type: 'breaking-news',
        isActive: true,
        order: 2,
        config: {
          title: 'Son Dakika',
          scrollSpeed: 'medium',
          backgroundColor: '#DC2626',
          textColor: '#FFFFFF',
          maxItems: 10,
          autoUpdate: true,
          updateInterval: 300000 // 5 dakika
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'featured-news',
        name: 'Öne Çıkan Haberler',
        type: 'featured-grid',
        isActive: true,
        order: 3,
        config: {
          title: 'Öne Çıkan Haberler',
          layout: 'grid',
          columns: 3,
          rows: 2,
          showCategory: true,
          showDate: true,
          showAuthor: true,
          maxItems: 6
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'category-sections',
        name: 'Kategori Bölümleri',
        type: 'category-sections',
        isActive: true,
        order: 4,
        config: {
          title: 'Kategoriler',
          showAllCategories: true,
          itemsPerCategory: 4,
          layout: 'horizontal',
          showImages: true,
          categories: ['gundem', 'spor', 'ekonomi', 'teknoloji']
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'popular-news',
        name: 'Popüler Haberler',
        type: 'popular-list',
        isActive: true,
        order: 5,
        config: {
          title: 'En Çok Okunanlar',
          itemCount: 10,
          showNumbers: true,
          showViews: true,
          timeRange: '24h', // son 24 saat
          layout: 'list'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'video-section',
        name: 'Video Haberler',
        type: 'video-news',
        isActive: false, // Başlangıçta kapalı
        order: 6,
        config: {
          title: 'Video Haberler',
          layout: 'carousel',
          autoPlay: false,
          showControls: true,
          itemCount: 8
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    console.log('\n🏠 Homepage modülleri ekleniyor...');
    for (const module of modules) {
      const docRef = await addDoc(collection(db, 'homepage_modules'), module);
      console.log(`✅ Modül eklendi: ${docRef.id} - ${module.name} ${module.isActive ? '(Aktif)' : '(Pasif)'}`);
    }

    // 3. Örnek News Module Configs
    const newsConfigs = [
      {
        name: 'Ana Sayfa Gündem',
        type: 'auto',
        category: 'gundem',
        maxItems: 10,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        filters: {
          featured: false,
          minViews: 0,
          tags: []
        },
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Öne Çıkan Spor',
        type: 'manual',
        category: 'spor',
        maxItems: 5,
        selectedNews: [], // Manuel seçilen haberler
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    console.log('\n📰 News modül konfigürasyonları ekleniyor...');
    for (const config of newsConfigs) {
      const docRef = await addDoc(collection(db, 'news_module_configs'), config);
      console.log(`✅ News config eklendi: ${docRef.id} - ${config.name}`);
    }

    // 4. Örnek Publishing Schedule
    const schedules = [
      {
        name: 'Günlük Otomatik Yayın',
        moduleId: 'featured-news',
        scheduleType: 'recurring',
        frequency: 'daily',
        time: '06:00',
        isActive: true,
        nextRun: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        config: {
          autoUpdate: true,
          priority: 'high'
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Son Dakika Güncellemesi',
        moduleId: 'breaking-news',
        scheduleType: 'recurring',
        frequency: 'hourly',
        time: null,
        isActive: true,
        nextRun: Timestamp.fromDate(new Date(Date.now() + 60 * 60 * 1000)),
        config: {
          autoUpdate: true,
          priority: 'critical',
          immediate: true
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    console.log('\n⏰ Yayın programları ekleniyor...');
    for (const schedule of schedules) {
      const docRef = await addDoc(collection(db, 'publishing_schedules'), schedule);
      console.log(`✅ Program eklendi: ${docRef.id} - ${schedule.name}`);
    }

    console.log('\n🎉 Homepage Management örnek verileri başarıyla eklendi!');
    console.log('\n📊 ÖZET:');
    console.log(`📂 ${categories.length} kategori eklendi`);
    console.log(`🏠 ${modules.length} homepage modülü eklendi`);
    console.log(`📰 ${newsConfigs.length} news konfigürasyonu eklendi`);
    console.log(`⏰ ${schedules.length} yayın programı eklendi`);
    console.log('\n🔗 Şimdi şu adresleri kontrol edebilirsiniz:');
    console.log('   http://localhost:3000/admin/dashboard/homepage-management');
    console.log('   http://localhost:3000/ (Ana sayfa)');

  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

// Script'i çalıştır
setupHomepageExamples().catch(console.error);
