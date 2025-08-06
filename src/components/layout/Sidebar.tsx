"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  X, Newspaper, PieChart, Globe2, MonitorSmartphone, Dumbbell, Stethoscope, Palette, Sparkles, Leaf
} from "lucide-react";
import logo from "@/../public/assets/logo.png";

const categories = [
  { key: "gundem", label: "Gündem", to: "/kategori/gundem", icon: <Newspaper size={20} /> },
  { key: "ekonomi", label: "Ekonomi", to: "/kategori/ekonomi", icon: <PieChart size={20} /> },
  { key: "dunya", label: "Dünya", to: "/kategori/dunya", icon: <Globe2 size={20} /> },
  { key: "teknoloji", label: "Teknoloji", to: "/kategori/teknoloji", icon: <MonitorSmartphone size={20} /> },
  { key: "spor", label: "Spor", to: "/kategori/spor", live: true, icon: <Dumbbell size={20} /> },
  { key: "saglik", label: "Sağlık", to: "/kategori/saglik", icon: <Stethoscope size={20} /> },
  { key: "kultur", label: "Kültür", to: "/kategori/kultur", icon: <Palette size={20} /> },
  { key: "magazin", label: "Magazin", to: "/kategori/magazin", icon: <Sparkles size={20} /> },
  { key: "cevre", label: "Çevre", to: "/kategori/cevre", icon: <Leaf size={20} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter(cat => cat.label.toLowerCase().includes(lower));
  }, [searchTerm]);

  return (
    <>
      {/* Arka Plan Maskesi */}
      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"} md:hidden`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar Kutusu */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigasyonu"
        className={`fixed top-0 left-0 h-full w-full md:w-72 bg-white dark:bg-gray-900 shadow-2xl z-60 transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
      >
        {/* Üst Kısım: Logo ve Kapat Butonu */}
        <div className="relative flex items-center justify-center p-6 border-b border-gray-300 dark:border-gray-700">
          <Link href="/" onClick={onClose} aria-label="Anasayfa">
            <Image
              src={logo}
              alt="Net Haberler Logo"
              className="w-auto object-contain"
              draggable={false}
              width={120}
              height={64}
              priority
              style={{ height: "auto" }}
            />
          </Link>
          <button
            aria-label="Menüyü Kapat"
            onClick={onClose}
            className="absolute right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
            type="button"
          >
            <X size={32} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        {/* Arama Kutusu */}
        <div className="p-5 border-b border-gray-300 dark:border-gray-700">
          <input
            type="search"
            aria-label="Kategori ara"
            placeholder="Haberlerde ara..."
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
        {/* Kategori Listesi */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900 p-5 space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold mb-4 select-none">
            Kategoriler
          </div>
          {filteredCategories.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 font-medium mt-6 select-none">
              Aramanıza uygun kategori bulunamadı.
            </div>
          ) : (
            filteredCategories.map(cat => (
              <Link
                key={cat.key}
                href={cat.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-lg transition-colors duration-150 ${
                  pathname === cat.to
                    ? "bg-blue-700 text-white shadow-lg"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
                aria-current={pathname === cat.to ? "page" : undefined}
              >
                <span className="flex-shrink-0">{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.live && (
                  <span className="ml-auto px-3 py-1 bg-red-600 text-white text-xs rounded font-bold animate-pulse select-none">
                    CANLI
                  </span>
                )}
              </Link>
            ))
          )}
        </nav>
        {/* Alt Butonlar */}
        <div className="p-6 border-t border-gray-300 dark:border-gray-700 flex gap-4">
          <Link href="/register" className="flex-1">
            <button className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-900 dark:hover:bg-gray-700 transition" type="button">
              Kayıt Ol
            </button>
          </Link>
          <Link href="/login" className="flex-1">
            <button className="w-full py-3 border-2 border-black text-black font-bold rounded-md hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition" type="button">
              Giriş Yap
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
