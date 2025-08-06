import EducationPlatformHeader from "@/components/category/EducationPlatformHeader";
import EducationSummaryCards from "@/components/education/EducationSummaryCards";
import EducationThemes from "@/components/education/EducationThemes";
import EducationKpiWidget from "@/components/education/EducationKpiWidget";
import EducationAiPanel from "@/components/education/EducationAiPanel";
import EducationVideoPanel from "@/components/education/EducationVideoPanel";
import EducationNewsGrid from "@/components/education/EducationNewsGrid";
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eğitim Platformu - Net Haberler",
  description:
    "Eğitim dünyasından haberler, akademik gelişmeler ve eğitim politikaları.",
  openGraph: {
    title: "Eğitim Platformu - Net Haberler",
    description:
      "Eğitim dünyasından haberler, akademik gelişmeler ve eğitim politikaları.",
  },
};

export default function EducationPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <EducationPlatformHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        <section className="mb-8"><EducationSummaryCards /></section>
        <section className="mb-8"><EducationThemes /></section>
        <section className="mb-8"><EducationKpiWidget /></section>
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0"><EducationAiPanel /></div>
          <div className="flex-1 min-w-0"><EducationVideoPanel /></div>
        </div>
        <section><EducationNewsGrid /></section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
