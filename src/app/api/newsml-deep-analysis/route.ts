import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function POST(request: Request) {
  try {
    console.log('🔍 NewsML 2.9 XML structure tam analizi...');
    
    // Text haberlerini al (type 1)
    const searchResult = await ultraPremiumAAService.search({
      filter_type: [1], // Sadece text haberler
      filter_language: [1], // tr_TR
      limit: 3,
      offset: 0
    });
    
    if (!searchResult?.data?.result?.length) {
      return NextResponse.json({
        success: false,
        error: 'Text haberi bulunamadı'
      });
    }
    
    const newsItems = [];
    
    for (const news of searchResult.data.result.slice(0, 2)) {
      try {
        console.log(`📄 Analiz ediliyor: ${news.id}`);
        
        // NewsML document al
        const newsmlContent = await ultraPremiumAAService.getDocument(news.id, 'newsml29');
        
        let analysis = {
          aa_id: news.id,
          title: news.title,
          type: news.type,
          has_newsml: !!newsmlContent,
          newsml_length: newsmlContent ? newsmlContent.length : 0,
          xml_structure: {},
          content_found: null as string | null,
          summary_found: null as string | null,
          photos_found: [] as string[],
          parsing_attempts: {} as Record<string, boolean>,
          xml_sample: null as string | null
        };
        
        if (newsmlContent && typeof newsmlContent === 'string') {
          // XML structure analizi
          const xmlAnalysis = {
            has_itemSet: newsmlContent.includes('<itemSet>'),
            has_newsItem: newsmlContent.includes('<newsItem>'),
            has_contentSet: newsmlContent.includes('<contentSet>'),
            has_inlineXML: newsmlContent.includes('<inlineXML>'),
            has_inlineData: newsmlContent.includes('<inlineData>'),
            has_body: newsmlContent.includes('<body>'),
            has_p_tags: newsmlContent.includes('<p>'),
            content_count: (newsmlContent.match(/<content/g) || []).length,
            remoteContent_count: (newsmlContent.match(/<remoteContent/g) || []).length
          };
          analysis.xml_structure = xmlAnalysis;
          
          // 1. contentSet > inlineXML > body > p yaklaşımı
          const contentSetMatch = newsmlContent.match(/<contentSet[^>]*>([\s\S]*?)<\/contentSet>/);
          if (contentSetMatch) {
            const contentSetContent = contentSetMatch[1];
            const inlineXMLMatch = contentSetContent.match(/<inlineXML[^>]*>([\s\S]*?)<\/inlineXML>/);
            if (inlineXMLMatch) {
              const inlineXMLContent = inlineXMLMatch[1];
              const bodyMatch = inlineXMLContent.match(/<body[^>]*>([\s\S]*?)<\/body>/);
              if (bodyMatch) {
                const bodyContent = bodyMatch[1];
                
                // P tag'lerini birleştir
                const pMatches = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
                if (pMatches) {
                  const paragraphs = pMatches.map(p => 
                    p.replace(/<[^>]*>/g, '').trim()
                  ).filter(p => p.length > 0);
                  
                  const fullContent = paragraphs.join('\n\n');
                  if (fullContent.length > 50) {
                    analysis.content_found = fullContent;
                    analysis.summary_found = fullContent.substring(0, 200) + '...';
                    analysis.parsing_attempts.contentSet_success = true;
                  }
                }
              }
            }
          }
          
          // 2. Alternatif: Direkt inlineData arama
          if (!analysis.content_found) {
            const inlineDataMatch = newsmlContent.match(/<inlineData[^>]*>([\s\S]*?)<\/inlineData>/);
            if (inlineDataMatch) {
              const cleanContent = inlineDataMatch[1]
                .replace(/<[^>]*>/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              
              if (cleanContent.length > 50) {
                analysis.content_found = cleanContent;
                analysis.summary_found = cleanContent.substring(0, 200) + '...';
                analysis.parsing_attempts.inlineData_success = true;
              }
            }
          }
          
          // 3. remoteContent'den fotoğraf URL'leri çıkar
          const remoteContentMatches = newsmlContent.match(/<remoteContent[^>]*href="([^"]*)"[^>]*>/g);
          if (remoteContentMatches) {
            remoteContentMatches.forEach(match => {
              const urlMatch = match.match(/href="([^"]*)"/);
              if (urlMatch && urlMatch[1]) {
                const url = urlMatch[1];
                if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
                  analysis.photos_found.push(url);
                }
              }
            });
          }
          
          // Raw XML sample (500 karakter)
          analysis.xml_sample = newsmlContent.substring(0, 800) + '...';
        }
        
        newsItems.push(analysis);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        console.error(`❌ ${news.id} analiz hatası:`, error.message);
      }
    }
    
    return NextResponse.json({
      success: true,
      total_analyzed: newsItems.length,
      news_items: newsItems,
      summary: {
        content_found_count: newsItems.filter(n => n.content_found).length,
        photos_found_count: newsItems.reduce((sum, n) => sum + n.photos_found.length, 0),
        parsing_success: newsItems.some(n => n.content_found)
      }
    });
    
  } catch (error: any) {
    console.error('❌ NewsML analiz hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
