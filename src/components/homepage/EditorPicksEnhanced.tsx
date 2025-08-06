import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { EnhancedNewsService } from '@/hooks/useHomepageData'
import { DisplayNews } from '@/types/admin'

// Fallback data for development
const fallbackPicks = [
  {
    id: '1',
    title: "Editörden: 2025'e Damga Vuracak 5 Mega Trend",
    summary: "2025 yılında iş dünyasında yaşanacak en önemli değişimler",
    imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80",
    category: "analiz",
    author: "Editör",
    publishedAt: new Date(),
    views: 1250,
    featured: true,
    tags: ["trend", "2025", "analiz"],
    content: "",
    source: "",
    sourceUrl: ""
  },
  {
    id: '2',
    title: "B2B Ticarette Yükselen Sektörler",
    summary: "Dijital dönüşümle birlikte öne çıkan yeni iş fırsatları",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    category: "ekonomi",
    author: "Ekonomi Editörü",
    publishedAt: new Date(),
    views: 980,
    featured: true,
    tags: ["b2b", "ticaret", "sektör"],
    content: "",
    source: "",
    sourceUrl: ""
  },
  {
    id: '3',
    title: "Yatırımcıya: Dönüşen Gayrimenkul Piyasası",
    summary: "2025'te gayrimenkul yatırımcılarını bekleyen fırsatlar",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    category: "yatirim",
    author: "Yatırım Uzmanı",
    publishedAt: new Date(),
    views: 750,
    featured: true,
    tags: ["gayrimenkul", "yatırım", "piyasa"],
    content: "",
    source: "",
    sourceUrl: ""
  }
] as DisplayNews[]

function PickImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
      draggable={false}
    />
  );
}

export default function EditorPicksEnhanced() {
  const [picks, setPicks] = useState<DisplayNews[]>(fallbackPicks)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEditorPicks = async () => {
      try {
        const adminPicks = await EnhancedNewsService.getNewsWithFallback('editor-picks', fallbackPicks)
        setPicks(adminPicks.slice(0, 3)) // Ensure only 3 items
      } catch (error) {
        console.error('Error loading editor picks:', error)
        setPicks(fallbackPicks)
      } finally {
        setLoading(false)
      }
    }

    loadEditorPicks()
  }, [])

  if (loading) {
    return (
      <section className="w-full max-w-[1200px] mx-auto py-8">
        <div className="mb-4 flex items-center gap-2 font-bold text-xl text-gray-900">
          <Star className="w-5 h-5 text-yellow-500" />
          Editörün Seçimi
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto py-8">
      <div className="mb-4 flex items-center gap-2 font-bold text-xl text-gray-900">
        <Star className="w-5 h-5 text-yellow-500" />
        Editörün Seçimi
      </div>
      {/* Sadece 3 sütun! */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {picks.map(item => (
          <Link
            href={`/haber/${item.id}`}
            key={item.id}
            className="group bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition flex flex-col"
          >
            <div className="h-44 w-full overflow-hidden">
              <PickImage
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-semibold text-base group-hover:text-blue-600 line-clamp-2">
                  {item.title}
                </span>
                {item.summary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.summary}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-blue-600 font-medium uppercase">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">
                  {item.views.toLocaleString()} görüntülenme
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
