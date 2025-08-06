"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BreakingNewsBar = dynamic(() => import("@/components/homepage/BreakingNewsBar"), { ssr: false });
const MoneyMarketsTicker = dynamic(() => import("@/components/homepage/MoneyMarketsTicker"), { ssr: false });
const MainVisualHeadline = dynamic(() => import("@/components/homepage/MainVisualHeadline"), { ssr: false });
const HeadlineNewsGrid = dynamic(() => import("@/components/homepage/HeadlineNewsGrid"), { ssr: false });
const WeekendReadsSection = dynamic(() => import("@/components/homepage/WeekendReadsSection"), { ssr: false });
const EditorPicks = dynamic(() => import("@/components/homepage/EditorPicks"), { ssr: false });
const VideoHighlights = dynamic(() => import("@/components/homepage/VideoHighlights"), { ssr: false });
const AiRecommendationPanel = dynamic(() => import("@/components/homepage/AiRecommendationPanel"), { ssr: false });
const PopularNewsSidebar = dynamic(() => import("@/components/homepage/PopularNewsSidebar"), { ssr: false });
const NewsProgramsGrid = dynamic(() => import("@/components/homepage/NewsProgramsGrid"), { ssr: false });
const StickyBanner = dynamic(() => import("@/components/homepage/StickyBanner"), { ssr: false });
const WeatherCurrencyPanel = dynamic(() => import("@/components/homepage/WeatherCurrencyPanel"), { ssr: false });

const weekendReadsSample = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Geleceğin Şehirleri: Akıllı Kentler",
    summary: "Akıllı şehirler nasıl inşa ediliyor? Teknoloji, sürdürülebilirlik ve inovasyonun buluşma noktası.",
    url: "/hafta-sonu/akilli-sehirler",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80",
    title: "Doğa ile Yaşam: Hafta Sonu Kaçamakları",
    summary: "Stresten uzaklaşmak isteyenler için doğada harika hafta sonu rotaları.",
    url: "/hafta-sonu/doga-kacamak",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
    title: "Yeni Teknolojiler: Yapay Zeka ile Kişisel Gelişim",
    summary: "Kişisel gelişim için yapay zeka destekli uygulamalar neler vadediyor?",
    url: "/hafta-sonu/yapay-zeka-gelisim",
  },
];

export default function HomePageClient() {
  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col gap-6 bg-white">
      {/* Üst bar: Son Dakika ve Piyasa Ticker */}
      <div className="flex flex-col gap-2">
        <Suspense fallback={null}>
          <BreakingNewsBar />
          <MoneyMarketsTicker />
        </Suspense>
      </div>
      {/* Ana içerik bölümleri */}
      <main className="flex flex-col gap-10">
        <Suspense fallback={null}>
          <MainVisualHeadline />
          <HeadlineNewsGrid />
          <WeekendReadsSection label="Hafta Sonu Okumaları" />
          <EditorPicks />
          <VideoHighlights />
          <AiRecommendationPanel />
          <PopularNewsSidebar />
          <NewsProgramsGrid />
          <StickyBanner />
          <WeatherCurrencyPanel />
        </Suspense>
      </main>
    </div>
  );
}
