"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, query, getDocs, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  category: string;
  author: string;
  createdAt: Date;
  status: string;
}

function NewsImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='14'%3EGörsel Yükleniyor%3C/text%3E%3C/svg%3E";
  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={className + " bg-gray-100"}
      loading="lazy"
      draggable={false}
      style={{ userSelect: "none" }}
      onError={() => setError(true)}
    />
  );
}

// Fallback veri
const fallbackNews = [
  {
    id: "1",
    title: "Dijital Medya ve Okur Güveni",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    summary: "Türkiye'de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    meta: "1 saat önce",
    to: "/haber/1"
  }
];

// Mock veri, Firestore ile dinamik yapılabilir
const news = [
  {
    id: "1",
    title: "Dijital Medya ve Okur Güveni",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    summary: "Türkiye’de medya güveni neden düşüyor? Araştırma sonuçlarını ve çözüm önerilerini inceledik.",
    meta: "1 saat önce",
    to: "/haber/1"
  },
  {
    id: "2",
    title: "Kenya Sokaklarında Kanlı Protesto!",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    summary: "Kenya’da ekonomik kriz ve ifade özgürlüğü ihlalleri nedeniyle büyüyen protestoları derinlemesine analiz ettik.",
    meta: "2 saat önce",
    to: "/haber/2"
  },
  {
    id: "3",
    title: "Basında Dijitalleşme ve Son Trendler",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    summary: "Haber merkezlerinde dijital dönüşümün etkileri ve yeni yayıncılık araçları.",
    meta: "3 saat önce",
    to: "/haber/3"
  },
  {
    id: "4",
    title: "İzmir'de Makilik Alanda Yangın",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=700&q=80",
    summary: "İzmir'in Dikili ilçesinde çöplükte çıkan ve makilik alana sıçrayan yangına müdahale ediliyor...",
    meta: "4 saat önce",
    to: "/haber/4"
  },
  {
    id: "5",
    title: "Vergi Düzenlemeleri ve Son Gelişmeler",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80",
    summary: "Yeni vergi düzenlemeleri ve ekonomiye etkileri hakkında detaylı analiz.",
    meta: "5 saat önce",
    to: "/haber/5"
  },
  {
    id: "6",
    title: "Spor Gündemi: Transfer Sezonu",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Futbol ve basketbol dünyasında transfer sezonunun öne çıkan gelişmeleri.",
    meta: "6 saat önce",
    to: "/haber/6"
  },
  {
    id: "7",
    title: "Kültür Sanat: Yeni Sergiler",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Türkiye ve dünyadan yeni sanat sergileri ve kültürel etkinlikler.",
    meta: "7 saat önce",
    to: "/haber/7"
  },
  {
    id: "8",
    title: "Enerji Sektöründe Yenilikler",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    summary: "Enerji sektöründe son yenilikler ve sürdürülebilirlik çalışmaları.",
    meta: "8 saat önce",
    to: "/haber/8"
  }
];

export default function HeadlineNewsGrid() {
  if (news.length < 8) return null;
  return (
    <section className="w-full max-w-[1200px] mx-auto px-2 sm:px-0 mt-8">
      {/* Masaüstü GRID */}
      <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-6 auto-rows-fr">
        {/* Sol 3 kart */}
        {news.slice(0, 3).map((item, idx) => (
          <Link
            href={item.to}
            key={item.id}
            className="col-start-1 col-end-2 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
            style={{ gridRow: idx + 1 }}
          >
            <NewsImage src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h3>
              <p className="text-gray-700 text-[15px] leading-snug">{item.summary}</p>
              <span className="text-xs text-gray-400 mt-auto">{item.meta}</span>
            </div>
          </Link>
        ))}
        {/* Orta büyük manşet */}
        <Link
          href={news[3].to}
          className="col-start-2 col-end-3 row-start-1 row-end-3 bg-white shadow-lg rounded-lg border hover:shadow-xl transition flex flex-col"
        >
          <NewsImage src={news[3].image} alt={news[3].title} className="w-full h-56 object-cover" />
          <div className="px-5 pt-6 pb-3 flex-1 flex flex-col justify-start">
            <h2 className="text-[2.1rem] font-extrabold leading-tight mb-2 group-hover:underline">{news[3].title}</h2>
            <p className="text-gray-700 text-[1.07rem] leading-snug mb-2">
              İzmir'in Dikili ilçesinde çöplükte çıkan ve makilik alana sıçrayan yangına müdahale ediliyor.
              İsmetpaşa Mahallesi'nde bulunan çöplük alanda öğlen saatlerinde henüz bilinmeyen nedenle yangın çıktı.
              Yangın daha sonra çevredeki makilik alana sıçradı. Çevredekilerin ihbarı üzerine bölgeye İzmir Orman Bölge Müdürlüğüne ait helikopter ve arazöz ile Dikili Belediyesine ait itfaiye araçları sevk edildi.
              Ekipler, akşam saatlerine kadar havadan ve karadan müdahale etti. Kara ekipleri havanın kararmasıyla çalışmalarını yoğunlaştırdı.
            </p>
            <span className="text-xs text-gray-400">{news[3].meta}</span>
          </div>
        </Link>
        {/* Sağ 2 kart + altına vergi kartı */}
        {news.slice(5, 7).map((item, idx) => (
          <Link
            href={item.to}
            key={item.id}
            className="col-start-3 col-end-4 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
            style={{ gridRow: idx + 1 }}
          >
            <NewsImage src={item.image} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h3>
              <p className="text-gray-700 text-[15px] leading-snug">{item.summary}</p>
              <span className="text-xs text-gray-400 mt-auto">{item.meta}</span>
            </div>
          </Link>
        ))}
        {/* Sağ sütunun en altına: Vergi Düzenlemeleri */}
        <Link
          href={news[4].to}
          className="col-start-3 col-end-4 row-start-3 bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition flex flex-col"
        >
          <NewsImage src={news[4].image} alt={news[4].title} className="w-full h-40 object-cover" />
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-1 group-hover:underline">{news[4].title}</h3>
            <p className="text-gray-700 text-[15px] leading-snug">{news[4].summary}</p>
            <span className="text-xs text-gray-400 mt-auto">{news[4].meta}</span>
          </div>
        </Link>
        {/* Alt ortada geniş kart: Enerji (news[7]) */}
        <Link
          href={news[7].to}
          className="col-start-2 col-end-3 row-start-3 bg-white shadow-lg rounded-lg border hover:shadow-xl transition flex flex-col"
        >
          <NewsImage src={news[7].image} alt={news[7].title} className="w-full h-44 object-cover" />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-xl mb-1 group-hover:underline">{news[7].title}</h3>
            <p className="text-gray-700 text-[16px] leading-snug">{news[7].summary}</p>
            <span className="text-xs text-gray-400 mt-auto">{news[7].meta}</span>
          </div>
        </Link>
      </div>
      {/* Mobilde sıralı tek sütun */}
      <div className="md:hidden flex flex-col gap-6">
        {news.map(item =>
          item ? (
            <Link href={item.to} key={item.id} className="bg-white shadow rounded-lg border hover:shadow-lg transition overflow-hidden flex flex-col">
              <NewsImage src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 group-hover:underline">{item.title}</h3>
                <p className="text-gray-700 text-[15px] leading-snug">{item.summary}</p>
                <span className="text-xs text-gray-400 mt-auto">{item.meta}</span>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </section>
  );
}
