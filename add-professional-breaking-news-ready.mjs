// Firebase'e Son Dakika Haberi Ekleme Scripti
// Bu dosyayı çalıştırmadan önce Firebase config bilgilerini güncelleyin

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './src/firebase/firebaseConfig.js'; // Mevcut Firebase config'inizi kullanın

const professionalBreakingNews = [
  {
    title: "Merkez Bankası Faiz Kararını Açıkladı: Yüzde 45'te Sabit Tutuldu",
    summary: "TCMB, politika faizini yüzde 45 seviyesinde değiştirmeme kararı aldı. Enflasyonla mücadelede kararlılık mesajı verildi.",
    content: `Türkiye Cumhuriyet Merkezi Bankası (TCMB), Para Politikası Kurulu toplantısının ardından politika faizini yüzde 45 seviyesinde sabit tutma kararı aldığını açıkladı.

TCMB'den yapılan açıklamada, enflasyonla mücadelede kararlılıkla devam edileceği ve fiyat istikrarı hedefine odaklanıldığı belirtildi. Kurul, küresel ekonomideki gelişmeleri yakından takip ettiğini ve gerekli tedbirleri almaya hazır olduğunu ifade etti.

Ekonomistler, bu kararın piyasalar tarafından olumlu karşılandığını ve enflasyon beklentilerinin olumlu yönde etkilenebileceğini değerlendiriyor.`,
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
    content: `İstanbul'u etkisi altına alan şiddetli kar yağışı, toplu ulaşımda aksamalara neden oldu. İstanbul Büyükşehir Belediyesi, güvenlik gerekçesiyle bazı metro hatlarında seferleri geçici olarak durdurduğunu açıkladı.

Etkilenen hatlar arasında M1A, M1B ve M7 hatları bulunuyor. Belediye, vatandaşları otobüs ve dolmuş gibi alternatif ulaşım araçlarını kullanmaya davet etti.

Meteoroloji'den gelen son verilere göre kar yağışının akşam saatlerine kadar devam etmesi bekleniyor.`,
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
    content: `Galatasaray, kış transfer döneminin en büyük bombalarından birini patlatmaya hazırlanıyor. Kulüp yönetimi, Avrupa'nın köklü takımlarından birinde forma giyen yıldız oyuncu ile ön anlaşmaya vardığını duyurdu.

Transfer operasyonunu yakından takip eden kaynaklar, oyuncunun önümüzdeki hafta İstanbul'a gelerek sağlık kontrolünden geçeceğini ve resmi imzanın atılacağını belirtiyor.

Bu transfer, Galatasaray'ın Şampiyonlar Ligi'ndeki hedefleri doğrultusunda önemli bir adım olarak değerlendiriliyor.`,
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
    content: `Yapay zeka dünyasını sarsan bir gelişme yaşandı. OpenAI, merakla beklenen GPT-5 modelini resmi olarak tanıttı. Şirket CEO'su Sam Altman, yeni modelin GPT-4'ten 10 kat daha güçlü olduğunu ve insan seviyesinde akıl yürütme kabiliyetine sahip olduğunu açıkladı.

GPT-5, multimodal yetenekleri ile görsel, ses ve metin verilerini aynı anda işleyebiliyor. Model, bilimsel araştırmalardan yaratıcı yazım işlemlerine kadar geniş bir yelpazede kullanılabilecek.

Teknoloji uzmanları, bu gelişmenin yapay zeka endüstrisinde yeni bir dönem başlatacağını değerlendiriyor.`,
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
    content: `Sağlık Bakanı Prof. Dr. Fahrettin Koca, komşu ülkelerde görülen yeni virüs mutasyonuna ilişkin açıklama yaptı. Bakan, Türkiye'nin sağlık sisteminin hazır olduğunu ve gerekli önlemlerin alındığını belirtti.

Açıklamada, havaalanlarında termal kamera kontrollerinin artırıldığı, hastanelerin kapasite planlamasının yapıldığı ve aşı stoklarının gözden geçirildiği bildirildi.

Dünya Sağlık Örgütü ile koordineli çalışıldığını belirten Bakan, vatandaşları endişelenmemeye davet etti.`,
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
    content: `Türkiye Büyük Millet Meclisi'nde günlerdir süren görüşmelerin ardından anayasa değişikliği teklifi oylandı. Teklifin tamamı 345 oyla kabul edildi.

TBMM Başkanı Numan Kurtulmuş, oylamanın tamamlanmasının ardından yaptığı açıklamada, demokratik sürecin işlediğini ve teklifin referanduma gideceğini belirtti.

Anayasa değişikliği, yargı reformu ve yerel yönetimlerin güçlendirilmesi gibi konuları içeriyor. Referandum tarihi YSK tarafından belirlenecek.`,
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

async function addProfessionalBreakingNews() {
  try {
    console.log('🚀 6 adet profesyonel son dakika haberi ekleniyor...');
    
    for (const news of professionalBreakingNews) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log(`✅ Haber eklendi: ${docRef.id} - ${news.title.substring(0, 50)}...`);
    }
    
    console.log('🎉 Tüm profesyonel son dakika haberleri başarıyla eklendi!');
    console.log('📊 Eklenen haber sayısı:', professionalBreakingNews.length);
    console.log('🔥 Bu haberler "breaking: true" olarak işaretlenmiştir');
    console.log('📱 BreakingNewsBar komponenti bu haberleri otomatik olarak gösterecektir');
    console.log('🖼️ Her haberin görsel içeriği Unsplash\'den profesyonel fotoğraflar ile sağlanmıştır');
    
  } catch (error) {
    console.error('❌ Haber ekleme hatası:', error);
  }
}

// Export for use in other files
export { addProfessionalBreakingNews, professionalBreakingNews };

// Run if this file is executed directly
if (typeof window === 'undefined') {
  addProfessionalBreakingNews();
}
