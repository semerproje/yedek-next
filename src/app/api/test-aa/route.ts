import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if running in development mode for security
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        message: 'AA API test sadece development modunda kullanılabilir'
      }, { status: 403 });
    }

    // Dynamic import with better error handling
    let AANewsService, DEFAULT_AA_CREDENTIALS;
    
    try {
      const aaModule = await import('@/lib/aa-news-service');
      AANewsService = aaModule.AANewsService;
      DEFAULT_AA_CREDENTIALS = aaModule.DEFAULT_AA_CREDENTIALS;
    } catch (importError) {
      console.error('AA News Service import error:', importError);
      return NextResponse.json({
        success: false,
        message: 'AA News Service modülü yüklenemedi'
      }, { status: 500 });
    }

    if (!AANewsService || !DEFAULT_AA_CREDENTIALS) {
      return NextResponse.json({
        success: false,
        message: 'AA News Service konfigürasyonu eksik'
      }, { status: 500 });
    }
    
    const aaService = new AANewsService(DEFAULT_AA_CREDENTIALS);
    const testResult = await aaService.testConnection();
    
    return NextResponse.json({
      success: testResult.success,
      message: testResult.message,
      endpoint: testResult.endpoint
    });
  } catch (error) {
    console.error('AA API test error:', error);
    return NextResponse.json({
      success: false,
      message: `Test başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
    }, { status: 500 });
  }
}
