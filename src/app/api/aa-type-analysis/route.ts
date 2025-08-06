import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function GET() {
  try {
    console.log('🔍 AA API type kodlarını analiz ediliyor...');
    
    // 1. Discover API'den type bilgilerini al
    const discoverData = await ultraPremiumAAService.discover('tr_TR');
    
    if (!discoverData) {
      return NextResponse.json({
        success: false,
        error: 'Discover API\'den veri alınamadı'
      }, { status: 500 });
    }
    
    // 2. Farklı type kodları ile test arama yap
    const testTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const typeResults: Record<number, {
      count: number;
      sample?: {
        id: string;
        title: string;
        type: number;
        has_content: boolean;
        has_summary: boolean;
        content_length: number;
        summary_length: number;
      };
      message?: string;
      error?: string;
    }> = {};
    
    for (const typeCode of testTypes) {
      try {
        console.log(`Testing type: ${typeCode}`);
        
        const searchResult = await ultraPremiumAAService.search({
          filter_type: [typeCode],
          filter_language: [1],
          limit: 5,
          offset: 0
        });
        
        if (searchResult?.data?.result && searchResult.data.result.length > 0) {
          const firstNews = searchResult.data.result[0];
          typeResults[typeCode] = {
            count: searchResult.data.result.length,
            sample: {
              id: firstNews.id,
              title: firstNews.title || 'Başlık yok',
              type: firstNews.type,
              has_content: !!(firstNews.content && firstNews.content.trim()),
              has_summary: !!(firstNews.summary && firstNews.summary.trim()),
              content_length: firstNews.content ? firstNews.content.length : 0,
              summary_length: firstNews.summary ? firstNews.summary.length : 0
            }
          };
        } else {
          typeResults[typeCode] = {
            count: 0,
            message: 'Bu tipte haber bulunamadı'
          };
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        typeResults[typeCode] = {
          count: 0,
          error: error.message
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      discover_data: {
        categories: (discoverData as any)?.categories || [],
        types: (discoverData as any)?.types || [],
        languages: (discoverData as any)?.languages || [],
        priorities: (discoverData as any)?.priorities || []
      },
      type_test_results: typeResults,
      recommendation: {
        text_types: Object.keys(typeResults).filter(typeKey => {
          const type = parseInt(typeKey);
          return typeResults[type].sample?.has_content || typeResults[type].sample?.has_summary;
        }),
        best_for_content: "Type kodları arasında content/summary içeren tipleri bulun"
      }
    });
    
  } catch (error: any) {
    console.error('❌ AA type analizi hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
