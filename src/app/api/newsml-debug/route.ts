import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function POST(request: Request) {
  try {
    const { aa_id = null } = await request.json();
    
    console.log('🔍 NewsML content debug ediliyor...');
    
    // Önce son haberlerden birini al
    let targetId = aa_id;
    if (!targetId) {
      const searchResult = await ultraPremiumAAService.search({
        filter_type: [1], // text
        filter_language: [1],
        limit: 1,
        offset: 0
      });
      
      if (searchResult?.data?.result && searchResult.data.result.length > 0) {
        targetId = searchResult.data.result[0].id;
      }
    }
    
    if (!targetId) {
      return NextResponse.json({
        success: false,
        error: 'Haber ID bulunamadı'
      });
    }
    
    console.log(`📄 NewsML debug: ${targetId}`);
    
    // NewsML document'i al
    const newsmlResponse = await ultraPremiumAAService.getDocument(targetId, 'newsml29');
    
    let analysis: any = {
      aa_id: targetId,
      newsml_available: !!newsmlResponse,
      newsml_type: typeof newsmlResponse,
      newsml_length: newsmlResponse ? newsmlResponse.length : 0,
      is_xml: false,
      body_matches: [],
      content_matches: [],
      text_content: null,
      raw_sample: null
    };
    
    if (newsmlResponse) {
      analysis.is_xml = typeof newsmlResponse === 'string' && newsmlResponse.includes('<?xml');
      analysis.raw_sample = typeof newsmlResponse === 'string' ? 
        newsmlResponse.substring(0, 500) + '...' : 
        JSON.stringify(newsmlResponse).substring(0, 500) + '...';
      
      if (typeof newsmlResponse === 'string') {
        // Body tag arama
        const bodyMatches = newsmlResponse.match(/<body[^>]*>/g) || [];
        analysis.body_matches = bodyMatches;
        
        // Content tag arama  
        const contentMatches = newsmlResponse.match(/<[^>]*content[^>]*>/gi) || [];
        analysis.content_matches = contentMatches;
        
        // Text content çıkarma denemesi
        const textMatch = newsmlResponse.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        if (textMatch) {
          const cleanContent = textMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          analysis.text_content = cleanContent.substring(0, 200);
        }
        
        // Alternatif content arama
        const altContentMatch = newsmlResponse.match(/<inlineData[^>]*>([\s\S]*?)<\/inlineData>/);
        if (altContentMatch) {
          analysis.alternative_content = altContentMatch[1].substring(0, 200);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      analysis
    });
    
  } catch (error: any) {
    console.error('❌ NewsML debug hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
