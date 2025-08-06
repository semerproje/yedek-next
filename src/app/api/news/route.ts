// app/api/news/route.ts - Ana haber listesi
import { NextRequest, NextResponse } from 'next/server';

// Simulated AA News Service (gerçekte aa-nextjs-service'den import edilecek)
class AANewsService {
  async getLatestNews(options: any) {
    // Burada gerçek servis çağrılacak
    return {
      news: [
        {
          id: 'aa:text:20250731:001',
          title: 'Örnek Haber Başlığı',
          summary: 'Bu bir örnek haber özetidir...',
          categories: ['genel'],
          publishedAt: new Date().toISOString(),
          hasImages: true,
          hasVideos: false,
          imageCount: 1,
          videoCount: 0
        }
      ],
      pagination: {
        currentPage: options.page || 1,
        totalNews: 100,
        hasNextPage: true,
        hasPrevPage: false
      },
      stats: {
        total: 1,
        byCategory: { genel: 1 }
      },
      fromCache: false
    };
  }
}

const aaNewsService = new AANewsService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeContent = searchParams.get('includeContent') === 'true';

    const data = await aaNewsService.getLatestNews({
      category: category || null,
      page,
      limit,
      includeContent
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Haber alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST endpoint for admin operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'sync':
        // Yeni haber senkronizasyonu
        // const result = await runNewsSync(params);
        return NextResponse.json({ success: true, message: 'Senkronizasyon başlatıldı' });
      
      case 'clearCache':
        // Cache temizleme
        return NextResponse.json({ success: true, message: 'Cache temizlendi' });
      
      default:
        return NextResponse.json(
          { error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('POST API Error:', error);
    return NextResponse.json(
      { error: 'İşlem gerçekleştirilemedi' },
      { status: 500 }
    );
  }
}
