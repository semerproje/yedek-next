import { NextRequest, NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 AA API Hızlı Test Başlatılıyor...');

    // 1. Environment variables kontrolü
    const envCheck = {
      AA_API_BASE_URL: process.env.AA_API_BASE_URL,
      AA_USERNAME: process.env.AA_USERNAME ? '***SET***' : 'MISSING',
      AA_PASSWORD: process.env.AA_PASSWORD ? '***SET***' : 'MISSING'
    };

    console.log('🔧 Environment:', envCheck);

    // 2. Basit bağlantı testi
    let connectionTest = null;
    try {
      connectionTest = await ultraPremiumAAService.testConnection();
      console.log('🔗 Bağlantı testi:', connectionTest);
    } catch (connError: any) {
      console.error('❌ Bağlantı hatası:', connError.message);
      connectionTest = { success: false, message: connError.message };
    }

    // 3. Discover test
    let discoverTest = null;
    try {
      discoverTest = await ultraPremiumAAService.discover('tr_TR');
      console.log('📋 Discover testi:', discoverTest ? 'SUCCESS' : 'FAILED');
    } catch (discoverError: any) {
      console.error('❌ Discover hatası:', discoverError.message);
    }

    // 4. Basit search test
    let searchTest = null;
    try {
      searchTest = await ultraPremiumAAService.search({
        filter_category: [1],
        filter_type: [1],
        start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        limit: 2
      });
      console.log('🔍 Search testi:', searchTest?.data?.result?.length || 0, 'haber bulundu');
    } catch (searchError: any) {
      console.error('❌ Search hatası:', searchError.message);
    }

    return NextResponse.json({
      success: true,
      test_results: {
        environment: envCheck,
        connection: connectionTest,
        discover: {
          success: !!discoverTest,
          categories: discoverTest?.category ? Object.keys(discoverTest.category).length : 0
        },
        search: {
          success: !!searchTest?.data?.result,
          news_count: searchTest?.data?.result?.length || 0
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Genel test hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
