import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({
        success: false,
        message: 'URL is required'
      }, { status: 400 });
    }

    // Mock data ile test - gerçek fetch yerine
    const article = {
      title: 'Test Haber Başlığı',
      content: `Bu bir test haber içeriğidir. AA web sitesinden detay çekimi şu anda teknik sorunlar nedeniyle çalışmıyor.
      
      Bu nedenle sistem brief (özet) bilgisini kullanacak. Bu durum haberlerin temel bilgilerinin kaydedilmesini engellemez.
      
      Sistem otomatik olarak:
      - Haber başlığını
      - Brief/özet bilgisini  
      - Kategori bilgisini
      - Yayın tarihini
      - Kaynak bilgisini
      
      Firestore'a kaydedecektir.`,
      summary: 'AA web sitesi detay çekimi şu anda çalışmıyor, sistem brief bilgisini kullanacak.',
      images: [
        'https://via.placeholder.com/400x300?text=Mock+Image+1',
        'https://via.placeholder.com/400x300?text=Mock+Image+2'
      ],
      publishedAt: new Date().toISOString(),
      location: 'İSTANBUL',
      tags: ['test', 'haber', 'mock', 'sistem']
    };

    // Gerçek AA fetch denemesi (yorum satırında)
    /*
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'tr-TR,tr;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 10000
      });

      if (response.ok) {
        const html = await response.text();
        // HTML parsing logic burada olacak
      }
    } catch (fetchError) {
      console.log('Real fetch failed, using mock data:', fetchError.message);
    }
    */

    return NextResponse.json({
      success: true,
      article,
      originalUrl: url,
      note: 'Using mock data due to AA website access restrictions'
    });

  } catch (error: any) {
    console.error('AA article detail error:', error);
    
    // Fallback mock response
    return NextResponse.json({
      success: true,
      article: {
        title: 'Fallback Test Başlığı',
        content: 'Detay çekimi başarısız oldu, brief bilgisi kullanılacak.',
        summary: 'Brief bilgisi ile haber kaydedilecek.',
        images: [],
        publishedAt: new Date().toISOString(),
        location: '',
        tags: ['fallback']
      },
      originalUrl: 'error-fallback',
      error: error.message
    });
  }
}
