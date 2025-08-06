// src/components/world/WorldSummaryCards.tsx
import React from "react";
import { Globe, TrendingUp, Users, Zap } from "lucide-react";

const summaryCards = [
  {
    icon: <Globe className="w-7 h-7 text-blue-600" />,
    title: "Dünya Haberleri",
    desc: "Uluslararası gelişmeler ve önemli olaylar.",
    highlight: "12 yeni haber",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-green-600" />,
    title: "Ekonomi",
    desc: "Global piyasalar ve ekonomik göstergeler.",
    highlight: "8 analiz",
  },
  {
    icon: <Users className="w-7 h-7 text-purple-600" />,
    title: "Diplomasi",
    desc: "Uluslararası ilişkiler ve anlaşmalar.",
    highlight: "6 gelişme",
  },
  {
    icon: <Zap className="w-7 h-7 text-orange-600" />,
    title: "Krizler",
    desc: "Acil durumlar ve kritik gelişmeler.",
    highlight: "3 son dakika",
  },
];

export default function WorldSummaryCards() {
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
