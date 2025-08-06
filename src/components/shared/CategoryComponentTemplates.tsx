// Template component creator for category components

import React from "react";

// Generic template for category summary cards
export function createSummaryCards(categoryName: string, cards: any[]) {
  return function SummaryCards() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {cards.map((card, i) => (
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
  };
}

// Generic template for category themes
export function createThemes(categoryName: string, themes: any[]) {
  return function Themes() {
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
  };
}

// Generic template for category KPI widgets
export function createKpiWidget(categoryName: string, kpis: any[]) {
  return function KpiWidget() {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow-xl px-6 py-5 border border-gray-100 dark:border-neutral-800 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
            tabIndex={0}
            aria-label={k.label}
          >
            <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
              {k.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{k.value}</span>
              <span className="text-base font-semibold text-gray-600 dark:text-gray-300">{k.label}</span>
              <span className="text-xs text-gray-400 dark:text-gray-400">{k.desc}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
}

// Generic AI Panel
export function createAiPanel(categoryName: string, placeholder: string) {
  return function AiPanel() {
    return (
      <div className="bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 p-6 md:p-8 flex flex-col h-full min-h-[480px] justify-center transition-all duration-300 backdrop-blur-lg">
        <div className="text-center">
          <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
            {categoryName} AI Asistanı
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {placeholder}
          </div>
        </div>
      </div>
    );
  };
}

// Generic Video Panel
export function createVideoPanel(categoryName: string) {
  return function VideoPanel() {
    return (
      <div className="bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow border border-gray-100 dark:border-neutral-800 p-6 flex flex-col gap-2 mb-0 w-full">
        <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">
          {categoryName} Video
        </div>
        <div
          className="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-lg bg-gray-100 dark:bg-[#20273b] flex justify-center items-center w-full"
          style={{ minHeight: 420, height: 460, maxHeight: 480 }}
        >
          <div className="w-full text-center text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center" style={{ minHeight: 420 }}>
            <div className="text-base font-semibold">Video içeriği henüz eklenmedi</div>
          </div>
        </div>
      </div>
    );
  };
}
