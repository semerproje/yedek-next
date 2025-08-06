import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'text';
    const newsId = params.id;

    // Determine format based on type
    let format = 'newsml29';
    if (type === 'picture' || type === 'video') {
      format = 'web';
    }

    const response = await fetch(`https://api.aa.com.tr/abone/document/${newsId}/${format}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error(`AA API error: ${response.status}`);
    }

    const data = await response.text();

    // Parse XML/HTML response based on format
    let parsedNews;
    if (format === 'newsml29') {
      parsedNews = await parseNewsML(data);
    } else {
      parsedNews = await parseWebFormat(data);
    }

    // Add media gallery if available
    const mediaGallery = await getMediaGallery(newsId);
    const enrichedNews = {
      ...parsedNews,
      photos: mediaGallery.photos,
      videos: mediaGallery.videos
    };

    return NextResponse.json({ 
      success: true, 
      news: enrichedNews 
    });

  } catch (error) {
    console.error('AA News detail error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function parseNewsML(xmlData: string) {
  // Simple XML parsing - in production use proper XML parser
  const titleMatch = xmlData.match(/<headline[^>]*>([\s\S]*?)<\/headline>/);
  const contentMatch = xmlData.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
  
  let content = '';
  if (contentMatch) {
    content = contentMatch.map(p => p.replace(/<[^>]*>/g, '')).join('\n\n');
  }

  return {
    id: '',
    title: titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '',
    content: content,
    brief: content.substring(0, 300) + '...',
    publishedAt: new Date().toISOString(),
    source: 'AA'
  };
}

async function parseWebFormat(htmlData: string) {
  // Simple HTML parsing - in production use proper HTML parser
  const titleMatch = htmlData.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  const contentMatch = htmlData.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  
  return {
    id: '',
    title: titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : '',
    content: contentMatch ? contentMatch[1].replace(/<[^>]*>/g, '') : '',
    brief: '',
    publishedAt: new Date().toISOString(),
    source: 'AA'
  };
}

async function getMediaGallery(newsId: string) {
  try {
    // Fetch photo gallery
    const photoResponse = await fetch(`https://api.aa.com.tr/abone/document/${newsId}/web`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.AA_USERNAME}:${process.env.AA_PASSWORD}`).toString('base64')}`
      }
    });

    const photos: any[] = [];
    const videos: any[] = [];

    if (photoResponse.ok) {
      const htmlData = await photoResponse.text();
      
      // Extract image URLs from HTML
      const imgMatches = htmlData.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
      if (imgMatches) {
        imgMatches.forEach((imgTag, index) => {
          const srcMatch = imgTag.match(/src="([^"]+)"/);
          const altMatch = imgTag.match(/alt="([^"]*)"/);
          
          if (srcMatch) {
            photos.push({
              id: `${newsId}_photo_${index}`,
              url: srcMatch[1],
              caption: altMatch ? altMatch[1] : '',
              credit: 'AA',
              width: 800,
              height: 600
            });
          }
        });
      }

      // Extract video URLs
      const videoMatches = htmlData.match(/<video[^>]+src="([^"]+)"[^>]*>/g);
      if (videoMatches) {
        videoMatches.forEach((videoTag, index) => {
          const srcMatch = videoTag.match(/src="([^"]+)"/);
          
          if (srcMatch) {
            videos.push({
              id: `${newsId}_video_${index}`,
              url: srcMatch[1],
              thumbnailUrl: srcMatch[1].replace('.mp4', '_thumb.jpg'),
              caption: '',
              duration: 0
            });
          }
        });
      }
    }

    return { photos, videos };
  } catch (error) {
    console.error('Media gallery fetch error:', error);
    return { photos: [], videos: [] };
  }
}
