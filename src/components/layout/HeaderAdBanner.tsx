"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function HeaderAdBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const handleScroll = () => setVisible(false);
    window.addEventListener("scroll", handleScroll, { once: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="w-full bg-[#fafafa] border-b border-gray-200 flex flex-col items-center relative z-50"
      style={{ minHeight: 180 }}
    >
      {/* Reklam üstü metin ve kapatma */}
      <div className="w-full max-w-[1240px] flex justify-end items-start text-xs text-gray-400 pt-2 pr-2 relative">
        ADVERTISEMENT
        <button
          className="ml-2 p-1 hover:bg-gray-200 rounded transition absolute right-0 top-0"
          aria-label="Reklamı Kapat"
          onClick={() => setVisible(false)}
        >
          <X size={16} />
        </button>
      </div>
      {/* Reklam Bannerı */}
      <div className="flex w-full justify-center items-center py-2">
        <a
          href="https://net-haberler.com/mobilya"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src="/assets/banner-demo.svg"
            alt="Evinizi Baştan Yaratın! Mobilya Kampanyası"
            className="rounded shadow object-cover"
            style={{
              width: "1200px",
              height: "250px",
              maxWidth: "100%",
              maxHeight: "250px",
              display: "block",
              margin: "0 auto",
              background: "#f5f5f5"
            }}
            width={1200}
            height={250}
            priority
          />
        </a>
      </div>
    </div>
  );
}
