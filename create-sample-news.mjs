// Firebase breaking news ve kategori haberleri oluşturma
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBRdFZpqEQ7aT-ZO9vqHp1gE2g9oyqE1vo",
  authDomain: "haber-a62cf.firebaseapp.com",
  projectId: "haber-a62cf",
  storageBucket: "haber-a62cf.appspot.com",
  messagingSenderId: "1030993732306",
  appId: "1:1030993732306:web:4c6fafb6ba8a67c3b40c5e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Breaking news örnekleri
const breakingNewsData = [
  {
    title: "Ekonomide Son Durum: Dolar/TL Kuru Güncellenmesi",
    summary: "Merkez Bankası'nın açıklamaları sonrası döviz kurlarında dikkat çekici hareketler yaşanıyor.",
    content: "Türkiye Cumhuriyet Merkez Bankası'nın bugün yaptığı açıklamalar sonrası döviz piyasalarında önemli gelişmeler yaşanıyor. Uzmanlar, önümüzdeki dönemde ekonomik göstergelerin yakından takip edilmesi gerektiğini belirtiyor.",
    category: "ekonomi",
    author: "Ekonomi Editörü",
    source: "NetNext",
    status: "published",
    breaking: true,
    urgent: false,
    featured: true,
    images: ["https://picsum.photos/800/600?random=1"],
    tags: ["ekonomi", "dolar", "merkez bankası", "döviz"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  {
    title: "Teknoloji Dünyasında Yeni Gelişme: Yapay Zeka Atılımı",
    summary: "Yerli teknoloji şirketi, yapay zeka alanında önemli bir başarıya imza attı.",
    content: "Türkiye'nin önde gelen teknoloji şirketlerinden biri, yapay zeka alanında dünya çapında rekabet edebilecek yeni bir ürün geliştirdi. Bu gelişme, ülkemizin teknoloji alanındaki konumunu güçlendiriyor.",
    category: "teknoloji",
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    breaking: true,
    urgent: false,
    featured: true,
    images: ["https://picsum.photos/800/600?random=2"],
    tags: ["teknoloji", "yapay zeka", "yerli üretim", "inovasyon"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  {
    title: "Spor Dünyasından Flaş Haber: Milli Takımda Yeni Gelişme",
    summary: "A Milli Futbol Takımı'nda önemli bir karar alındı.",
    content: "Türkiye A Milli Futbol Takımı'nda teknik direktörlük konusunda önemli gelişmeler yaşanıyor. Türkiye Futbol Federasyonu'ndan yapılan açıklama spor camiasında geniş yankı uyandırdı.",
    category: "spor",
    author: "Spor Editörü",
    source: "NetNext",
    status: "published",
    breaking: true,
    urgent: true,
    featured: true,
    images: ["https://picsum.photos/800/600?random=3"],
    tags: ["spor", "futbol", "milli takım", "tff"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }
];

// Kategori haberleri örnekleri
const categoryNewsData = [
  // Gündem haberleri
  {
    title: "Şehir Merkezinde Yeni Sosyal Proje Başlatıldı",
    summary: "Belediye, vatandaşların sosyal ihtiyaçlarını karşılamak için yeni bir proje hayata geçirdi.",
    content: "Büyükşehir Belediyesi tarafından başlatılan yeni sosyal proje, özellikle ihtiyaç sahibi ailelere yönelik kapsamlı hizmetler sunuyor. Proje kapsamında eğitim, sağlık ve sosyal yardım hizmetleri bir arada veriliyor.",
    category: "gundem",
    author: "Gündem Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: false,
    images: ["https://picsum.photos/800/600?random=4"],
    tags: ["gündem", "belediye", "sosyal proje", "yardım"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  {
    title: "Eğitim Alanında Dijital Dönüşüm Hızlanıyor",
    summary: "Milli Eğitim Bakanlığı, okullarda dijital eğitim altyapısını güçlendirme çalışmalarını sürdürüyor.",
    content: "Türkiye'nin eğitim sisteminde dijital dönüşüm projeleri hız kazanıyor. Okullarda akıllı tahta, tablet dağıtımı ve dijital içerik geliştirme çalışmaları devam ediyor.",
    category: "gundem",
    author: "Eğitim Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: true,
    images: ["https://picsum.photos/800/600?random=5"],
    tags: ["eğitim", "dijital", "teknoloji", "okul"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  // Teknoloji haberleri
  {
    title: "5G Teknolojisi Yaygınlaşmaya Devam Ediyor",
    summary: "Türkiye'de 5G altyapısı çalışmaları hızlanırken, kullanıcılar yeni teknolojinin avantajlarını deneyimliyor.",
    content: "Türkiye'nin büyük şehirlerinde 5G teknolojisi yaygınlaşmaya devam ediyor. Telekomünikasyon operatörleri, 2024 yılında 5G kapsamını genişletmeyi planlıyor.",
    category: "teknoloji",
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: false,
    images: ["https://picsum.photos/800/600?random=6"],
    tags: ["teknoloji", "5g", "internet", "telekomünikasyon"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  // Ekonomi haberleri
  {
    title: "Yatırım Teşvikleri Genişletildi",
    summary: "Hükümet, özel sektör yatırımlarını desteklemek için yeni teşvik paketini açıkladı.",
    content: "Sanayi ve Teknoloji Bakanlığı, özel sektör yatırımlarını desteklemek için kapsamlı teşvik paketi açıkladı. Paket, özellikle teknoloji ve üretim alanlarındaki yatırımları hedefliyor.",
    category: "ekonomi",
    author: "Ekonomi Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: true,
    images: ["https://picsum.photos/800/600?random=7"],
    tags: ["ekonomi", "yatırım", "teşvik", "sanayi"],
    views: 0,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }
];

async function createSampleNews() {
  try {
    console.log('Breaking news oluşturuluyor...');
    
    // Breaking news ekleme
    for (const news of breakingNewsData) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log('Breaking news eklendi:', docRef.id, '-', news.title);
    }
    
    console.log('\nKategori haberleri oluşturuluyor...');
    
    // Kategori haberleri ekleme
    for (const news of categoryNewsData) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log('Kategori haberi eklendi:', docRef.id, '-', news.title);
    }
    
    console.log('\n✅ Tüm örnek haberler başarıyla oluşturuldu!');
    console.log('💡 Bu haberler Firebase index hatalarını önleyecek şekilde optimize edilmiştir.');
    
  } catch (error) {
    console.error('❌ Haber oluşturma hatası:', error);
  }
}

// Scripti çalıştır
createSampleNews();
