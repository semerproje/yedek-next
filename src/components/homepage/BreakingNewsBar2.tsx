"use client";

import React from "react";

export default function BreakingNewsBar() {
  const breakingNews = [
    "Son dakika: Ekonomide yeni gelişmeler yaşanıyor",
    "Teknoloji sektöründe büyük yatırım",
    "Spor dünyasından önemli transfer haberi"
  ];

  return (
    <div className="bg-red-600 text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="bg-white text-red-600 px-2 py-1 text-xs font-bold rounded mr-4">
            SON DAKİKA
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="whitespace-nowrap">
              {breakingNews.join(" • ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
