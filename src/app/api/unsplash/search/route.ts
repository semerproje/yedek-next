import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, perPage = 10 } = await request.json();

    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Unsplash API key not configured'
      });
    }

    const response = await fetch('https://api.unsplash.com/search/photos', {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        'Content-Type': 'application/json'
      },
      // Use URLSearchParams for GET request
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      photos: data.results || [],
      total: data.total || 0
    });

  } catch (error) {
    console.error('Unsplash search error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'news';
    const perPage = parseInt(searchParams.get('per_page') || '10');

    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Unsplash API key not configured'
      });
    }

    const apiUrl = new URL('https://api.unsplash.com/search/photos');
    apiUrl.searchParams.append('query', query);
    apiUrl.searchParams.append('per_page', perPage.toString());
    apiUrl.searchParams.append('orientation', 'landscape');
    apiUrl.searchParams.append('content_filter', 'high');

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      photos: data.results || [],
      total: data.total || 0
    });

  } catch (error) {
    console.error('Unsplash search error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
