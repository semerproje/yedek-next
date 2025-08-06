import React, { useRef, useEffect, useState } from "react";

const DATA = [
  { label: "Dolar", value: "33.20 ₺", change: "+0.21%" },
  { label: "Euro", value: "36.45 ₺", change: "-0.10%" },
  { label: "Altın", value: "2.570 ₺", change: "+0.08%" },
  { label: "Bitcoin", value: "66.000 $", change: "+1.12%" },
  { label: "Ethereum", value: "3.300 $", change: "-0.38%" },
  { label: "BIST 100", value: "10.850", change: "+0.47%" },
  { label: "Sterlin", value: "42.30 ₺", change: "+0.15%" },
  { label: "Gram Gümüş", value: "32.80 ₺", change: "+0.02%" },
];

export default function MoneyMarketsTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const changeColor = (change: string) =>
    change.startsWith("+") ? "text-green-600" : "text-red-600";

  return (
    <div className="w-full bg-white border-y border-gray-200 shadow relative overflow-hidden select-none">
      <div className="absolute left-0 top-0 h-full w-14 flex items-center justify-center z-10 bg-gradient-to-r from-white via-white/80 to-transparent">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="12" fill="#232323" />
          <path d="M8 12h8M12 8l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        ref={tickerRef}
        className={`flex gap-7 whitespace-nowrap items-center py-2 pl-14 pr-4 ${animate ? "animate-ticker" : ""}`}
        style={{ animationDuration: "38s" }}
      >
        {[...DATA, ...DATA].map((item, idx) => (
          <span key={idx} className="flex items-center gap-2 text-base font-semibold text-gray-800 min-w-max">
            <span className="text-gray-600">{item.label}:</span>
            <span>{item.value}</span>
            <span className={`${changeColor(item.change)} text-sm font-bold`}>{item.change}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker linear infinite;
        }
      `}</style>
    </div>
  );
}
