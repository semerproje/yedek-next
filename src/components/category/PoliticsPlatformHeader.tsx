import { Landmark } from "lucide-react";

export default function PoliticsPlatformHeader() {
  return (
    <section className="relative w-full min-h-[220px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#e3eefe] via-[#e6e9f0] to-[#f8fafc] shadow-lg rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <Landmark className="w-12 h-12 mb-2 text-blue-900/90 drop-shadow" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Politika Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl">
          Siyaset, parlamento, seçimler, analizler, hükümet politikaları ve güncel gelişmeler Net Haberler Politika Platformu'nda!
        </p>
      </div>
      {/* Kategoriye özel politika/meclis temalı görsel */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
        alt="Türkiye Büyük Millet Meclisi"
        className="absolute inset-0 w-full h-full object-cover opacity-20 select-none pointer-events-none"
        draggable={false}
      />
      {/* Soft beyaz gradient üst geçiş (okunabilirlik için) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent pointer-events-none"></div>
    </section>
  );
}
