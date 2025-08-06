import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';
import { aaNewsFirestoreService } from '@/services/aaNewsFirestoreService';

export async function POST(request: Request) {
  try {
    const { 
      content_types = [1], // Sadece TEXT haberler
      limit = 5,
      use_enhanced_parsing = true
    } = await request.json();

    console.log('🔥 ENHANCED AA FETCH başlatılıyor...');
    console.log('📋 Parametreler:', { content_types, limit, use_enhanced_parsing });

    // AA API'den text haberlerini çek
    const searchResult = await ultraPremiumAAService.search({
      filter_type: content_types,
      filter_language: [1], // tr_TR
      limit,
      offset: 0
    });

    if (!searchResult?.data?.result) {
      return NextResponse.json({
        success: false,
        error: 'AA API\'den veri alınamadı'
      }, { status: 500 });
    }

    console.log(`📊 Bulunan haberler: ${searchResult.data.result.length}`);

    const processedNews = [];
    let successCount = 0;
    let contentFoundCount = 0;

    for (const rawNews of searchResult.data.result) {
      try {
        console.log(`\n🔄 İşleniyor: ${rawNews.id} - ${rawNews.title}`);
        
        // Enhanced content extraction
        let finalContent = '';
        let finalSummary = '';
        let photoUrls: string[] = [];

        if (use_enhanced_parsing) {
          // NewsML document al
          const newsmlContent = await ultraPremiumAAService.getDocument(rawNews.id, 'newsml29');
          
          if (newsmlContent && typeof newsmlContent === 'string') {
            console.log(`📄 NewsML alındı: ${newsmlContent.length} karakter`);
            
            // ENHANCED PARSING STRATEGY
            const extractedData = extractContentFromNewsML(newsmlContent);
            finalContent = extractedData.content;
            finalSummary = extractedData.summary;
            photoUrls = extractedData.photos;
            
            if (finalContent) {
              contentFoundCount++;
              console.log(`✅ Content çıkarıldı: ${finalContent.length} karakter`);
            } else {
              console.log(`⚠️ Content çıkarılamadı`);
            }
          }
        }

        // AA News Item oluştur
        const aaNewsItem = {
          id: rawNews.id,
          title: rawNews.title || 'Başlık Yok',
          summary: finalSummary || `${rawNews.title} ile ilgili detaylar...`,
          content: finalContent || `${rawNews.title}\n\nDetaylı haber içeriği yükleniyor...`,
          type: rawNews.type || 1,
          date: rawNews.date || new Date().toISOString(),
          group_id: rawNews.group_id,
          category_id: rawNews.category_id || 1,
          priority_id: rawNews.priority_id || 3,
          language_id: 1,
          provider_id: 1,
          images: photoUrls,
          videos: rawNews.videos || [],
          tags: rawNews.tags || [],
          keywords: rawNews.keywords || []
        };

        // Firestore'a kaydet
        const savedId = await aaNewsFirestoreService.addNews(aaNewsItem, true);
        
        processedNews.push({
          aa_id: rawNews.id,
          firestore_id: savedId,
          title: rawNews.title,
          content_length: finalContent.length,
          summary_length: finalSummary.length,
          photos_count: photoUrls.length,
          has_real_content: finalContent.length > 100
        });

        successCount++;
        console.log(`✅ Kaydedildi: ${savedId}`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error: any) {
        console.error(`❌ Haber işleme hatası ${rawNews.id}:`, error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Enhanced AA fetch tamamlandı',
      results: {
        total_found: searchResult.data.result.length,
        processed_successfully: successCount,
        content_extracted: contentFoundCount,
        processed_news: processedNews
      }
    });

  } catch (error: any) {
    console.error('❌ Enhanced AA fetch hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ENHANCED CONTENT EXTRACTION FUNCTION
function extractContentFromNewsML(newsmlXML: string): {
  content: string;
  summary: string;
  photos: string[];
} {
  let content = '';
  let summary = '';
  const photos: string[] = [];

  try {
    // 1. Photo URLs çıkar (remoteContent)
    const photoMatches = newsmlXML.match(/<remoteContent[^>]*href="([^"]*\.(jpg|jpeg|png))"[^>]*>/gi);
    if (photoMatches) {
      photoMatches.forEach(match => {
        const urlMatch = match.match(/href="([^"]*)"/i);
        if (urlMatch && urlMatch[1]) {
          photos.push(urlMatch[1]);
        }
      });
    }

    // 2. Content extraction - Multiple strategies
    
    // Strategy 1: contentSet > inlineXML > body > p
    let contentSetMatch = newsmlXML.match(/<contentSet[^>]*>([\s\S]*?)<\/contentSet>/i);
    if (contentSetMatch) {
      const contentSetContent = contentSetMatch[1];
      
      const inlineXMLMatch = contentSetContent.match(/<inlineXML[^>]*>([\s\S]*?)<\/inlineXML>/i);
      if (inlineXMLMatch) {
        const inlineXMLContent = inlineXMLMatch[1];
        
        const bodyMatch = inlineXMLContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          const bodyContent = bodyMatch[1];
          
          // P tag'lerini çıkar
          const pMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
          if (pMatches) {
            const paragraphs = pMatches
              .map(p => p.replace(/<[^>]*>/g, '').trim())
              .filter(p => p.length > 10);
            
            content = paragraphs.join('\n\n');
          }
        }
      }
    }

    // Strategy 2: Direkt inlineData arama
    if (!content || content.length < 50) {
      const inlineDataMatch = newsmlXML.match(/<inlineData[^>]*>([\s\S]*?)<\/inlineData>/i);
      if (inlineDataMatch) {
        content = inlineDataMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    // Strategy 3: Text node'ları çıkar (fallback)
    if (!content || content.length < 50) {
      const textMatches = newsmlXML.match(/>[^<]{20,}</g);
      if (textMatches) {
        const texts = textMatches
          .map(t => t.substring(1).trim())
          .filter(t => t.length > 20 && !t.includes('<?') && !t.includes('xmlns'))
          .slice(0, 5);
        
        content = texts.join(' ');
      }
    }

    // Content temizleme
    if (content) {
      content = content
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Summary oluştur
      summary = content.length > 200 
        ? content.substring(0, 200) + '...'
        : content;
    }

  } catch (error) {
    console.error('NewsML parsing hatası:', error);
  }

  return { content, summary, photos };
}
