import { NextRequest, NextResponse } from 'next/server';
import { AA_CATEGORIES, AA_PRIORITIES, AA_CONTENT_TYPES, getCategoryName, getPriorityName, getContentTypeName, type AASearchFilters } from '@/lib/aaApiTypes';

export async function POST(request: NextRequest) {
  try {
    const body: AASearchFilters = await request.json();
    
    // Default values
    const searchParams = {
      q: body.q || '',
      limit: Math.min(body.limit || 100, 500), // Max 500
      offset: body.offset || 0,
      filter_category: body.filter_category || undefined,
      filter_type: body.filter_type || undefined, 
      filter_priority: body.filter_priority || undefined,
      filter_language: body.filter_language || 'tr_TR',
      date_from: body.date_from || undefined,
      date_to: body.date_to || undefined,
      keywords: body.keywords || undefined
    };

    // AA API credentials
    const username = process.env.AA_USERNAME;
    const password = process.env.AA_PASSWORD;

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'AA API credentials not configured'
      }, { status: 500 });
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    console.log('📡 AA Enhanced Search Request:', searchParams);
    
    // AA API request
    const aaResponse = await fetch('https://api.aa.com.tr/abone/search/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AA-News-Crawler/2.0'
      },
      body: JSON.stringify(searchParams)
    });

    if (!aaResponse.ok) {
      throw new Error(`AA API error: ${aaResponse.status} ${aaResponse.statusText}`);
    }

    const aaData = await aaResponse.json();
    console.log('📊 AA API Response Structure:', {
      hasResponse: !!aaData.response,
      hasData: !!aaData.data,
      hasResult: !!aaData.data?.result,
      resultLength: aaData.data?.result?.length || 0,
      total: aaData.data?.total
    });

    // Check if API call was successful
    const isSuccess = aaData?.response?.success && aaData?.response?.code === 200;
    if (!isSuccess) {
      throw new Error(`AA API returned error: ${aaData?.response?.message || 'Unknown error'}`);
    }

    // Transform data to our enhanced format
    const transformedNews = (aaData.data?.result || []).map((item: any) => {
      return {
        id: item.id || `aa:${item.type}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || item.headline || '',
        brief: item.brief || item.lead || item.summary || '',
        summary: item.summary || item.brief || item.lead || '',
        news_text: item.news_text || item.text || item.content || '',
        category: getCategoryName(item.filter_category || item.category_id || 1),
        category_id: item.filter_category || item.category_id || 1,
        language: item.filter_language || item.language || 'tr',
        type: getContentTypeName(item.filter_type || item.type_id || 1),
        type_id: item.filter_type || item.type_id || 1,
        priority: item.filter_priority || item.priority || 4,
        priority_name: getPriorityName(item.filter_priority || item.priority || 4),
        publishedAt: item.publish_date || item.publishedAt || item.date || new Date().toISOString(),
        updatedAt: item.updated_date || item.updatedAt || item.date || new Date().toISOString(),
        source: 'AA',
        url: item.url || `https://www.aa.com.tr/tr/haber/${item.id}`,
        author: item.author || item.reporter || '',
        keywords: item.keywords || [],
        media_ids: item.media_ids || [],
        location: item.location || '',
        tags: item.tags || []
      };
    });

    console.log('✅ Enhanced Transform Complete:', {
      originalCount: aaData.data?.result?.length || 0,
      transformedCount: transformedNews.length,
      sampleItem: transformedNews[0] ? {
        id: transformedNews[0].id,
        title: transformedNews[0].title.substring(0, 50) + '...',
        category: transformedNews[0].category,
        type: transformedNews[0].type,
        priority_name: transformedNews[0].priority_name
      } : null
    });

    return NextResponse.json({
      success: true,
      news: transformedNews,
      count: transformedNews.length,
      totalAvailable: aaData.data?.total || transformedNews.length,
      filters: searchParams,
      usedUrl: 'https://api.aa.com.tr/abone/search/',
      categories: AA_CATEGORIES,
      priorities: AA_PRIORITIES,
      contentTypes: AA_CONTENT_TYPES
    });

  } catch (error: any) {
    console.error('❌ AA Enhanced Search Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch news from AA API',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET method for testing and discovery
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AA Enhanced News Search API - Use POST method with filters',
    availableFilters: {
      q: 'string - Search query',
      limit: 'number - Results limit (max 500)',
      offset: 'number - Pagination offset', 
      filter_category: 'number - Category ID (1-7)',
      filter_type: 'number - Content type (1-5)',
      filter_priority: 'number - Priority level (1-6)',
      filter_language: 'string - Language code (tr_TR, en_US, ar_AR)',
      date_from: 'string - Start date (YYYY-MM-DD)',
      date_to: 'string - End date (YYYY-MM-DD)',
      keywords: 'string - Keywords'
    },
    categories: AA_CATEGORIES,
    priorities: AA_PRIORITIES,
    contentTypes: AA_CONTENT_TYPES,
    exampleRequest: {
      q: 'spor',
      limit: 50,
      filter_category: 2,
      filter_type: 1,
      filter_language: 'tr_TR'
    }
  });
}
