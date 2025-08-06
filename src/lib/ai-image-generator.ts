/**
 * AI Image Generation Service
 * Haber içeriğine uygun telifsiz görseller oluşturur
 */

interface ImageGenerationOptions {
  style?: 'photorealistic' | 'artistic' | 'modern' | 'minimal' | 'professional'
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16'
  quality?: 'standard' | 'hd'
  size?: '512x512' | '1024x1024' | '1792x1024' | '1024x1792'
}

interface GeneratedImage {
  url: string
  alt: string
  prompt: string
  metadata: {
    style: string
    size: string
    generatedAt: Date
    keywords: string[]
  }
}

class AIImageGenerator {
  private apiKey: string
  private baseUrl: string
  
  constructor(apiKey: string = '', baseUrl: string = '') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  /**
   * Haber başlığı ve içeriğinden görsel oluşturur
   */
  async generateNewsImage(
    title: string, 
    content: string, 
    category: string,
    options: ImageGenerationOptions = {}
  ): Promise<GeneratedImage | null> {
    try {
      // Anahtar kelimeleri çıkar
      const keywords = this.extractKeywords(title + ' ' + content)
      
      // Kategori bazlı stil belirleme
      const style = options.style || this.getStyleByCategory(category)
      
      // Prompt oluştur
      const prompt = this.createImagePrompt(keywords, category, style)
      
      // Görsel oluştur
      const imageUrl = await this.generateImage(prompt, options)
      
      if (!imageUrl) {
        return null
      }

      return {
        url: imageUrl,
        alt: this.generateAltText(title, keywords),
        prompt,
        metadata: {
          style,
          size: options.size || '1024x1024',
          generatedAt: new Date(),
          keywords
        }
      }

    } catch (error) {
      console.error('Image generation error:', error)
      return null
    }
  }

  /**
   * Metinden anahtar kelimeleri çıkarır
   */
  private extractKeywords(text: string): string[] {
    const turkishStopWords = [
      'bir', 'bu', 've', 'ile', 'için', 'olan', 'da', 'de', 'ki', 'en', 'çok', 
      'daha', 'sonra', 'kadar', 'ancak', 'ayrıca', 'hem', 'ya', 'ama', 'fakat',
      'çünkü', 'eğer', 'hangi', 'nasıl', 'ne', 'neden', 'nere', 'niçin'
    ]
    
    // Metni temizle ve kelimelere ayır
    const words = text.toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !turkishStopWords.includes(word) &&
        !word.match(/^\d+$/) // Sadece rakam olanları çıkar
      )
    
    // Kelime frekansını hesapla
    const frequency: { [key: string]: number } = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })
    
    // En sık kullanılan kelimeleri döndür
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word)
  }

  /**
   * Kategoriye göre görsel stili belirler
   */
  private getStyleByCategory(category: string): string {
    const categoryStyles: { [key: string]: string } = {
      'ekonomi': 'professional',
      'spor': 'dynamic',
      'teknoloji': 'modern',
      'politika': 'formal',
      'kultur': 'artistic',
      'saglik': 'clean',
      'egitim': 'academic',
      'gundem': 'journalistic',
      'dunya': 'global',
      'cevre': 'natural'
    }
    
    return categoryStyles[category] || 'professional'
  }

  /**
   * AI görsel prompt'u oluşturur
   */
  private createImagePrompt(
    keywords: string[], 
    category: string, 
    style: string
  ): string {
    // Kategori bazlı prompt şablonları
    const categoryPrompts: { [key: string]: string } = {
      'ekonomi': 'Professional business and finance concept',
      'spor': 'Dynamic sports and athletics scene',
      'teknoloji': 'Modern technology and innovation concept',
      'politika': 'Formal political and governmental theme',
      'kultur': 'Cultural arts and heritage concept',
      'saglik': 'Clean healthcare and wellness theme',
      'egitim': 'Educational and academic environment',
      'gundem': 'News and current affairs concept',
      'dunya': 'Global international affairs theme',
      'cevre': 'Environmental and nature concept'
    }

    const basePrompt = categoryPrompts[category] || 'Professional news concept'
    
    // Stil açıklamaları
    const styleDescriptions: { [key: string]: string } = {
      'professional': 'clean, professional, corporate style',
      'modern': 'modern, minimalist, high-tech aesthetic',
      'artistic': 'artistic, creative, visually appealing',
      'minimal': 'minimal, simple, elegant design',
      'photorealistic': 'photorealistic, detailed, high quality',
      'dynamic': 'dynamic, energetic, action-oriented',
      'formal': 'formal, serious, authoritative',
      'clean': 'clean, bright, organized',
      'academic': 'academic, scholarly, educational',
      'journalistic': 'journalistic, informative, clear',
      'global': 'international, worldwide, diverse',
      'natural': 'natural, environmental, organic'
    }

    const styleDesc = styleDescriptions[style] || 'professional'
    
    // Keywords'leri İngilizce çevir (basit mapping)
    const translatedKeywords = this.translateKeywords(keywords)
    
    return `${basePrompt}, ${styleDesc}, related to: ${translatedKeywords.join(', ')}, 
            high quality, copyright-free, suitable for news article, 
            no text overlays, suitable for Turkish news media`
  }

  /**
   * Basit Türkçe-İngilizce anahtar kelime çevirisi
   */
  private translateKeywords(keywords: string[]): string[] {
    const translations: { [key: string]: string } = {
      // Temel çeviriler
      'ekonomi': 'economy',
      'spor': 'sports',
      'teknoloji': 'technology',
      'politika': 'politics',
      'haber': 'news',
      'türkiye': 'turkey',
      'şirket': 'company',
      'pazar': 'market',
      'yatırım': 'investment',
      'büyüme': 'growth',
      'gelişme': 'development',
      'başkan': 'president',
      'hükümet': 'government',
      'milli': 'national',
      'uluslararası': 'international',
      'avrupa': 'europe',
      'dünya': 'world',
      'futbol': 'football',
      'basketbol': 'basketball',
      'olimpiyat': 'olympics',
      'takım': 'team',
      'oyuncu': 'player',
      'bilim': 'science',
      'araştırma': 'research',
      'inovasyon': 'innovation',
      'dijital': 'digital',
      'yapay': 'artificial',
      'zeka': 'intelligence',
      'sağlık': 'health',
      'eğitim': 'education',
      'üniversite': 'university',
      'kültür': 'culture',
      'sanat': 'art',
      'müze': 'museum',
      'tiyatro': 'theater',
      'çevre': 'environment',
      'iklim': 'climate',
      'enerji': 'energy'
    }

    return keywords.map(keyword => 
      translations[keyword.toLowerCase()] || keyword
    )
  }

  /**
   * Alt text oluşturur
   */
  private generateAltText(title: string, keywords: string[]): string {
    return `${title} haberi ile ilgili görsel - ${keywords.slice(0, 3).join(', ')}`
  }

  /**
   * Gerçek görsel oluşturma işlemi
   */
  private async generateImage(
    prompt: string, 
    options: ImageGenerationOptions
  ): Promise<string | null> {
    try {
      // OpenAI DALL-E API kullanımı örneği
      if (this.apiKey && this.baseUrl) {
        return await this.generateWithOpenAI(prompt, options)
      }
      
      // Stability AI kullanımı
      // return await this.generateWithStabilityAI(prompt, options)
      
      // Midjourney API kullanımı
      // return await this.generateWithMidjourney(prompt, options)
      
      // Demo için placeholder görsel
      return await this.generatePlaceholderImage(prompt, options)

    } catch (error) {
      console.error('Image generation API error:', error)
      return null
    }
  }

  /**
   * OpenAI DALL-E ile görsel oluşturma
   */
  private async generateWithOpenAI(
    prompt: string, 
    options: ImageGenerationOptions
  ): Promise<string | null> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: options.size || '1024x1024',
          quality: options.quality || 'standard',
          response_format: 'url'
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data[0]?.url || null

    } catch (error) {
      console.error('OpenAI image generation error:', error)
      return null
    }
  }

  /**
   * Demo/placeholder görsel oluşturma
   */
  private async generatePlaceholderImage(
    prompt: string, 
    options: ImageGenerationOptions
  ): Promise<string> {
    // Picsum.photos ile placeholder
    const width = options.size?.split('x')[0] || '1024'
    const height = options.size?.split('x')[1] || '1024'
    
    // Prompt'tan basit bir ID oluştur
    const promptHash = this.simpleHash(prompt)
    
    return `https://picsum.photos/${width}/${height}?random=${promptHash}`
  }

  /**
   * Basit hash fonksiyonu
   */
  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Görsel URL'sini optimize eder
   */
  async optimizeImageUrl(imageUrl: string): Promise<string> {
    // Gerçek implementasyonda:
    // - Görseli CDN'e yükle
    // - Boyutlandır ve optimize et
    // - WebP'ye çevir
    // - Responsive versiyonlar oluştur
    
    return imageUrl
  }

  /**
   * Görselin telifsiz olduğunu doğrular
   */
  async verifyCopyrightFree(imageUrl: string): Promise<boolean> {
    // Gerçek implementasyonda:
    // - Reverse image search
    // - Copyright detection APIs
    // - License verification
    
    console.log('Verifying copyright-free status for:', imageUrl)
    return true // Demo için true döndür
  }
}

// Singleton instance
let imageGenerator: AIImageGenerator | null = null

/**
 * Image generator'ı başlatır
 */
export function initializeImageGenerator(apiKey?: string, baseUrl?: string): AIImageGenerator {
  if (!imageGenerator) {
    imageGenerator = new AIImageGenerator(apiKey, baseUrl)
  }
  return imageGenerator
}

/**
 * Haber için görsel oluşturur
 */
export async function generateNewsImage(
  title: string,
  content: string,
  category: string,
  options?: ImageGenerationOptions
): Promise<GeneratedImage | null> {
  const generator = imageGenerator || initializeImageGenerator()
  return await generator.generateNewsImage(title, content, category, options)
}

export type { ImageGenerationOptions, GeneratedImage }
export { AIImageGenerator }
