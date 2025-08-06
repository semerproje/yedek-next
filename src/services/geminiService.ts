import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDLgOamVt9EjmPd-W8YJN8DOxquebT_WI0');

interface NewsContent {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
}

interface EnhancedNews extends NewsContent {
  enhanced_title: string;
  enhanced_content: string;
  enhanced_summary: string;
  seo_keywords: string[];
  meta_description: string;
  tags: string[];
  quality_score: number;
  readability_score: number;
}

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async enhanceNews(news: NewsContent): Promise<EnhancedNews> {
    try {
      const prompt = `
      Aşağıdaki haberi Türkçe olarak geliştir ve optimize et:

      Başlık: ${news.title}
      İçerik: ${news.content}
      Özet: ${news.summary || ''}

      Lütfen aşağıdaki formatta JSON olarak döndür:
      {
        "enhanced_title": "SEO uyumlu, çekici başlık",
        "enhanced_content": "Düzenlenmiş, akıcı haber metni",
        "enhanced_summary": "2-3 cümlelik özet",
        "seo_keywords": ["anahtar", "kelimeler"],
        "meta_description": "160 karakter meta açıklama",
        "tags": ["etiket1", "etiket2"],
        "quality_score": 85,
        "readability_score": 90
      }

      Kurallar:
      - Başlık maksimum 60 karakter
      - Meta açıklama 150-160 karakter
      - İçerik akıcı ve anlaşılır olmalı
      - SEO anahtar kelimeleri doğal yerleştirilmeli
      - Türkçe dil bilgisi kurallarına uygun
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // JSON yanıtını parse et
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const enhancedData = JSON.parse(jsonMatch[0]);
      
      return {
        ...news,
        ...enhancedData
      };
    } catch (error) {
      console.error('Gemini enhancement error:', error);
      throw new Error('AI enhancement failed');
    }
  }

  async autoCategorizeNews(news: NewsContent): Promise<string> {
    try {
      const prompt = `
      Aşağıdaki haberin kategorisini belirle:

      Başlık: ${news.title}
      İçerik: ${news.content.substring(0, 500)}...

      Mevcut kategoriler:
      - politika
      - ekonomi
      - spor
      - teknoloji
      - saglik
      - kultur
      - dunya
      - gundem
      - egitim
      - cevre

      Sadece kategori adını döndür (küçük harf, türkçe karakter yok).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const category = response.text().trim().toLowerCase();
      
      return category;
    } catch (error) {
      console.error('Auto categorization error:', error);
      return 'gundem'; // Default category
    }
  }

  async generateSEOUrl(title: string): Promise<string> {
    try {
      const prompt = `
      Bu haber başlığından SEO uyumlu URL slug oluştur:

      Başlık: ${title}

      Kurallar:
      - Sadece küçük harf
      - Türkçe karakterler İngilizce karşılıkları ile değiştirilmeli
      - Boşluklar tire (-) ile değiştirilmeli
      - Özel karakterler kaldırılmalı
      - Maksimum 60 karakter
      - Anlamlı ve SEO dostu olmalı

      Sadece URL slug'ını döndür.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let slug = response.text().trim();
      
      // Türkçe karakterleri değiştir
      const turkishMap: { [key: string]: string } = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
      };
      
      Object.keys(turkishMap).forEach(turkish => {
        slug = slug.replace(new RegExp(turkish, 'g'), turkishMap[turkish]);
      });
      
      // Temizle ve formatla
      slug = slug.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 60);
      
      return slug;
    } catch (error) {
      console.error('SEO URL generation error:', error);
      // Fallback manual generation
      return title.toLowerCase()
        .replace(/[çğıöşü]/g, c => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' } as any)[c])
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60);
    }
  }

  async checkNewsQuality(news: NewsContent): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
    try {
      const prompt = `
      Bu haberin kalitesini değerlendir:

      Başlık: ${news.title}
      İçerik: ${news.content}

      Aşağıdaki kriterlere göre 0-100 puan ver ve JSON olarak döndür:
      {
        "score": 85,
        "issues": ["başlık çok uzun", "imla hatası"],
        "suggestions": ["başlığı kısaltın", "imla kontrolü yapın"]
      }

      Kriterler:
      - Başlık kalitesi
      - İçerik kalitesi
      - İmla ve dilbilgisi
      - Anlaşılırlık
      - SEO uyumluluğu
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { score: 70, issues: [], suggestions: [] };
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('News quality check error:', error);
      return { score: 70, issues: [], suggestions: [] };
    }
  }

  async detectDuplicates(news1: NewsContent, news2: NewsContent): Promise<{ similarity: number; isDuplicate: boolean }> {
    try {
      const prompt = `
      Bu iki haberin benzerlik oranını 0-100 arasında değerlendir:

      Haber 1:
      Başlık: ${news1.title}
      İçerik: ${news1.content.substring(0, 300)}...

      Haber 2:
      Başlık: ${news2.title}
      İçerik: ${news2.content.substring(0, 300)}...

      JSON formatında döndür:
      {
        "similarity": 75,
        "isDuplicate": true
      }

      85+ benzerlik = duplicate
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { similarity: 0, isDuplicate: false };
      }

      const data = JSON.parse(jsonMatch[0]);
      return {
        similarity: data.similarity,
        isDuplicate: data.similarity >= 85
      };
    } catch (error) {
      console.error('Duplicate detection error:', error);
      return { similarity: 0, isDuplicate: false };
    }
  }

  async generateMetaTags(news: NewsContent): Promise<{ title: string; description: string; keywords: string; og_tags: any }> {
    try {
      const prompt = `
      Bu haber için HTML meta tagları oluştur:

      Başlık: ${news.title}
      İçerik: ${news.content.substring(0, 400)}...

      JSON formatında döndür:
      {
        "title": "SEO title",
        "description": "Meta description",
        "keywords": "keyword1, keyword2, keyword3",
        "og_tags": {
          "og:title": "Open Graph title",
          "og:description": "OG description",
          "og:type": "article"
        }
      }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid meta tags response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Meta tags generation error:', error);
      return {
        title: news.title,
        description: news.summary || news.content.substring(0, 160),
        keywords: '',
        og_tags: {}
      };
    }
  }
}

export const geminiService = new GeminiService();
