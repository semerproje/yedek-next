/**
 * Image utility functions for handling image errors and fallbacks
 */

export interface ImageFallbackOptions {
  width?: number;
  height?: number;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Generate a placeholder image URL using a service like Picsum or create a data URL
 */
export function generatePlaceholderImage(options: ImageFallbackOptions = {}): string {
  const {
    width = 800,
    height = 600,
    text = 'Görsel Yükleniyor',
    backgroundColor = '#e5e7eb',
    textColor = '#6b7280'
  } = options;

  // Use Picsum as primary fallback (more reliable than broken Unsplash URLs)
  return `https://picsum.photos/${width}/${height}?blur=1&grayscale`;
}

/**
 * Generate a solid color placeholder as SVG data URL
 */
export function generateSvgPlaceholder(options: ImageFallbackOptions = {}): string {
  const {
    width = 800,
    height = 600,
    text = 'Görsel Bulunamadı',
    backgroundColor = '#f3f4f6',
    textColor = '#9ca3af'
  } = options;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
            fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Default fallback images for different categories
 */
export const DEFAULT_CATEGORY_IMAGES = {
  'genel': 'https://picsum.photos/800/600?seed=news',
  'politika': 'https://picsum.photos/800/600?seed=politics',
  'ekonomi': 'https://picsum.photos/800/600?seed=economy',
  'spor': 'https://picsum.photos/800/600?seed=sports',
  'teknoloji': 'https://picsum.photos/800/600?seed=technology',
  'saglik': 'https://picsum.photos/800/600?seed=health',
  'egitim': 'https://picsum.photos/800/600?seed=education',
  'kultur': 'https://picsum.photos/800/600?seed=culture',
  'sanat': 'https://picsum.photos/800/600?seed=art',
  'gundem': 'https://picsum.photos/800/600?seed=agenda',
  'dunya': 'https://picsum.photos/800/600?seed=world',
  'default': 'https://picsum.photos/800/600?seed=default'
} as const;

/**
 * Avatar placeholder images
 */
export const DEFAULT_AVATAR_IMAGES = [
  'https://ui-avatars.com/api/?name=U1&background=3b82f6&color=ffffff&size=150',
  'https://ui-avatars.com/api/?name=U2&background=06b6d4&color=ffffff&size=150',
  'https://ui-avatars.com/api/?name=U3&background=8b5cf6&color=ffffff&size=150',
  'https://ui-avatars.com/api/?name=U4&background=f59e0b&color=ffffff&size=150',
  'https://ui-avatars.com/api/?name=U5&background=ef4444&color=ffffff&size=150'
];

/**
 * Get a random avatar image
 */
export function getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATAR_IMAGES.length);
  return DEFAULT_AVATAR_IMAGES[randomIndex];
}

/**
 * Get fallback image for a category
 */
export function getCategoryFallbackImage(category: string = 'default'): string {
  return DEFAULT_CATEGORY_IMAGES[category as keyof typeof DEFAULT_CATEGORY_IMAGES] || 
         DEFAULT_CATEGORY_IMAGES.default;
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation failed:', url, error);
    return false;
  }
}

/**
 * Get a working image URL with fallback
 */
export async function getWorkingImageUrl(
  primaryUrl: string, 
  category: string = 'default',
  options: ImageFallbackOptions = {}
): Promise<string> {
  // First try the primary URL
  if (await validateImageUrl(primaryUrl)) {
    return primaryUrl;
  }
  
  // Try category fallback
  const categoryFallback = getCategoryFallbackImage(category);
  if (await validateImageUrl(categoryFallback)) {
    return categoryFallback;
  }
  
  // Return SVG placeholder as last resort
  return generateSvgPlaceholder(options);
}

/**
 * Extract category from news title or content for better image selection
 */
export function extractCategoryFromText(text: string): string {
  const keywords = {
    'politika': ['politika', 'seçim', 'hükümet', 'parti', 'milletvekili', 'başkan'],
    'ekonomi': ['ekonomi', 'borsa', 'dolar', 'euro', 'enflasyon', 'bütçe', 'vergi'],
    'spor': ['spor', 'futbol', 'basketbol', 'maç', 'takım', 'şampiyonluk'],
    'teknoloji': ['teknoloji', 'internet', 'bilgisayar', 'telefon', 'yapay zeka', 'yazılım'],
    'saglik': ['sağlık', 'hastane', 'doktor', 'ilaç', 'tedavi', 'aşı'],
    'egitim': ['eğitim', 'okul', 'üniversite', 'öğretmen', 'öğrenci', 'sınav'],
    'kultur': ['kültür', 'müze', 'sanat', 'kitap', 'yazar', 'edebiyat'],
    'dunya': ['dünya', 'amerika', 'avrupa', 'çin', 'rusya', 'uluslararası']
  };

  const lowerText = text.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerText.includes(word))) {
      return category;
    }
  }
  
  return 'genel';
}
