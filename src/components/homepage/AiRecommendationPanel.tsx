import { Sparkles } from "lucide-react";
import Link from "next/link";

const recommendations = [
  {
    id: 1,
    title: "İlgi Alanına Uygun: Yeni Nesil Startuplar",
    summary: "Teknoloji ve girişimcilik dünyasındaki en güncel gelişmeleri kaçırmayın.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80",
    to: "/ai/oneri/startuplar"
  },
  {
    id: 2,
    title: "Popüler Gündem: Yapay Zeka ve İş Dünyası",
    summary: "Yapay zekanın üretim, finans ve B2B ekosistemdeki etkileri.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=500&q=80",
    to: "/ai/oneri/yapay-zeka"
  }
];

export default function AiRecommendationPanel() {
  return (
    <section className="w-full max-w-[1200px] mx-auto py-6 px-2">
      <div className="flex items-center gap-2 mb-4 font-black text-xl text-indigo-700">
        <Sparkles className="w-6 h-6 animate-bounce" />
        <span>AI'den Sana Özel Haber</span>
      </div>
      <div className="flex gap-6 flex-col md:flex-row">
        {recommendations.map(rec => (
          <Link
            key={rec.id}
            href={rec.to}
            className="flex-1 group bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-2xl shadow-md hover:shadow-xl transition-all border border-indigo-100 flex flex-col overflow-hidden"
            tabIndex={0}
            aria-label={rec.title}
          >
            <div className="h-40 w-full overflow-hidden relative">
              <img
                src={rec.image}
                alt={rec.title}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                draggable={false}
              />
              <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold opacity-90">
                AI Öneri
              </span>
            </div>
            <div className="flex-1 p-5 flex flex-col">
              <div className="font-bold text-lg mb-1 text-indigo-900 group-hover:text-indigo-700 transition-colors">
                {rec.title}
              </div>
              <div className="text-gray-700 text-sm">{rec.summary}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
