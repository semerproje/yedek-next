import WebsiteLayout from "@/components/layout/WebsiteLayout";
import TechnologyPlatformHeader from "@/components/category/TechnologyPlatformHeader";
import CategoryPage from "@/components/category/CategoryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teknoloji Haberleri - NetNext",
  description: "Teknoloji dünyasından en son gelişmeler, incelemeler ve yenilikler NetNext Teknoloji sayfasında.",
  openGraph: {
    title: "Teknoloji Haberleri - NetNext",
    description: "Teknoloji dünyasından en son gelişmeler, incelemeler ve yenilikler NetNext Teknoloji sayfasında.",
  },
};

export default function TechnologyPage() {
  return (
    <WebsiteLayout>
      <CategoryPage
        categorySlug="teknoloji"
        title="Teknoloji Haberleri"
        description="Teknoloji, bilim ve yenilik dünyasından son dakika haberleri"
        headerComponent={TechnologyPlatformHeader}
        showComponents={{
          summaryCards: true,
          themes: true,
          kpiWidget: true,
          aiPanel: true,
          videoPanel: true
        }}
      />
    </WebsiteLayout>
  );
}
