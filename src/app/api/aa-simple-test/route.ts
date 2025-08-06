import { NextRequest, NextResponse } from 'next/server';

// Simple AA API Test - Try different approaches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'discover';

    const AA_USERNAME = process.env.AA_API_USERNAME || '3010263';
    const AA_PASSWORD = process.env.AA_API_PASSWORD || '4WUbxVw9';
    const AA_BASE_URL = 'https://api.aa.com.tr/abone';
    const authHeader = 'Basic ' + Buffer.from(`${AA_USERNAME}:${AA_PASSWORD}`).toString('base64');

    console.log(`🧪 Running AA API test: ${testType}`);

    if (testType === 'discover') {
      // Test discover endpoint
      const response = await fetch(`${AA_BASE_URL}/discover/tr_TR`, {
        headers: {
          'Authorization': authHeader,
          'User-Agent': 'NetNext-Simple-Test/1.0'
        }
      });

      const data = await response.json();
      return NextResponse.json({
        success: response.ok,
        endpoint: 'discover/tr_TR',
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      });
    }

    if (testType === 'news') {
      // Test latest news endpoint
      const endpoints = [
        '/news/latest',
        '/news',
        '/content/latest',
        '/latest',
        '/feed'
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Testing: ${AA_BASE_URL}${endpoint}`);
          
          const response = await fetch(`${AA_BASE_URL}${endpoint}`, {
            headers: {
              'Authorization': authHeader,
              'Accept': 'application/json',
              'User-Agent': 'NetNext-Simple-Test/1.0'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
              success: true,
              endpoint: endpoint,
              status: response.status,
              data,
              dataKeys: Object.keys(data),
              hasNews: !!(data.result || data.news || data.data || data.items),
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          console.log(`Failed: ${endpoint}`, err);
        }
      }

      return NextResponse.json({
        success: false,
        message: 'All news endpoints failed',
        timestamp: new Date().toISOString()
      });
    }

    if (testType === 'categories') {
      // Test categories endpoint
      const response = await fetch(`${AA_BASE_URL}/categories`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'User-Agent': 'NetNext-Simple-Test/1.0'
        }
      });

      const data = await response.json();
      return NextResponse.json({
        success: response.ok,
        endpoint: 'categories',
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      });
    }

    if (testType === 'search-minimal') {
      // Test minimal search
      const searchData = {
        limit: 10
      };

      const endpoints = [
        '/search',
        '/news/search',
        '/content/search'
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Testing search: ${AA_BASE_URL}${endpoint}`);
          
          const response = await fetch(`${AA_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'NetNext-Simple-Test/1.0'
            },
            body: JSON.stringify(searchData)
          });

          const data = await response.json();
          
          if (response.ok || data) {
            return NextResponse.json({
              success: response.ok,
              endpoint: endpoint,
              status: response.status,
              data,
              dataKeys: Object.keys(data),
              hasNews: !!(data.result || data.news || data.data || data.items),
              searchParams: searchData,
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          console.log(`Failed search: ${endpoint}`, err);
        }
      }

      return NextResponse.json({
        success: false,
        message: 'All search endpoints failed',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid test type. Use: discover, news, categories, or search-minimal',
      availableTypes: ['discover', 'news', 'categories', 'search-minimal'],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Simple AA test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
