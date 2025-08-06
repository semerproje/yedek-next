import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test URL
    const testUrl = 'https://www.aa.com.tr/tr/haber/aa:text:20250802:38733833';
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/aa-news/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: testUrl })
    });

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Detail API test completed',
      testUrl,
      result: data,
      status: response.status
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Detail API test failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST() {
  // Direct test
  try {
    const testUrl = 'https://www.aa.com.tr/tr/haber/aa:text:20250802:38733833';
    
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const html = await response.text();
    
    return NextResponse.json({
      success: true,
      message: 'Direct fetch test successful',
      htmlLength: html.length,
      hasContent: html.includes('haber') || html.includes('content'),
      titleExists: html.includes('<title>'),
      preview: html.substring(0, 500)
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Direct fetch test failed',
      error: error.message
    }, { status: 500 });
  }
}
