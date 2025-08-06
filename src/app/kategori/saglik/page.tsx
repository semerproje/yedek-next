import HealthPlatformHeader from "@/components/category/HealthPlatformHeader";
import HealthKpiWidget from '@/components/health/HealthKpiWidget';
import HealthNewsGrid from '@/components/health/HealthNewsGrid';
import HealthThemes from '@/components/health/HealthThemes';
import HealthVideoPanel from '@/components/health/HealthVideoPanel';
import HealthAiPanel from '@/components/health/HealthAiPanel';
import HealthSummaryCards from '@/components/health/HealthSummaryCards';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sağlık Platformu - Net Haberler",
  description:
    "Sağlık alanından son gelişmeler, tıbbi araştırmalar ve sağlıklı yaşam önerileri.",
  openGraph: {
    title: "Sağlık Platformu - Net Haberler",
    description:
      "Sağlık alanından son gelişmeler, tıbbi araştırmalar ve sağlıklı yaşam önerileri.",
  },
};

export default function HealthPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <HealthPlatformHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        <section className="mb-8">
          <HealthSummaryCards />
        </section>
        <section className="mb-8">
          <HealthThemes />
        </section>
        <section className="mb-8">
          <HealthKpiWidget />
        </section>
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0">
            <HealthAiPanel />
          </div>
          <div className="flex-1 min-w-0">
            <HealthVideoPanel />
          </div>
        </div>
        <section>
          <HealthNewsGrid />
        </section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
