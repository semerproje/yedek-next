import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Environment variables kontrolü
    const envCheck = {
      AA_API_BASE_URL: process.env.AA_API_BASE_URL ? '✅ Set' : '❌ Missing',
      AA_USERNAME: process.env.AA_USERNAME ? '✅ Set' : '❌ Missing',
      AA_PASSWORD: process.env.AA_PASSWORD ? '✅ Set' : '❌ Missing',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'
    };

    return NextResponse.json({
      success: true,
      message: 'AA News System - API Status',
      environment_variables: envCheck,
      features: {
        real_aa_api: '✅ Aktif',
        newsml_29_support: '✅ Aktif',
        firestore_integration: '✅ Aktif',
        ai_enhancement: '✅ Aktif',
        duplicate_detection: '✅ Aktif'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Status error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
