interface AIEnhancedContent {
  title: string;
  originalTitle: string;
  content: string;
  originalContent: string;
  summary: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  category: string;
  readingTime: number;
}

class AIContentService {
  // Simulated AI enhancement - in production, integrate with OpenAI or similar
  async enhanceNewsContent(originalNews: any): Promise<AIEnhancedContent> {
    try {
      const originalTitle = originalNews.title || '';
      const originalContent = originalNews.content || originalNews.brief || '';
      const originalSummary = originalNews.summary || '';

      // Enhanced title generation
      const enhancedTitle = this.enhanceTitle(originalTitle);
      
      // Enhanced content generation
      const enhancedContent = this.enhanceContent(originalContent);
      
      // SUMMARY HANDLING: Orijinal summary varsa kullan, yoksa enhanced content'ten üret
      let finalSummary = '';
      if (originalSummary && originalSummary.length > 0 && originalSummary !== originalContent) {
        // Orijinal summary var ve content'ten farklı - kullan
        finalSummary = originalSummary;
        console.log('✅ AI: Orijinal summary kullanıldı');
      } else {
        // Orijinal summary yok veya content ile aynı - yeni üret
        finalSummary = this.generateSummary(enhancedContent);
        console.log('✅ AI: Yeni summary üretildi');
      }
      
      // Extract tags
      const tags = this.extractTags(originalTitle + ' ' + originalContent);
      
      // SEO optimization
      const seoTitle = this.generateSEOTitle(enhancedTitle);
      const seoDescription = this.generateSEODescription(finalSummary);
      
      // Calculate reading time
      const readingTime = this.calculateReadingTime(enhancedContent);

      console.log(`📊 AI Enhancement: Content=${enhancedContent.length}chars, Summary=${finalSummary.length}chars`);

      return {
        title: enhancedTitle,
        originalTitle,
        content: enhancedContent,
        originalContent,
        summary: finalSummary, // FIXED: Proper summary handling
        tags,
        seoTitle,
        seoDescription,
        category: originalNews.category || 'genel',
        readingTime
      };

    } catch (error) {
      console.error('AI Content Enhancement Error:', error);
      
      // Fallback to original content
      return {
        title: originalNews.title || '',
        originalTitle: originalNews.title || '',
        content: originalNews.content || originalNews.brief || '',
        originalContent: originalNews.content || originalNews.brief || '',
        summary: this.generateSummary(originalNews.content || originalNews.brief || ''),
        tags: this.extractTags(originalNews.title || ''),
        seoTitle: originalNews.title || '',
        seoDescription: this.generateSummary(originalNews.content || originalNews.brief || '').substring(0, 160),
        category: originalNews.category || 'genel',
        readingTime: this.calculateReadingTime(originalNews.content || originalNews.brief || '')
      };
    }
  }

  private enhanceTitle(originalTitle: string): string {
    if (!originalTitle) return '';
    
    // Remove extra spaces and format
    let enhanced = originalTitle.trim();
    
    // Add engaging elements if too plain
    if (enhanced.length < 50 && !enhanced.includes('?') && !enhanced.includes('!')) {
      // Add context or emphasis
      enhanced = this.addTitleContext(enhanced);
    }
    
    return enhanced;
  }

  private enhanceContent(originalContent: string): string {
    if (!originalContent || originalContent.length < 50) return originalContent;
    
    let enhanced = originalContent.trim();
    
    // Add structure and readability improvements
    enhanced = this.improveContentStructure(enhanced);
    
    // Add connecting phrases
    enhanced = this.addTransitions(enhanced);
    
    return enhanced;
  }

  private addTitleContext(title: string): string {
    const contextPhrases = [
      'Son Dakika: ',
      'Gündem: ',
      'Önemli Gelişme: ',
      'Dikkat: ',
      'Açıklama: '
    ];
    
    // Add context based on content type
    if (title.includes('açıkla') || title.includes('bildir')) {
      return 'Açıklama: ' + title;
    }
    if (title.includes('son dakika') || title.includes('acil')) {
      return 'Son Dakika: ' + title;
    }
    
    return title;
  }

  private improveContentStructure(content: string): string {
    const sentences = content.split('. ');
    if (sentences.length < 2) return content;
    
    // Add paragraph breaks for better readability
    let structured = '';
    sentences.forEach((sentence, index) => {
      structured += sentence;
      if (index < sentences.length - 1) {
        structured += '. ';
        // Add paragraph break every 2-3 sentences
        if ((index + 1) % 3 === 0) {
          structured += '\n\n';
        }
      }
    });
    
    return structured;
  }

  private addTransitions(content: string): string {
    const transitions = [
      'Bu gelişme ile birlikte',
      'Öte yandan',
      'Ayrıca',
      'Bu durumda',
      'Bununla birlikte'
    ];
    
    // Simple transition addition between paragraphs
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 1) {
      return paragraphs.map((para, index) => {
        if (index > 0 && index < paragraphs.length - 1 && Math.random() > 0.7) {
          const transition = transitions[Math.floor(Math.random() * transitions.length)];
          return transition + ', ' + para.toLowerCase();
        }
        return para;
      }).join('\n\n');
    }
    
    return content;
  }

  private generateSummary(content: string): string {
    if (!content || content.length < 50) return content;
    
    // ENHANCED SUMMARY: Sadece ilk cümle veya maksimum 150 karakter
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length === 0) {
      // Fallback: İlk 150 karakteri al
      return content.substring(0, 150).trim() + (content.length > 150 ? '...' : '');
    }
    
    // İlk cümleyi al, çok uzunsa kısalt
    let summary = sentences[0].trim();
    
    // Eğer ilk cümle çok kısaysa ikinci cümleyi de ekle
    if (summary.length < 80 && sentences.length > 1) {
      summary += '. ' + sentences[1].trim();
    }
    
    // Maksimum 180 karakter sınırı
    if (summary.length > 180) {
      summary = summary.substring(0, 170).trim() + '...';
    }
    
    // Nokta ile bitir
    if (!summary.endsWith('.') && !summary.endsWith('...')) {
      summary += '.';
    }
    
    return summary;
  }

  private extractTags(text: string): string[] {
    const commonTags = [
      'türkiye', 'ankara', 'istanbul', 'ekonomi', 'politika', 'spor', 
      'teknoloji', 'sağlık', 'eğitim', 'dünya', 'avrupa', 'amerika',
      'son dakika', 'gündem', 'haber', 'açıklama', 'gelişme'
    ];
    
    const textLower = text.toLowerCase();
    const foundTags = commonTags.filter(tag => textLower.includes(tag));
    
    // Add category-specific tags
    if (textLower.includes('seçim') || textLower.includes('parti')) {
      foundTags.push('seçim', 'politika');
    }
    if (textLower.includes('dolar') || textLower.includes('euro') || textLower.includes('borsa')) {
      foundTags.push('ekonomi', 'finans');
    }
    if (textLower.includes('maç') || textLower.includes('takım') || textLower.includes('futbol')) {
      foundTags.push('spor', 'futbol');
    }
    
    return [...new Set(foundTags)].slice(0, 8); // Max 8 tags
  }

  private generateSEOTitle(title: string): string {
    if (title.length <= 60) return title;
    
    // Truncate to optimal SEO length
    return title.substring(0, 57) + '...';
  }

  private generateSEODescription(summary: string): string {
    if (summary.length <= 160) return summary;
    
    // Truncate to optimal meta description length
    return summary.substring(0, 157) + '...';
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed in Turkish
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
}

export const aiContentService = new AIContentService();
