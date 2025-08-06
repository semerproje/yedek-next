import WebsiteLayout from "@/components/layout/WebsiteLayout";
import EconomyPlatformHeader from "@/components/category/EconomyPlatformHeader";
import EconomySummaryCards from "@/components/economy/EconomySummaryCards";
import EconomyThemes from "@/components/economy/EconomyThemes";
import EconomyKpiWidget from "@/components/economy/EconomyKpiWidget";
import EconomyAiPanel from "@/components/economy/EconomyAiPanel";
import EconomyVideoPanel from "@/components/economy/EconomyVideoPanel";
import EconomyNewsGrid from "@/components/economy/EconomyNewsGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekonomi Platformu - Net Haberler",
  description:
    "Ekonomi haberleri, borsa analizi, döviz kurları ve finans dünyasından gelişmeler.",
  openGraph: {
    title: "Ekonomi Platformu - Net Haberler",
    description:
      "Ekonomi haberleri, borsa analizi, döviz kurları ve finans dünyasından gelişmeler.",
  },
};

export default function EconomyPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
        <EconomyPlatformHeader />
        
        <div className="container mx-auto px-4 py-8">
        {/* KPI Widget */}
        <EconomyKpiWidget />

        {/* Summary Cards */}
        <EconomySummaryCards />

        {/* Ana İçerik Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sol Kolon - Haberler (3/4) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Ekonomi Temaları */}
            <section>
              <EconomyThemes />
            </section>

            {/* Haberler Grid */}
            <section>
              <EconomyNewsGrid />
            </section>

            {/* AI Panel */}
            <section>
              <EconomyAiPanel />
            </section>
          </div>

          {/* Sağ Kolon - Video Panel (1/4) */}
          <div className="lg:col-span-1">
            <EconomyVideoPanel />
          </div>
        </div>

        {/* Alt Bölüm - İstatistikler */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Ekonomi Özellikleri</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700">Gerçek zamanlı BIST 100 verileri</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">USD/TL döviz kuru takibi</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-gray-700">Enflasyon ve faiz oranları</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-gray-700">8 kategorize edilmiş tema</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Ekonomi İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Günlük Haber Sayısı</span>
                <span className="font-semibold">847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aktif Kategoriler</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Görüntüleme</span>
                <span className="font-semibold">25.8K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Video İçerikleri</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </WebsiteLayout>
  );
}
