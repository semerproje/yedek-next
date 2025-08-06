// app/api/news/galleries/route.ts - Fotoğraf galerileri
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Simulated photo galleries response
    const data = {
      galleries: [
        {
          id: 'aa:picture:20250731:001',
          title: 'Örnek Fotoğraf Galerisi',
          summary: 'Bu bir fotoğraf galerisi örneğidir...',
          categories: ['genel', 'fotogaleri'],
          publishedAt: new Date().toISOString(),
          type: 'picture',
          hasImages: true,
          images: [
            {
              id: 'img_001',
              url: 'https://source.unsplash.com/800x600/?news',
              caption: 'Örnek fotoğraf 1',
              alt: 'Haber fotoğrafı',
              source: 'aa'
            },
            {
              id: 'img_002',
              url: 'https://source.unsplash.com/800x600/?media',
              caption: 'Örnek fotoğraf 2',
              alt: 'Haber fotoğrafı',
              source: 'aa'
            }
          ],
          imageCount: 2,
          location: 'İstanbul'
        }
      ],
      count: 1,
      timestamp: new Date().toISOString(),
      fromCache: false
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Galleries API Error:', error);
    return NextResponse.json(
      { error: 'Fotoğraf galerileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}
