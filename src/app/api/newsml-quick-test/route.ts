import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function GET() {
  try {
    console.log('🎯 Hızlı NewsML test...');
    
    // En basit yaklaşım: tek haber al ve XML'i logla
    const searchResult = await ultraPremiumAAService.search({
      filter_type: [1], // text
      filter_language: [1],
      limit: 1
    });
    
    if (!searchResult?.data?.result?.length) {
      return NextResponse.json({ success: false, error: 'Haber bulunamadı' });
    }
    
    const news = searchResult.data.result[0];
    const newsmlContent = await ultraPremiumAAService.getDocument(news.id, 'newsml29');
    
    console.log('📄 FULL XML CONTENT:', newsmlContent);
    
    return NextResponse.json({
      success: true,
      aa_id: news.id,
      title: news.title,
      has_newsml: !!newsmlContent,
      newsml_preview: newsmlContent ? newsmlContent.substring(0, 1000) + '...' : null,
      
      // Tüm olası parsing yaklaşımları dene
      parsing_tests: {
        // Test 1: contentSet approach
        contentSet_found: newsmlContent ? newsmlContent.includes('<contentSet>') : false,
        
        // Test 2: inlineXML approach  
        inlineXML_found: newsmlContent ? newsmlContent.includes('<inlineXML>') : false,
        
        // Test 3: body approach
        body_found: newsmlContent ? newsmlContent.includes('<body>') : false,
        
        // Test 4: p tags
        p_tags_found: newsmlContent ? newsmlContent.includes('<p>') : false,
        
        // Test 5: text content direkt arama
        text_nodes_count: newsmlContent ? (newsmlContent.match(/>[^<]+</g) || []).length : 0
      }
    });
    
  } catch (error: any) {
    console.error('❌ Quick test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
