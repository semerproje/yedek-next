import Link from "next/link";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='14'%3EGörsel Yükleniyor%3C/text%3E%3C/svg%3E";

function ReadImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
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

// Firestore entegrasyonu yerine mock veri
const mockItems = [
  {
    id: "w1",
    title: "Dijital Medya Okumaları: Güven ve Algı",
    summary: "Türkiye’de medya güveni ve okur algısı üzerine hafta sonu için derinlemesine bir analiz.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    to: "/haber/w1"
  },
  {
    id: "w2",
    title: "Ekonomi: Yeni Vergi Düzenlemeleri",
    summary: "Ekonomideki son gelişmeler ve yeni vergi düzenlemelerinin topluma etkileri.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    to: "/haber/w2"
  },
  {
    id: "w3",
    title: "Kültür Sanat: Yazın Yeni Sergileri",
    summary: "Türkiye ve dünyadan yeni sanat sergileri ve kültürel etkinlikler hafta sonu için öneriler.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    to: "/haber/w3"
  },
  {
    id: "w4",
    title: "Spor: Transfer Sezonu ve Gelişmeler",
    summary: "Futbol ve basketbol dünyasında transfer sezonunun öne çıkan gelişmeleri ve analizler.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    to: "/haber/w4"
  }
];

type WeekendReadsSectionProps = {
  label?: string;
};

export default function WeekendReadsSection({ label }: WeekendReadsSectionProps) {
  // Firestore entegrasyonu hazır olunca aşağıdaki state ve useEffect kullanılabilir
  // const [items, setItems] = useState<typeof mockItems>([]);
  // useEffect(() => { ...fetch logic... }, []);
  const items = mockItems;
  if (!items.length) return null;
  return (
    <section className="bg-gray-100 rounded-xl p-6 mb-4 shadow border max-w-[1530px] mx-auto">
      <h2 className="font-extrabold text-lg mb-5 text-gray-900 tracking-wide">
        {label || "Hafta Sonu Okumaları"}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <Link
            href={item.to}
            key={item.id}
            className="block rounded-lg bg-white hover:shadow-lg transition overflow-hidden group"
            aria-label={item.title}
          >
            <ReadImage
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
            <div className="p-4">
              <h3 className="text-base font-bold mb-2 text-gray-800 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">{item.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
