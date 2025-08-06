export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    download: string;
  };
}

class UnsplashService {
  private accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  async searchPhotos(query: string, perPage = 10): Promise<UnsplashPhoto[]> {
    if (!this.accessKey) {
      console.warn('Unsplash Access Key not found, returning fallback photos');
      return this.getFallbackPhotos(query, perPage);
    }

    try {
      const url = new URL('https://api.unsplash.com/search/photos');
      url.searchParams.append('query', query);
      url.searchParams.append('per_page', perPage.toString());
      url.searchParams.append('orientation', 'landscape');
      url.searchParams.append('content_filter', 'high');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || this.getFallbackPhotos(query, perPage);
    } catch (error) {
      console.error('Unsplash API error:', error);
      return this.getFallbackPhotos(query, perPage);
    }
  }

  // Fallback photos using more reliable sources
  private getFallbackPhotos(query: string, perPage: number): UnsplashPhoto[] {
    const fallbackPhotos: UnsplashPhoto[] = [];
    
    for (let i = 0; i < perPage; i++) {
      const seed = `${query}-${i}`;
      fallbackPhotos.push({
        id: `fallback-${i}`,
        urls: {
          raw: `https://picsum.photos/1200/800?seed=${seed}`,
          full: `https://picsum.photos/1200/800?seed=${seed}`,
          regular: `https://picsum.photos/800/600?seed=${seed}`,
          small: `https://picsum.photos/400/300?seed=${seed}`,
          thumb: `https://picsum.photos/200/150?seed=${seed}`
        },
        alt_description: `${query} ile ilgili görsel`,
        description: `${query} konulu temsili görsel`,
        user: {
          name: 'NetNext',
          username: 'netnext'
        },
        links: {
          download: `https://picsum.photos/800/600?seed=${seed}`
        }
      });
    }
    
    return fallbackPhotos;
  }

  async downloadPhoto(photoUrl: string): Promise<Blob | null> {
    try {
      const response = await fetch(photoUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Photo download error:', error);
      return null;
    }
  }

  // Get relevant keywords from news title for better photo search
  extractKeywords(title: string): string {
    const stopWords = ['ve', 'ile', 'için', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'ta', 'te', 'ki', 'mi', 'mu', 'mı', 'mü'];
    const words = title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 3); // First 3 relevant words
    
    return words.join(' ');
  }
}

export const unsplashService = new UnsplashService();
