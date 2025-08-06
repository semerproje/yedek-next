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

// Mock haberler - Firebase bağlantısı yokken kullanılacak
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Gündem Haberi 1",
    summary: "Bu bir örnek gündem haberidir. Gerçek veriler Firebase'den gelecek.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    category: "gundem",
    pubDate: new Date(),
  },
  {
    id: "2", 
    title: "Gündem Haberi 2",
    summary: "İkinci örnek haber içeriği buraya gelecek.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    category: "gundem",
    pubDate: new Date(),
  },
  {
    id: "3",
    title: "Gündem Haberi 3", 
    summary: "Üçüncü örnek haber içeriği buraya gelecek.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    category: "gundem",
    pubDate: new Date(),
  },
];

export default function GundemNewsGrid() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!db) return;
      
      const q = query(
        collection(db, "news"),
        where("category", "==", "gundem"),
        orderBy("pubDate", "desc"),
        limit(12)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            // Firebase'de veri yoksa mock veriler kullan
            setNewsList(mockNews);
          } else {
            const news = snapshot.docs.map((doc) => ({ 
              id: doc.id, 
              ...doc.data() 
            } as NewsItem));
            setNewsList(news);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Firestore sorgu hatası:", err);
          // Hata durumunda mock veriler kullan
          setNewsList(mockNews);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase bağlantı hatası:", error);
      // Firebase bağlantı hatası durumunda mock veriler kullan
      setNewsList(mockNews);
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-600 dark:text-gray-300">
        Yükleniyor...
      </div>
    );

  return (
    <section className="container mx-auto px-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gündem Haberleri</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 pb-14">
        {newsList.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-[#232c3a] rounded-2xl shadow p-4 hover:shadow-xl transition border border-gray-100 dark:border-neutral-800"
          >
            <Link href={`/haber/${item.id}`}>
              <div className="relative w-full h-48 mb-3">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"}
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
              <div className="inline-block mt-3 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-semibold">
                Gündem
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
