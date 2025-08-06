import WebsiteLayout from "@/components/layout/WebsiteLayout";
import GundemPlatformHeader from "@/components/category/GundemPlatformHeader";
import GundemSummaryCards from "@/components/gundem/GundemSummaryCards";
import GundemThemes from "@/components/gundem/GundemThemes";
import GundemKpiWidget from "@/components/gundem/GundemKpiWidget";
import GundemAiPanel from "@/components/gundem/GundemAiPanel";
import GundemVideoPanel from "@/components/gundem/GundemVideoPanel";
import GundemNewsGrid from "@/components/gundem/GundemNewsGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gündem Platformu - Net Haberler",
  description:
    "Güncel gündem haberleri, toplumsal gelişmeler, sıcak başlıklar ve uzman analizleri Net Haberler Gündem Platformu'nda.",
  openGraph: {
    title: "Gündem Platformu - Net Haberler",
    description:
      "Güncel gündem haberleri, toplumsal gelişmeler, sıcak başlıklar ve uzman analizleri Net Haberler Gündem Platformu'nda.",
  },
};

export default function GundemPlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <GundemPlatformHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        <section className="mb-8"><GundemSummaryCards /></section>
        <section className="mb-8"><GundemThemes /></section>
        <section className="mb-8"><GundemKpiWidget /></section>
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0"><GundemAiPanel /></div>
          <div className="flex-1 min-w-0"><GundemVideoPanel /></div>
        </div>
        <section><GundemNewsGrid /></section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
