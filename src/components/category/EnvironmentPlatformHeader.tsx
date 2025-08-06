import { Leaf } from "lucide-react";

const COVER_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";

export default function EnvironmentPlatformHeader() {
  return (
    <section
      className="
        relative w-full min-h-[220px] md:min-h-[280px]
        flex flex-col justify-center items-center
        bg-gradient-to-br from-[#f0fcf7] via-[#d4efe1] to-[#f8fafc]
        dark:from-[#192926] dark:via-[#183a2e] dark:to-[#243934]
        shadow-lg rounded-b-3xl overflow-hidden mb-6
        border-b border-green-50 dark:border-[#2a4638]
      "
      style={{
        backdropFilter: "blur(2px) saturate(120%)",
        WebkitBackdropFilter: "blur(2px) saturate(120%)",
      }}
    >
      <div className="flex flex-col items-center justify-center z-10 pt-4 pb-7">
        <Leaf className="w-12 h-12 mb-2 text-green-600/90 dark:text-green-400/70 drop-shadow" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-green-800 dark:text-white drop-shadow tracking-tight text-center mb-2">
          Çevre Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto">
          İklim değişikliği, sürdürülebilirlik, doğa, enerji ve çevre dostu teknolojilerle ilgili en güncel gelişmeler Net Haberler Çevre Platformu'nda!
        </p>
      </div>
      <img
        src={COVER_IMAGE}
        alt="Çevre Kapak - Orman"
        className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-15 select-none pointer-events-none transition-all duration-700"
        draggable={false}
      />
      <div
        className="
          absolute inset-0 bg-gradient-to-b
          from-white/80 via-transparent to-white/40
          dark:from-[#232c3a]/70 dark:via-transparent dark:to-[#1b2230]/80
          pointer-events-none
        "
      />
    </section>
  );
}
