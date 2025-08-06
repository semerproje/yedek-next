import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'debug':
        return NextResponse.json({ 
          success: true, 
          message: 'Simple API route is working',
          timestamp: new Date().toISOString(),
          env_check: {
            base_url: process.env.AA_API_BASE_URL || 'not set',
            username_set: !!process.env.AA_USERNAME,
            password_set: !!process.env.AA_PASSWORD,
            node_env: process.env.NODE_ENV
          }
        });

      case 'simple-test':
        return NextResponse.json({
          success: true,
          message: 'Simple test endpoint working',
          version: '1.0.0'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown action: ' + action,
          available_actions: ['debug', 'simple-test']
        });
    }
  } catch (error) {
    console.error('Simple API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'API Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      error_type: error instanceof Error ? error.constructor.name : 'Unknown'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'POST endpoint working'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'POST Error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
