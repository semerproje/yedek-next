import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('🔍 AA API Basic Test Başlatılıyor...');
    
    const AA_API_BASE_URL = process.env.AA_API_BASE_URL;
    const AA_USERNAME = process.env.AA_USERNAME;
    const AA_PASSWORD = process.env.AA_PASSWORD;
    
    if (!AA_API_BASE_URL || !AA_USERNAME || !AA_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: 'AA API credentials missing'
      }, { status: 500 });
    }
    
    // Basic AA API connection test
    const response = await axios.get(AA_API_BASE_URL + '/discover/tr_TR', {
      auth: {
        username: AA_USERNAME,
        password: AA_PASSWORD
      },
      timeout: 10000
    });
    
    return NextResponse.json({
      success: true,
      message: 'AA API basic connection successful',
      status: response.status,
      hasData: !!response.data
    });
    
  } catch (error: any) {
    console.error('❌ AA API Basic Test Error:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      status: error.response?.status || 'unknown'
    }, { status: 500 });
  }
}
