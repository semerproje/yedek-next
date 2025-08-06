import { BarChart3 } from "lucide-react";

export default function EconomyHeader() {
  return (
    <section
      className="
        relative w-full min-h-[220px] md:min-h-[280px]
        flex flex-col justify-center items-center
        bg-gradient-to-br from-[#f8fafd] via-[#e8eef2] to-[#fcfcff]
        dark:from-[#182033] dark:via-[#1b2230] dark:to-[#20273b]
        shadow-lg rounded-b-3xl overflow-hidden mb-6
        border-b border-blue-50 dark:border-[#232c3a]
        transition-all duration-500
      "
      style={{
        backdropFilter: "blur(2px) saturate(120%)",
        WebkitBackdropFilter: "blur(2px) saturate(120%)",
      }}
    >
      <div className="flex flex-col items-center justify-center z-10 pt-3 pb-6">
        <BarChart3 className="w-12 h-12 mb-2 text-blue-700/90 dark:text-blue-400/70 drop-shadow" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow tracking-tight text-center mb-2">
          Ekonomi Platformu
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto">
          Türkiye ve dünyadan ekonomi, finans ve piyasaların nabzı burada.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
        alt="Ekonomi Kapak"
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-10 dark:opacity-20
          select-none pointer-events-none
          transition-all duration-700
        "
        draggable={false}
      />
      {/* Overlay degrade */}
      <div className="
        absolute inset-0 bg-gradient-to-b
        from-white/70 via-transparent to-white/40
        dark:from-[#232c3a]/70 dark:via-transparent dark:to-[#1b2230]/80
        pointer-events-none
      " />
    </section>
  );
}
