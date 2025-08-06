import WebsiteLayout from "@/components/layout/WebsiteLayout";
import SportPlatformHeader from "@/components/category/SportPlatformHeader";
import SportSummaryCardsNew from '../../../components/sport/SportSummaryCardsNew';
import SportThemesNew from '../../../components/sport/SportThemesNew';
import SportKpiWidget from '../../../components/sport/SportKpiWidget';
import SportAiPanelNew from '../../../components/sport/SportAiPanelNew';
import SportVideoPanelNew from '../../../components/sport/SportVideoPanelNew';
import SportNewsGridNew from '../../../components/sport/SportNewsGridNew';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spor Platformu - Net Haberler",
  description:
    "Spor dünyasından son dakika haberleri, maç sonuçları, transfer haberleri ve spor analizleri.",
  openGraph: {
    title: "Spor Platformu - Net Haberler",
    description:
      "Spor dünyasından son dakika haberleri, maç sonuçları, transfer haberleri ve spor analizleri.",
  },
};

export default function SportPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
        <SportPlatformHeader />
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
          <section className="mb-8"><SportSummaryCardsNew /></section>
          <section className="mb-8"><SportThemesNew /></section>
          <section className="mb-8"><SportKpiWidget /></section>
          <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
            <div className="flex-1 min-w-0"><SportAiPanelNew /></div>
            <div className="flex-1 min-w-0"><SportVideoPanelNew /></div>
          </div>
          <section><SportNewsGridNew /></section>
        </div>
      </div>
    </WebsiteLayout>
  );
}
