import React from "react";
import { User2, Activity, Globe2, Users, Feather, Award } from "lucide-react";

// Temalar örnek
const themes = [
  { icon: <User2 className="w-5 h-5 text-blue-500" />, name: "Siyaset" },
  { icon: <Activity className="w-5 h-5 text-rose-500" />, name: "Krizler" },
  { icon: <Globe2 className="w-5 h-5 text-green-600" />, name: "Dünya" },
  { icon: <Users className="w-5 h-5 text-gray-700" />, name: "Toplum" },
  { icon: <Feather className="w-5 h-5 text-yellow-500" />, name: "Kültür & Sanat" },
  { icon: <Award className="w-5 h-5 text-indigo-600" />, name: "Bilim & Spor" },
];

export default function GundemThemes() {
  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {themes.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-semibold text-gray-700 shadow-sm hover:bg-gray-100 transition select-none cursor-pointer"
        >
          {t.icon}
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  );
}
