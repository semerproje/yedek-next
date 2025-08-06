"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Newspaper,
  PieChart,
  Globe2,
  MonitorSmartphone,
  Dumbbell,
  Stethoscope,
  Palette,
  Sparkles,
  Leaf,
  Landmark,
  GraduationCap,
  BookOpen
} from "lucide-react";
import Sidebar from "./Sidebar";
// import HeaderAdBanner from "./HeaderAdBanner";

const categories = [
  { key: "gundem",    label: "Gündem",    to: "/kategori/gundem",    icon: <Newspaper size={18} /> },
  { key: "ekonomi",   label: "Ekonomi",   to: "/kategori/ekonomi",   icon: <PieChart size={18} /> },
  { key: "dunya",     label: "Dünya",     to: "/kategori/dunya",     icon: <Globe2 size={18} /> },
  { key: "teknoloji", label: "Teknoloji", to: "/kategori/teknoloji", icon: <MonitorSmartphone size={18} /> },
  { key: "spor",      label: "Spor",      to: "/kategori/spor",      icon: <Dumbbell size={18} /> },
  { key: "saglik",    label: "Sağlık",    to: "/kategori/saglik",    icon: <Stethoscope size={18} /> },
  { key: "kultur",    label: "Kültür",    to: "/kategori/kultur",    icon: <Palette size={18} /> },
  { key: "magazin",   label: "Magazin",   to: "/kategori/magazin",   icon: <Sparkles size={18} /> },
  { key: "cevre",     label: "Çevre",     to: "/kategori/cevre",     icon: <Leaf size={18} /> },
  { key: "politika",  label: "Politika",  to: "/kategori/politika",  icon: <Landmark size={18} /> },
  { key: "egitim",    label: "Eğitim",    to: "/kategori/egitim",    icon: <GraduationCap size={18} /> },
  { key: "din",       label: "Din",       to: "/kategori/din",       icon: <BookOpen size={18} /> }
];

export default function WebsiteHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // ThemeSwitcher component placeholder
  const ThemeSwitcher = () => <div>Theme</div>;

  return (
    <>
      {/* <HeaderAdBanner /> */}

      <header className="sticky top-0 z-40 bg-white shadow border-b border-gray-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
          {/* Menü Butonu (Mobil) */}
          <button
            className="flex items-center justify-center h-10 w-10 text-black"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menü Aç"
          >
            <Menu size={28} />
          </button>

          {/* Ortalanmış Logo - Çerçevesiz ve gölgesiz */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <img
                src="/assets/logo.png"
                alt="Net Haberler Logo"
                className="h-14 w-auto object-contain select-none"
                style={{
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  borderRadius: 0,
                  padding: 0,
                }}
                draggable={false}
              />
            </Link>
          </div>

          {/* Sağ Butonlar */}
          <div className="hidden md:flex gap-3 items-center ml-auto">
            <button
              className="px-5 py-2 bg-black text-white font-bold hover:bg-gray-900 transition rounded"
              onClick={() => window.location.href = "/register"}
            >
              Kayıt Ol
            </button>
            <button
              className="px-5 py-2 border-2 border-black text-black font-bold hover:bg-black hover:text-white transition rounded"
              onClick={() => window.location.href = "/login"}
            >
              Giriş Yap
            </button>
            <React.Suspense fallback={null}>
              <ThemeSwitcher />
            </React.Suspense>
          </div>
        </div>

        {/* Kategori Menü (ikonu ile) */}
        <div className="hidden md:flex justify-center border-t border-gray-200 bg-gray-50 px-4">
          <nav className="flex items-center gap-6 h-12 text-[15px] font-semibold select-none">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.to}
                className={`pb-1 border-b-2 transition-all flex items-center gap-1 ${
                  pathname === cat.to
                    ? "text-black border-black"
                    : "text-gray-600 border-transparent hover:text-black hover:border-black"
                }`}
              >
                <span
                  className={`transition-all duration-200 flex items-center ${
                    pathname === cat.to ? "scale-125 text-blue-600 drop-shadow-sm" : "text-gray-400"
                  }`}
                >
                  {cat.icon}
                </span>
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Sidebar - mobil */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
