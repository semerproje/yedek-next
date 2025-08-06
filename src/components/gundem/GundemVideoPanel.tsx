"use client";

import React, { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface VideoData {
  title?: string;
  youtubeId?: string;
  summary?: string;
  publishedAt?: any;
}

export default function GundemVideoPanel() {
  const [video, setVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    try {
      if (!db) return;
      
      const q = query(
        collection(db, "gundemVideos"),
        orderBy("publishedAt", "desc"),
        limit(1)
      );
      const unsub = onSnapshot(q, 
        snap => {
          if (!snap.empty) setVideo(snap.docs[0].data() as VideoData);
        },
        error => {
          console.error("Video verisi alınırken hata:", error);
        }
      );
      return () => unsub();
    } catch (error) {
      console.error("Firebase video bağlantı hatası:", error);
    }
  }, []);

  return (
    <div className="bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow border border-gray-100 dark:border-neutral-800 p-6 flex flex-col gap-2 mb-0 w-full">
      <div className="flex items-center gap-2 mb-3">
        <PlayCircle className="w-7 h-7 text-rose-600" />
        <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          {video?.title || "Gündem Video: Haftanın Özeti"}
        </span>
      </div>
      <div
        className="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-lg bg-gray-100 dark:bg-[#20273b] flex justify-center items-center w-full"
        style={{ minHeight: 420, height: 460, maxHeight: 480 }}
      >
        {video?.youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title || "Gündem Analiz Video"}
            allowFullScreen
            className="w-full h-full"
            style={{ minHeight: 420, height: 460 }}
            loading="lazy"
          />
        ) : (
          <div className="w-full text-center text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center" style={{ minHeight: 420 }}>
            <PlayCircle className="w-12 h-12 mb-2" />
            <div className="text-base font-semibold">Video içeriği henüz eklenmedi</div>
          </div>
        )}
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-3">
        {video?.summary || "Uzmanlardan haftanın gündem değerlendirmesi ve analiz videosu."}
      </div>
    </div>
  );
}
