import React from "react";

const leftList = [
  {
    id: 1,
    title: "Gazze'de Kıtlık Derinleşiyor: Çocuklar Açlıktan",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    url: "/haber/gazze-cocuklar-aclik"
  },
  {
    id: 2,
    title: "Handala Gemisi Gazze'ye Gitmek İçin Hazır: Aktivistler",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    url: "/haber/handala-gemisi-gazze"
  },
  {
    id: 3,
    title: "Almanya Başbakanı Merz, Gazze Şeridi’nde Yaşananların Artık Kabul Edilemez Olduğunu...",
    url: "#"
  },
  {
    id: 4,
    title: "Suriye Cumhurbaşkanı Şara: “Süveyda Hala Suriye Devletinin Asli Bir Parçasıdır”",
    url: "#"
  },
  {
    id: 5,
    title: "KKTC Cumhurbaşkanı Ersin Tatar: Bizi Acımasızca Toplu Mezarlarla Koyacaklardı",
    url: "#"
  }
];

const rightList = [
  {
    id: 1,
    title: "Suriye’de Geçiş Sürecinin Sancıları",
    author: "Erdem Ozan",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    url: "#"
  },
  {
    id: 2,
    title: "Trump-Netanyahu Görüşmesi: Tehcir Konusu Yeniden Gündemde",
    author: "Mahmut Alrantisi",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    url: "#"
  },
  {
    id: 3,
    title: "Aile İçin En Genel Tehdit: Uzun Mesai Saatleri",
    author: "Zeynep Burcu Uğur",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    url: "#"
  },
  {
    id: 4,
    title: "Terör Sorununa Yönelik Yeni Konsept: \"Türkiye Modeli\"",
    author: "Ahmet Kaya",
    avatar: "https://randomuser.me/api/portraits/men/60.jpg",
    url: "#"
  }
];

const headline = {
  image: "/manşet.jpg",
  logo: "/fokusplus-logo.png",
  title: "İsrail Ordusunda İntihar Alarmı: En az 42 Asker Kendini Öldürdü!",
  summary:
    "7 Ekim 2023'ten bu yana devam eden Gazze savaşında İsrail ordusu ağır kayıplar veriyor. Resmi verilere göre 42 asker intihar ederken, 9 binden fazlası psikolojik tedavi görüyor.",
};

export default function MainHeadlineSection() {
  return (
    <div className="w-full flex flex-row items-stretch bg-white">
      {/* Sol */}
      <div className="hidden lg:flex flex-col justify-between min-w-[300px] max-w-[340px] border-r border-gray-200 pr-3">
        {leftList.slice(0, 2).map((item) => (
          <a key={item.id} href={item.url} className="flex gap-3 mb-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-20 object-cover rounded"
              />
            )}
            <span className="text-lg font-medium leading-tight text-neutral-900">{item.title}</span>
          </a>
        ))}
        {leftList.slice(2).map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="block text-base py-1 text-neutral-900"
          >
            {item.title}
          </a>
        ))}
        <div className="flex-grow"></div>
        <button className="w-full flex items-center justify-center h-12 border-t border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          <svg width="28" height="28" fill="none"><path d="M8 12l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {/* Orta */}
      <div className="flex flex-1 flex-col items-center justify-center px-2 lg:px-8">
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full flex flex-col items-center">
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              {/* <img src={headline.logo} alt="Logo" className="w-36" /> */}
              <span className="font-bold tracking-wider text-2xl text-neutral-700 opacity-80">FOKUS+</span>
            </div>
            <img
              src={headline.image}
              alt={headline.title}
              className="w-full max-h-[440px] object-cover rounded-b-none rounded-t-xl"
              style={{ minHeight: 340, background: "#eaeaea" }}
            />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-6 z-20">
              <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-2xl hover:bg-gray-200 transition"><span>&larr;</span></button>
              <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-2xl hover:bg-gray-200 transition"><span>&rarr;</span></button>
            </div>
          </div>
          <div className="w-full py-6 text-center">
            <h1 className="text-4xl font-serif font-semibold leading-tight mb-3">{headline.title}</h1>
            <p className="text-xl font-light text-neutral-700">{headline.summary}</p>
          </div>
        </div>
      </div>
      {/* Sağ */}
      <div className="hidden lg:flex flex-col justify-between min-w-[300px] max-w-[340px] border-l border-gray-200 pl-3">
        {rightList.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="flex items-center gap-3 mb-8"
          >
            <img
              src={item.avatar}
              alt={item.author}
              className="w-14 h-14 rounded-full object-cover border border-gray-300"
            />
            <div>
              <div className="text-lg font-semibold leading-tight text-neutral-900">
                {item.title}
              </div>
              <div className="text-base font-medium text-red-600">{item.author}</div>
            </div>
          </a>
        ))}
        <div className="flex-grow"></div>
        <button className="w-full flex items-center justify-center h-12 border-t border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          <svg width="28" height="28" fill="none"><path d="M8 12l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
