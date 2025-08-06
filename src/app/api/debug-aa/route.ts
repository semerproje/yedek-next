import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🧪 Debug AA API Test başlatıldı...');
    
    // AA API credentials
    const AA_USERNAME = process.env.AA_API_USERNAME || '3010263';
    const AA_PASSWORD = process.env.AA_API_PASSWORD || '4WUbxVw9';
    const AA_BASE_URL = 'https://api.aa.com.tr/abone';

    // Basic auth header
    const authHeader = 'Basic ' + Buffer.from(`${AA_USERNAME}:${AA_PASSWORD}`).toString('base64');
    
    console.log('🔐 Auth header created, length:', authHeader.length);
    console.log('🌐 Testing basic search...');

    // Test 1: Basic search without filters
    const basicParams = {
      limit: '5',
      offset: '0'
    };

    const basicResponse = await fetch(`${AA_BASE_URL}/search/`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'NetNext-Debug/1.0'
      },
      body: JSON.stringify(basicParams)
    });

    console.log('📡 Basic response status:', basicResponse.status, basicResponse.statusText);

    if (!basicResponse.ok) {
      const errorText = await basicResponse.text();
      console.error('❌ Basic request failed:', errorText);
      
      return NextResponse.json({
        success: false,
        message: 'Basic AA API test failed',
        status: basicResponse.status,
        statusText: basicResponse.statusText,
        error: errorText,
        params: basicParams
      });
    }

    const basicData = await basicResponse.json();
    console.log('📊 Basic response data keys:', Object.keys(basicData));
    console.log('📊 Basic response sample:', {
      hasResult: !!basicData.result,
      resultType: typeof basicData.result,
      resultLength: Array.isArray(basicData.result) ? basicData.result.length : 'Not array',
      totalResults: basicData.total_results,
      dataKeys: Object.keys(basicData)
    });

    // Test 2: Search with category filter
    const categoryParams = {
      filter_category: '1', // Genel
      limit: '5',
      offset: '0'
    };

    console.log('🏷️ Testing category search...');
    const categoryResponse = await fetch(`${AA_BASE_URL}/search/`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'NetNext-Debug/1.0'
      },
      body: JSON.stringify(categoryParams)
    });

    console.log('📡 Category response status:', categoryResponse.status);
    
    let categoryData = null;
    if (categoryResponse.ok) {
      categoryData = await categoryResponse.json();
      console.log('📊 Category response:', {
        hasResult: !!categoryData.result,
        resultLength: Array.isArray(categoryData.result) ? categoryData.result.length : 'Not array',
        totalResults: categoryData.total_results
      });
    }

    // Test 3: Discover endpoint
    console.log('🔍 Testing discover endpoint...');
    const discoverResponse = await fetch(`${AA_BASE_URL}/discover/tr_TR`, {
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'NetNext-Debug/1.0'
      }
    });

    console.log('📡 Discover response status:', discoverResponse.status);
    
    let discoverData = null;
    if (discoverResponse.ok) {
      discoverData = await discoverResponse.json();
      console.log('📊 Discover response keys:', Object.keys(discoverData));
    }

    return NextResponse.json({
      success: true,
      message: 'Debug AA API tests completed',
      tests: {
        basic: {
          status: basicResponse.status,
          success: basicResponse.ok,
          params: basicParams,
          hasResult: !!basicData.result,
          resultCount: Array.isArray(basicData.result) ? basicData.result.length : 0,
          sampleData: basicData.result?.slice(0, 1) || null,
          totalResults: basicData.total_results
        },
        category: {
          status: categoryResponse.status,
          success: categoryResponse.ok,
          params: categoryParams,
          hasResult: !!categoryData?.result,
          resultCount: Array.isArray(categoryData?.result) ? categoryData.result.length : 0,
          totalResults: categoryData?.total_results
        },
        discover: {
          status: discoverResponse.status,
          success: discoverResponse.ok,
          hasData: !!discoverData,
          dataKeys: discoverData ? Object.keys(discoverData) : []
        }
      },
      credentials: {
        username: AA_USERNAME,
        hasPassword: !!AA_PASSWORD,
        authHeaderLength: authHeader.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Debug test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Debug test failed',
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
