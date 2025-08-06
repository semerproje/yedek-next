import React from "react";
import { Globe, TrendingUp, Building, Users, Landmark, Shield } from "lucide-react";

const themes = [
  { icon: <Globe className="w-5 h-5 text-blue-500" />, name: "Uluslararası" },
  { icon: <TrendingUp className="w-5 h-5 text-green-600" />, name: "Ekonomi" },
  { icon: <Building className="w-5 h-5 text-gray-700" />, name: "AB & NATO" },
  { icon: <Users className="w-5 h-5 text-purple-500" />, name: "Toplum" },
  { icon: <Landmark className="w-5 h-5 text-yellow-500" />, name: "Politika" },
  { icon: <Shield className="w-5 h-5 text-red-600" />, name: "Güvenlik" },
];

export default function WorldThemes() {
  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {themes.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition select-none cursor-pointer"
        >
          {t.icon}
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  );
}
