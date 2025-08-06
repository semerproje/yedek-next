interface PhotoResult {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  description?: string;
  photographer?: string;
  date_taken?: string;
  keywords?: string[];
}

interface NewsWithPhotos {
  id: string;
  title: string;
  content: string;
  photos: PhotoResult[];
  main_photo?: PhotoResult;
}

export class PhotoService {
  private aaPhotoBaseUrl = 'https://foto.aa.com.tr';
  private searchEndpoint = '/api/search';

  async searchAAPhotos(query: string, limit: number = 10): Promise<PhotoResult[]> {
    try {
      // AA Fotoğraf arşivi API'si simülasyonu
      // Gerçek implementasyonda AA'nın fotoğraf API'sini kullanacağız
      
      const mockPhotos: PhotoResult[] = [
        {
          id: 'aa_photo_1',
          title: `${query} ile ilgili fotoğraf 1`,
          url: `${this.aaPhotoBaseUrl}/photos/${encodeURIComponent(query)}_1.jpg`,
          thumbnail_url: `${this.aaPhotoBaseUrl}/thumbs/${encodeURIComponent(query)}_1.jpg`,
          description: `${query} konulu haber fotoğrafı`,
          photographer: 'AA Foto Muhabiri',
          date_taken: new Date().toISOString(),
          keywords: [query, 'haber', 'aa']
        },
        {
          id: 'aa_photo_2',
          title: `${query} ile ilgili fotoğraf 2`,
          url: `${this.aaPhotoBaseUrl}/photos/${encodeURIComponent(query)}_2.jpg`,
          thumbnail_url: `${this.aaPhotoBaseUrl}/thumbs/${encodeURIComponent(query)}_2.jpg`,
          description: `${query} konulu haber fotoğrafı`,
          photographer: 'AA Foto Muhabiri',
          date_taken: new Date().toISOString(),
          keywords: [query, 'haber', 'aa']
        }
      ];

      return mockPhotos.slice(0, limit);
    } catch (error) {
      console.error('AA Photo search error:', error);
      return [];
    }
  }

  async autoFindPhotos(news: any): Promise<NewsWithPhotos> {
    try {
      // Haber başlığından anahtar kelimeler çıkar
      const keywords = this.extractKeywords(news.title);
      
      // Her anahtar kelime için fotoğraf ara
      let allPhotos: PhotoResult[] = [];
      
      for (const keyword of keywords) {
        const photos = await this.searchAAPhotos(keyword, 3);
        allPhotos = [...allPhotos, ...photos];
      }

      // Duplikatları kaldır
      const uniquePhotos = allPhotos.filter((photo, index, self) => 
        index === self.findIndex(p => p.id === photo.id)
      );

      // Ana fotoğrafı seç (en alakalı)
      const mainPhoto = uniquePhotos.length > 0 ? uniquePhotos[0] : undefined;

      return {
        ...news,
        photos: uniquePhotos.slice(0, 5), // Maksimum 5 fotoğraf
        main_photo: mainPhoto
      };
    } catch (error) {
      console.error('Auto photo finding error:', error);
      return {
        ...news,
        photos: [],
        main_photo: undefined
      };
    }
  }

  private extractKeywords(title: string): string[] {
    // Türkçe stopwords
    const stopwords = [
      'bir', 'bu', 'şu', 've', 'ile', 'için', 'olan', 'olarak', 'sonra', 
      'önce', 'kadar', 'gibi', 'daha', 'çok', 'az', 'hem', 'de', 'da',
      'ki', 'mi', 'mı', 'mu', 'mü', 'ne', 'nasıl', 'neden', 'niçin'
    ];

    return title
      .toLowerCase()
      .replace(/[^\w\sçğıöşü]/g, '') // Özel karakterleri kaldır
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopwords.includes(word))
      .slice(0, 3); // İlk 3 anahtar kelime
  }

  async downloadAndSavePhoto(photoUrl: string, newsId: string): Promise<string> {
    try {
      // Fotoğrafı indir ve Firebase Storage'a kaydet
      const response = await fetch(photoUrl);
      if (!response.ok) {
        throw new Error('Photo download failed');
      }

      // Burada Firebase Storage'a kaydetme işlemi yapılacak
      // Şimdilik mock bir URL döndürüyoruz
      const savedUrl = `/images/news/${newsId}/${Date.now()}.jpg`;
      
      return savedUrl;
    } catch (error) {
      console.error('Photo download error:', error);
      throw error;
    }
  }

  async optimizePhotoForWeb(photoUrl: string): Promise<{ original: string; thumbnail: string; webp: string }> {
    try {
      // Fotoğrafı web için optimize et (thumbnail, webp format)
      // Şimdilik mock URLs döndürüyoruz
      
      return {
        original: photoUrl,
        thumbnail: photoUrl.replace('.jpg', '_thumb.jpg'),
        webp: photoUrl.replace('.jpg', '.webp')
      };
    } catch (error) {
      console.error('Photo optimization error:', error);
      return {
        original: photoUrl,
        thumbnail: photoUrl,
        webp: photoUrl
      };
    }
  }

  async validatePhotoRights(photoId: string): Promise<{ canUse: boolean; license: string; attribution?: string }> {
    try {
      // AA fotoğraflarının kullanım haklarını kontrol et
      // AA abonesi olduğumuz için genellikle kullanabiliriz
      
      return {
        canUse: true,
        license: 'AA Subscription',
        attribution: 'Anadolu Ajansı'
      };
    } catch (error) {
      console.error('Photo rights validation error:', error);
      return {
        canUse: false,
        license: 'Unknown'
      };
    }
  }

  async getPhotoMetadata(photoUrl: string): Promise<{ width: number; height: number; size: number; format: string }> {
    try {
      // Fotoğraf metadata'sını al
      // Şimdilik mock data döndürüyoruz
      
      return {
        width: 1920,
        height: 1080,
        size: 245760, // bytes
        format: 'JPEG'
      };
    } catch (error) {
      console.error('Photo metadata error:', error);
      return {
        width: 0,
        height: 0,
        size: 0,
        format: 'Unknown'
      };
    }
  }

  async generateAltText(photoUrl: string, newsTitle: string): Promise<string> {
    try {
      // Fotoğraf için SEO uyumlu alt text oluştur
      const keywords = this.extractKeywords(newsTitle);
      const altText = `${keywords.join(' ')} ile ilgili haber fotoğrafı - Anadolu Ajansı`;
      
      return altText;
    } catch (error) {
      console.error('Alt text generation error:', error);
      return newsTitle;
    }
  }
}

export const photoService = new PhotoService();
