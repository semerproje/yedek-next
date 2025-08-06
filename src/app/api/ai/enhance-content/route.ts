import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json();

    // AI Content Enhancement Logic
    const enhanced = await enhanceContent(newsData);

    return NextResponse.json({
      success: true,
      enhanced
    });

  } catch (error) {
    console.error('AI enhancement error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function enhanceContent(originalNews: any) {
  const originalTitle = originalNews.title || '';
  const originalContent = originalNews.content || originalNews.brief || '';

  // Enhanced title generation
  const enhancedTitle = enhanceTitle(originalTitle);
  
  // Enhanced content generation
  const enhancedContent = enhanceContentText(originalContent);
  
  // Generate summary
  const summary = generateSummary(enhancedContent);
  
  // Extract tags
  const tags = extractTags(originalTitle + ' ' + originalContent);
  
  // SEO optimization
  const seoTitle = generateSEOTitle(enhancedTitle);
  const seoDescription = generateSEODescription(summary);
  
  // Calculate reading time
  const readingTime = calculateReadingTime(enhancedContent);

  return {
    title: enhancedTitle,
    content: enhancedContent,
    summary,
    tags,
    seoTitle,
    seoDescription,
    readingTime,
    aiEnhanced: true,
    enhancedAt: new Date().toISOString()
  };
}

function enhanceTitle(originalTitle: string): string {
  if (!originalTitle) return '';
  
  let enhanced = originalTitle.trim();
  
  // Add engaging elements if too plain
  if (enhanced.length < 50 && !enhanced.includes('?') && !enhanced.includes('!')) {
    enhanced = addTitleContext(enhanced);
  }
  
  return enhanced;
}

function addTitleContext(title: string): string {
  const contextPhrases = [
    'Son Dakika: ',
    'Gündem: ',
    'Önemli Gelişme: ',
    'Dikkat: ',
    'Açıklama: '
  ];
  
  if (title.includes('açıkla') || title.includes('bildir')) {
    return 'Açıklama: ' + title;
  }
  if (title.includes('son dakika') || title.includes('acil')) {
    return 'Son Dakika: ' + title;
  }
  
  return title;
}

function enhanceContentText(originalContent: string): string {
  if (!originalContent || originalContent.length < 50) return originalContent;
  
  let enhanced = originalContent.trim();
  
  // Add structure and readability improvements
  enhanced = improveContentStructure(enhanced);
  
  // Add connecting phrases
  enhanced = addTransitions(enhanced);
  
  return enhanced;
}

function improveContentStructure(content: string): string {
  const sentences = content.split('. ');
  if (sentences.length < 2) return content;
  
  let structured = '';
  sentences.forEach((sentence, index) => {
    structured += sentence;
    if (index < sentences.length - 1) {
      structured += '. ';
      if ((index + 1) % 3 === 0) {
        structured += '\n\n';
      }
    }
  });
  
  return structured;
}

function addTransitions(content: string): string {
  const transitions = [
    'Bu gelişme ile birlikte',
    'Öte yandan',
    'Ayrıca',
    'Bu durumda',
    'Bununla birlikte'
  ];
  
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

function generateSummary(content: string): string {
  if (!content || content.length < 100) return content;
  
  const sentences = content.split('. ');
  const summary = sentences.slice(0, Math.min(3, sentences.length)).join('. ');
  
  return summary + (summary.endsWith('.') ? '' : '.');
}

function extractTags(text: string): string[] {
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
  
  return [...new Set(foundTags)].slice(0, 8);
}

function generateSEOTitle(title: string): string {
  if (title.length <= 60) return title;
  return title.substring(0, 57) + '...';
}

function generateSEODescription(summary: string): string {
  if (summary.length <= 160) return summary;
  return summary.substring(0, 157) + '...';
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
