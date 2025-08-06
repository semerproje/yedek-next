// Firestore'a Demo Haber Ekleme Script

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

async function addSampleNews() {
  console.log('📰 Firestore\'a örnek haberler ekleniyor...\n');

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const sampleNews = [
      {
        title: "Türkiye Ekonomisinde Yeni Gelişmeler",
        summary: "Ekonomi alanında yaşanan son gelişmeler ve bunların yansımaları",
        content: "Türkiye ekonomisinde yaşanan son gelişmeler, piyasalarda önemli hareketlere neden oldu. Uzmanlar, bu durumun kısa vadede pozitif etkiler yaratacağını öngörüyor.",
        category: "ekonomi",
        author: "Ekonomi Editörü",
        status: "published",
        tags: ["ekonomi", "türkiye", "piyasa"],
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
        views: 150,
        featured: true,
        createdAt: Timestamp.now(),
        publishDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Spor Dünyasından Son Dakika Haberleri",
        summary: "Futbol ve diğer spor dallarından güncel gelişmeler",
        content: "Spor dünyasında yaşanan son gelişmeler, taraftarları heyecanlandırmaya devam ediyor. Özellikle futbol alanında yaşanan transferler dikkat çekiyor.",
        category: "spor",
        author: "Spor Editörü",
        status: "published",
        tags: ["spor", "futbol", "transfer"],
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        views: 320,
        featured: false,
        createdAt: Timestamp.now(),
        publishDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Teknoloji Sektöründe Yapay Zeka Devrimi",
        summary: "AI teknolojilerinin günlük hayata etkisi ve gelecek projeksiyonları",
        content: "Yapay zeka teknolojileri, günlük hayatımızın her alanında kendini göstermeye başladı. Uzmanlar, önümüzdeki dönemde bu etkinin daha da artacağını belirtiyor.",
        category: "teknoloji",
        author: "Teknoloji Editörü",
        status: "published",
        tags: ["teknoloji", "ai", "yapay zeka"],
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
        views: 89,
        featured: true,
        createdAt: Timestamp.now(),
        publishDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Sağlık Alanında Yeni Keşifler",
        summary: "Tıp dünyasından umut verici gelişmeler",
        content: "Sağlık alanında yapılan son araştırmalar, birçok hastalığın tedavisinde yeni umutlar yaratıyor. Bilim insanları, gelecek vaat eden sonuçlar elde etti.",
        category: "saglik",
        author: "Sağlık Editörü",
        status: "published",
        tags: ["sağlık", "tıp", "araştırma"],
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
        views: 67,
        featured: false,
        createdAt: Timestamp.now(),
        publishDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Eğitim Sistemi Reformu Tartışmaları",
        summary: "Eğitim alanında yapılması planlanan değişiklikler",
        content: "Eğitim sistemi üzerinde yapılan çalışmalar, önemli değişikliklerin habercisi. Uzmanlar ve eğitimciler, bu konudaki görüşlerini paylaşıyor.",
        category: "egitim",
        author: "Eğitim Editörü",
        status: "draft",
        tags: ["eğitim", "reform", "sistem"],
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        views: 23,
        featured: false,
        createdAt: Timestamp.now(),
        publishDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    let addedCount = 0;
    for (const newsItem of sampleNews) {
      try {
        const docRef = await addDoc(collection(db, 'news'), newsItem);
        console.log(`✅ Haber eklendi: ${docRef.id} - ${newsItem.title}`);
        addedCount++;
      } catch (error) {
        console.log(`❌ Haber eklenemedi: ${newsItem.title} - ${error.message}`);
      }
    }

    console.log(`\n📊 Toplam ${addedCount} haber Firestore'a eklendi`);
    console.log('\n🎉 Demo veriler başarıyla eklendi!');
    console.log('🔗 Şimdi http://localhost:3000/admin/dashboard/news adresini kontrol edebilirsiniz');

  } catch (error) {
    console.error('💥 Haber ekleme hatası:', error);
  }
}

addSampleNews();
