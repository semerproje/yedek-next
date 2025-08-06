import { Trophy } from "lucide-react";

export default function SportPlatformHeader() {
  return (
    <section className="relative w-full min-h-[200px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#f2faf5] via-[#e3f5eb] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <Trophy className="w-10 h-10 mb-2 text-green-700/80" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          Spor Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
          Futbol, basketbol, olimpiyatlar ve tüm spor branşlarında en güncel gelişmeler, istatistikler, analizler ve özel içerikler burada!
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1505843276872-5b0606c607b4?auto=format&fit=crop&w=1600&q=80"
        alt="Spor Kapak"
        className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
        draggable={false}
      />
    </section>
  );
}
