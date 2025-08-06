import WorldPlatformHeader from "@/components/category/WorldPlatformHeader";
import WorldKpiWidget from "../../../components/world/WorldKpiWidget";
import WorldNewsGridNew from "../../../components/world/WorldNewsGridNew";
import WorldThemesNew from "../../../components/world/WorldThemesNew";
import WorldVideoPanelNew from "../../../components/world/WorldVideoPanelNew";
import WorldSummaryCardsNew from "../../../components/world/WorldSummaryCardsNew";
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dünya Platformu - Net Haberler",
  description:
    "Dünya genelinden sıcak gelişmeler, analizler ve öne çıkan başlıklar Net Haberler Dünya Platformu'nda.",
  openGraph: {
    title: "Dünya Platformu - Net Haberler",
    description:
      "Dünya genelinden sıcak gelişmeler, analizler ve öne çıkan başlıklar Net Haberler Dünya Platformu'nda.",
  },
};

export default function WorldPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <WorldPlatformHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* KPI Widget */}
        <WorldKpiWidget />

        {/* Summary Cards */}
        <WorldSummaryCardsNew />

        {/* Ana İçerik Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sol Kolon - Haberler (3/4) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Dünya Temaları */}
            <section>
              <WorldThemesNew />
            </section>

            {/* Haberler Grid */}
            <section>
              <WorldNewsGridNew />
            </section>
          </div>

          {/* Sağ Kolon - Video Panel (1/4) */}
          <div className="lg:col-span-1">
            <WorldVideoPanelNew />
          </div>
        </div>

        {/* Alt Bölüm - İstatistikler */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Dünya Özellikleri</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700">Gerçek zamanlı küresel olaylar</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">47 ülkeden haber takibi</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-gray-700">Diplomatik gelişmeler</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-gray-700">8 kategorize edilmiş tema</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Dünya İstatistikleri</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Günlük Haber Sayısı</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aktif Kriz Alanları</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diplomatik Toplantılar</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Video İçerikleri</span>
                <span className="font-semibold">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </WebsiteLayout>
  );
}
