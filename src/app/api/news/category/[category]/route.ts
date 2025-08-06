// app/api/news/category/[category]/route.ts - Kategoriye göre haberler
import { NextRequest, NextResponse } from 'next/server';

const VALID_CATEGORIES = ['genel', 'spor', 'ekonomi', 'teknoloji', 'politika', 'kultur-sanat', 'dunya'];

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '15');
    const includeContent = searchParams.get('includeContent') === 'true';

    // Kategori doğrulama
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori', validCategories: VALID_CATEGORIES },
        { status: 400 }
      );
    }

    // Simulated response
    const data = {
      category,
      news: [
        {
          id: `aa:text:20250731:${category}001`,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Kategorisi Örnek Haber`,
          summary: `Bu ${category} kategorisinden bir örnek haberdir...`,
          categories: [category],
          publishedAt: new Date().toISOString(),
          hasImages: true,
          hasVideos: category === 'spor',
          imageCount: 2,
          videoCount: category === 'spor' ? 1 : 0
        }
      ],
      stats: {
        total: 1,
        byType: { text: 1 }
      },
      timestamp: new Date().toISOString(),
      fromCache: false
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Category API Error:', error);
    return NextResponse.json(
      { error: 'Kategori haberleri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}
