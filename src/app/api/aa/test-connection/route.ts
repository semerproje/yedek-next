import { NextRequest, NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 AA API bağlantı testi başlatılıyor...');

    // 1. AA API bağlantı testi
    const connectionTest = await ultraPremiumAAService.testConnection();
    console.log('📡 AA bağlantı testi:', connectionTest);

    // 2. Discover API testi - kategorileri al
    const discoverData = await ultraPremiumAAService.discover('tr_TR');
    console.log('📋 AA Discover Data:', discoverData ? Object.keys(discoverData) : 'null');

    // 3. AA kategorilerini al
    const categories = await ultraPremiumAAService.getAACategories();
    console.log('📂 AA Kategoriler:', Object.keys(categories).length);

    // 4. Test search - son 24 saatin genel haberlerini çek
    const testSearch = await ultraPremiumAAService.search({
      filter_category: [1], // Genel kategori
      filter_type: [1], // Haber
      start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: undefined, // NOW
      limit: 5
    });

    const searchResults = testSearch?.data?.result || [];
    console.log('🔍 Test arama sonuçları:', searchResults.length, 'haber bulundu');

    // 5. Eğer haber varsa, birinin NewsML 2.9 formatını test et
    let newsmlTest = null;
    if (searchResults.length > 0) {
      const firstNews = searchResults[0];
      console.log('📰 İlk haber test ediliyor:', firstNews.title);
      
      try {
        newsmlTest = await ultraPremiumAAService.getDocument(firstNews.id, 'newsml29');
        console.log('📄 NewsML 2.9 test:', newsmlTest ? 'Başarılı' : 'Başarısız');
      } catch (newsmlError: any) {
        console.warn('⚠️ NewsML test hatası:', newsmlError.message);
      }
    }

    return NextResponse.json({
      success: true,
      test_results: {
        connection: {
          status: connectionTest.success ? 'connected' : 'failed',
          message: connectionTest.message
        },
        discover: {
          status: discoverData ? 'success' : 'failed',
          categories_count: discoverData?.category ? Object.keys(discoverData.category).length : 0,
          types_count: discoverData?.type ? Object.keys(discoverData.type).length : 0,
          languages_count: discoverData?.language ? Object.keys(discoverData.language).length : 0
        },
        search: {
          status: testSearch?.data?.result ? 'success' : 'failed',
          news_found: searchResults.length,
          sample_titles: searchResults.slice(0, 3).map(n => n.title || 'Başlık yok')
        },
        newsml: {
          status: newsmlTest ? 'success' : 'failed',
          content_length: newsmlTest ? newsmlTest.length : 0,
          is_xml: newsmlTest ? newsmlTest.includes('<?xml') : false
        }
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

  } catch (error: any) {
    console.error('❌ AA API test genel hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'AA API test başarısız',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
