import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getNewsByModule } from "@/data/mockNewsData";

// Mock data'dan editör seçimlerini al
const editorPicksData = getNewsByModule('editorPicks');

interface PickItem {
  id: number;
  title: string;
  image: string;
  to: string;
}

const picks: PickItem[] = editorPicksData.length > 0 ? editorPicksData.map((news: any, index: number) => ({
  id: index + 1,
  title: news.title,
  image: news.images && news.images.length > 0 ? news.images[0].url : "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80",
  to: `/haber/${news.id}`
})) : [
  {
    id: 1,
    title: "Editörden: 2025'e Damga Vuracak 5 Mega Trend",
    image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80",
    to: "/editor/mega-trendler"
  },
  {
    id: 2,
    title: "B2B Ticarette Yükselen Sektörler",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    to: "/editor/b2b-ticaret-analiz"
  },
  {
    id: 3,
    title: "Yatırımcıya: Dönüşen Gayrimenkul Piyasası",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    to: "/editor/yatirimciya-gayrimenkul"
  }
];

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

export default function EditorPicks() {
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
            href={item.to as any}
            key={item.id}
            className="group bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition flex flex-col"
          >
            <div className="h-44 w-full overflow-hidden">
              <PickImage
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4 flex-1 flex items-center">
              <span className="font-semibold text-base group-hover:text-blue-600">{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
