import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'debug':
        return NextResponse.json({ 
          success: true, 
          message: 'Working API route',
          timestamp: new Date().toISOString(),
          env_check: {
            base_url: process.env.AA_API_BASE_URL || 'not set',
            username_set: !!process.env.AA_USERNAME,
            password_set: !!process.env.AA_PASSWORD
          }
        });

      case 'test-connection':
        // Simple mock response for now
        return NextResponse.json({
          success: true,
          message: 'AA API bağlantısı başarılı (mock)',
          data: {
            status: 'active',
            subscription: 'premium',
            credits: 1000
          }
        });

      case 'discover':
        return NextResponse.json({
          success: true,
          data: {
            category: {
              '1': 'Gündem',
              '2': 'Ekonomi', 
              '3': 'Spor',
              '4': 'Teknoloji',
              '5': 'Sağlık'
            },
            provider: {
              '1': 'Anadolu Ajansı'
            },
            language: {
              '1': 'Türkçe'
            }
          }
        });

      case 'stats':
        return NextResponse.json({
          success: true,
          data: {
            total_news: 1250,
            published_news: 980,
            draft_news: 270,
            last_fetch: new Date().toISOString()
          }
        });

      case 'schedules':
        return NextResponse.json({
          success: true,
          data: [
            {
              id: 'schedule-1',
              name: 'Sabah Haberleri',
              categories: ['Gündem', 'Ekonomi'],
              frequency: 'Günlük 09:00',
              next_run: new Date(Date.now() + 24 * 60 * 60 * 1000),
              is_active: true
            }
          ]
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown action: ' + action
        });
    }
  } catch (error) {
    console.error('Mock API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'API Error: ' + (error instanceof Error ? error.message : 'Unknown')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'manual-fetch':
        return NextResponse.json({
          success: true,
          data: {
            total_fetched: 25,
            processed: 25,
            auto_published: body.auto_publish ? 25 : 0,
            message: 'Manual fetch completed successfully (mock)'
          }
        });

      case 'test-aa-connection':
        return NextResponse.json({
          success: true,
          data: {
            success: true,
            message: 'AA API connection successful (mock)'
          }
        });

      default:
        return NextResponse.json({
          success: true,
          message: `POST action ${action} completed (mock)`
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'POST Error: ' + (error instanceof Error ? error.message : 'Unknown')
    }, { status: 500 });
  }
}
