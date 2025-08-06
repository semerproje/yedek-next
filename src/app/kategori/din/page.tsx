import WebsiteLayout from "@/components/layout/WebsiteLayout";
import ReligionPlatformHeader from "@/components/category/ReligionPlatformHeader";
import ReligionSummaryCards from "@/components/religion/ReligionSummaryCards";
import ReligionThemes from "@/components/religion/ReligionThemes";
import ReligionKpiWidget from "@/components/religion/ReligionKpiWidget";
import ReligionAiPanel from "@/components/religion/ReligionAiPanel";
import ReligionVideoPanel from "@/components/religion/ReligionVideoPanel";
import ReligionNewsGrid from "@/components/religion/ReligionNewsGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Din Platformu - Net Haberler",
  description:
    "Din ve manevi konular, dini etkinlikler ve toplumsal barış haberleri.",
  openGraph: {
    title: "Din Platformu - Net Haberler",
    description:
      "Din ve manevi konular, dini etkinlikler ve toplumsal barış haberleri.",
  },
};

export default function ReligionPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
        <ReligionPlatformHeader />
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
          <section className="mb-8"><ReligionSummaryCards /></section>
          <section className="mb-8"><ReligionThemes /></section>
          <section className="mb-8"><ReligionKpiWidget /></section>
          <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
            <div className="flex-1 min-w-0"><ReligionAiPanel /></div>
            <div className="flex-1 min-w-0"><ReligionVideoPanel /></div>
          </div>
          <section><ReligionNewsGrid /></section>
        </div>
      </div>
    </WebsiteLayout>
  );
}
