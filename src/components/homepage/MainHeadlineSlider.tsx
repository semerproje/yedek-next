"use client";




import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const headlines = [
  {
    id: 1,
    title: "Dünya Gündemi: Yeni Çağın Eşiğinde",
    summary: "Küresel güç dengeleri, iklim krizi ve teknolojide devrim – günün manşetinde öne çıkanlar.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1400&q=80",
    url: "/haber/dunya-gundemi",
    author: "Elif Çelik",
    date: "22 Temmuz 2025"
  },
  {
    id: 2,
    title: "Ekonomi: Dijitalleşmenin İzinde",
    summary: "Ekonomi haberciliğinde dijital dönüşüm, verinin gücü ve yatırım trendleri.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80",
    url: "/haber/ekonomi-dijital-iz",
    author: "Murat Sönmez",
    date: "21 Temmuz 2025"
  },
  {
    id: 3,
    title: "Yapay Zeka, Gazetecilikte Yeni Dönemi Başlatıyor",
    summary: "AI ile habercilikte özgünlük, hız ve derin analiz: Yeni çağ başlıyor.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1400&q=80",
    url: "/haber/yapay-zeka-gazetecilik",
    author: "Zeynep Aksoy",
    date: "20 Temmuz 2025"
  }
];

export default function MainHeadlineSlider() {
  return (
    <section className="w-full relative mb-10">
      <Swiper
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        pagination={{
          clickable: true,
          renderBullet: (index, className) => (
            `<span class=\"${className} !mx-1 !w-2.5 !h-2.5 !bg-neutral-100 !opacity-60 !rounded-full\"></span>`
          ),
        }}
        className="!rounded-3xl"
      >
        {headlines.map((item) => (
          <SwiperSlide key={item.id}>
            {/* Tam ekran bg ve overlay */}
            <a
              href={item.url}
              className="block group relative w-full h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl select-none"
              tabIndex={0}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* Background görsel */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 z-0"
                loading="lazy"
                draggable="false"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
              {/* Sol alt dev manşet panel */}
              <div className="
                absolute bottom-0 left-0 z-20
                md:bottom-10 md:left-12
                w-full md:w-[630px] max-w-full
                bg-white/70 backdrop-blur-2xl
                rounded-t-3xl md:rounded-3xl
                shadow-2xl
                px-6 py-7 md:px-12 md:py-8
                flex flex-col items-start
                border border-white/40
                group-hover:shadow-[0_8px_56px_-6px_rgba(37,42,60,0.21)]
                transition-all duration-400
              ">
                <h1 className="text-[2.1rem] md:text-[2.7rem] font-extrabold text-neutral-900 mb-2 leading-tight drop-shadow-lg">
                  {item.title}
                </h1>
                <p className="text-neutral-700 text-[1.16rem] font-medium mb-5 max-w-2xl">
                  {item.summary}
                </p>
                <div className="flex items-center gap-2 mt-2 text-neutral-500 text-[15px]">
                  <svg width={22} height={22} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#2e2e2e" fillOpacity=".07" />
                    <text x="12" y="17" textAnchor="middle" fontSize="13" fill="#2e2e2e" fontWeight="bold">N</text>
                  </svg>
                  <span className="font-semibold">{item.author}</span>
                  <span className="mx-1 text-xs">•</span>
                  <span className="text-xs">{item.date}</span>
                </div>
              </div>
              {/* Sağ alt watermark marka etiketi */}
              <div className="absolute right-8 bottom-6 z-30 opacity-70 bg-white/70 px-3 py-1 rounded-xl shadow border border-white/20 text-xs text-neutral-800 font-semibold">
                Net Haberler
              </div>
              {/* Hover micro effect */}
              <span className="absolute inset-0 z-40 group-hover:bg-black/5 transition" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
