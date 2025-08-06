import { Camera, Star, ShoppingBag, Mic } from "lucide-react";

const CATEGORY_CONFIG = {
  magazin: {
    label: "Magazin Haberleri",
    desc:
      "Ünlüler, sosyal yaşam, etkinlikler, moda, TV dünyası, trendler ve en güncel magazin gelişmeleri Net Haberler Magazin Platformu'nda!",
    icon: Camera,
    iconColor: "text-pink-500/80",
    image:
      "https://images.unsplash.com/photo-1512070800542-1d03348b8bfa?auto=format&fit=crop&w=1600&q=80",
  },
  moda: {
    label: "Moda Trendleri",
    desc:
      "Sezonun öne çıkan koleksiyonları, renkleri ve tüm moda haberleri Net Haberler'de güncel!",
    icon: Star,
    iconColor: "text-rose-600/80",
    image:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=1600&q=80",
  },
  etkinlik: {
    label: "Etkinlik & Festival",
    desc:
      "Alışveriş, konser, kültür ve sosyal etkinliklerden anlık haberler.",
    icon: ShoppingBag,
    iconColor: "text-emerald-600/80",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  },
  roportaj: {
    label: "Röportajlar",
    desc:
      "Ünlülerle yapılan en güncel, samimi ve ilham verici röportajlar.",
    icon: Mic,
    iconColor: "text-indigo-500/80",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1600&q=80",
  },
};

type MagazinePlatformHeaderProps = {
  category?: keyof typeof CATEGORY_CONFIG;
};

export default function MagazinePlatformHeader({ category = "magazin" }: MagazinePlatformHeaderProps) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["magazin"];
  const Icon = config.icon;

  return (
    <section className="relative w-full min-h-[210px] md:min-h-[270px] flex flex-col justify-center items-center bg-gradient-to-br from-[#fdf6fa] via-[#fce8f2] to-[#f8fafc] shadow-sm rounded-b-3xl overflow-hidden mb-2">
      <div className="flex flex-col items-center justify-center z-10 pt-2 pb-4">
        <Icon className={`w-11 h-11 mb-2 ${config.iconColor}`} aria-label={config.label + " ikonu"} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 drop-shadow-sm">
          {config.label}
        </h1>
        <p className="text-base md:text-lg text-gray-700 text-center max-w-2xl">
          {config.desc}
        </p>
      </div>
      <img
        src={config.image}
        alt={config.label + " Kapak"}
        className="absolute inset-0 w-full h-full object-cover opacity-15 select-none pointer-events-none"
        draggable={false}
        loading="lazy"
      />
      {/* Hafif overlay ile okunabilirliği artırın */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/70 pointer-events-none" />
    </section>
  );
}
