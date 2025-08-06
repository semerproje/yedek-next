import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Content/Summary separation test...');

    // AI enhancement KAPALI ile test
    const response = await fetch('http://localhost:3000/api/aa/complete-fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        limit: 1,
        include_photos: false,
        ai_enhance: false // AI KAPALI
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Fetch failed: ${response.status}`
      });
    }

    const result = await response.json();
    
    // Son haberi kontrol et
    const sampleResponse = await fetch('http://localhost:3000/api/aa-news-sample');
    const sampleData = await sampleResponse.json();
    
    const news = sampleData.data;
    
    return NextResponse.json({
      success: true,
      test_name: 'Content/Summary Separation Test',
      test_result: {
        content_length: news.content?.length || 0,
        summary_length: news.summary?.length || 0,
        are_different: news.content?.length !== news.summary?.length,
        content_preview: news.content?.substring(0, 150) + '...',
        summary_preview: news.summary?.substring(0, 150) + '...',
        ai_enhanced: news.ai_content ? true : false
      },
      verdict: {
        status: news.content?.length !== news.summary?.length ? 'FIXED ✅' : 'STILL_BROKEN ❌',
        recommendation: news.content?.length === news.summary?.length ? 
          'Summary generation algorithm needs more work' : 
          'Content and Summary are now properly separated'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
