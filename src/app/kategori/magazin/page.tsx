import MagazinePlatformHeader from "@/components/category/MagazinePlatformHeader";
import MagazineKpiWidget from '@/components/magazine/MagazineKpiWidget';
import MagazineNewsGrid from '@/components/magazine/MagazineNewsGrid';
import MagazineThemes from '@/components/magazine/MagazineThemes';
import MagazineVideoPanel from '@/components/magazine/MagazineVideoPanel';
import MagazineAiPanel from '@/components/magazine/MagazineAiPanel';
import MagazineSummaryCards from '@/components/magazine/MagazineSummaryCards';
import WebsiteLayout from '@/components/layout/WebsiteLayout';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazin Platformu - Net Haberler",
  description:
    "Magazin dünyasından son dakika haberleri, ünlü haberleri ve showbiz gelişmeleri.",
  openGraph: {
    title: "Magazin Platformu - Net Haberler",
    description:
      "Magazin dünyasından son dakika haberleri, ünlü haberleri ve showbiz gelişmeleri.",
  },
};

export default function MagazinePlatformPage() {
  return (
    <WebsiteLayout>
      <div className="min-h-screen py-8 px-2 bg-gradient-to-tr from-[#ffe7e1] via-[#f3f9fa] to-[#f7faff] dark:from-[#1a2536] dark:via-[#19212e] dark:to-[#232c3a] transition-colors duration-700">
      <MagazinePlatformHeader />
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-8 py-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-xl border border-neutral-200 dark:bg-[#232c3a]/80 dark:border-neutral-800 transition-all duration-300">
        <section className="mb-8"><MagazineSummaryCards /></section>
        <section className="mb-8"><MagazineThemes /></section>
        <section className="mb-8"><MagazineKpiWidget /></section>
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8 mb-12">
          <div className="flex-1 min-w-0"><MagazineAiPanel /></div>
          <div className="flex-1 min-w-0"><MagazineVideoPanel /></div>
        </div>
        <section><MagazineNewsGrid /></section>
      </div>
    </div>
    </WebsiteLayout>
  );
}
