import { NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function POST(request: Request) {
  try {
    const { 
      title = '',
      keywords = [],
      category_id = 1,
      limit = 5
    } = await request.json();

    console.log('📸 AA Fotoğraf Arşivi araması:', { title, keywords, category_id });

    // AA API'den ilgili fotoğrafları ara
    const photoSearchParams = {
      filter_type: [2], // Fotoğraf tipi
      filter_language: [1], // tr_TR
      filter_category: category_id ? [category_id] : [],
      search_string: title,
      limit: limit,
      offset: 0
    };

    const photoResults = await ultraPremiumAAService.search(photoSearchParams);

    if (!photoResults?.data?.result) {
      return NextResponse.json({
        success: false,
        message: 'Fotoğraf bulunamadı',
        photo_count: 0,
        photos: []
      });
    }

    console.log(`📊 Bulunan fotoğraf: ${photoResults.data.result.length}`);

    const photos = [];
    
    for (const photo of photoResults.data.result.slice(0, limit)) {
      try {
        // Fotoğrafın NewsML content'ini al
        const photoNewsML = await ultraPremiumAAService.getDocument(photo.id, 'newsml29');
        
        let photoUrls = [];
        let caption = photo.title || '';
        let description = photo.summary || '';

        if (photoNewsML && typeof photoNewsML === 'string') {
          // remoteContent'den fotoğraf URL'lerini çıkar
          const photoMatches = photoNewsML.match(/<remoteContent[^>]*href="([^"]*\.(jpg|jpeg|png))"[^>]*>/gi);
          if (photoMatches) {
            photoMatches.forEach(match => {
              const urlMatch = match.match(/href="([^"]*)"/i);
              if (urlMatch && urlMatch[1]) {
                photoUrls.push(urlMatch[1]);
              }
            });
          }

          // Caption ve description için content parse et
          const captionMatch = photoNewsML.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
          if (captionMatch) {
            caption = captionMatch[1].replace(/<[^>]*>/g, '').trim();
          }

          const descMatch = photoNewsML.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
          if (descMatch) {
            description = descMatch[1].replace(/<[^>]*>/g, '').trim();
          }
        }

        if (photoUrls.length > 0) {
          photos.push({
            aa_id: photo.id,
            title: photo.title,
            caption: caption,
            description: description,
            urls: photoUrls,
            primary_url: photoUrls[0],
            date: photo.date,
            category_id: photo.category_id,
            relevance_score: calculateRelevanceScore(title, photo.title, keywords)
          });
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        console.warn(`Fotoğraf işleme hatası ${photo.id}:`, error.message);
      }
    }

    // Relevance score'a göre sırala
    photos.sort((a, b) => b.relevance_score - a.relevance_score);

    return NextResponse.json({
      success: true,
      message: `${photos.length} fotoğraf bulundu`,
      photo_count: photos.length,
      photos: photos,
      search_params: photoSearchParams
    });

  } catch (error: any) {
    console.error('❌ AA fotoğraf arama hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Başlık ve keywords'e göre relevance score hesapla
function calculateRelevanceScore(newsTitle: string, photoTitle: string, keywords: string[]): number {
  let score = 0;
  
  const newsWords = newsTitle.toLowerCase().split(/\s+/);
  const photoWords = photoTitle.toLowerCase().split(/\s+/);
  
  // Başlık benzerliği
  for (const newsWord of newsWords) {
    if (newsWord.length > 3) {
      for (const photoWord of photoWords) {
        if (photoWord.includes(newsWord) || newsWord.includes(photoWord)) {
          score += 10;
        }
      }
    }
  }
  
  // Keyword eşleşmesi
  for (const keyword of keywords) {
    if (photoTitle.toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
    }
  }
  
  return score;
}
