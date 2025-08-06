import { HeartPulse } from "lucide-react";

export default function HealthPlatformHeader() {
  return (
    <section className="relative w-full min-h-[200px] md:min-h-[260px] flex flex-col justify-center items-center bg-gradient-to-br from-[#f8fdfa] via-[#eaf5f1] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-3">
        <HeartPulse className="w-10 h-10 mb-2 text-red-600/80" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
          Sağlık Haberleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-xl">
          Sağlık teknolojileri, tıp, yaşam, güncel gelişmeler, araştırmalar, bilimsel bulgular ve sağlıklı yaşam rehberi Net Haberler Sağlık Platformu'nda!
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd7e?auto=format&fit=crop&w=1600&q=80"
        alt="Sağlık Kapak"
        className="absolute inset-0 w-full h-full object-cover opacity-15 select-none pointer-events-none"
        draggable={false}
      />
    </section>
  );
}
