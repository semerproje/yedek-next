$categories = @(
    @{name="world"; displayName="Dünya"; color="blue"},
    @{name="technology"; displayName="Teknoloji"; color="green"},
    @{name="economy"; displayName="Ekonomi"; color="yellow"},
    @{name="sport"; displayName="Spor"; color="orange"},
    @{name="health"; displayName="Sağlık"; color="teal"},
    @{name="culture"; displayName="Kültür"; color="purple"},
    @{name="magazine"; displayName="Magazin"; color="pink"},
    @{name="environment"; displayName="Çevre"; color="emerald"},
    @{name="politics"; displayName="Politika"; color="indigo"},
    @{name="education"; displayName="Eğitim"; color="cyan"},
    @{name="religion"; displayName="Din"; color="amber"}
)

# Create NewsGrid components for all categories
foreach ($cat in $categories) {
    $content = @"
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.target as HTMLImageElement;
  target.src = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";
}

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  category: string;
  pubDate: any;
}

export default function $($cat.displayName)NewsGrid() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "news"),
      where("category", "==", "$($cat.name)"),
      orderBy("pubDate", "desc"),
      limit(12)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const news = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        } as NewsItem));
        setNewsList(news);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore sorgu hatası:", err);
        setError("Veriler alınırken bir hata oluştu.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-600 dark:text-gray-300">
        Yükleniyor...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-lg text-red-600">
        {error}
      </div>
    );

  if (!newsList.length)
    return (
      <div className="text-center py-10 text-lg text-gray-600 dark:text-gray-300">
        $($cat.displayName) kategorisinde haber bulunamadı.
      </div>
    );

  return (
    <section className="container mx-auto px-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">$($cat.displayName) Haberleri</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-14">
        {newsList.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-[#232c3a] rounded-2xl shadow p-4 hover:shadow-xl transition border border-gray-100 dark:border-neutral-800"
          >
            <Link href={`/haber/`${item.id}`}>
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl"
                  onError={handleImageError}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                {item.summary || "Özet bilgisi yok."}
              </p>
              <div className="inline-block mt-3 px-2 py-1 bg-$($cat.color)-100 dark:bg-$($cat.color)-900/30 text-$($cat.color)-700 dark:text-$($cat.color)-300 rounded text-xs font-semibold">
                $($cat.displayName)
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
"@

    $fileName = "c:\dev\net1\netnext\src\components\$($cat.name)\$($cat.displayName)NewsGrid.tsx"
    New-Item -Path (Split-Path $fileName) -ItemType Directory -Force | Out-Null
    Set-Content -Path $fileName -Value $content -Encoding UTF8
    Write-Host "Created: $fileName"
}
