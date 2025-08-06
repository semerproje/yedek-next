import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Simple test endpoint working',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        has_aa_url: !!process.env.AA_API_BASE_URL,
        has_aa_username: !!process.env.AA_USERNAME,
        has_aa_password: !!process.env.AA_PASSWORD
      }
    });
  } catch (error: any) {
    console.error('Simple test error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack
    }, { status: 500 });
  }
}
