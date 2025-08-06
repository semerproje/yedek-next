// Ultra Premium Gemini AI Service - Advanced SEO & Content Enhancement
// Complete professional AI integration for news content optimization

import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { environmentConfig } from '@/lib/config/environmentConfig';

interface AIEnhancementResult {
  success: boolean;
  originalContent: string;
  enhancedContent: string;
  seoOptimizedTitle: string;
  seoDescription: string;
  metaKeywords: string[];
  socialMediaTitle: string;
  socialMediaDescription: string;
  hashtagSuggestions: string[];
  readabilityScore: number;
  sentimentAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotionalTone: string;
  };
  contentStructure: {
    headings: string[];
    bulletPoints: string[];
    callToAction?: string;
  };
  googleNewsOptimization: {
    headline: string;
    snippet: string;
    structuredData: any;
  };
  performanceMetrics: {
    originalWordCount: number;
    enhancedWordCount: number;
    readingTime: number;
    improvementScore: number;
  };
}

interface AIContentStrategy {
  targetAudience: string;
  contentGoal: 'inform' | 'engage' | 'convert' | 'viral';
  toneOfVoice: 'professional' | 'casual' | 'authoritative' | 'friendly';
  seoFocus: 'local' | 'national' | 'international';
  contentLength: 'short' | 'medium' | 'long';
}

interface AITestResult {
  success: boolean;
  model?: string;
  response_time?: number;
  test_response?: string;
  message?: string;
}

// Legacy interfaces for backward compatibility
type GeminiTestResult = AITestResult
export interface GeminiEnhanceResult {
  success: boolean;
  enhanced_content?: string;
  summary?: string;
  keywords?: string[];
  seo_title?: string;
  seo_description?: string;
  error?: string;
}

class UltraPremiumGeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    const apiKey = environmentConfig.geminiApiKey;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, 
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          }
        ]
      });
    } else {
      console.warn('⚠️ Gemini API key not found in environment variables');
    }
  }

  async testConnection(): Promise<AITestResult> {
    if (!this.model) {
      return {
        success: false,
        message: 'Gemini API not configured. Please set GEMINI_API_KEY environment variable.'
      };
    }

    const startTime = Date.now();
    
    try {
      console.log('🔄 Testing Gemini AI connection...');
      
      const testPrompt = `Bu bir bağlantı testidir. Kısa ve güzel bir yanıt ver.`;
      
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      const text = response.text();
      
      const responseTime = Date.now() - startTime;
      
      console.log('✅ Gemini AI connection test successful');
      
      return {
        success: true,
        model: 'gemini-1.5-pro',
        response_time: responseTime,
        test_response: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('❌ Gemini AI connection test failed:', error);
      
      return {
        success: false,
        response_time: responseTime,
        message: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  async enhanceNewsContent(
    originalContent: string, 
    title: string, 
    category: string,
    strategy: AIContentStrategy = {
      targetAudience: 'genel',
      contentGoal: 'inform',
      toneOfVoice: 'professional',
      seoFocus: 'national',
      contentLength: 'medium'
    }
  ): Promise<AIEnhancementResult> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    console.log('🤖 Enhancing news content with AI...');
    
    try {
      const enhancementPrompt = this.buildEnhancementPrompt(originalContent, title, category, strategy);
      
      const result = await this.model.generateContent(enhancementPrompt);
      const response = await result.response;
      const enhancedData = this.parseAIResponse(response.text());

      // Generate additional optimizations
      const seoOptimizations = await this.generateSEOOptimizations(enhancedData.content, title, category);
      const googleNewsOpt = await this.generateGoogleNewsOptimization(enhancedData.content, title, category);
      const sentimentAnalysis = await this.analyzeSentiment(enhancedData.content);

      const result_data: AIEnhancementResult = {
        success: true,
        originalContent,
        enhancedContent: enhancedData.content,
        seoOptimizedTitle: seoOptimizations.title,
        seoDescription: seoOptimizations.description,
        metaKeywords: seoOptimizations.keywords,
        socialMediaTitle: seoOptimizations.socialTitle,
        socialMediaDescription: seoOptimizations.socialDescription,
        hashtagSuggestions: seoOptimizations.hashtags,
        readabilityScore: this.calculateReadabilityScore(enhancedData.content),
        sentimentAnalysis,
        contentStructure: {
          headings: enhancedData.headings || [],
          bulletPoints: enhancedData.bulletPoints || [],
          callToAction: enhancedData.callToAction
        },
        googleNewsOptimization: googleNewsOpt,
        performanceMetrics: {
          originalWordCount: this.countWords(originalContent),
          enhancedWordCount: this.countWords(enhancedData.content),
          readingTime: Math.ceil(this.countWords(enhancedData.content) / 200),
          improvementScore: this.calculateImprovementScore(originalContent, enhancedData.content)
        }
      };

      console.log('✅ AI content enhancement completed successfully');
      return result_data;

    } catch (error) {
      console.error('❌ AI enhancement error:', error);
      
      return {
        success: false,
        originalContent,
        enhancedContent: originalContent,
        seoOptimizedTitle: title,
        seoDescription: originalContent.substring(0, 160),
        metaKeywords: [],
        socialMediaTitle: title,
        socialMediaDescription: originalContent.substring(0, 100),
        hashtagSuggestions: [],
        readabilityScore: 50,
        sentimentAnalysis: { sentiment: 'neutral', confidence: 0, emotionalTone: 'neutral' },
        contentStructure: { headings: [], bulletPoints: [] },
        googleNewsOptimization: { headline: title, snippet: '', structuredData: {} },
        performanceMetrics: { originalWordCount: 0, enhancedWordCount: 0, readingTime: 0, improvementScore: 0 }
      };
    }
  }

  private buildEnhancementPrompt(content: string, title: string, category: string, strategy: AIContentStrategy): string {
    return `
Sen profesyonel bir haber editörü ve SEO uzmanısın. Aşağıdaki AA haber içeriğini tamamen özgün, SEO uyumlu ve Google News optimizasyonlu hale getir.

**ORİJİNAL HABER:**
Başlık: ${title}
Kategori: ${category}
İçerik: ${content}

**HEDEF STRATEJİ:**
- Hedef Kitle: ${strategy.targetAudience}
- İçerik Hedefi: ${strategy.contentGoal}
- Üslup: ${strategy.toneOfVoice}
- SEO Odak: ${strategy.seoFocus}
- İçerik Uzunluğu: ${strategy.contentLength}

**GÖREVLER:**

1. **İÇERİK YENİDEN YAZIMI:**
   - Tamamen özgün, yaratıcı yeniden yazım
   - Anahtar bilgileri koruyarak daha akıcı hale getir
   - Okuyucu ilgisini artıracak anlatım
   - ${strategy.contentLength === 'long' ? '1000+' : strategy.contentLength === 'medium' ? '500-800' : '300-500'} kelime hedefi

2. **SEO OPTİMİZASYONU:**
   - Google News uyumlu başlık (60 karakter)
   - Meta açıklama (155 karakter)
   - İçerikte doğal anahtar kelime kullanımı
   - Alt başlıklar (H2, H3) önerisi

3. **SOSYAL MEDYA OPTİMİZASYONU:**
   - Facebook/Twitter uyumlu başlık
   - Sosyal medya açıklaması
   - 5-10 hashtag önerisi

4. **YAPISAL İYİLEŞTİRME:**
   - Giriş-gelişme-sonuç yapısı
   - Madde işaretli önemli noktalar
   - Call-to-action önerisi

**YANIT FORMATI (JSON benzeri):**
\`\`\`
ENHANCED_CONTENT: [Tamamen yeniden yazılmış özgün içerik]
SEO_TITLE: [60 karakter SEO başlık]
SEO_DESCRIPTION: [155 karakter meta açıklama]
SOCIAL_TITLE: [Sosyal medya başlığı]
SOCIAL_DESCRIPTION: [Sosyal medya açıklaması]
KEYWORDS: [kelime1, kelime2, kelime3, kelime4, kelime5]
HASHTAGS: [#hashtag1, #hashtag2, #hashtag3, #hashtag4, #hashtag5]
HEADINGS: [Alt Başlık 1, Alt Başlık 2, Alt Başlık 3]
BULLET_POINTS: [Önemli nokta 1, Önemli nokta 2, Önemli nokta 3]
CALL_TO_ACTION: [Okuyucu eylem çağrısı]
\`\`\`

**DİKKAT EDİLECEKLER:**
- Hiçbir durumda kopyala-yapıştır yapmayın
- Tamamen özgün içerik üretin
- Faktual bilgileri koruyun ama ifadeyi değiştirin
- Türkçe dil kurallarına uygun yazın
- SEO ve okunabilirlik dengesini sağlayın
- Google News editorial guidelines'a uygun olun

Lütfen belirtilen formatta yanıtlayın:
`;
  }

  private parseAIResponse(aiResponse: string): any {
    try {
      // Extract structured data from AI response
      const extractValue = (key: string): string | string[] => {
        const regex = new RegExp(`${key}:\\s*\\[(.*?)\\]`, 's');
        const match = aiResponse.match(regex);
        
        if (match) {
          const content = match[1].trim();
          if (key === 'KEYWORDS' || key === 'HASHTAGS' || key === 'HEADINGS' || key === 'BULLET_POINTS') {
            return content.split(',').map(item => item.trim().replace(/["\[\]]/g, ''));
          }
          return content.replace(/["\[\]]/g, '');
        }
        
        const simpleRegex = new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 's');
        const simpleMatch = aiResponse.match(simpleRegex);
        
        if (simpleMatch) {
          const content = simpleMatch[1].trim().replace(/["\[\]]/g, '');
          if (key === 'KEYWORDS' || key === 'HASHTAGS' || key === 'HEADINGS' || key === 'BULLET_POINTS') {
            return content.split(',').map(item => item.trim());
          }
          return content;
        }
        
        return '';
      };

      return {
        content: extractValue('ENHANCED_CONTENT') as string,
        seoTitle: extractValue('SEO_TITLE') as string,
        seoDescription: extractValue('SEO_DESCRIPTION') as string,
        socialTitle: extractValue('SOCIAL_TITLE') as string,
        socialDescription: extractValue('SOCIAL_DESCRIPTION') as string,
        keywords: extractValue('KEYWORDS') as string[],
        hashtags: extractValue('HASHTAGS') as string[],
        headings: extractValue('HEADINGS') as string[],
        bulletPoints: extractValue('BULLET_POINTS') as string[],
        callToAction: extractValue('CALL_TO_ACTION') as string
      };

    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      return {
        content: aiResponse,
        seoTitle: '',
        seoDescription: '',
        socialTitle: '',
        socialDescription: '',
        keywords: [],
        hashtags: [],
        headings: [],
        bulletPoints: [],
        callToAction: ''
      };
    }
  }

  private async generateSEOOptimizations(content: string, title: string, category: string): Promise<any> {
    if (!this.model) throw new Error('Gemini AI not configured');

    try {
      const seoPrompt = `
İçerik: ${content.substring(0, 1000)}
Başlık: ${title}
Kategori: ${category}

Bu haber için profesyonel SEO optimizasyonu yap:

1. Google'da üst sıralarda çıkacak SEO başlık (60 karakter)
2. Google arama sonuçlarında görünecek meta açıklama (155 karakter)
3. Bu konuyla ilgili en çok aranan 10 anahtar kelime
4. Sosyal medya paylaşımı için çekici başlık
5. Sosyal medya açıklaması (100 karakter)
6. Trending hashtag'ler (10 adet)

JSON formatında yanıtla:
{
  "title": "SEO başlık",
  "description": "Meta açıklama",
  "keywords": ["kelime1", "kelime2", ...],
  "socialTitle": "Sosyal medya başlığı",
  "socialDescription": "Sosyal medya açıklaması",
  "hashtags": ["#tag1", "#tag2", ...]
}
`;

      const result = await this.model.generateContent(seoPrompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        // Fallback parsing
        return {
          title: title,
          description: content.substring(0, 155),
          keywords: this.extractKeywords(content),
          socialTitle: title,
          socialDescription: content.substring(0, 100),
          hashtags: [`#${category}`, '#haber', '#gündem']
        };
      }

    } catch (error) {
      console.error('❌ SEO optimization error:', error);
      return {
        title: title,
        description: content.substring(0, 155),
        keywords: [],
        socialTitle: title,
        socialDescription: content.substring(0, 100),
        hashtags: []
      };
    }
  }

  private async generateGoogleNewsOptimization(content: string, title: string, category: string): Promise<any> {
    try {
      // Generate Google News compliant headline
      const headline = title.length > 100 ? title.substring(0, 97) + '...' : title;
      
      // Generate snippet for Google News
      const snippet = content.substring(0, 160);
      
      // Generate structured data for Google News
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": headline,
        "description": snippet,
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Anadolu Ajansı"
        },
        "publisher": {
          "@type": "Organization",
          "name": "News Platform",
          "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://example.com/news/" + this.generateSlug(title)
        },
        "articleSection": category,
        "keywords": this.extractKeywords(content).join(', ')
      };

      return {
        headline,
        snippet,
        structuredData
      };

    } catch (error) {
      console.error('❌ Google News optimization error:', error);
      return {
        headline: title,
        snippet: content.substring(0, 160),
        structuredData: {}
      };
    }
  }

  private async analyzeSentiment(content: string): Promise<any> {
    if (!this.model) {
      return { sentiment: 'neutral', confidence: 0, emotionalTone: 'neutral' };
    }

    try {
      const sentimentPrompt = `
Aşağıdaki haber içeriğinin duygu analizi:

"${content.substring(0, 500)}"

JSON formatında yanıtla:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.0-1.0,
  "emotionalTone": "duygusal ton açıklaması"
}
`;

      const result = await this.model.generateContent(sentimentPrompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        return { sentiment: 'neutral', confidence: 0.5, emotionalTone: 'nötr' };
      }

    } catch (error) {
      console.error('❌ Sentiment analysis error:', error);
      return { sentiment: 'neutral', confidence: 0, emotionalTone: 'neutral' };
    }
  }

  private extractKeywords(content: string): string[] {
    // Simple keyword extraction
    const words = content.toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞIÖÇ]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞIÖÇ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .substring(0, 50);
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private calculateReadabilityScore(content: string): number {
    const words = this.countWords(content);
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simple readability calculation
    let score = 100;
    if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;
    
    // Check for complex words
    const complexWords = content.split(/\s+/).filter(word => word.length > 8).length;
    const complexityRatio = complexWords / words;
    score -= complexityRatio * 50;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private calculateImprovementScore(original: string, enhanced: string): number {
    const originalWords = this.countWords(original);
    const enhancedWords = this.countWords(enhanced);
    const originalReadability = this.calculateReadabilityScore(original);
    const enhancedReadability = this.calculateReadabilityScore(enhanced);
    
    let score = 0;
    
    // Length improvement
    if (enhancedWords > originalWords * 1.2) score += 20;
    else if (enhancedWords > originalWords) score += 10;
    
    // Readability improvement
    if (enhancedReadability > originalReadability + 10) score += 30;
    else if (enhancedReadability > originalReadability) score += 15;
    
    // Structure improvement (simple check)
    if (enhanced.includes('\n\n') && !original.includes('\n\n')) score += 20;
    
    // SEO elements (headings, lists)
    if (enhanced.toLowerCase().includes('##') || enhanced.includes('- ')) score += 15;
    
    // Engagement elements
    if (enhanced.includes('?') && !original.includes('?')) score += 10;
    
    return Math.min(100, score);
  }

  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    if (!this.model) {
      return content.substring(0, maxLength);
    }

    try {
      const summaryPrompt = `
Bu haber içeriğinin ${maxLength} karakter özeti:

"${content}"

Önemli bilgileri koruyan, akıcı bir özet yaz.
`;

      const result = await this.model.generateContent(summaryPrompt);
      const response = await result.response;
      
      return response.text().substring(0, maxLength);

    } catch (error) {
      console.error('❌ Summary generation error:', error);
      return content.substring(0, maxLength);
    }
  }

  async generateTags(content: string, category: string): Promise<string[]> {
    if (!this.model) {
      return [category, 'haber'];
    }

    try {
      const tagsPrompt = `
Bu haber için 8-10 etiket üret:

İçerik: "${content.substring(0, 500)}"
Kategori: ${category}

Etiketler virgülle ayrılmış olarak:
`;

      const result = await this.model.generateContent(tagsPrompt);
      const response = await result.response;
      
      return response.text()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 2)
        .slice(0, 10);

    } catch (error) {
      console.error('❌ Tag generation error:', error);
      return [category, 'haber', 'gündem'];
    }
  }

  // Legacy method for backward compatibility
  async enhanceContent(content: string, title: string = '', category: string = ''): Promise<GeminiEnhanceResult> {
    try {
      const enhancement = await this.enhanceNewsContent(content, title, category);
      
      return {
        success: true,
        enhanced_content: enhancement.enhancedContent,
        summary: enhancement.googleNewsOptimization.snippet,
        keywords: enhancement.metaKeywords,
        seo_title: enhancement.seoOptimizedTitle,
        seo_description: enhancement.seoDescription
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enhancement failed'
      };
    }
  }
}

export const geminiService = new UltraPremiumGeminiService();
export default geminiService;
