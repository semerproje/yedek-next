import { TrendingUp, PieChart, Banknote, CreditCard } from "lucide-react";
import React from "react";

const kpiWidgets = [
  {
    icon: <TrendingUp className="w-8 h-8 text-green-600 drop-shadow" />,
    label: "Borsa Endeksi",
    value: "11.450,25",
    desc: "BIST 100 (Kapanış)",
  },
  {
    icon: <Banknote className="w-8 h-8 text-blue-700 drop-shadow" />,
    label: "Dolar Kuru",
    value: "33,15 TL",
    desc: "USD/TRY (Güncel)",
  },
  {
    icon: <PieChart className="w-8 h-8 text-yellow-500 drop-shadow" />,
    label: "Enflasyon",
    value: "%73,6",
    desc: "TÜİK (Yıllık)",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-purple-600 drop-shadow" />,
    label: "Tahvil Faizi",
    value: "%38,90",
    desc: "2Y Gösterge",
  },
];

export default function EconomyKpiBoard() {
  return (
    <section className="container mx-auto px-2 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {kpiWidgets.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white rounded-2xl shadow-xl px-6 py-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 dark:bg-[#232c3a]/90 dark:border-[#2a3142] group"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-gray-50 dark:from-[#2d3750] dark:to-[#232c3a]">
              {w.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{w.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{w.label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-400">{w.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
