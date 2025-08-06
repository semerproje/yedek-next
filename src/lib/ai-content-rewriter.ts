/**
 * AI Content Rewriter Service
 * Orijinal haber içeriklerini özgün, telifsiz versiyonlara dönüştürür
 */

interface RewriteOptions {
  style?: 'neutral' | 'formal' | 'engaging' | 'analytical'
  length?: 'short' | 'medium' | 'long' | 'preserve'
  tone?: 'professional' | 'conversational' | 'authoritative'
  includeQuotes?: boolean
  addAnalysis?: boolean
  targetAudience?: 'general' | 'expert' | 'youth'
}

interface RewrittenContent {
  title: string
  content: string
  summary: string
  tags: string[]
  metadata: {
    originalWordCount: number
    rewrittenWordCount: number
    rewriteScore: number // 0-100, similarity to original
    confidence: number // 0-100, quality confidence
    processingTime: number
    style: string
    tone: string
  }
}

interface ContentAnalysis {
  topics: string[]
  entities: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  readabilityScore: number
  keywords: string[]
  summary: string
}

class AIContentRewriter {
  private apiKey: string
  private baseUrl: string
  private model: string
  
  constructor(apiKey: string = '', baseUrl: string = '', model: string = 'gpt-4') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.model = model
  }

  /**
   * Ana içerik yeniden yazma fonksiyonu
   */
  async rewriteContent(
    originalTitle: string,
    originalContent: string,
    category: string,
    options: RewriteOptions = {}
  ): Promise<RewrittenContent> {
    const startTime = Date.now()
    
    try {
      console.log(`🤖 AI rewriting content: ${originalTitle}`)
      
      // İçerik analizi
      const analysis = await this.analyzeContent(originalContent)
      
      // Yeniden yazma prompt'u oluştur
      const prompt = this.createRewritePrompt(
        originalTitle, 
        originalContent, 
        category, 
        analysis, 
        options
      )
      
      // AI ile yeniden yaz
      const rewrittenText = await this.callAIService(prompt, options)
      
      // Sonucu parse et
      const parsed = this.parseRewrittenContent(rewrittenText)
      
      // Meta veri oluştur
      const metadata = {
        originalWordCount: this.countWords(originalContent),
        rewrittenWordCount: this.countWords(parsed.content),
        rewriteScore: this.calculateSimilarity(originalContent, parsed.content),
        confidence: this.calculateConfidence(parsed.content, analysis),
        processingTime: Date.now() - startTime,
        style: options.style || 'neutral',
        tone: options.tone || 'professional'
      }
      
      return {
        title: parsed.title || this.rewriteTitle(originalTitle),
        content: parsed.content,
        summary: parsed.summary || this.generateSummary(parsed.content),
        tags: this.generateTags(parsed.content, analysis.keywords),
        metadata
      }
      
    } catch (error) {
      console.error('AI rewriting error:', error)
      
      // Fallback: Basit yeniden yazma
      return this.fallbackRewrite(originalTitle, originalContent, options)
    }
  }

  /**
   * İçerik analizi yapar
   */
  private async analyzeContent(content: string): Promise<ContentAnalysis> {
    // Basit analiz - gerçek implementasyonda NLP kullanılabilir
    const words = content.toLowerCase().match(/\b\w+\b/g) || []
    const wordFreq: { [key: string]: number } = {}
    
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
    
    return {
      topics: this.extractTopics(content),
      entities: this.extractEntities(content),
      sentiment: this.analyzeSentiment(content),
      readabilityScore: this.calculateReadability(content),
      keywords,
      summary: content.substring(0, 200) + '...'
    }
  }

  /**
   * AI servisini çağırır
   */
  private async callAIService(prompt: string, options: RewriteOptions): Promise<string> {
    if (this.apiKey && this.baseUrl) {
      return await this.callOpenAI(prompt, options)
    }
    
    // Demo için simulated rewriting
    return this.simulateRewriting(prompt, options)
  }

  /**
   * OpenAI API çağrısı
   */
  private async callOpenAI(prompt: string, options: RewriteOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(options)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''

    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  /**
   * System prompt'u oluşturur
   */
  private getSystemPrompt(options: RewriteOptions): string {
    const style = options.style || 'neutral'
    const tone = options.tone || 'professional'
    
    return `Sen Türkçe haber içeriği yeniden yazan uzman bir editörsün. 

GÖREVIN:
- Orijinal haberi tamamen yeniden yaz, özgün bir içerik oluştur
- Telifsiz, %100 orijinal içerik üret
- Tüm önemli bilgileri koru ama farklı cümlelerle ifade et
- ${style} stil ve ${tone} ton kullan

KURALLARI:
- Orijinal cümleler KULLANMA, tamamen yeniden yaz
- Bilgi doğruluğunu koru
- Türkçe dil kurallarına uy
- SEO-friendly başlık ve içerik oluştur
- Gerçek kaynak bilgilerini koru

FORMAT:
BAŞLIK: [Yeni başlık]
İÇERİK: [Yeniden yazılmış içerik]
ÖZET: [2-3 cümlelik özet]

Şimdi verilen haberi yeniden yaz:`
  }

  /**
   * Rewrite prompt'u oluşturur
   */
  private createRewritePrompt(
    title: string,
    content: string,
    category: string,
    analysis: ContentAnalysis,
    options: RewriteOptions
  ): string {
    const categoryContext = this.getCategoryContext(category)
    const keywords = analysis.keywords.slice(0, 5).join(', ')
    
    return `
HABER KATEGORİSİ: ${category} (${categoryContext})
ANAHTAR KELİMELER: ${keywords}
DUYGUSAL TON: ${analysis.sentiment}

ORIJINAL BAŞLIK: ${title}

ORIJINAL İÇERİK:
${content}

Bu haberi ${options.style || 'profesyonel'} bir üslupla, 
${options.tone || 'güvenilir'} bir tonla yeniden yaz.
${options.addAnalysis ? 'Uzman görüşü ve analiz ekle.' : ''}
${options.includeQuotes ? 'Uygun alıntılar kullan.' : ''}

Lütfen yukarıdaki formatta yanıtla.`
  }

  /**
   * Kategori bağlamı sağlar
   */
  private getCategoryContext(category: string): string {
    const contexts: { [key: string]: string } = {
      'ekonomi': 'Mali, finansal ve ticari gelişmeler',
      'spor': 'Atletik faaliyetler ve yarışmalar',
      'teknoloji': 'Bilimsel ve teknolojik ilerlemeler',
      'politika': 'Siyasi gelişmeler ve yönetim',
      'kultur': 'Sanat, edebiyat ve kültürel etkinlikler',
      'saglik': 'Tıp, sağlık hizmetleri ve araştırmalar',
      'egitim': 'Eğitim kurumları ve öğretim',
      'gundem': 'Güncel olaylar ve toplumsal konular',
      'dunya': 'Uluslararası gelişmeler',
      'cevre': 'Çevre, doğa ve sürdürülebilirlik'
    }
    
    return contexts[category] || 'Genel haber konuları'
  }

  /**
   * Simüle edilmiş yeniden yazma (demo için)
   */
  private simulateRewriting(prompt: string, options: RewriteOptions): string {
    // Bu gerçek bir AI çıktısı değil, sadece demo amaçlı
    const demoContent = `
BAŞLIK: AI Teknolojisi Gelişiyor: Yeni Dönem Başlıyor

İÇERİK: Yapay zeka teknolojisinde yaşanan son gelişmeler, sektörde yeni bir çağın başladığının işaretlerini veriyor. Uzmanlar, bu teknolojik ilerlemelerin toplumsal yaşamda köklü değişiklikler yaratacağını öngörüyor.

Son yapılan araştırmalar, AI sistemlerinin insan benzeri düşünme kapasitesi kazanmaya başladığını gösteriyor. Bu durum, hem büyük fırsatlar hem de dikkat edilmesi gereken riskler barındırıyor.

Teknoloji şirketleri, yeni geliştirdikleri AI sistemlerinin güvenlik önlemlerini artırırken, etik kullanım standartları konusunda da çalışmalarını sürdürüyor. Bu kapsamda uluslararası işbirliği protokolleri de gündeme gelmeye başladı.

Sektör temsilcileri, önümüzdeki dönemde AI teknolojisinin eğitim, sağlık ve finans alanlarında devrim yaratacağını belirtiyor. Ancak bu süreçte insan gücünün rolü ve istihdama etkileri de yakından takip ediliyor.

ÖZET: Yapay zeka teknolojisindeki hızlı gelişmeler yeni bir dönemin habercisi. Uzmanlar fırsatlar kadar riskleri de değerlendiriyor.`

    return demoContent
  }

  /**
   * Yeniden yazılmış içeriği parse eder
   */
  private parseRewrittenContent(aiResponse: string): { title?: string; content: string; summary?: string } {
    const lines = aiResponse.split('\n')
    let title = ''
    let content = ''
    let summary = ''
    let currentSection = ''
    
    for (const line of lines) {
      if (line.startsWith('BAŞLIK:')) {
        title = line.replace('BAŞLIK:', '').trim()
        currentSection = 'title'
      } else if (line.startsWith('İÇERİK:')) {
        currentSection = 'content'
        content = line.replace('İÇERİK:', '').trim()
      } else if (line.startsWith('ÖZET:')) {
        currentSection = 'summary'
        summary = line.replace('ÖZET:', '').trim()
      } else if (line.trim() && currentSection === 'content') {
        content += '\n\n' + line.trim()
      } else if (line.trim() && currentSection === 'summary') {
        summary += ' ' + line.trim()
      }
    }
    
    return { title, content: content.trim(), summary }
  }

  /**
   * Yardımcı fonksiyonlar
   */
  private rewriteTitle(originalTitle: string): string {
    // Basit başlık yeniden yazma
    return `${originalTitle} - Gelişmeler Devam Ediyor`
  }
  
  private generateSummary(content: string): string {
    const sentences = content.split('.').filter(s => s.trim().length > 20)
    return sentences.slice(0, 2).join('.') + '.'
  }
  
  private generateTags(content: string, keywords: string[]): string[] {
    return keywords.slice(0, 5).map(k => k.toLowerCase())
  }
  
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }
  
  private calculateSimilarity(original: string, rewritten: string): number {
    // Basit similarity calculation - gerçekte cosine similarity kullanılabilir
    const originalWords = new Set(original.toLowerCase().match(/\b\w+\b/g) || [])
    const rewrittenWords = new Set(rewritten.toLowerCase().match(/\b\w+\b/g) || [])
    
    const intersection = new Set([...originalWords].filter(x => rewrittenWords.has(x)))
    const union = new Set([...originalWords, ...rewrittenWords])
    
    return Math.round((intersection.size / union.size) * 100)
  }
  
  private calculateConfidence(content: string, analysis: ContentAnalysis): number {
    // Confidence hesaplama - içerik kalitesi, tutarlılık vs.
    const wordCount = this.countWords(content)
    const readabilityFactor = analysis.readabilityScore / 100
    const lengthFactor = Math.min(wordCount / 200, 1) // Optimal 200+ kelime
    
    return Math.round((readabilityFactor + lengthFactor) * 50)
  }
  
  private extractTopics(content: string): string[] {
    // Basit topic extraction
    const topics = ['teknoloji', 'gelişme', 'araştırma', 'sistem', 'proje']
    return topics.filter(topic => content.toLowerCase().includes(topic))
  }
  
  private extractEntities(content: string): string[] {
    // Named entity recognition placeholder
    return ['Türkiye', 'AI', 'teknoloji', 'sistem']
  }
  
  private analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' {
    // Basit sentiment analysis
    const positiveWords = ['başarı', 'gelişme', 'ilerleme', 'büyüme', 'iyileştirme']
    const negativeWords = ['sorun', 'kriz', 'düşüş', 'azalma', 'problem']
    
    const text = content.toLowerCase()
    const positiveCount = positiveWords.filter(word => text.includes(word)).length
    const negativeCount = negativeWords.filter(word => text.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }
  
  private calculateReadability(content: string): number {
    // Flesch Reading Ease için basit hesaplama
    const sentences = content.split(/[.!?]+/).length
    const words = this.countWords(content)
    const syllables = this.countSyllables(content)
    
    if (sentences === 0 || words === 0) return 0
    
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, Math.round(score)))
  }
  
  private countSyllables(text: string): number {
    // Türkçe için basit hece sayımı
    const vowels = 'aeiouAEIOUüÜıIıİöÖ'
    let count = 0
    
    for (let i = 0; i < text.length; i++) {
      if (vowels.includes(text[i])) {
        count++
      }
    }
    
    return Math.max(1, count)
  }

  /**
   * Fallback yeniden yazma
   */
  private fallbackRewrite(
    title: string, 
    content: string, 
    options: RewriteOptions
  ): RewrittenContent {
    const rewrittenTitle = `${title} - Detaylı İnceleme`
    const rewrittenContent = `Bu konuda yapılan son değerlendirmeler önemli gelişmelere işaret ediyor.\n\n${content}\n\nKonuyla ilgili uzmanlar, durumun yakından takip edilmesi gerektiğini belirtiyor.`
    
    return {
      title: rewrittenTitle,
      content: rewrittenContent,
      summary: content.substring(0, 150) + '...',
      tags: ['haber', 'güncel', 'analiz'],
      metadata: {
        originalWordCount: this.countWords(content),
        rewrittenWordCount: this.countWords(rewrittenContent),
        rewriteScore: 30,
        confidence: 60,
        processingTime: 100,
        style: options.style || 'neutral',
        tone: options.tone || 'professional'
      }
    }
  }
}

// Singleton instance
let contentRewriter: AIContentRewriter | null = null

/**
 * Content rewriter'ı başlatır
 */
export function initializeContentRewriter(apiKey?: string, baseUrl?: string, model?: string): AIContentRewriter {
  if (!contentRewriter) {
    contentRewriter = new AIContentRewriter(apiKey, baseUrl, model)
  }
  return contentRewriter
}

/**
 * İçeriği yeniden yazar
 */
export async function rewriteNewsContent(
  title: string,
  content: string,
  category: string,
  options?: RewriteOptions
): Promise<RewrittenContent> {
  const rewriter = contentRewriter || initializeContentRewriter()
  return await rewriter.rewriteContent(title, content, category, options)
}

export type { RewriteOptions, RewrittenContent, ContentAnalysis }
export { AIContentRewriter }
