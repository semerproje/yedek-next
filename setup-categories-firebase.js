const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc, getDocs, query, where } = require('firebase/firestore');

// Firebase config - gerçek config bilgilerini kullanın
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kategoriler
const categories = [
  {
    name: 'Gündem',
    slug: 'gundem',
    description: 'Son dakika gündem haberleri ve gelişmeler',
    active: true,
    order: 1,
    icon: '📰',
    color: '#EF4444'
  },
  {
    name: 'Spor',
    slug: 'spor',
    description: 'Futbol, basketbol ve diğer spor dalları haberleri',
    active: true,
    order: 2,
    icon: '⚽',
    color: '#10B981'
  },
  {
    name: 'Ekonomi',
    slug: 'ekonomi',
    description: 'Ekonomi, finans ve borsa haberleri',
    active: true,
    order: 3,
    icon: '💰',
    color: '#F59E0B'
  },
  {
    name: 'Teknoloji',
    slug: 'teknoloji',
    description: 'Teknoloji, bilim ve yenilik haberleri',
    active: true,
    order: 4,
    icon: '💻',
    color: '#3B82F6'
  },
  {
    name: 'Sağlık',
    slug: 'saglik',
    description: 'Sağlık, tıp ve yaşam haberleri',
    active: true,
    order: 5,
    icon: '🏥',
    color: '#8B5CF6'
  },
  {
    name: 'Politika',
    slug: 'politika',
    description: 'Siyaset ve politika haberleri',
    active: true,
    order: 6,
    icon: '🏛️',
    color: '#EC4899'
  },
  {
    name: 'Kültür',
    slug: 'kultur',
    description: 'Kültür, sanat ve edebiyat haberleri',
    active: true,
    order: 7,
    icon: '🎭',
    color: '#14B8A6'
  },
  {
    name: 'Magazin',
    slug: 'magazin',
    description: 'Magazin, şov dünyası ve ünlü haberleri',
    active: true,
    order: 8,
    icon: '🎬',
    color: '#F97316'
  },
  {
    name: 'Eğitim',
    slug: 'egitim',
    description: 'Eğitim sistemi ve öğrenci haberleri',
    active: true,
    order: 9,
    icon: '📚',
    color: '#6366F1'
  },
  {
    name: 'Çevre',
    slug: 'cevre',
    description: 'Çevre, doğa ve iklim haberleri',
    active: true,
    order: 10,
    icon: '🌱',
    color: '#84CC16'
  },
  {
    name: 'Dünya',
    slug: 'dunya',
    description: 'Uluslararası haberler ve gelişmeler',
    active: true,
    order: 11,
    icon: '🌍',
    color: '#06B6D4'
  },
  {
    name: 'Din',
    slug: 'din',
    description: 'Din, inanç ve maneviyat haberleri',
    active: true,
    order: 12,
    icon: '🙏',
    color: '#A855F7'
  }
];

// Örnek haberler
const sampleNews = [
  {
    title: 'Türkiye Ekonomisinde Yeni Gelişmeler',
    summary: 'Ekonomi alanında son dönemde yaşanan gelişmeler ve uzmanların değerlendirmeleri...',
    content: 'Detaylı haber içeriği burada yer alacak. Bu alanda haberin tam metni bulunur.',
    category: 'ekonomi',
    author: 'Ekonomi Editörü',
    source: 'NetNext',
    status: 'published',
    breaking: false,
    urgent: false,
    featured: true,
    views: 1250,
    tags: ['ekonomi', 'finans', 'türkiye'],
    images: [
      {
        url: 'https://via.placeholder.com/800x600/1f2937/ffffff?text=Ekonomi+Haberi',
        alt: 'Ekonomi haberi görseli',
        caption: 'Türkiye ekonomisinden bir görünüm'
      }
    ]
  },
  {
    title: 'Teknoloji Dünyasında Yapay Zeka Devrimi',
    summary: 'Yapay zeka teknolojilerinin günlük hayatımıza etkisi giderek artıyor...',
    content: 'Yapay zeka teknolojilerinin gelişimi ve toplumsal etkileri hakkında detaylı analiz.',
    category: 'teknoloji',
    author: 'Teknoloji Editörü',
    source: 'NetNext',
    status: 'published',
    breaking: true,
    urgent: false,
    featured: true,
    views: 2100,
    tags: ['teknoloji', 'yapay-zeka', 'ai'],
    images: [
      {
        url: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Teknoloji+Haberi',
        alt: 'Teknoloji haberi görseli',
        caption: 'Yapay zeka teknolojileri'
      }
    ]
  },
  {
    title: 'Spor Dünyasından Son Gelişmeler',
    summary: 'Futbol liglerinde yaşanan heyecan verici maçlar ve transfer haberleri...',
    content: 'Spor dünyasından son dakika haberleri ve analiz yazıları.',
    category: 'spor',
    author: 'Spor Editörü',
    source: 'NetNext',
    status: 'published',
    breaking: false,
    urgent: false,
    featured: false,
    views: 890,
    tags: ['spor', 'futbol', 'liga'],
    images: [
      {
        url: 'https://via.placeholder.com/800x600/10b981/ffffff?text=Spor+Haberi',
        alt: 'Spor haberi görseli',
        caption: 'Futbol sahnesinden'
      }
    ]
  },
  {
    title: 'Sağlık Alanında Yeni Buluşlar',
    summary: 'Tıp dünyasında yaşanan gelişmeler ve sağlıklı yaşam önerileri...',
    content: 'Sağlık alanındaki son araştırmalar ve uzman görüşleri.',
    category: 'saglik',
    author: 'Sağlık Editörü',
    source: 'NetNext',
    status: 'published',
    breaking: false,
    urgent: true,
    featured: false,
    views: 675,
    tags: ['sağlık', 'tıp', 'araştırma'],
    images: [
      {
        url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Saglik+Haberi',
        alt: 'Sağlık haberi görseli',
        caption: 'Sağlık alanından gelişmeler'
      }
    ]
  },
  {
    title: 'Çevre Koruma Çalışmaları Artıyor',
    summary: 'İklim değişikliği ile mücadele kapsamında yeni projeler hayata geçiriliyor...',
    content: 'Çevre koruma alanında yapılan çalışmalar ve sürdürülebilirlik projeleri.',
    category: 'cevre',
    author: 'Çevre Editörü',
    source: 'NetNext',
    status: 'published',
    breaking: false,
    urgent: false,
    featured: true,
    views: 430,
    tags: ['çevre', 'iklim', 'sürdürülebilirlik'],
    images: [
      {
        url: 'https://via.placeholder.com/800x600/84cc16/ffffff?text=Cevre+Haberi',
        alt: 'Çevre haberi görseli',
        caption: 'Doğa koruma çalışmaları'
      }
    ]
  }
];

async function setupCategoriesAndNews() {
  try {
    console.log('Kategoriler Firebase\'e ekleniyor...');
    
    // Kategorileri ekle
    for (const category of categories) {
      const categoryData = {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, 'categories'), categoryData);
      console.log(`✅ ${category.name} kategorisi eklendi`);
    }
    
    console.log('\nÖrnek haberler Firebase\'e ekleniyor...');
    
    // Örnek haberleri ekle
    for (const news of sampleNews) {
      const newsData = {
        ...news,
        createdAt: new Date(),
        publishedAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, 'news'), newsData);
      console.log(`✅ ${news.title} haberi eklendi`);
    }
    
    console.log('\n🎉 Kategori ve haber kurulumu tamamlandı!');
    console.log('\nKontrol etmek için:');
    console.log('1. Firebase Console > Firestore Database bölümüne gidin');
    console.log('2. "categories" ve "news" koleksiyonlarını kontrol edin');
    console.log('3. Admin panelinden kategori yönetimini test edin: /admin/categories');
    console.log('4. Kategori sayfalarını test edin: /kategori/[kategori-slug]');
    
  } catch (error) {
    console.error('❌ Kurulum sırasında hata:', error);
  }
}

async function checkExistingData() {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const newsSnapshot = await getDocs(collection(db, 'news'));
    
    console.log(`Mevcut kategoriler: ${categoriesSnapshot.size}`);
    console.log(`Mevcut haberler: ${newsSnapshot.size}`);
    
    if (categoriesSnapshot.size > 0 || newsSnapshot.size > 0) {
      console.log('\n⚠️  Dikkat: Firebase\'de zaten veri bulunuyor.');
      console.log('Devam etmek istiyorsanız setupCategoriesAndNews() fonksiyonunu çağırın.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Veri kontrol hatası:', error);
    return false;
  }
}

// Scripti çalıştır
async function main() {
  console.log('🚀 Firebase Kategori ve Haber Kurulum Scripti\n');
  
  const canProceed = await checkExistingData();
  
  if (canProceed) {
    await setupCategoriesAndNews();
  }
}

// Eğer doğrudan çalıştırılıyorsa
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  setupCategoriesAndNews,
  checkExistingData,
  categories,
  sampleNews
};
