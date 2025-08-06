import { GraduationCap } from "lucide-react";

export default function EducationPlatformHeader() {
  return (
    <section
      className="
        relative w-full min-h-[220px] md:min-h-[280px]
        flex flex-col justify-center items-center
        bg-gradient-to-br from-[#eaf5ff] via-[#e4f0fa] to-[#f8fafc]
        shadow-lg rounded-b-3xl overflow-hidden mb-6
        border-b border-blue-50
      "
      style={{
        backdropFilter: "blur(2px) saturate(120%)",
        WebkitBackdropFilter: "blur(2px) saturate(120%)",
      }}
    >
      {/* Başlık ve Açıklama */}
      <div className="flex flex-col items-center justify-center z-10 pt-3 pb-6">
        <GraduationCap className="w-12 h-12 mb-2 text-blue-700/90 drop-shadow" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 drop-shadow tracking-tight text-center mb-2">
          Eğitim Platformu
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Okul, üniversite, sınavlar, eğitim teknolojileri ve yenilikçi öğrenme modellerine dair en güncel gelişmeler Net Haberler Eğitim Platformu'nda!
        </p>
      </div>
      {/* Eğitim temalı arka plan görseli */}
      <img
        src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1920&q=80"
        alt="Eğitim Kapak"
        className="
          absolute inset-0 w-full h-full object-cover
          opacity-10 select-none pointer-events-none
          transition-all duration-700
        "
        draggable={false}
      />
      {/* Üstte degrade overlay */}
      <div className="
        absolute inset-0 bg-gradient-to-b
        from-white/70 via-transparent to-white/40
        pointer-events-none
      " />
    </section>
  );
}
