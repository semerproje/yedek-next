import React from "react";
import { PlayCircle } from "lucide-react";

export default function EconomyVideoPanel() {
  return (
    <div
      className="bg-white dark:bg-[#232c3a]/90 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-[#2a3142] px-7 py-6 flex flex-col w-full transition-all"
      style={{
        maxWidth: "1120px",
        minWidth: "380px",
        minHeight: "370px",
      }}
    >
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-3">
        <PlayCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
        <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Ekonomi Video: Haftanın Özeti
        </span>
      </div>
      <div
        className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100 flex justify-center items-center w-full"
        style={{ minHeight: 420, height: 460, maxHeight: 480 }}
      >
        <iframe
          src="https://www.youtube.com/embed/DFjC9ycQY4Y"
          title="Ekonomi Analiz Video"
          allowFullScreen
          className="w-full h-full"
          style={{ minHeight: 420, height: 460 }}
          loading="lazy"
        />
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">
        Haftanın ekonomik gelişmeleri ve piyasa analiz videosu.
      </div>
    </div>
  );
}
