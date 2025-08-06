import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test AA API connection
    const credentials = {
      username: process.env.AA_API_USERNAME || '',
      password: process.env.AA_API_PASSWORD || ''
    };

    if (!credentials.username || !credentials.password) {
      return NextResponse.json({
        success: false,
        message: 'AA API kimlik bilgileri yapılandırılmamış'
      });
    }

    const authHeader = `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`;
    
    const response = await fetch('https://api.aa.com.tr/abone/discover/tr_TR', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: 'AA API bağlantısı başarılı',
        data: data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `AA API bağlantısı başarısız: ${response.status} ${response.statusText}`
      });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
    });
  }
}
