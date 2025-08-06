// src/app/category/economy/page.tsx

import dynamic from "next/dynamic";
import EconomyHeader from "@/components/category/EconomyHeader";
import EconomyKpiBoard from "@/components/economy/EconomyKpiBoard";
import EconomyAiPanel from "@/components/economy/EconomyAiPanel";
import EconomyVideoPanel from "@/components/economy/EconomyVideoPanel";
import EconomyNewsGrid from "@/components/economy/EconomyNewsGrid";
import { Metadata } from "next";

// Placeholder components for missing modules
const EconomySummaryCards = () => (
  <div className="bg-yellow-50 text-yellow-900 rounded-xl p-6 text-center mb-4">
    EconomySummaryCards component is missing. Please implement.
  </div>
);
const EconomyThemes = () => (
  <div className="bg-blue-50 text-blue-900 rounded-xl p-6 text-center mb-4">
    EconomyThemes component is missing. Please implement.
  </div>
);

export const metadata: Metadata = {
  title: "Ekonomi Platformu - Net Haberler",
  description:
    "Ekonomi, finans, piyasalar, borsa ve iş dünyasına dair son dakika haberleri ve analizler Net Haberler'de.",
  openGraph: {
    title: "Ekonomi Platformu - Net Haberler",
    description:
      "Ekonomi, finans, piyasalar, borsa ve iş dünyasına dair son dakika haberleri ve analizler Net Haberler'de.",
  },
};

export default function EconomyCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f8fafd] via-[#e8eef2] to-[#fcfcff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] py-8 px-2 transition-colors duration-700">
      <EconomyHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        {/* Özet Kartlar */}
        <section className="mb-8">
          <EconomySummaryCards />
        </section>
        {/* Temalar */}
        <section className="mb-8">
          <EconomyThemes />
        </section>
        {/* KPI Panel */}
        <section className="mb-8">
          <EconomyKpiBoard />
        </section>
        {/* Yapay Zeka Paneli & Video Paneli */}
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0">
            <EconomyAiPanel />
          </div>
          <div className="flex-1 min-w-0">
            <EconomyVideoPanel />
          </div>
        </div>
        {/* Ekonomi Haber Grid'i */}
        <section>
          <EconomyNewsGrid />
        </section>
      </div>
    </div>
  );
}
