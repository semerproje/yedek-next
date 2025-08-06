import { NextRequest, NextResponse } from 'next/server';

// Ultra Premium AA Crawler API - Simple AA Test sonuçlarına göre düzeltildi
export async function POST(request: NextRequest) {
  try {
    const { 
      categories = [1,2,3,4,5,6,7,8], 
      priorities = [1,2,3,4,5,6], 
      types = [1,2,3],
      languages = ['tr_TR'],
      startDate,
      endDate = 'NOW',
      keywords = '',
      limit = 100,
      saveToFirestore = true,
      saveMode = 'bulk-save-overwrite'
    } = await request.json();

    console.log('🚀 Ultra Premium AA Crawler başlatıldı:', {
      categories,
      priorities,
      types,
      languages,
      limit,
      saveToFirestore,
      startDate,
      endDate,
      keywords
    });

    const allNews: any[] = [];
    const categoryResults: Record<string, any> = {};
    const errors: string[] = [];
    const duplicateIds = new Set<string>(); // Kopya önleme için ID takibi

    // AA API bilgileri
    const AA_USERNAME = process.env.AA_API_USERNAME || '3010263';
    const AA_PASSWORD = process.env.AA_API_PASSWORD || '4WUbxVw9';
    const AA_BASE_URL = 'https://api.aa.com.tr/abone';

    // Basic auth header
    const authHeader = 'Basic ' + Buffer.from(`${AA_USERNAME}:${AA_PASSWORD}`).toString('base64');

    // Her kategori için çalışan /search endpoint'ini kullan
    for (const categoryId of categories) {
      try {
        console.log(`📰 Kategori ${categoryId} getiriliyor...`);

        // Simple AA Test sonuçlarına göre search parametreleri
        const searchParams: any = {
          limit: Math.min(limit, 100)
        };

        // Kategori filtresi ekle
        if (categoryId) {
          searchParams.category = categoryId;
        }

        // Tarih filtreleri - AA API formatında
        if (startDate) {
          const startDateFormatted = new Date(startDate).toISOString();
          searchParams.start_date = startDateFormatted;
          console.log(`📅 Başlangıç tarihi: ${startDate} -> ${startDateFormatted}`);
        } else {
          // Son 24 saat için varsayılan
          const yesterday = new Date();
          yesterday.setHours(yesterday.getHours() - 24);
          searchParams.start_date = yesterday.toISOString();
          console.log(`📅 Varsayılan başlangıç tarihi: ${searchParams.start_date}`);
        }

        if (endDate && endDate !== 'NOW') {
          const endDateFormatted = new Date(endDate).toISOString();
          searchParams.end_date = endDateFormatted;
          console.log(`📅 Bitiş tarihi: ${endDate} -> ${endDateFormatted}`);
        }

        // Anahtar kelime arama
        if (keywords && keywords.trim()) {
          searchParams.query = keywords.trim();
          console.log(`🔍 Anahtar kelime: ${keywords.trim()}`);
        }

        // Dil filtresi
        searchParams.language = 'tr';

        console.log(`📋 Kategori ${categoryId} için parametreler:`, searchParams);

        // Simple AA Test'te çalışan endpoint'i kullan
        const endpoint = `${AA_BASE_URL}/search`;
        console.log(`🌐 Çalışan endpoint kullanılıyor: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'NetNext-Ultra-Crawler/1.0'
          },
          body: JSON.stringify(searchParams)
        });

        console.log(`📡 Yanıt durumu: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`AA API hatası: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log(`📊 Kategori ${categoryId} yanıtı:`, {
          success: !!data.response?.success,
          responseCode: data.response?.code,
          hasData: !!data.data,
          hasResult: !!data.data?.result,
          resultCount: data.data?.result?.length || 0,
          dataKeys: Object.keys(data),
          resultKeys: data.data ? Object.keys(data.data) : [],
          sampleData: data.data?.result?.slice(0, 1) || null
        });

        // AA API yanıt formatı: {response: {success: true, code: 200}, data: {result: [...]}}
        let newsItems = null;
        if (data.response?.success && data.data?.result && Array.isArray(data.data.result)) {
          newsItems = data.data.result;
        }

        if (newsItems && newsItems.length > 0) {
          // Öncelik ve tip filtreleme (istemci tarafında)
          const filteredNews = newsItems.filter((item: any) => {
            const itemPriority = parseInt(item.priority) || 4;
            const itemType = item.type === 'text' ? 1 : item.type === 'picture' ? 2 : item.type === 'video' ? 3 : 1;
            
            return priorities.includes(itemPriority) && types.includes(itemType);
          });

          // Kopya önleme ve en son güncelleme kontrolü
          const uniqueNews: any[] = [];
          const newsMap = new Map<string, any>();

          filteredNews.forEach((item: any) => {
            const newsId = item.id;
            
            if (newsId) {
              // Aynı ID'li haber varsa, tarih kontrolü yap
              if (newsMap.has(newsId)) {
                const existingItem = newsMap.get(newsId);
                const existingDate = new Date(existingItem.date || 0);
                const currentDate = new Date(item.date || 0);
                
                // En son tarihli olanı sakla
                if (currentDate > existingDate) {
                  newsMap.set(newsId, item);
                  console.log(`🔄 Kategori ${categoryId}: Haber ${newsId} güncellendi (${currentDate.toISOString()})`);
                }
              } else {
                // Global kopya kontrolü
                if (!duplicateIds.has(newsId)) {
                  newsMap.set(newsId, item);
                  duplicateIds.add(newsId);
                } else {
                  console.log(`⚠️ Kategori ${categoryId}: Kopya haber atlandı - ${newsId}`);
                }
              }
            }
          });

          // Map'ten array'e dönüştür
          const finalNews = Array.from(newsMap.values());

          // Haber verilerini dönüştür
          const transformedNews = finalNews.map((item: any) => {
            // Kategori adını al
            const categoryNames: Record<string, string> = {
              '1': 'gundem',
              '2': 'ekonomi', 
              '3': 'spor',
              '4': 'teknoloji',
              '5': 'saglik',
              '6': 'kultur',
              '7': 'dunya',
              '8': 'politika'
            };
            const categoryName = categoryNames[categoryId.toString()] || 'aa';
            // AA'dan gelen haberin benzersiz kimliğini 'aaId' olarak sakla
            const uniqueAaId = item.id ? `${categoryName}:${item.type || 'text'}:${item.date ? new Date(item.date).toISOString().split('T')[0].replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '')}:${item.id}` : `${categoryName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return {
              aaId: uniqueAaId,
              title: item.title || item.headline || item.header || 'Başlık bulunamadı',
              brief: item.brief || item.summary || item.excerpt || item.lead || '',
              content: item.content || item.text || item.brief || item.summary || '',
              category: categoryName,
              priority: parseInt(item.priority) || 4,
              type: item.type === 'text' ? 1 : item.type === 'picture' ? 2 : item.type === 'video' ? 3 : 1,
              language: item.language || 'tr_TR',
              publishDate: item.date || new Date().toISOString(),
              url: item.url || item.link || '',
              images: item.images || [],
              location: item.location || '',
              tags: item.tags || [],
              source: 'AA',
              endpoint: '/search',
              originalData: item // Debug için orijinal veri
            };
          });

          categoryResults[categoryId] = {
            total: newsItems.length,
            fetched: filteredNews.length,
            filtered: transformedNews.length,
            duplicatesSkipped: filteredNews.length - finalNews.length,
            endpoint: '/search'
          };

          allNews.push(...transformedNews);
          
          console.log(`✅ Kategori ${categoryId}: ${transformedNews.length} haber işlendi, ${filteredNews.length - finalNews.length} kopya atlandı (/search endpoint'inden)`);
        } else {
          console.log(`⚠️ Kategori ${categoryId}: Sonuç yok veya geçersiz yanıt formatı`);
          console.log(`🔍 Yanıt yapısı:`, JSON.stringify(data).substring(0, 500) + '...');
          categoryResults[categoryId] = { 
            total: 0, 
            fetched: 0, 
            filtered: 0, 
            endpoint: '/search',
            responseSuccess: data.response?.success,
            responseCode: data.response?.code,
            hasData: !!data.data,
            sampleStructure: JSON.stringify(data).substring(0, 200)
          };
        }

        // Rate limiting: istekler arası 500ms bekle
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (categoryError: any) {
        console.error(`❌ Kategori ${categoryId} hatası:`, categoryError);
        errors.push(`Kategori ${categoryId}: ${categoryError.message}`);
        categoryResults[categoryId] = { error: categoryError.message };
      }
    }

    console.log(`📈 Toplam toplanan haber: ${allNews.length}`);
    console.log(`🔒 Toplam kopya atlandı: ${Array.from(duplicateIds).length - allNews.length}`);

    // Firestore'a kaydet - kopya kontrolü ile
    let saveResults = null;
    if (saveToFirestore && allNews.length > 0) {
      try {
        console.log('💾 Firestore\'a kaydediliyor (mevcut haberlerin üzerine yazılarak)...');
        
        const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/ultra-news-manager`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: saveMode || 'bulk-save-overwrite', // Dinamik save mode
            newsData: allNews,
            overwriteExisting: true // Mevcut haberlerin üzerine yaz
          })
        });

        if (saveResponse.ok) {
          saveResults = await saveResponse.json();
          console.log('✅ Firestore kayıt tamamlandı:', saveResults);
        } else {
          const errorData = await saveResponse.text();
          console.error('❌ Firestore kayıt başarısız:', errorData);
          errors.push(`Firestore kayıt hatası: ${errorData}`);
        }
      } catch (saveError: any) {
        console.error('❌ Firestore kayıt hatası:', saveError);
        errors.push(`Firestore kayıt hatası: ${saveError.message}`);
      }
    }

    // İstatistikleri hesapla
    const totalDuplicatesSkipped = Object.values(categoryResults).reduce((sum: number, result: any) => {
      return sum + (result.duplicatesSkipped || 0);
    }, 0);

    const stats = {
      totalCategories: categories.length,
      totalNews: allNews.length,
      totalDuplicatesSkipped,
      uniqueNewsRatio: allNews.length > 0 ? (allNews.length / (allNews.length + totalDuplicatesSkipped) * 100).toFixed(2) + '%' : '0%',
      categoryResults,
      priorities: priorities,
      types: types,
      languages: languages,
      errors: errors.length,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Ultra Premium AA Crawler tamamlandı - ${allNews.length} benzersiz haber bulundu (${totalDuplicatesSkipped} kopya atlandı)`,
      stats,
      news: allNews.slice(0, 50), // İlk 50'yi önizleme için döndür
      saveResults,
      errors: errors.slice(0, 10), // İlk 10 hatayı döndür
      duplicateInfo: {
        totalProcessed: allNews.length + totalDuplicatesSkipped,
        uniqueNews: allNews.length,
        duplicatesSkipped: totalDuplicatesSkipped,
        uniqueRatio: stats.uniqueNewsRatio
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Ultra Premium AA Crawler hatası:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Ultra Premium AA Crawler başarısız',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        message: 'Ultra Premium AA Crawler hazır - Çalışan /search endpoint ile düzeltildi',
        version: '2.0.0',
        features: [
          'Çalışan /search endpoint ile çoklu kategori tarama',
          'Gelişmiş kopya önleme sistemi (ID ve tarih bazlı)',
          'Mevcut haberlerin üzerine yazma (overwrite) sistemi',
          'En son güncelleme kontrolü ve otomatik güncelleme',
          'Öncelik filtreleme (istemci tarafında)',
          'Tip filtreleme (metin, resim, video)',
          'Anahtar kelime arama',
          'Tarih aralığı filtreleme',
          'Firestore entegrasyonu (overwrite mode)',
          'Duplicate tracking ve istatistikler',
          'Rate limiting',
          'Hata yönetimi',
          'Gerçek zamanlı istatistikler'
        ],
        lastFix: 'Simple AA Test sonuçlarına göre - /search endpoint ve doğru yanıt formatı kullanılıyor',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test') {
      // Çalışan endpoint'i kullanarak AA API bağlantısını test et
      const AA_USERNAME = process.env.AA_API_USERNAME || '3010263';
      const AA_PASSWORD = process.env.AA_API_PASSWORD || '4WUbxVw9';
      const authHeader = 'Basic ' + Buffer.from(`${AA_USERNAME}:${AA_PASSWORD}`).toString('base64');

      const testResponse = await fetch('https://api.aa.com.tr/abone/search', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'User-Agent': 'NetNext-Ultra-Crawler/1.0'
        },
        body: JSON.stringify({ limit: 5 })
      });

      const testData = await testResponse.json();

      return NextResponse.json({
        success: testResponse.ok && testData.response?.success,
        message: testResponse.ok && testData.response?.success ? 'AA API /search endpoint çalışıyor' : 'AA API bağlantı hatası',
        apiStatus: testResponse.status,
        responseCode: testData.response?.code,
        hasNews: !!(testData.data?.result?.length),
        newsCount: testData.data?.result?.length || 0,
        testData: testResponse.ok ? testData : null,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Geçersiz işlem'
    });

  } catch (error: any) {
    console.error('Ultra Premium AA Crawler GET hatası:', error);
    
    return NextResponse.json({
      success: false,
      message: 'GET isteği başarısız',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
