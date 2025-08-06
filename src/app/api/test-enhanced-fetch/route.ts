import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Enhanced fetch'i test et
    const response = await fetch('http://localhost:3000/api/aa/enhanced-fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content_types: [1], // TEXT only
        limit: 2,
        use_enhanced_parsing: true
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Enhanced fetch failed: ${response.status}`
      });
    }

    const result = await response.json();
    
    // Kısa özet döndür
    return NextResponse.json({
      success: true,
      test_completed: true,
      enhanced_fetch_result: {
        total_found: result.results?.total_found || 0,
        processed: result.results?.processed_successfully || 0,
        content_extracted: result.results?.content_extracted || 0,
        news_samples: result.results?.processed_news?.slice(0, 2) || []
      },
      next_step: "Content başarıyla çıkarıldıysa AA fotoğraf arşivi entegrasyonuna geçelim"
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      suggestion: "Enhanced fetch endpoint'inde sorun olabilir"
    }, { status: 500 });
  }
}
