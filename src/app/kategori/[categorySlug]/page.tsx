import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/category/CategoryPage';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

// Kategori bilgileri
const categoryInfo = {
  'gundem': {
    title: 'Gündem Haberleri',
    description: 'Son dakika gündem haberleri ve gelişmeler'
  },
  'spor': {
    title: 'Spor Haberleri',
    description: 'Futbol, basketbol ve diğer spor dalları haberleri'
  },
  'ekonomi': {
    title: 'Ekonomi Haberleri',
    description: 'Ekonomi, finans ve borsa haberleri'
  },
  'teknoloji': {
    title: 'Teknoloji Haberleri',
    description: 'Teknoloji, bilim ve yenilik haberleri'
  },
  'saglik': {
    title: 'Sağlık Haberleri',
    description: 'Sağlık, tıp ve yaşam haberleri'
  },
  'politika': {
    title: 'Politika Haberleri',
    description: 'Siyaset ve politika haberleri'
  },
  'kultur': {
    title: 'Kültür Haberleri',
    description: 'Kültür, sanat ve edebiyat haberleri'
  },
  'magazin': {
    title: 'Magazin Haberleri',
    description: 'Magazin, şov dünyası ve ünlü haberleri'
  },
  'egitim': {
    title: 'Eğitim Haberleri',
    description: 'Eğitim sistemi ve öğrenci haberleri'
  },
  'cevre': {
    title: 'Çevre Haberleri',
    description: 'Çevre, doğa ve iklim haberleri'
  },
  'dunya': {
    title: 'Dünya Haberleri',
    description: 'Uluslararası haberler ve gelişmeler'
  },
  'din': {
    title: 'Din Haberleri',
    description: 'Din, inanç ve maneviyat haberleri'
  }
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = params;
  const info = categoryInfo[categorySlug as keyof typeof categoryInfo];
  
  if (!info) {
    return {
      title: 'Kategori Bulunamadı - NetNext',
      description: 'Aradığınız kategori sayfası bulunamadı.'
    };
  }

  return {
    title: `${info.title} - NetNext`,
    description: info.description,
    keywords: `${categorySlug}, haber, güncel, ${info.title.toLowerCase()}`,
    openGraph: {
      title: `${info.title} - NetNext`,
      description: info.description,
      type: 'website',
      url: `https://netnext.com.tr/kategori/${categorySlug}`
    }
  };
}

export default function DynamicCategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = params;
  const info = categoryInfo[categorySlug as keyof typeof categoryInfo];
  
  if (!info) {
    notFound();
  }

  return (
    <CategoryPage
      categorySlug={categorySlug}
      title={info.title}
      description={info.description}
    />
  );
}

// Statik sayfa oluşturma için kategorileri belirt
export async function generateStaticParams() {
  return Object.keys(categoryInfo).map((slug) => ({
    categorySlug: slug,
  }));
}
