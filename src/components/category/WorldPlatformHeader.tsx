import { Globe2 } from "lucide-react";

export default function WorldPlatformHeader() {
  return (
    <section className="relative w-full min-h-[200px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#eef5fa] via-[#e3e9ef] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <Globe2 className="w-10 h-10 mb-2 text-blue-700/80" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          Dünya Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
          Küresel gündemin nabzı, uluslararası gelişmeler, krizler ve çözüm yolları.  
          Dünya ajandasındaki son dakika haberler, özgün analizler ve özetler burada.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
        alt="Dünya Kapak"
        className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
        draggable={false}
      />
    </section>
  );
}
