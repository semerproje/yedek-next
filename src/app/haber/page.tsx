import { Metadata } from "next";
import WebsiteLayout from "@/components/layout/WebsiteLayout";
import NewsPageHeader from "@/components/news/NewsPageHeader";
import NewsFilters from "@/components/news/NewsFilters";
import NewsGrid from "@/components/news/NewsGrid";
import NewsSidebar from "@/components/news/NewsSidebar";
import NewsStats from "@/components/news/NewsStats";
import { NewsFiltersProvider } from "@/contexts/NewsFiltersContext";

export const metadata: Metadata = {
  title: "Tüm Haberler - Net Haberler",
  description:
    "Güncel haberler, son dakika haberleri ve tüm kategorilerden haberler. Politika, ekonomi, spor, teknoloji ve daha fazlası.",
  keywords: ["haberler", "son dakika", "güncel", "politika", "ekonomi", "spor", "teknoloji"],
  openGraph: {
    title: "Tüm Haberler - Net Haberler",
    description:
      "Güncel haberler, son dakika haberleri ve tüm kategorilerden haberler.",
    type: "website",
  },
};

export default function NewsPage() {
  return (
    <NewsFiltersProvider>
      <WebsiteLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
          <NewsPageHeader />
          
          <div className="container mx-auto px-4 py-8">
            {/* Ana İçerik Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sol Kolon - Ana İçerik (3/4) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Filtreler */}
                <section>
                  <NewsFilters />
                </section>

                {/* Haberler Grid */}
                <section>
                  <NewsGrid />
                </section>
              </div>

              {/* Sağ Kolon - Sidebar (1/4) */}
              <div className="lg:col-span-1 space-y-6">
                <NewsSidebar />
              </div>
            </div>

            {/* Alt Bölüm - İstatistikler */}
            <NewsStats />
          </div>
        </div>
      </WebsiteLayout>
    </NewsFiltersProvider>
  );
}
