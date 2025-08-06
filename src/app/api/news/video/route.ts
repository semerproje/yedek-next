// app/api/news/video/route.ts - Video haberler
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Simulated video news response
    const data = {
      news: [
        {
          id: 'aa:video:20250731:001',
          title: 'Önemli Video Haber Başlığı',
          summary: 'Bu bir video haber örneğidir...',
          categories: ['genel', 'video-haberler'],
          publishedAt: new Date().toISOString(),
          type: 'video',
          hasVideos: true,
          videos: [
            {
              id: 'video_001',
              url: 'https://example.com/video.mp4',
              title: 'Video Başlığı',
              thumbnail: 'https://example.com/thumb.jpg',
              source: 'aa'
            }
          ],
          videoCount: 1,
          duration: '02:45'
        }
      ],
      count: 1,
      timestamp: new Date().toISOString(),
      fromCache: false
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Video API Error:', error);
    return NextResponse.json(
      { error: 'Video haberler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}
