import { BookOpen } from "lucide-react";

export default function ReligionPlatformHeader() {
  return (
    <section className="relative w-full min-h-[200px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#f9fafb] via-[#f2efe6] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <BookOpen className="w-10 h-10 mb-2 text-yellow-600/80" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          Din Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
          Dini günler, toplumsal değerler, kültürel etkinlikler, manevi rehberlik ve güncel din haberleri Net Haberler Din Platformu'nda!
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
        alt="Din Kapak"
        className="absolute inset-0 w-full h-full object-cover opacity-10 select-none pointer-events-none"
        draggable={false}
      />
    </section>
  );
}
