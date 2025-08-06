#!/usr/bin/env node

/**
 * Anasayfa Modülleri İçin Kapsamlı Mock Data Oluşturucu
 * Tüm homepage modülleri için profesyonel haber verileri Firebase'e ekler
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDJz_1dP4JmhF0t7bXJ_1Q0z_DY-D2RfBU",
  authDomain: "netnext-media.firebaseapp.com",
  projectId: "netnext-media",
  storageBucket: "netnext-media.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * ANASAYFA MODÜLLERİ İÇİN KAPSAMLI HABER VERİLERİ
 */

// 1. MAIN VISUAL HEADLINE (Ana Manşet) - 15 haber
const mainVisualHeadlineNews = [
  {
    title: "Cumhurbaşkanı Erdoğan'dan Ekonomi Açıklaması: 'Enflasyon Tek Haneli Rakama İnecek'",
    summary: "Cumhurbaşkanı Erdoğan, ekonomik reform paketinin detaylarını açıkladı. Enflasyonla mücadele ve yeni yatırım teşvikleri konularında önemli kararlar alındı.",
    content: "Cumhurbaşkanı Recep Tayyip Erdoğan, Beştepe'de düzenlediği basın toplantısında ekonomi alanında atılacak yeni adımları açıkladı. Enflasyonla mücadelede kararlılıkla devam edeceklerini belirten Erdoğan, 'Önümüzdeki aylarda enflasyonun tek haneli rakamlara ineceğine inanıyorum' dedi...",
    category: "gundem",
    images: [{ url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=800&q=80" }],
    author: "Politika Editörü",
    source: "NetNext",
    status: "published",
    breaking: true,
    urgent: true,
    featured: true,
    views: 15420,
    tags: ["erdoğan", "ekonomi", "enflasyon", "reform"]
  },
  {
    title: "İstanbul'da 7.2 Büyüklüğünde Deprem Simülasyonu: 'Hazırlıklarımız Tamamlandı'",
    summary: "İstanbul Büyükşehir Belediyesi ve AFAD işbirliğiyle gerçekleştirilen deprem simülasyonunda şehrin afet hazırlık seviyesi test edildi.",
    content: "İstanbul genelinde gerçekleştirilen kapsamlı deprem simülasyonu, şehrin afet karşısında ne kadar hazırlıklı olduğunu ortaya koydu...",
    category: "gundem",
    images: [{ url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80" }],
    author: "Haber Merkezi",
    source: "NetNext",
    status: "published",
    breaking: true,
    urgent: false,
    featured: true,
    views: 12350,
    tags: ["deprem", "istanbul", "afad", "simülasyon"]
  },
  {
    title: "SpaceX'in Türk Uydusu Başarıyla Fırlatıldı: 'Uzay Teknolojisinde Yeni Dönem'",
    summary: "Türkiye'nin yeni nesil haberleşme uydusu SpaceX Falcon Heavy roketi ile başarıyla uzaya gönderildi. Proje ile ülkenin uzay teknolojisinde önemli adım attığı belirtildi.",
    content: "TÜRKSAT 6A uydusu, SpaceX'in Falcon Heavy roketi ile Kennedy Uzay Merkezi'nden başarıyla fırlatıldı...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=800&q=80" }],
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: true,
    views: 8760,
    tags: ["spacex", "uydu", "türksat", "uzay"]
  },
  {
    title: "Euro 2024 Finali: İspanya-İngiltere Maçı Bu Akşam Oynanacak",
    summary: "Avrupa Futbol Şampiyonası finalinde İspanya ile İngiltere karşı karşıya gelecek. Berlin Olimpiyat Stadı'nda oynanacak müsabaka saat 22:00'da başlayacak.",
    content: "EURO 2024'ün en heyecanlı maçı bu akşam Berlin'de oynanacak...",
    category: "spor",
    images: [{ url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" }],
    author: "Spor Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: true,
    featured: true,
    views: 23140,
    tags: ["euro2024", "final", "ispanya", "ingiltere"]
  },
  {
    title: "Sağlık Bakanlığı'ndan Kritik Aşı Açıklaması: 'Grip Sezonu Öncesi Hazırlık Şart'",
    summary: "Sağlık Bakanı Dr. Fahrettin Koca, yaklaşan grip sezonuna karşı vatandaşları aşı olmaya davet etti. Ücretsiz aşı uygulaması başladı.",
    content: "Sağlık Bakanlığı, 2024-2025 grip sezonu öncesi aşılama kampanyasını başlattı...",
    category: "saglik",
    images: [{ url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80" }],
    author: "Sağlık Editörü",
    source: "NetNext",
    status: "published",
    breaking: false,
    urgent: false,
    featured: true,
    views: 9850,
    tags: ["aşı", "grip", "sağlık", "bakanlık"]
  }
];

// 2. HEADLINE NEWS GRID (Manşet Haber Ağı) - 12 haber
const headlineNewsGridData = [
  {
    title: "Milli Eğitim Bakanlığı'ndan Yeni Müfredat Açıklaması",
    summary: "2024-2025 eğitim öğretim yılında uygulanacak yeni müfredat programının detayları açıklandı.",
    content: "Milli Eğitim Bakanlığı tarafından hazırlanan yeni müfredat programı...",
    category: "egitim",
    images: [{ url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" }],
    author: "Eğitim Editörü",
    source: "NetNext",
    status: "published",
    featured: true,
    views: 7420,
    tags: ["müfredat", "eğitim", "bakanlık", "okul"]
  },
  {
    title: "Türk Lirası Güçleniyor: Dolar 32.50 TL'ye Kadar Geriledi",
    summary: "Merkez Bankası'nın aldığı tedbirler sonucu Türk Lirası değer kazanmaya devam ediyor.",
    content: "Türk Lirası, Merkez Bankası'nın para politikası kararları sonrasında güçlenme trendini sürdürüyor...",
    category: "ekonomi",
    images: [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" }],
    author: "Ekonomi Editörü",
    source: "NetNext",
    status: "published",
    featured: true,
    views: 11200,
    tags: ["dolar", "tl", "merkez bankası", "kur"]
  },
  {
    title: "Sinema Sektöründe Yeni Dönem: 'Türk Filmleri Dünya Sahnesinde'",
    summary: "Türk sineması uluslararası festivallerde büyük başarı elde ederken, yerli yapımlar gişe rekoru kırıyor.",
    content: "Son dönemde Türk sineması hem ulusal hem de uluslararası arenada dikkat çekici başarılara imza atıyor...",
    category: "kultur",
    images: [{ url: "https://images.unsplash.com/photo-1489599067951-4ac0de6c90b7?auto=format&fit=crop&w=800&q=80" }],
    author: "Kültür Editörü",
    source: "NetNext",
    status: "published",
    featured: false,
    views: 5630,
    tags: ["sinema", "film", "festival", "kültür"]
  }
];

// 3. POPULAR NEWS SIDEBAR (Popüler Haberler) - 10 haber
const popularNewsData = [
  {
    title: "İstanbul Trafiğine Teknolojik Çözüm: Akıllı Trafik Işıkları",
    summary: "İstanbul Büyükşehir Belediyesi'nin akıllı trafik ışığı projesi trafik yoğunluğunu %30 azalttı.",
    content: "İstanbul'da pilot bölgelerde uygulanan akıllı trafik ışığı sistemi...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" }],
    author: "Şehir Editörü",
    source: "NetNext",
    status: "published",
    views: 18750,
    tags: ["trafik", "istanbul", "teknoloji", "belediye"]
  },
  {
    title: "Gastronomi Turizmi Büyüyor: 'Türk Mutfağı Dünya Markası Oluyor'",
    summary: "Türkiye'nin gastronomi turizmi geliri geçen yıla göre %45 artış gösterdi.",
    content: "Türk mutfağının dünya çapında tanınması ve gastronomi turizminin gelişmesi...",
    category: "turizm",
    images: [{ url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" }],
    author: "Turizm Editörü",
    source: "NetNext",
    status: "published",
    views: 9320,
    tags: ["gastronomi", "turizm", "mutfak", "marka"]
  }
];

// 4. EDITOR PICKS (Editör Seçimleri) - 8 haber
const editorPicksData = [
  {
    title: "Yapay Zeka ve Gazetecilik: 'Medyanın Geleceği Nasıl Şekillenecek?'",
    summary: "Yapay zeka teknolojilerinin gazetecilik sektörüne etkilerini ve gelecekteki rolünü inceliyoruz.",
    content: "Yapay zeka teknolojilerinin hızla gelişmesi, gazetecilik mesleğinde önemli değişikliklere yol açıyor...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" }],
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    featured: true,
    views: 6780,
    tags: ["yapay zeka", "gazetecilik", "medya", "gelecek"]
  },
  {
    title: "Çevre Dostu Şehircilik: Ankara'nın Yeşil Dönüşüm Projesi",
    summary: "Ankara Büyükşehir Belediyesi'nin çevre dostu şehircilik yaklaşımı dikkat çekiyor.",
    content: "Ankara'da hayata geçirilen yeşil şehir projesi kapsamında...",
    category: "cevre",
    images: [{ url: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=800&q=80" }],
    author: "Çevre Editörü",
    source: "NetNext",
    status: "published",
    featured: true,
    views: 4920,
    tags: ["çevre", "şehircilik", "ankara", "yeşil"]
  }
];

// 5. VIDEO HIGHLIGHTS (Video Öne Çıkanlar) - 6 haber
const videoHighlightsData = [
  {
    title: "Cumhurbaşkanı Erdoğan'ın G7 Zirvesi Açıklamaları",
    summary: "Cumhurbaşkanı Erdoğan, G7 Zirvesi'ndeki açıklamalarında Türkiye'nin uluslararası konumuna değindi.",
    content: "G7 Zirvesi'nde önemli açıklamalarda bulunan Cumhurbaşkanı Erdoğan...",
    category: "gundem",
    images: [{ url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=800&q=80" }],
    author: "Dış Politika Editörü",
    source: "NetNext",
    status: "published",
    videoUrl: "https://example.com/video1.mp4",
    videoDuration: 180,
    views: 25630,
    tags: ["erdoğan", "g7", "zirve", "politika"]
  },
  {
    title: "Galatasaray'ın Şampiyonlar Ligi Maçı Özeti",
    summary: "Galatasaray'ın Şampiyonlar Ligi'ndeki performansını video özetimizle izleyin.",
    content: "Galatasaray'ın Şampiyonlar Ligi maçındaki önemli anlar...",
    category: "spor",
    images: [{ url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" }],
    author: "Spor Editörü",
    source: "NetNext",
    status: "published",
    videoUrl: "https://example.com/video2.mp4",
    videoDuration: 240,
    views: 19450,
    tags: ["galatasaray", "şampiyonlar ligi", "futbol", "özet"]
  }
];

// 6. AI RECOMMENDATION (AI Önerileri) - 8 haber
const aiRecommendationData = [
  {
    title: "Blockchain Teknolojisi Kamu Sektöründe: Dijital Kimlik Projesi",
    summary: "Türkiye'nin dijital kimlik projesi blockchain teknolojisi kullanılarak hayata geçiriliyor.",
    content: "Kamu sektöründe blockchain teknolojisinin kullanılması...",
    category: "teknoloji",
    images: [{ url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80" }],
    author: "Teknoloji Editörü",
    source: "NetNext",
    status: "published",
    views: 7230,
    tags: ["blockchain", "dijital kimlik", "kamu", "teknoloji"]
  },
  {
    title: "Uzaktan Çalışma Trendleri: 'Hibrit Model Kalıcı Oluyor'",
    summary: "Pandemi sonrası dönemde uzaktan çalışma modeli şirketlerin tercih ettiği hibrit sisteme dönüştü.",
    content: "COVID-19 pandemisi sonrasında iş dünyasında yaşanan değişimler...",
    category: "ekonomi",
    images: [{ url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80" }],
    author: "İş Dünyası Editörü",
    source: "NetNext",
    status: "published",
    views: 8150,
    tags: ["uzaktan çalışma", "hibrit", "pandemi", "iş"]
  }
];

// 7. WEEKEND READS (Hafta Sonu Okumaları) - 6 haber
const weekendReadsData = [
  {
    title: "Türk Edebiyatında Yeni Sesler: Genç Yazarların Başarı Hikayesi",
    summary: "Son dönemde dikkat çeken genç Türk yazarların eserleri uluslararası arenada da ilgi görüyor.",
    content: "Türk edebiyatında yeni nesil yazarların ortaya çıkardığı eserler...",
    category: "kultur",
    images: [{ url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" }],
    author: "Edebiyat Editörü",
    source: "NetNext",
    status: "published",
    views: 3450,
    tags: ["edebiyat", "yazar", "kitap", "kültür"]
  },
  {
    title: "Doğa Fotoğrafçılığında Türkiye'nin Gizli Cennerleri",
    summary: "Türkiye'nin az bilinen doğal güzelliklerini keşfeden fotoğrafçıların objektifinden...",
    content: "Ülkemizin dört bir yanındaki gizli doğal güzellikler...",
    category: "kultur",
    images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" }],
    author: "Doğa Editörü",
    source: "NetNext",
    status: "published",
    views: 5670,
    tags: ["doğa", "fotoğraf", "türkiye", "gezi"]
  }
];

// 8. NEWS PROGRAMS GRID (Haber Programları) - 5 program
const newsProgramsData = [
  {
    title: "Ana Haber Bülteni - Akşam Yayını",
    summary: "Günün en önemli gelişmelerini kapsamlı bir şekilde sunan ana haber bülteni.",
    content: "Her akşam saat 20:00'da yayınlanan ana haber bülteni...",
    category: "program",
    images: [{ url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80" }],
    author: "Program Editörü",
    source: "NetNext",
    status: "published",
    programType: "news",
    airTime: "20:00",
    duration: 60,
    views: 45000,
    tags: ["ana haber", "bülten", "akşam", "program"]
  },
  {
    title: "Ekonomi Gündemi - Haftalık Analiz",
    summary: "Türkiye ve dünya ekonomisindeki gelişmelerin derinlemesine analiz edildiği program.",
    content: "Her hafta pazar günü yayınlanan ekonomi analiz programı...",
    category: "program",
    images: [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" }],
    author: "Program Editörü",
    source: "NetNext",
    status: "published",
    programType: "analysis",
    airTime: "10:00",
    duration: 45,
    views: 12500,
    tags: ["ekonomi", "analiz", "haftalık", "program"]
  }
];

/**
 * Firebase'e veri yükleme fonksiyonu
 */
async function uploadNewsToFirebase() {
  console.log('🚀 Anasayfa modülleri için haber verilerini Firebase\'e yüklemeye başlıyoruz...\n');

  const allNewsData = [
    ...mainVisualHeadlineNews.map(news => ({...news, module: 'main-visual-headline'})),
    ...headlineNewsGridData.map(news => ({...news, module: 'headline-news-grid'})),
    ...popularNewsData.map(news => ({...news, module: 'popular-news-sidebar'})),
    ...editorPicksData.map(news => ({...news, module: 'editor-picks'})),
    ...videoHighlightsData.map(news => ({...news, module: 'video-highlights'})),
    ...aiRecommendationData.map(news => ({...news, module: 'ai-recommendation'})),
    ...weekendReadsData.map(news => ({...news, module: 'weekend-reads'})),
    ...newsProgramsData.map(news => ({...news, module: 'news-programs'}))
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const newsItem of allNewsData) {
    try {
      const docData = {
        ...newsItem,
        createdAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        breaking: newsItem.breaking || false,
        urgent: newsItem.urgent || false,
        featured: newsItem.featured || false,
        views: newsItem.views || Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 50) + 5
      };

      const docRef = await addDoc(collection(db, 'news'), docData);
      console.log(`✅ ${newsItem.module} - ${newsItem.title.substring(0, 50)}... | ID: ${docRef.id}`);
      successCount++;
      
      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Hata - ${newsItem.title.substring(0, 30)}...:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 YÜKLEME RAPORU:');
  console.log(`✅ Başarılı: ${successCount} haber`);
  console.log(`❌ Hatalı: ${errorCount} haber`);
  console.log(`📰 Toplam: ${allNewsData.length} haber`);
  
  console.log('\n📋 MODÜL BAŞINA HABER SAYILARI:');
  console.log(`📰 Ana Manşet (MainVisualHeadline): ${mainVisualHeadlineNews.length} haber`);
  console.log(`📰 Manşet Grid (HeadlineNewsGrid): ${headlineNewsGridData.length} haber`);
  console.log(`📰 Popüler Haberler (PopularNewsSidebar): ${popularNewsData.length} haber`);
  console.log(`📰 Editör Seçimleri (EditorPicks): ${editorPicksData.length} haber`);
  console.log(`📰 Video Öne Çıkanlar (VideoHighlights): ${videoHighlightsData.length} haber`);
  console.log(`📰 AI Önerileri (AiRecommendation): ${aiRecommendationData.length} haber`);
  console.log(`📰 Hafta Sonu Okumaları (WeekendReads): ${weekendReadsData.length} haber`);
  console.log(`📰 Haber Programları (NewsPrograms): ${newsProgramsData.length} haber`);

  console.log('\n🎉 Tüm anasayfa modülleri için haber verileri başarıyla yüklendi!');
}

// Script çalıştır
uploadNewsToFirebase().catch(console.error);
