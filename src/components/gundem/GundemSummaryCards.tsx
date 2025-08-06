// src/components/gundem/GundemSummaryCards.tsx
import React from "react";
import { AlertTriangle, Flashlight, TrendingUp, Landmark } from "lucide-react";

const summaryCards = [
  {
    icon: <AlertTriangle className="w-7 h-7 text-rose-600" />,
    title: "Son Dakika",
    desc: "Gündemdeki en sıcak gelişmeleri anlık olarak takip edin.",
    highlight: "7 yeni haber",
  },
  {
    icon: <Flashlight className="w-7 h-7 text-blue-700" />,
    title: "Analiz",
    desc: "Uzman değerlendirmeleri ve derinlemesine analizler.",
    highlight: "4 yeni analiz",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-green-600" />,
    title: "Ekonomi & Siyaset",
    desc: "Piyasa ve politika alanında önemli başlıklar.",
    highlight: "5 önemli gelişme",
  },
  {
    icon: <Landmark className="w-7 h-7 text-gray-600" />,
    title: "Toplum",
    desc: "Sosyal yaşam, kültür ve güncel olaylar.",
    highlight: "3 başlık öne çıktı",
  },
];

export default function GundemSummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
      {summaryCards.map((card, i) => (
        <div
          key={i}
          tabIndex={0}
          aria-label={card.title}
          className="
            bg-white/90 dark:bg-[#232c3a]/90
            rounded-2xl shadow-md
            hover:shadow-2xl
            border border-gray-100 dark:border-neutral-800
            p-4 flex flex-col items-start
            transition-all duration-300
            group min-h-[120px] outline-none
            focus:ring-2 focus:ring-blue-300
          "
        >
          <div className="mb-1 group-hover:scale-110 transition-transform">{card.icon}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white">{card.title}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">{card.desc}</div>
          <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 mt-auto shadow-sm">
            {card.highlight}
          </div>
        </div>
      ))}
    </div>
  );
}
