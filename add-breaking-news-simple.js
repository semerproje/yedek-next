// Firebase'e Profesyonel Son Dakika Haberleri Ekleme
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const breakingNewsData = [
  {
    title: "Merkez Bankası Faiz Kararını Açıkladı: Yüzde 45'te Sabit Tutuldu",
    summary: "TCMB, politika faizini yüzde 45 seviyesinde değiştirmeme kararı aldı. Enflasyonla mücadelede kararlılık mesajı verildi.",
    content: "Türkiye Cumhuriyet Merkezi Bankası (TCMB), Para Politikası Kurulu toplantısının ardından politika faizini yüzde 45 seviyesinde sabit tutma kararı aldığını açıkladı. TCMB'den yapılan açıklamada, enflasyonla mücadelede kararlılıkla devam edileceği ve fiyat istikrarı hedefine odaklanıldığı belirtildi.",
    category: "ekonomi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
        caption: "Merkez Bankası binası",
        alt: "TCMB Merkez Bankası binası"
      }
    ],
    author: "Ekonomi Editörü",
    source: "NetNext",
    status: "published",
    views: 1247,
    tags: ["merkez bankası", "faiz", "ekonomi", "enflasyon"],
    breaking: true,
    urgent: true,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "İstanbul'da Metro Seferlerine Kar Engeli: Bazı Hatlar Durdu",
    summary: "Şiddetli kar yağışı nedeniyle İstanbul'da bazı metro hatlarında seferler durduruldu. Vatandaşlar alternatif ulaşım araçlarını kullanıyor.",
    content: "İstanbul'u etkisi altına alan şiddetli kar yağışı, toplu ulaşımda aksamalara neden oldu. İstanbul Büyükşehir Belediyesi, güvenlik gerekçesiyle bazı metro hatlarında seferleri geçici olarak durdurduğunu açıkladı.",
    category: "gundem",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        caption: "İstanbul'da kar yağışı",
        alt: "İstanbul metrosunda kar etkisi"
      }
    ],
    author: "Haber Editörü",
    source: "NetNext",
    status: "published",
    views: 892,
    tags: ["istanbul", "kar", "metro", "ulaşım"],
    breaking: true,
    urgent: true,
    featured: false,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Galatasaray Transfer Bombası: Dünya Yıldızı İçin Anlaşma Sağlandı",
    summary: "Galatasaray, Avrupa'nın önde gelen takımlarından birinde forma giyen yıldız futbolcu ile ön anlaşmaya vardı.",
    content: "Galatasaray, kış transfer döneminin en büyük bombalarından birini patlatmaya hazırlanıyor. Kulüp yönetimi, Avrupa'nın köklü takımlarından birinde forma giyen yıldız oyuncu ile ön anlaşmaya vardığını duyurdu.",
    category: "spor",
    images: [
      {
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
        caption: "Galatasaray stadyumu",
        alt: "Galatasaray transfer haberi"
      }
    ],
    author: "Spor Editörü",
    source: "NetNext",
    status: "published",
    views: 2156,
    tags: ["galatasaray", "transfer", "futbol", "şampiyonlar ligi"],
    breaking: true,
    urgent: true,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Yapay Zeka Devrimi: OpenAI'ın Yeni Modeli GPT-5 Tanıtıldı",
    summary: "OpenAI, GPT-4'ten 10 kat daha güçlü olan GPT-5 modelini duyurdu. Yeni model, insan seviyesinde akıl yürütme yapabilecek.",
    content: "Yapay zeka dünyasını sarsan bir gelişme yaşandı. OpenAI, merakla beklenen GPT-5 modelini resmi olarak tanıttı. Şirket CEO'su Sam Altman, yeni modelin GPT-4'ten 10 kat daha güçlü olduğunu açıkladı.",
    category: "teknoloji",
    images: [
      {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        caption: "Yapay zeka teknolojisi",
        alt: "OpenAI GPT-5 modeli"
      }
    ],
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    views: 3421,
    tags: ["yapay zeka", "openai", "gpt-5", "teknoloji"],
    breaking: true,
    urgent: true,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "Sağlık Bakanı'ndan Kritik Açıklama: Yeni Salgın Tehdidine Karşı Hazırlık",
    summary: "Sağlık Bakanı, yakın bölgelerde görülen yeni virüs mutasyonuna karşı Türkiye'nin hazırlıklarını değerlendirdi.",
    content: "Sağlık Bakanı Prof. Dr. Fahrettin Koca, komşu ülkelerde görülen yeni virüs mutasyonuna ilişkin açıklama yaptı. Bakan, Türkiye'nin sağlık sisteminin hazır olduğunu ve gerekli önlemlerin alındığını belirtti.",
    category: "saglik",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        caption: "Sağlık Bakanlığı binası",
        alt: "Sağlık Bakanı açıklama"
      }
    ],
    author: "Sağlık Editörü",
    source: "NetNext",
    status: "published",
    views: 1876,
    tags: ["sağlık", "virüs", "salgın", "önlem"],
    breaking: true,
    urgent: true,
    featured: false,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  },
  {
    title: "TBMM'de Kritik Oylama: Anayasa Değişikliği Teklifı Kabul Edildi",
    summary: "Türkiye Büyük Millet Meclisi'nde görüşülen anayasa değişikliği teklifi, 345 oyla kabul edildi. Referandum süreci başlayacak.",
    content: "Türkiye Büyük Millet Meclisi'nde günlerdir süren görüşmelerin ardından anayasa değişikliği teklifi oylandı. Teklifin tamamı 345 oyla kabul edildi. TBMM Başkanı, demokratik sürecin işlediğini belirtti.",
    category: "politika",
    images: [
      {
        url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop",
        caption: "TBMM Genel Kurulu",
        alt: "TBMM anayasa değişikliği oylaması"
      }
    ],
    author: "Politika Editörü",
    source: "NetNext",
    status: "published",
    views: 2743,
    tags: ["tbmm", "anayasa", "referandum", "politika"],
    breaking: true,
    urgent: true,
    featured: true,
    publishedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  }
];

async function addBreakingNews() {
  try {
    console.log('🚀 Profesyonel son dakika haberleri ekleniyor...');
    
    for (const news of breakingNewsData) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log(`✅ Haber eklendi: ${docRef.id} - ${news.title.substring(0, 40)}...`);
    }
    
    console.log('🎉 Tüm profesyonel son dakika haberleri başarıyla eklendi!');
    console.log('📊 Eklenen haber sayısı:', breakingNewsData.length);
    console.log('🔥 Bu haberler "breaking: true" olarak işaretlenmiştir.');
    console.log('💡 BreakingNewsBar komponenti bu haberleri otomatik olarak gösterecektir.');
    
  } catch (error) {
    console.error('❌ Haber ekleme hatası:', error);
  }
}

addBreakingNews();
