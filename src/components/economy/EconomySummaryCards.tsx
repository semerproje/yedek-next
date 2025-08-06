// src/components/economy/EconomySummaryCards.tsx
import React from "react";
import { TrendingUp, PieChart, Banknote, Building } from "lucide-react";

const summaryCards = [
  {
    icon: <TrendingUp className="w-7 h-7 text-green-600" />,
    title: "Borsa",
    desc: "BIST 100 ve global endeksler.",
    highlight: "Güncel veriler",
  },
  {
    icon: <Banknote className="w-7 h-7 text-blue-600" />,
    title: "Döviz",
    desc: "USD, EUR ve diğer kurlar.",
    highlight: "Canlı takip",
  },
  {
    icon: <PieChart className="w-7 h-7 text-yellow-600" />,
    title: "Enflasyon",
    desc: "TÜİK verileri ve analizler.",
    highlight: "Aylık rapor",
  },
  {
    icon: <Building className="w-7 h-7 text-purple-600" />,
    title: "Şirketler",
    desc: "Kurumsal haberler ve gelişmeler.",
    highlight: "5 yeni haber",
  },
];

export default function EconomySummaryCards() {
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
