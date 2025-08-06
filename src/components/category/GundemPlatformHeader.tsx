import { Globe } from "lucide-react";

export default function GundemPlatformHeader() {
  return (
    <section
      className="
        relative w-full min-h-[220px] md:min-h-[280px]
        flex flex-col justify-center items-center
        bg-gradient-to-br from-[#f8fafd] via-[#e8eef2] to-[#fcfcff]
        dark:from-[#182033] dark:via-[#1b2230] dark:to-[#20273b]
        shadow-lg rounded-b-3xl overflow-hidden mb-6
        border-b border-blue-50 dark:border-[#232c3a]
      "
      style={{
        backdropFilter: "blur(2px) saturate(120%)",
        WebkitBackdropFilter: "blur(2px) saturate(120%)",
      }}
      aria-label="Gündem Platformu Başlık Alanı"
    >
      {/* Öne çıkan başlık ve açıklama */}
      <div className="flex flex-col items-center justify-center z-10 pt-3 pb-6">
        <Globe
          className="w-12 h-12 mb-2 text-blue-700/90 dark:text-blue-400/70 drop-shadow"
          aria-hidden="true"
        />
        <h1
          className="
            text-3xl md:text-5xl font-extrabold
            text-gray-900 dark:text-white drop-shadow
            tracking-tight text-center mb-2
          "
        >
          Gündem Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto">
          Türkiye ve dünyadan son dakika gelişmeleri, güncel olaylar ve önemli analizler.
        </p>
      </div>
      {/* Arka plan görseli - koyu mod ve efektli */}
      <img
        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-10 dark:opacity-20
          select-none pointer-events-none
          transition-all duration-700
        "
        draggable={false}
        aria-hidden="true"
      />
      {/* Üstte hafif degrade overlay efekti */}
      <div
        className="
          absolute inset-0 bg-gradient-to-b
          from-white/70 via-transparent to-white/40
          dark:from-[#232c3a]/70 dark:via-transparent dark:to-[#1b2230]/80
          pointer-events-none
        "
        aria-hidden="true"
      />
    </section>
  );
}
