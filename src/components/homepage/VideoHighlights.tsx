import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const videoData = [
  {
    id: 1,
    title: "Deprem Bölgesinden İlk Görüntüler",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=700&q=80",
    duration: "2:07",
    to: "/video/deprem-goruntuler"
  },
  {
    id: 2,
    title: "Online Sağlıkta Son Gelişmeler",
    image: "https://images.unsplash.com/photo-1519494080410-f9aa8f52f176?auto=format&fit=crop&w=700&q=80",
    duration: "1:32",
    to: "/video/online-saglik"
  },
  {
    id: 3,
    title: "Ekonomide Hafta Özeti",
    image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=700&q=80",
    duration: "1:54",
    to: "/video/ekonomi-hafta-ozeti"
  },
  {
    id: 4,
    title: "İklim Krizi: Gençlerin Protestosu",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=700&q=80",
    duration: "1:41",
    to: "/video/iklim-protestosu"
  },
  {
    id: 5,
    title: "Çiftçide Dönüşüm: Dijital Tarım",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80",
    duration: "2:16",
    to: "/video/dijital-tarim"
  },
  {
    id: 6,
    title: "Yapay Zeka: Geleceğin Meslekleri",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=700&q=80",
    duration: "2:03",
    to: "/video/yapay-zeka-meslekler"
  },
  {
    id: 7,
    title: "Küresel Ticarettin Yeni Rotası",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=700&q=80",
    duration: "1:58",
    to: "/video/kuresel-ticaret"
  },
  {
    id: 8,
    title: "Büyük Şehirlerde Ulaşım ve Yenilikler",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80",
    duration: "1:44",
    to: "/video/ulasim-yenilikler"
  }
];

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='14'%3EVideo Yükleniyor%3C/text%3E%3C/svg%3E";

function VideoImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? FALLBACK_IMAGE : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
      draggable={false}
    />
  );
}

export default function VideoHighlights() {
  return (
    <section className="w-full max-w-[1200px] mx-auto my-10">
      <div className="flex items-center gap-2 mb-3">
        <PlayCircle className="text-indigo-700 w-7 h-7" />
        <span className="font-bold text-xl text-gray-900">
          Kısa Video / Öne Çıkanlar
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {videoData.map(v => (
          <Link
            href={v.to}
            key={v.id}
            className="group block rounded-lg overflow-hidden shadow bg-white hover:shadow-xl transition relative"
            style={{ minHeight: 260 }}
          >
            <div className="relative h-40 w-full">
              <VideoImage
                src={v.image}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              {/* Play Icon */}
              <span className="absolute left-2 bottom-2 bg-white/90 rounded-full p-1 shadow">
                <PlayCircle className="w-7 h-7 text-indigo-600" />
              </span>
              {/* Duration */}
              <span className="absolute right-2 bottom-2 bg-black/80 text-white text-xs rounded px-2 py-0.5 select-none">
                {v.duration}
              </span>
            </div>
            <div className="px-3 py-2 text-base font-semibold group-hover:text-indigo-700 transition min-h-[56px]">
              {v.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
