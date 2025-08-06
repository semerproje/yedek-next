// AA API Gelişmiş Haber Çekme ve İşleme Sistemi

const AA_CONFIG = {
  baseUrl: 'https://api.aa.com.tr/abone',
  username: '3010229',
  password: '8vWhT6Vt',
  timeout: 30000
};

const authHeader = 'Basic ' + Buffer.from(`${AA_CONFIG.username}:${AA_CONFIG.password}`).toString('base64');

console.log('🚀 AA API Gelişmiş Haber Sistemi\n');

// Kategori mapping'i
const CATEGORY_MAP = {
  1: 'genel',
  2: 'spor', 
  3: 'ekonomi',
  4: 'dunya',
  5: 'teknoloji',
  6: 'politika',
  7: 'kultur-sanat'
};

// Tip mapping'i
const TYPE_MAP = {
  'text': 'metin',
  'picture': 'fotograf',
  'video': 'video',
  'graphic': 'grafik',
  'file': 'dosya'
};

// Çoklu kategori belirleme
function determineCategories(item) {
  const categories = [];
  
  // Ana kategori
  const mainCategory = CATEGORY_MAP[item.category] || 'genel';
  categories.push(mainCategory);
  
  // Medya tipine göre ek kategori
  if (item.type === 'video') {
    categories.push('video-haberler');
  } else if (item.type === 'picture') {
    categories.push('fotogaleri');
  }
  
  // Başlık analizi ile ek kategori
  const title = item.title?.toLowerCase() || '';
  if (title.includes('spor') || title.includes('futbol') || title.includes('basketbol')) {
    if (!categories.includes('spor')) categories.push('spor');
  }
  if (title.includes('ekonomi') || title.includes('borsa') || title.includes('dolar')) {
    if (!categories.includes('ekonomi')) categories.push('ekonomi');
  }
  
  return categories;
}

// Tek bir haberin detaylarını al
async function getNewsDetail(newsId) {
  try {
    console.log(`📄 Haber detayı alınıyor: ${newsId}`);
    
    const response = await fetch(`${AA_CONFIG.baseUrl}/document/${newsId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Detail-Client/1.0'
      },
      timeout: AA_CONFIG.timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log(`❌ Haber detayı alınamadı: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Haber detayı hatası: ${error.message}`);
    return null;
  }
}

// Grup medyalarını al (fotoğraf/video galerisi)
async function getGroupMedia(groupId) {
  if (!groupId) return [];
  
  try {
    console.log(`🖼️ Grup medyası alınıyor: ${groupId}`);
    
    const response = await fetch(`${AA_CONFIG.baseUrl}/multitoken/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Media-Client/1.0'
      },
      timeout: AA_CONFIG.timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data?.result || [];
    } else {
      console.log(`❌ Grup medyası alınamadı: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.log(`❌ Grup medyası hatası: ${error.message}`);
    return [];
  }
}

// Telifsiz görsel API'si (Unsplash örneği)
async function getFreeImage(keyword) {
  try {
    // Unsplash API key'iniz varsa kullanın, yoksa placeholder
    const query = encodeURIComponent(keyword.substring(0, 50));
    const placeholderUrl = `https://source.unsplash.com/800x600/?${query}`;
    
    return {
      url: placeholderUrl,
      alt: `${keyword} ile ilgili görsel`,
      source: 'unsplash',
      isFree: true
    };
  } catch (error) {
    console.log(`❌ Telifsiz görsel hatası: ${error.message}`);
    return null;
  }
}

// Haberi tam detaylarıyla işle
async function processNewsItem(item) {
  try {
    console.log(`\n🔄 İşleniyor: ${item.title}`);
    
    // Temel bilgiler
    const processedNews = {
      id: item.id,
      aaId: item.id,
      title: item.title,
      type: item.type,
      date: item.date,
      publishedAt: new Date(item.date),
      categories: determineCategories(item),
      source: 'anadolu_ajansi',
      status: 'published',
      
      // Medya bilgileri
      hasVideo: item.type === 'video' || !!item.group_id?.includes('video'),
      hasImages: item.type === 'picture' || !!item.group_id?.includes('picture'),
      groupId: item.group_id || null,
      
      // Boş alanlar
      content: '',
      summary: '',
      images: [],
      videos: [],
      freeImage: null,
      
      // Meta bilgiler
      processedAt: new Date(),
      updatedAt: new Date()
    };
    
    // 1. Haber detayını al
    const detail = await getNewsDetail(item.id);
    if (detail && detail.data) {
      processedNews.content = detail.data.content || '';
      processedNews.summary = detail.data.summary || processedNews.title;
      
      // Detaydan ek bilgiler
      if (detail.data.keywords) {
        processedNews.keywords = detail.data.keywords;
      }
      if (detail.data.location) {
        processedNews.location = detail.data.location;
      }
    }
    
    // 2. Grup medyalarını al
    if (processedNews.groupId) {
      const groupMedia = await getGroupMedia(processedNews.groupId);
      
      groupMedia.forEach(media => {
        if (media.type === 'picture') {
          processedNews.images.push({
            id: media.id,
            url: media.url || media.download_url,
            caption: media.title || media.caption || '',
            alt: media.title || processedNews.title,
            source: 'aa'
          });
        } else if (media.type === 'video') {
          processedNews.videos.push({
            id: media.id,
            url: media.url || media.download_url,
            title: media.title || media.caption || '',
            thumbnail: media.thumbnail_url,
            source: 'aa'
          });
        }
      });
    }
    
    // 3. Telifsiz görsel ekle (sadece text haberler için ve AA görseli yoksa)
    if (processedNews.type === 'text' && processedNews.images.length === 0) {
      const freeImage = await getFreeImage(processedNews.title);
      if (freeImage) {
        processedNews.freeImage = freeImage;
        processedNews.images.push({
          id: `free_${Date.now()}`,
          url: freeImage.url,
          caption: freeImage.alt,
          alt: freeImage.alt,
          source: 'free',
          isFree: true
        });
      }
    }
    
    // 4. Kategorileri güncelle
    if (processedNews.videos.length > 0) {
      processedNews.categories.push('video-haberler');
    }
    if (processedNews.images.length > 1) {
      processedNews.categories.push('fotogaleri');
    }
    
    // Benzersiz kategoriler
    processedNews.categories = [...new Set(processedNews.categories)];
    
    console.log(`✅ İşlendi: ${processedNews.categories.join(', ')} | ${processedNews.images.length} görsel | ${processedNews.videos.length} video`);
    
    return processedNews;
    
  } catch (error) {
    console.error(`❌ Haber işleme hatası [${item.id}]:`, error.message);
    return null;
  }
}

// Çoklu haber çekme (duplikasyon kontrolü ile)
async function fetchEnhancedNews(options = {}) {
  const {
    limit = 20,
    category = null,
    includeImages = true,
    includeVideos = true,
    startDate = "*",
    endDate = "NOW"
  } = options;
  
  try {
    console.log(`\n🔍 Gelişmiş haber çekme başlıyor...`);
    console.log(`📊 Limit: ${limit}, Kategori: ${category || 'Tümü'}`);
    
    // Search parametreleri
    const searchPayload = {
      start_date: startDate,
      end_date: endDate,
      filter_language: "1", // Türkçe
      limit: limit
    };
    
    // Kategori filtresi
    if (category) {
      const categoryId = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === category);
      if (categoryId) {
        searchPayload.filter_category = categoryId;
      }
    }
    
    // Tip filtreleri
    const types = [];
    if (includeImages) types.push("1", "2"); // text, picture
    if (includeVideos) types.push("3"); // video
    if (types.length > 0) {
      searchPayload.filter_type = types.join(",");
    }
    
    console.log('📤 Arama parametreleri:', JSON.stringify(searchPayload, null, 2));
    
    // API çağrısı
    const response = await fetch(`${AA_CONFIG.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AA-Enhanced-Client/1.0'
      },
      body: JSON.stringify(searchPayload),
      timeout: AA_CONFIG.timeout
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const rawNews = data.data?.result || [];
    
    console.log(`📥 ${rawNews.length} ham haber alındı`);
    
    // Duplikasyon kontrolü (ID ve başlık bazlı)
    const uniqueNews = [];
    const seenIds = new Set();
    const seenTitles = new Set();
    
    for (const item of rawNews) {
      const titleKey = item.title?.toLowerCase().trim();
      
      if (!seenIds.has(item.id) && !seenTitles.has(titleKey)) {
        seenIds.add(item.id);
        seenTitles.add(titleKey);
        uniqueNews.push(item);
      } else {
        console.log(`🔄 Duplikasyon atlandı: ${item.title}`);
      }
    }
    
    console.log(`✨ ${uniqueNews.length} benzersiz haber belirlendi`);
    
    // Her haberi detaylı işle
    const processedNews = [];
    for (const item of uniqueNews) {
      const processed = await processNewsItem(item);
      if (processed) {
        processedNews.push(processed);
      }
      
      // API limitini aşmamak için bekle
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n🎯 Toplam ${processedNews.length} haber başarıyla işlendi`);
    
    // Özet istatistikler
    const stats = {
      total: processedNews.length,
      byType: {},
      byCategory: {},
      withImages: processedNews.filter(n => n.images.length > 0).length,
      withVideos: processedNews.filter(n => n.videos.length > 0).length,
      withFreeImages: processedNews.filter(n => n.freeImage).length
    };
    
    processedNews.forEach(news => {
      stats.byType[news.type] = (stats.byType[news.type] || 0) + 1;
      news.categories.forEach(cat => {
        stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
      });
    });
    
    console.log('\n📊 İSTATİSTİKLER:');
    console.log('================');
    console.log(`📰 Toplam haber: ${stats.total}`);
    console.log(`🖼️ Görselli: ${stats.withImages}`);
    console.log(`🎥 Videolu: ${stats.withVideos}`);
    console.log(`🆓 Telifsiz görselli: ${stats.withFreeImages}`);
    console.log('\n📑 Tip dağılımı:', stats.byType);
    console.log('🏷️ Kategori dağılımı:', stats.byCategory);
    
    return {
      news: processedNews,
      stats: stats,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('💥 Gelişmiş haber çekme hatası:', error.message);
    throw error;
  }
}

// Test fonksiyonu
async function testEnhancedSystem() {
  try {
    console.log('🧪 Gelişmiş sistem testi başlıyor...\n');
    
    // Farklı senaryoları test et
    const testScenarios = [
      { name: 'Genel Haberler', options: { limit: 5 } },
      { name: 'Spor Haberleri', options: { limit: 3, category: 'spor' } },
      { name: 'Sadece Videolar', options: { limit: 3, includeImages: false, includeVideos: true } }
    ];
    
    for (const scenario of testScenarios) {
      console.log(`\n🎯 Test: ${scenario.name}`);
      console.log('='.repeat(50));
      
      const result = await fetchEnhancedNews(scenario.options);
      
      console.log(`✅ ${scenario.name} testi tamamlandı!`);
      console.log(`📊 ${result.news.length} haber işlendi`);
      
      // İlk haberin detayını göster
      if (result.news.length > 0) {
        const firstNews = result.news[0];
        console.log(`\n📄 Örnek Haber:`);
        console.log(`   Başlık: ${firstNews.title}`);
        console.log(`   Kategoriler: ${firstNews.categories.join(', ')}`);
        console.log(`   Görseller: ${firstNews.images.length}`);
        console.log(`   Videolar: ${firstNews.videos.length}`);
        console.log(`   Telifsiz görsel: ${firstNews.freeImage ? 'Evet' : 'Hayır'}`);
      }
      
      // Senaryolar arası bekleme
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n🎉 Tüm testler tamamlandı!');
    
  } catch (error) {
    console.error('💥 Test hatası:', error.message);
  }
}

// Sistemi başlat
if (require.main === module) {
  testEnhancedSystem();
}

module.exports = {
  fetchEnhancedNews,
  processNewsItem,
  getNewsDetail,
  getGroupMedia,
  getFreeImage,
  CATEGORY_MAP,
  TYPE_MAP
};
