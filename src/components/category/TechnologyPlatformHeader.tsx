import { Cpu } from "lucide-react";

export default function TechnologyPlatformHeader() {
  return (
    <section className="relative w-full min-h-[200px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#eef5fa] via-[#e3e9ef] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <Cpu className="w-10 h-10 mb-2 text-blue-700/80" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          Teknoloji Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
          Küresel teknoloji trendleri, yapay zeka, 6G, inovasyon ve daha fazlası. Türkiye ve dünyadan güncel analizler, girişim haberleri ve platform içeriği burada!
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
        alt="Teknoloji Kapak"
        className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
        draggable={false}
      />
    </section>
  );
}
