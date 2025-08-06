import CulturePlatformHeader from "@/components/category/CulturePlatformHeader";
import CultureKpiWidget from '@/components/culture/CultureKpiWidget';
import CultureNewsGrid from '@/components/culture/CultureNewsGrid';
import CultureThemes from '@/components/culture/CultureThemes';
import CultureVideoPanel from '@/components/culture/CultureVideoPanel';
import CultureAiPanel from '@/components/culture/CultureAiPanel';
import CultureSummaryCards from '@/components/culture/CultureSummaryCards';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kültür Platformu - Net Haberler",
  description:
    "Kültür sanat dünyasından haberler, etkinlikler, sergiler ve kültürel gelişmeler.",
  openGraph: {
    title: "Kültür Platformu - Net Haberler",
    description:
      "Kültür sanat dünyasından haberler, etkinlikler, sergiler ve kültürel gelişmeler.",
  },
};

export default function CulturePlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <CulturePlatformHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        <section className="mb-8">
          <CultureSummaryCards />
        </section>
        <section className="mb-8">
          <CultureThemes />
        </section>
        <section className="mb-8">
          <CultureKpiWidget />
        </section>
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0">
            <CultureAiPanel />
          </div>
          <div className="flex-1 min-w-0">
            <CultureVideoPanel />
          </div>
        </div>
        <section>
          <CultureNewsGrid />
        </section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
