// ============================================
// ANASAYFA MODÜLLERİ İÇİN MOCK DATA (Düzeltilmiş)
// Tüm homepage komponenterinde kullanılacak
// ============================================

export const mockNewsData = {
  // 1. ANA MANŞET VERİLERİ (MainVisualHeadline)
  mainVisualHeadline: [
    {
      id: "main-1",
      title: "Cumhurbaşkanı Erdoğan'dan Ekonomi Açıklaması: 'Enflasyon Tek Haneli Rakama İnecek'",
      summary: "Cumhurbaşkanı Erdoğan, ekonomik reform paketinin detaylarını açıkladı. Enflasyonla mücadele ve yeni yatırım teşvikleri konularında önemli kararlar alındı.",
      content: "Cumhurbaşkanı Recep Tayyip Erdoğan, Beştepe'de düzenlediği basın toplantısında ekonomi alanında atılacak yeni adımları açıkladı. Enflasyonla mücadelede kararlılıkla devam edeceklerini belirten Erdoğan, 'Önümüzdeki aylarda enflasyonun tek haneli rakamlara ineceğine inanıyorum' dedi...",
      category: "gundem",
      images: [{ url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=800&q=80" }],
      author: "Politika Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: true,
      urgent: true,
      featured: true,
      views: 15420,
      tags: ["erdoğan", "ekonomi", "enflasyon", "reform"]
    },
    {
      id: "main-2",
      title: "İstanbul'da 7.2 Büyüklüğünde Deprem Simülasyonu: 'Hazırlıklarımız Tamamlandı'",
      summary: "İstanbul Büyükşehir Belediyesi ve AFAD işbirliğiyle gerçekleştirilen deprem simülasyonunda şehrin afet hazırlık seviyesi test edildi.",
      content: "İstanbul genelinde gerçekleştirilen kapsamlı deprem simülasyonu, şehrin afet karşısında ne kadar hazırlıklı olduğunu ortaya koydu...",
      category: "gundem",
      images: [{ url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80" }],
      author: "Haber Merkezi",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: true,
      urgent: false,
      featured: true,
      views: 12350,
      tags: ["deprem", "istanbul", "afad", "simülasyon"]
    },
    {
      id: "main-3",
      title: "SpaceX'in Türk Uydusu Başarıyla Fırlatıldı: 'Uzay Teknolojisinde Yeni Dönem'",
      summary: "Türkiye'nin yeni nesil haberleşme uydusu SpaceX Falcon Heavy roketi ile başarıyla uzaya gönderildi. Proje ile ülkenin uzay teknolojisinde önemli adım attığı belirtildi.",
      content: "TÜRKSAT 6A uydusu, SpaceX'in Falcon Heavy roketi ile Kennedy Uzay Merkezi'nden başarıyla fırlatıldı...",
      category: "teknoloji",
      images: [{ url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=800&q=80" }],
      author: "Teknoloji Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 8760,
      tags: ["spacex", "uydu", "türksat", "uzay"]
    },
    {
      id: "main-4",
      title: "Euro 2024 Finali: İspanya-İngiltere Maçı Bu Akşam Oynanacak",
      summary: "Avrupa Futbol Şampiyonası finalinde İspanya ile İngiltere karşı karşıya gelecek. Berlin Olimpiyat Stadı'nda oynanacak müsabaka saat 22:00'da başlayacak.",
      content: "EURO 2024'ün en heyecanlı maçı bu akşam Berlin'de oynanacak...",
      category: "spor",
      images: [{ url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" }],
      author: "Spor Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: true,
      featured: true,
      views: 23140,
      tags: ["euro2024", "final", "ispanya", "ingiltere"]
    },
    {
      id: "main-5",
      title: "Sağlık Bakanlığı'ndan Kritik Aşı Açıklaması: 'Grip Sezonu Öncesi Hazırlık Şart'",
      summary: "Sağlık Bakanı Dr. Fahrettin Koca, yaklaşan grip sezonuna karşı vatandaşları aşı olmaya davet etti. Ücretsiz aşı uygulaması başladı.",
      content: "Sağlık Bakanlığı, 2024-2025 grip sezonu öncesi aşılama kampanyasını başlattı...",
      category: "saglik",
      images: [{ url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80" }],
      author: "Sağlık Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 9850,
      tags: ["aşı", "grip", "sağlık", "bakanlık"]
    }
  ],

  // 2. MANŞET HABER GRİDİ (HeadlineNewsGrid)
  headlineNewsGrid: [
    {
      id: "grid-1",
      title: "Milli Eğitim Bakanlığı'ndan Yeni Müfredat Açıklaması",
      summary: "2024-2025 eğitim öğretim yılında uygulanacak yeni müfredat programının detayları açıklandı.",
      content: "Milli Eğitim Bakanlığı tarafından hazırlanan yeni müfredat programı...",
      category: "egitim",
      images: [{ url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" }],
      author: "Eğitim Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 7420,
      tags: ["müfredat", "eğitim", "bakanlık", "okul"]
    },
    {
      id: "grid-2",
      title: "Türk Lirası Güçleniyor: Dolar 32.50 TL'ye Kadar Geriledi",
      summary: "Merkez Bankası'nın aldığı tedbirler sonucu Türk Lirası değer kazanmaya devam ediyor.",
      content: "Türk Lirası, Merkez Bankası'nın para politikası kararları sonrasında güçlenme trendini sürdürüyor...",
      category: "ekonomi",
      images: [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" }],
      author: "Ekonomi Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 11200,
      tags: ["dolar", "tl", "merkez bankası", "kur"]
    },
    {
      id: "grid-3",
      title: "Sinema Sektöründe Yeni Dönem: 'Türk Filmleri Dünya Sahnesinde'",
      summary: "Türk sineması uluslararası festivallerde büyük başarı elde ederken, yerli yapımlar gişe rekoru kırıyor.",
      content: "Son dönemde Türk sineması hem ulusal hem de uluslararası arenada dikkat çekici başarılara imza atıyor...",
      category: "kultur",
      images: [{ url: "https://images.unsplash.com/photo-1489599067951-4ac0de6c90b7?auto=format&fit=crop&w=800&q=80" }],
      author: "Kültür Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 5630,
      tags: ["sinema", "film", "festival", "kültür"]
    },
    {
      id: "grid-4",
      title: "Yapay Zeka Sağlık Sektöründe: 'Erken Teşhiste Devrim'",
      summary: "Türk mühendislerin geliştirdiği yapay zeka sistemi kanser teşhisinde %95 doğruluk oranına ulaştı.",
      content: "Türkiye'de geliştirilen yapay zeka tabanlı teşhis sistemi...",
      category: "teknoloji",
      images: [{ url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80" }],
      author: "Teknoloji Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 9320,
      tags: ["yapay zeka", "sağlık", "teşhis", "kanser"]
    }
  ],

  // 3. POPÜLER HABERLER (PopularNewsSidebar)
  popularNews: [
    {
      id: "pop-1",
      title: "İstanbul Trafiğine Teknolojik Çözüm: Akıllı Trafik Işıkları",
      summary: "İstanbul Büyükşehir Belediyesi'nin akıllı trafik ışığı projesi trafik yoğunluğunu %30 azalttı.",
      content: "İstanbul'da pilot bölgelerde uygulanan akıllı trafik ışığı sistemi...",
      category: "teknoloji",
      images: [{ url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" }],
      author: "Şehir Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 18750,
      tags: ["trafik", "istanbul", "teknoloji", "belediye"]
    },
    {
      id: "pop-2",
      title: "Gastronomi Turizmi Büyüyor: 'Türk Mutfağı Dünya Markası Oluyor'",
      summary: "Türkiye'nin gastronomi turizmi geliri geçen yıla göre %45 artış gösterdi.",
      content: "Türk mutfağının dünya çapında tanınması ve gastronomi turizminin gelişmesi...",
      category: "turizm",
      images: [{ url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" }],
      author: "Turizm Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 9320,
      tags: ["gastronomi", "turizm", "mutfak", "marka"]
    },
    {
      id: "pop-3",
      title: "Yerel Seçim Anketi: 'Büyükşehirlerde Değişim Rüzgarı'",
      summary: "Son yapılan anketlerde büyükşehir belediye başkanlıkları için çarpıcı sonuçlar ortaya çıktı.",
      content: "Yerel seçimlere az bir süre kala yapılan anket sonuçları...",
      category: "gundem",
      images: [{ url: "https://images.unsplash.com/photo-1559157432-04962e1e1d4e?auto=format&fit=crop&w=800&q=80" }],
      author: "Politika Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 14230,
      tags: ["seçim", "anket", "belediye", "politika"]
    }
  ],

  // 4. EDİTÖR SEÇİMLERİ (EditorPicks)
  editorPicks: [
    {
      id: "editor-1",
      title: "Yapay Zeka ve Gazetecilik: 'Medyanın Geleceği Nasıl Şekillenecek?'",
      summary: "Yapay zeka teknolojilerinin gazetecilik sektörüne etkilerini ve gelecekteki rolünü inceliyoruz.",
      content: "Yapay zeka teknolojilerinin hızla gelişmesi, gazetecilik mesleğinde önemli değişikliklere yol açıyor...",
      category: "teknoloji",
      images: [{ url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" }],
      author: "Teknoloji Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 6780,
      tags: ["yapay zeka", "gazetecilik", "medya", "gelecek"]
    },
    {
      id: "editor-2",
      title: "Çevre Dostu Şehircilik: Ankara'nın Yeşil Dönüşüm Projesi",
      summary: "Ankara Büyükşehir Belediyesi'nin çevre dostu şehircilik yaklaşımı dikkat çekiyor.",
      content: "Ankara'da hayata geçirilen yeşil şehir projesi kapsamında...",
      category: "cevre",
      images: [{ url: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=800&q=80" }],
      author: "Çevre Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: true,
      views: 4920,
      tags: ["çevre", "şehircilik", "ankara", "yeşil"]
    }
  ],

  // 5. VİDEO ÖNE ÇIKANLAR (VideoHighlights)
  videoHighlights: [
    {
      id: "video-1",
      title: "Cumhurbaşkanı Erdoğan'ın G7 Zirvesi Açıklamaları",
      summary: "Cumhurbaşkanı Erdoğan, G7 Zirvesi'ndeki açıklamalarında Türkiye'nin uluslararası konumuna değindi.",
      content: "G7 Zirvesi'nde önemli açıklamalarda bulunan Cumhurbaşkanı Erdoğan...",
      category: "gundem",
      images: [{ url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=800&q=80" }],
      author: "Dış Politika Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      videoUrl: "https://example.com/video1.mp4",
      videoDuration: 180,
      views: 25630,
      tags: ["erdoğan", "g7", "zirve", "politika"]
    },
    {
      id: "video-2",
      title: "Galatasaray'ın Şampiyonlar Ligi Maçı Özeti",
      summary: "Galatasaray'ın Şampiyonlar Ligi'ndeki performansını video özetimizle izleyin.",
      content: "Galatasaray'ın Şampiyonlar Ligi maçındaki önemli anlar...",
      category: "spor",
      images: [{ url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" }],
      author: "Spor Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      videoUrl: "https://example.com/video2.mp4",
      videoDuration: 240,
      views: 19450,
      tags: ["galatasaray", "şampiyonlar ligi", "futbol", "özet"]
    }
  ],

  // 6. AI ÖNERİLERİ (AiRecommendation)
  aiRecommendation: [
    {
      id: "ai-1",
      title: "Blockchain Teknolojisi Kamu Sektöründe: Dijital Kimlik Projesi",
      summary: "Türkiye'nin dijital kimlik projesi blockchain teknolojisi kullanılarak hayata geçiriliyor.",
      content: "Kamu sektöründe blockchain teknolojisinin kullanılması...",
      category: "teknoloji",
      images: [{ url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80" }],
      author: "Teknoloji Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 7230,
      tags: ["blockchain", "dijital kimlik", "kamu", "teknoloji"]
    },
    {
      id: "ai-2",
      title: "Uzaktan Çalışma Trendleri: 'Hibrit Model Kalıcı Oluyor'",
      summary: "Pandemi sonrası dönemde uzaktan çalışma modeli şirketlerin tercih ettiği hibrit sisteme dönüştü.",
      content: "COVID-19 pandemisi sonrasında iş dünyasında yaşanan değişimler...",
      category: "ekonomi",
      images: [{ url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80" }],
      author: "İş Dünyası Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 8150,
      tags: ["uzaktan çalışma", "hibrit", "pandemi", "iş"]
    }
  ],

  // 7. HAFTA SONU OKUMALARI (WeekendReads)
  weekendReads: [
    {
      id: "weekend-1",
      title: "Türk Edebiyatında Yeni Sesler: Genç Yazarların Başarı Hikayesi",
      summary: "Son dönemde dikkat çeken genç Türk yazarların eserleri uluslararası arenada da ilgi görüyor.",
      content: "Türk edebiyatında yeni nesil yazarların ortaya çıkardığı eserler...",
      category: "kultur",
      images: [{ url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" }],
      author: "Edebiyat Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 3450,
      tags: ["edebiyat", "yazar", "kitap", "kültür"]
    },
    {
      id: "weekend-2",
      title: "Doğa Fotoğrafçılığında Türkiye'nin Gizli Cennerleri",
      summary: "Türkiye'nin az bilinen doğal güzelliklerini keşfeden fotoğrafçıların objektifinden...",
      content: "Ülkemizin dört bir yanındaki gizli doğal güzellikler...",
      category: "kultur",
      images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" }],
      author: "Doğa Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      views: 5670,
      tags: ["doğa", "fotoğraf", "türkiye", "gezi"]
    }
  ],

  // 8. HABER PROGRAMLARI (NewsPrograms)
  newsPrograms: [
    {
      id: "program-1",
      title: "Ana Haber Bülteni - Akşam Yayını",
      summary: "Günün en önemli gelişmelerini kapsamlı bir şekilde sunan ana haber bülteni.",
      content: "Her akşam saat 20:00'da yayınlanan ana haber bülteni...",
      category: "program",
      images: [{ url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80" }],
      author: "Program Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      programType: "news",
      airTime: "20:00",
      duration: 60,
      views: 45000,
      tags: ["ana haber", "bülten", "akşam", "program"]
    },
    {
      id: "program-2",
      title: "Ekonomi Gündemi - Haftalık Analiz",
      summary: "Türkiye ve dünya ekonomisindeki gelişmelerin derinlemesine analiz edildiği program.",
      content: "Her hafta pazar günü yayınlanan ekonomi analiz programı...",
      category: "program",
      images: [{ url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80" }],
      author: "Program Editörü",
      source: "NetNext",
      createdAt: new Date(),
      publishedAt: new Date(),
      status: "published",
      breaking: false,
      urgent: false,
      featured: false,
      programType: "analysis",
      airTime: "10:00",
      duration: 45,
      views: 12500,
      tags: ["ekonomi", "analiz", "haftalık", "program"]
    }
  ]
};

// Yardımcı fonksiyonlar
export const getNewsByModule = (moduleName) => {
  return mockNewsData[moduleName] || [];
};

export const getRandomNews = (count = 5) => {
  const allNews = Object.values(mockNewsData).flat();
  return allNews.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const getNewsByCategory = (category, count = 5) => {
  const allNews = Object.values(mockNewsData).flat();
  return allNews.filter(news => news.category === category).slice(0, count);
};

export const getFeaturedNews = (count = 5) => {
  const allNews = Object.values(mockNewsData).flat();
  return allNews.filter(news => news.featured).slice(0, count);
};

export const getBreakingNews = () => {
  const allNews = Object.values(mockNewsData).flat();
  return allNews.filter(news => news.breaking);
};

export const getUrgentNews = () => {
  const allNews = Object.values(mockNewsData).flat();
  return allNews.filter(news => news.urgent);
};
