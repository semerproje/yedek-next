import PoliticsKpiWidget from '@/components/politics/PoliticsKpiWidget';
import PoliticsNewsGrid from '@/components/politics/PoliticsNewsGrid';
import PoliticsThemes from '@/components/politics/PoliticsThemes';
import PoliticsVideoPanel from '@/components/politics/PoliticsVideoPanel';
import PoliticsAiPanel from '@/components/politics/PoliticsAiPanel';
import PoliticsSummaryCards from '@/components/politics/PoliticsSummaryCards';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika Platformu - Net Haberler",
  description:
    "Politik haberler, seçimler, hükümet politikaları ve siyasi analiz.",
  openGraph: {
    title: "Politika Platformu - Net Haberler",
    description:
      "Politik haberler, seçimler, hükümet politikaları ve siyasi analiz.",
  },
};

export default function PoliticsPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Politika Platformu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Politik haberler, seçimler, hükümet politikaları ve siyasi analiz konularında güncel bilgiler
          </p>
        </div>

        {/* Politics Summary Cards */}
        <section className="mb-12">
          <PoliticsSummaryCards />
        </section>

        {/* Politics Themes */}
        <section className="mb-12">
          <PoliticsThemes />
        </section>

        {/* Politics KPI Widget */}
        <section className="mb-12">
          <PoliticsKpiWidget />
        </section>

        {/* AI Panel and Video Panel Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="w-full">
            <PoliticsAiPanel />
          </div>
          <div className="w-full">
            <PoliticsVideoPanel />
          </div>
        </div>

        {/* Politics News Grid */}
        <section>
          <PoliticsNewsGrid />
        </section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
