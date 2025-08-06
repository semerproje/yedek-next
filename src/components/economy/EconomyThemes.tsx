import React from "react";
import { TrendingUp, PieChart, Building, Banknote, CreditCard, Globe } from "lucide-react";

const themes = [
  { icon: <TrendingUp className="w-5 h-5 text-green-500" />, name: "Borsa" },
  { icon: <Banknote className="w-5 h-5 text-blue-500" />, name: "Döviz" },
  { icon: <PieChart className="w-5 h-5 text-yellow-500" />, name: "Enflasyon" },
  { icon: <Building className="w-5 h-5 text-purple-500" />, name: "Şirketler" },
  { icon: <CreditCard className="w-5 h-5 text-red-500" />, name: "Bankacılık" },
  { icon: <Globe className="w-5 h-5 text-indigo-500" />, name: "Global Piyasalar" },
];

export default function EconomyThemes() {
  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {themes.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition select-none cursor-pointer"
        >
          {t.icon}
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  );
}
