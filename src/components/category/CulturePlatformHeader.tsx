import { Feather } from "lucide-react";

export default function CulturePlatformHeader() {
  return (
    <section
      className="
        relative w-full min-h-[220px] md:min-h-[280px]
        flex flex-col justify-center items-center
        bg-gradient-to-br from-[#f9f8f5] via-[#f6f4ee] to-[#fbfaff]
        dark:from-[#232c3a] dark:via-[#232c3a] dark:to-[#1a2536]
        shadow-lg rounded-b-3xl overflow-hidden mb-6
        border-b border-orange-50 dark:border-[#232c3a]
      "
      style={{
        backdropFilter: "blur(2px) saturate(120%)",
        WebkitBackdropFilter: "blur(2px) saturate(120%)",
      }}
    >
      <div className="flex flex-col items-center justify-center z-10 pt-3 pb-6">
        <Feather className="w-12 h-12 mb-2 text-orange-500/80 dark:text-orange-300/70 drop-shadow" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow tracking-tight text-center mb-2">
          Kültür & Sanat
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto">
          Edebiyat, sanat, toplumsal yaşam ve kültürel analizlerin merkezi.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80"
        alt="Kültür Kapak"
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-10 dark:opacity-20
          select-none pointer-events-none
          transition-all duration-700
        "
        draggable={false}
      />
      <div className="
        absolute inset-0 bg-gradient-to-b
        from-white/70 via-transparent to-white/40
        dark:from-[#232c3a]/70 dark:via-transparent dark:to-[#1b2230]/80
        pointer-events-none
      " />
    </section>
  );
}
