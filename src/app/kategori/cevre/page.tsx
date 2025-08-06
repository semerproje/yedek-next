import EnvironmentKpiWidget from '@/components/environment/EnvironmentKpiWidget';
import EnvironmentNewsGrid from '@/components/environment/EnvironmentNewsGrid';
import EnvironmentThemes from '@/components/environment/EnvironmentThemes';
import EnvironmentVideoPanel from '@/components/environment/EnvironmentVideoPanel';
import EnvironmentAiPanel from '@/components/environment/EnvironmentAiPanel';
import EnvironmentSummaryCards from '@/components/environment/EnvironmentSummaryCards';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çevre Platformu - Net Haberler",
  description:
    "Çevre ve doğa haberleri, iklim değişikliği, sürdürülebilirlik ve çevre koruma.",
  openGraph: {
    title: "Çevre Platformu - Net Haberler",
    description:
      "Çevre ve doğa haberleri, iklim değişikliği, sürdürülebilirlik ve çevre koruma.",
  },
};

export default function EnvironmentPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Çevre Platformu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Çevre ve doğa haberleri, iklim değişikliği, sürdürülebilirlik ve çevre koruma konularında güncel bilgiler
          </p>
        </div>

        {/* Environment Summary Cards */}
        <section className="mb-12">
          <EnvironmentSummaryCards />
        </section>

        {/* Environment Themes */}
        <section className="mb-12">
          <EnvironmentThemes />
        </section>

        {/* Environment KPI Widget */}
        <section className="mb-12">
          <EnvironmentKpiWidget />
        </section>

        {/* AI Panel and Video Panel Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="w-full">
            <EnvironmentAiPanel />
          </div>
          <div className="w-full">
            <EnvironmentVideoPanel />
          </div>
        </div>

        {/* Environment News Grid */}
        <section>
          <EnvironmentNewsGrid />
        </section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
