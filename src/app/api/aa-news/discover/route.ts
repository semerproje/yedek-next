import { NextRequest, NextResponse } from 'next/server';

// AA Discover API - Get category and parameter mappings
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 AA Discover API called');
    
    if (!process.env.AA_USERNAME || !process.env.AA_PASSWORD) {
      console.error('❌ AA API credentials not found');
      return NextResponse.json(
        { success: false, error: 'AA API credentials not configured' },
        { status: 500 }
      );
    }
    
    // AA Discover endpoint for Turkish language - try api.aa.com.tr first
    const baseUrls = [
      'https://api.aa.com.tr/abone/discover/tr_TR'
    ];
    
    let lastError = null;
    
    for (const discoverUrl of baseUrls) {
      try {
        console.log('📡 Trying AA Discover API:', discoverUrl);
        console.log('🔑 Using credentials for user:', process.env.AA_USERNAME);

        const response = await fetch(discoverUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
          }
        });

        console.log('📡 AA Discover Response Status:', response.status);
        console.log('📋 AA Discover Response Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Complete AA Discover Response:', JSON.stringify(data, null, 2));
          return NextResponse.json({ 
            success: true, 
            data: data,
            usedUrl: discoverUrl
          });
        } else {
          const errorText = await response.text();
          lastError = `${discoverUrl}: ${response.status} - ${errorText}`;
          console.log(`❌ Failed with ${discoverUrl}:`, response.status, errorText);
        }
      } catch (error) {
        lastError = `${discoverUrl}: ${error}`;
        console.log(`❌ Error with ${discoverUrl}:`, error);
      }
    }
    
    // If all URLs failed, return mock discovery data
    console.error('❌ All AA Discover URLs failed:', lastError);
    console.log('🔄 Falling back to mock discovery data...');
    
    const mockDiscoveryData = {
      categories: [
        { id: '1', name: 'Genel', name_tr: 'Genel' },
        { id: '2', name: 'Spor', name_tr: 'Spor' },
        { id: '3', name: 'Ekonomi', name_tr: 'Ekonomi' },
        { id: '4', name: 'Sağlık', name_tr: 'Sağlık' },
        { id: '5', name: 'Teknoloji', name_tr: 'Teknoloji' },
        { id: '6', name: 'Politika', name_tr: 'Politika' },
        { id: '7', name: 'Kültür-Sanat', name_tr: 'Kültür-Sanat' }
      ],
      languages: [
        { id: '1', code: 'tr', name: 'Türkçe' },
        { id: '2', code: 'en', name: 'English' }
      ],
      types: [
        { id: '1', name: 'Haber', name_tr: 'Haber' },
        { id: '2', name: 'Analiz', name_tr: 'Analiz' }
      ]
    };

    return NextResponse.json({ 
      success: true, 
      data: mockDiscoveryData,
      usedUrl: 'mock-data',
      warning: 'Using mock data - AA API authentication failed'
    });

  } catch (error) {
    console.error('❌ AA Discover API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
