import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'AA News Search API is working', 
    method: 'POST required',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const { category, limit = 20, language = 'tr' } = await request.json();
    
    console.log('🔍 AA News Search Request:', { category, limit, language });
    
    if (!process.env.AA_USERNAME || !process.env.AA_PASSWORD) {
      console.error('❌ AA API credentials not found in environment variables');
      return NextResponse.json(
        { success: false, error: 'AA API credentials not configured' },
        { status: 500 }
      );
    }
    
    // Try different AA API base URLs (api.aa.com.tr works with new credentials)
    const baseUrls = [
      'https://api.aa.com.tr/abone/search/'
    ];
    
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const categoryMap: Record<string, string> = {
      'genel': '1',
      'spor': '2',
      'ekonomi': '3',
      'saglik': '4',
      'teknoloji': '5',
      'politika': '6',
      'kultur': '7',
      'sanat': '7',
      'egitim': '1',
      'gundem': '1',
      'dunya': '1'
    };

    const requestData = {
      start_date: startDate,
      end_date: endDate,
      filter_category: categoryMap[category] || '1',
      filter_type: '1',
      filter_language: '1',
      limit: limit,
      offset: 0
    };

    console.log('📡 AA API Request Data:', requestData);
    console.log('🔑 Using credentials for user:', process.env.AA_USERNAME);

    let lastError = null;
    
    for (const aaApiUrl of baseUrls) {
      try {
        console.log('📡 Trying AA Search API:', aaApiUrl);
        
        const response = await fetch(aaApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
          },
          body: JSON.stringify(requestData)
        });

        console.log('📡 AA API Response Status:', response.status);
        console.log('📋 AA API Response Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          
          console.log('🔍 Complete AA API Response:', JSON.stringify(data, null, 2));
          
          // AA API returns: { "response": { "success": true, "code": 200 }, "data": { "result": [...], "total": 34419 } }
          const isSuccess = data?.response?.success && data?.response?.code === 200;
          const newsItems = Array.isArray(data?.data?.result) ? data.data.result : [];
          
          console.log('📊 AA API Response Analysis:', {
            isSuccess,
            hasData: !!data?.data,
            hasResult: !!data?.data?.result,
            resultType: typeof data?.data?.result,
            newsCount: newsItems.length,
            totalAvailable: data?.data?.total || 0
          });

          if (!isSuccess) {
            console.log('❌ AA API returned error:', data?.response?.message || 'Unknown error');
            throw new Error(`AA API error: ${data?.response?.message || 'Unknown error'}`);
          }

          if (newsItems.length > 0) {
            console.log('📝 Sample news item structure:', Object.keys(newsItems[0]));
            console.log('📝 First item:', newsItems[0]);
          }

          const transformedNews = newsItems.map((item: any) => ({
            id: item.id,
            title: item.title,
            brief: item.brief || item.description || item.summary || `${item.title?.substring(0, 100)}...` || '',
            category: item.category || 'genel',
            language: item.language || 'tr',
            type: item.type,
            priority: item.priority || 1,
            publishedAt: item.date || new Date().toISOString(),
            updatedAt: item.date || new Date().toISOString(),
            source: 'AA',
            url: item.url || `https://www.aa.com.tr/tr/haber/${item.id}`
          }));

          console.log('✅ Transformed News:', transformedNews.length);
          console.log('📝 Sample transformed item:', transformedNews[0]);

          return NextResponse.json({ 
            success: true, 
            news: transformedNews,
            count: transformedNews.length,
            totalAvailable: data?.data?.total || transformedNews.length,
            usedUrl: aaApiUrl
          });
        } else {
          const errorText = await response.text();
          lastError = `${aaApiUrl}: ${response.status} - ${errorText}`;
          console.log(`❌ Failed with ${aaApiUrl}:`, response.status, errorText);
        }
      } catch (error) {
        lastError = `${aaApiUrl}: ${error}`;
        console.log(`❌ Error with ${aaApiUrl}:`, error);
      }
    }
    
    // If all URLs failed, return the last error
    console.error('❌ AA Search URL failed:', lastError);
    return NextResponse.json(
      { success: false, error: `AA Search endpoint failed: ${lastError}` },
      { status: 500 }
    );

  } catch (error) {
    console.error('❌ AA News search error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Check server logs for more information'
      },
      { status: 500 }
    );
  }
}
