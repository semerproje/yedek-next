import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function POST(request: Request) {
  try {
    const { type_code = 1 } = await request.json();
    
    console.log(`🔍 AA Type ${type_code} test ediliyor...`);
    
    const searchResult = await ultraPremiumAAService.search({
      filter_type: [type_code],
      filter_language: [1],
      limit: 3,
      offset: 0
    });
    
    if (!searchResult?.data?.result) {
      return NextResponse.json({
        success: false,
        error: 'Arama sonucu bulunamadı',
        type_code
      });
    }
    
    const results = searchResult.data.result.map(news => ({
      id: news.id,
      title: news.title || 'Başlık yok',
      type: news.type,
      has_content: !!(news.content && news.content.trim()),
      has_summary: !!(news.summary && news.summary.trim()),
      content_preview: news.content ? news.content.substring(0, 200) + '...' : 'İçerik yok',
      summary_preview: news.summary ? news.summary.substring(0, 150) + '...' : 'Özet yok',
      content_length: news.content ? news.content.length : 0,
      summary_length: news.summary ? news.summary.length : 0
    }));
    
    return NextResponse.json({
      success: true,
      type_code,
      total_found: searchResult.data.result.length,
      results,
      analysis: {
        with_content: results.filter(r => r.has_content).length,
        with_summary: results.filter(r => r.has_summary).length,
        content_available: results.some(r => r.has_content),
        summary_available: results.some(r => r.has_summary)
      }
    });
    
  } catch (error: any) {
    console.error('❌ AA type test hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
