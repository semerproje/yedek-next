import { NextRequest, NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';
import { aaNewsFirestoreService } from '@/services/aaNewsFirestoreService';
import { AASearchParams } from '@/types/aa-news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categories = [],
      content_types = [1], // Default to text news
      keywords = '',
      search_string = '',
      start_date = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date = 'NOW',
      limit = 50,
      priority = [1, 2, 3, 4],
      language = 1,
      newsml_format = true,
      ai_enhance = true
    } = body;

    console.log('🔍 AA gerçek veri çekme başlatılıyor...', {
      categories,
      content_types,
      limit,
      newsml_format
    });

    // AA API'den gerçek veri çek
    const searchParams: AASearchParams = {
      filter_category: categories,
      filter_type: content_types,
      filter_priority: priority,
      filter_language: [language],
      search_string: search_string || keywords,
      start_date,
      end_date: end_date === 'NOW' ? undefined : end_date,
      offset: 0,
      limit
    };

    const searchResult = await ultraPremiumAAService.search(searchParams);
    
    if (!searchResult || !searchResult.data?.result) {
      return NextResponse.json({
        success: false,
        error: 'AA API\'den veri alınamadı',
        details: searchResult
      }, { status: 500 });
    }

    console.log(`📰 ${searchResult.data.result.length} adet haber bulundu`);

    const processedNews = [];
    const errors = [];
    let newsmlCount = 0;

    for (const rawNewsItem of searchResult.data.result) {
      try {
        console.log(`🔄 İşleniyor: ${rawNewsItem.title || rawNewsItem.id}`);

        // AA raw data'yı AANewsItem formatına dönüştür
        const aaNewsItem = {
          id: rawNewsItem.id,
          title: rawNewsItem.title || 'Başlık Yok',
          summary: rawNewsItem.summary || '',
          content: rawNewsItem.content || '',
          type: rawNewsItem.type || 1,
          date: rawNewsItem.date || new Date().toISOString(),
          group_id: rawNewsItem.group_id,
          category_id: rawNewsItem.category_id || 1,
          priority_id: rawNewsItem.priority_id || 3,
          language_id: rawNewsItem.language_id || 1,
          provider_id: 1, // AA
          images: rawNewsItem.images || [],
          videos: rawNewsItem.videos || [],
          tags: rawNewsItem.tags || [],
          keywords: rawNewsItem.keywords || []
        };

        // NewsML 2.9 formatında içerik al
        let newsmlContent = null;
        if (newsml_format) {
          try {
            newsmlContent = await ultraPremiumAAService.getDocument(rawNewsItem.id, 'newsml29');
            if (newsmlContent) {
              newsmlCount++;
              console.log(`📄 NewsML 2.9 içerik alındı: ${rawNewsItem.id}`);
              
              // NewsML 2.9 content'i parse et ve ana content'e ekle
              if (typeof newsmlContent === 'string') {
                let extractedContent = '';
                
                // NewsML 2.9 formatında content çıkarma
                // 1. inlineData tag'i ara
                const inlineDataMatch = newsmlContent.match(/<inlineData[^>]*>([\s\S]*?)<\/inlineData>/);
                if (inlineDataMatch) {
                  extractedContent = inlineDataMatch[1];
                } else {
                  // 2. contentSet/content ara
                  const contentMatch = newsmlContent.match(/<content[^>]*>([\s\S]*?)<\/content>/);
                  if (contentMatch) {
                    extractedContent = contentMatch[1];
                  } else {
                    // 3. body tag ara (fallback)
                    const bodyMatch = newsmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/);
                    if (bodyMatch) {
                      extractedContent = bodyMatch[1];
                    }
                  }
                }
                
                if (extractedContent) {
                  const cleanContent = extractedContent
                    .replace(/<[^>]*>/g, '') // HTML taglarını temizle
                    .replace(/\s+/g, ' ') // Çoklu boşlukları temizle
                    .replace(/&amp;/g, '&') // HTML entities
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .trim();
                  
                  if (cleanContent && cleanContent.length > 50) {
                    aaNewsItem.content = cleanContent;
                    
                    // Summary için ilk 200 karakteri al
                    if (!aaNewsItem.summary || aaNewsItem.summary.trim().length === 0) {
                      aaNewsItem.summary = cleanContent.substring(0, 200) + (cleanContent.length > 200 ? '...' : '');
                    }
                    
                    console.log(`✅ NewsML content çıkarıldı: ${cleanContent.length} karakter`);
                  } else {
                    console.log(`⚠️ NewsML content çok kısa: "${cleanContent}"`);
                  }
                } else {
                  console.log(`⚠️ NewsML'de content tag'i bulunamadı`);
                }
              }
            }
          } catch (newsmlError: any) {
            console.warn(`⚠️ NewsML 2.9 formatı alınamadı: ${rawNewsItem.id}`, newsmlError.message);
          }
        }

        // Firestore'a AA News olarak kaydet
        const savedId = await aaNewsFirestoreService.addNews(aaNewsItem, ai_enhance);
        processedNews.push({
          aa_id: rawNewsItem.id,
          firestore_id: savedId,
          title: aaNewsItem.title,
          newsml_retrieved: !!newsmlContent
        });

        // Rate limiting - AA API gereksinimi
        await new Promise(resolve => setTimeout(resolve, 600)); // 600ms bekle

      } catch (itemError: any) {
        console.error(`❌ Haber işleme hatası: ${rawNewsItem.id}`, itemError);
        errors.push(`Haber işleme hatası: ${rawNewsItem.id} - ${itemError.message}`);
      }
    }

    console.log(`✅ İşlem tamamlandı:`, {
      toplam_bulunan: searchResult.data.result.length,
      basarili_islenen: processedNews.length,
      newsml_alınan: newsmlCount,
      hata_sayisi: errors.length
    });

    return NextResponse.json({
      success: true,
      data: {
        total_found: searchResult.data.result.length,
        processed_count: processedNews.length,
        newsml_count: newsmlCount,
        error_count: errors.length,
        processed_news: processedNews,
        errors: errors.slice(0, 10) // İlk 10 hatayı göster
      }
    });

  } catch (error: any) {
    console.error('❌ AA gerçek veri çekme genel hatası:', error);
    return NextResponse.json({
      success: false,
      error: 'AA gerçek veri çekme işlemi başarısız',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // AA bağlantısını test et
    const testResult = await ultraPremiumAAService.testConnection();
    
    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      aa_api_status: testResult.success ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'AA API bağlantı testi başarısız',
      error: error.message
    }, { status: 500 });
  }
}
