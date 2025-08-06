import Link from "next/link";
import { getNewsByModule } from "@/data/mockNewsData";

// Mock data'dan popüler haberleri al
const popularNewsData = getNewsByModule('popularNews');

interface MostReadItem {
  id: number;
  title: string;
  to: string;
  views: number;
}

const mostRead: MostReadItem[] = popularNewsData.length > 0 ? popularNewsData.map((news: any, index: number) => ({
  id: index + 1,
  title: news.title,
  to: `/haber/${news.id}`,
  views: news.views,
})) : [
  {
    id: 1,
    title: "Yapay Zeka ile Güçlenen Haber Platformu Yayında!",
    to: "/haber/net-haberler-ai-platform",
    views: 12500,
  },
  {
    id: 2,
    title: "Türkiye'nin En Büyük Kiralama İhalesi Tamamlandı",
    to: "/haber/en-buyuk-kiralama-ihalesi",
    views: 10310,
  },
  {
    id: 3,
    title: "Ekonomide Yeni Dönem: Uzman Yorumları",
    to: "/haber/ekonomide-yeni-donem",
    views: 9930,
  },
  {
    id: 4,
    title: "Yazılım Sektöründe Büyük Satın Alma",
    to: "/haber/yazilim-sektorunde-satin-alma",
    views: 8230,
  },
  {
    id: 5,
    title: "Küresel Gündem ve Sıcak Başlıklar",
    to: "/haber/kuresel-gundem",
    views: 7990,
  }
];

function formatViews(num: number) {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
}

export default function PopularNewsSidebar() {
  return (
    <aside className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 flex flex-col sticky top-28 mb-10 overflow-hidden">
      <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 text-lg tracking-tight bg-gradient-to-r from-white/70 to-gray-50">
        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2 align-middle animate-pulse" />
        En Çok Okunanlar
      </div>
      <ul>
        {mostRead.map((item: MostReadItem, i: number) => (
          <li
            key={item.id}
            className="flex items-center group border-b last:border-b-0 border-gray-50"
          >
            <span
              className={`ml-3 text-base font-bold w-6 flex-shrink-0 text-gray-300 group-hover:text-orange-500 transition-colors select-none`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {i + 1 < 10 ? `0${i + 1}` : i + 1}
            </span>
            <Link
              href={item.to as any}
              className="block flex-1 px-3 py-4 text-gray-800 font-medium text-sm leading-snug transition group-hover:text-orange-600 group-hover:pl-5 duration-200 focus:outline-none"
              style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
              title={item.title}
              tabIndex={0}
            >
              {item.title}
            </Link>
            <span
              className="mr-4 text-xs text-gray-400 font-medium px-2 py-1 rounded bg-gray-50 group-hover:bg-orange-50/80 transition select-none"
              aria-label="Okunma"
            >
              {formatViews(item.views)}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
