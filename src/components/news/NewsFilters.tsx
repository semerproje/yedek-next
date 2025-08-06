"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Tag, TrendingUp, Clock } from "lucide-react";
import { useNewsFilters } from "@/contexts/NewsFiltersContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const baseCategories = [
  { id: "all", label: "Tümü" },
  { id: "gundem", label: "Gündem" },
  { id: "ekonomi", label: "Ekonomi" },
  { id: "spor", label: "Spor" },
  { id: "teknoloji", label: "Teknoloji" },
  { id: "dunya", label: "Dünya" },
  { id: "saglik", label: "Sağlık" },
  { id: "kultur", label: "Kültür" },
  { id: "magazin", label: "Magazin" },
  { id: "cevre", label: "Çevre" },
  { id: "politika", label: "Politika" },
  { id: "egitim", label: "Eğitim" },
  { id: "din", label: "Din" }
];

const timeFilters = [
  { id: "all", label: "Tüm Zamanlar" },
  { id: "today", label: "Bugün" },
  { id: "week", label: "Bu Hafta" },
  { id: "month", label: "Bu Ay" },
  { id: "year", label: "Bu Yıl" }
];

const sortOptions = [
  { id: "newest", label: "En Yeni", icon: <Clock size={16} /> },
  { id: "popular", label: "En Popüler", icon: <TrendingUp size={16} /> },
  { id: "trending", label: "Trend", icon: <TrendingUp size={16} /> }
];

export default function NewsFilters() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTime,
    setSelectedTime,
    selectedSort,
    setSelectedSort,
    clearFilters
  } = useNewsFilters();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState(baseCategories.map(cat => ({ ...cat, count: "0" })));
  const [totalCount, setTotalCount] = useState(0);

  // Firebase'den kategori sayılarını getir
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        // Toplam haber sayısı
        const allNewsQuery = query(collection(db, 'news'), where('status', '==', 'published'));
        const allNewsSnapshot = await getDocs(allNewsQuery);
        const total = allNewsSnapshot.size;
        setTotalCount(total);

        // Her kategori için sayıları getir
        const updatedCategories = await Promise.all(
          baseCategories.map(async (category) => {
            if (category.id === 'all') {
              return { ...category, count: total.toString() };
            }

            const categoryQuery = query(
              collection(db, 'news'),
              where('status', '==', 'published'),
              where('category', '==', category.id)
            );
            const categorySnapshot = await getDocs(categoryQuery);
            return { ...category, count: categorySnapshot.size.toString() };
          })
        );

        setCategories(updatedCategories);
      } catch (error) {
        console.error('Kategori sayıları getirilemedi:', error);
        // Hata durumunda varsayılan sayıları kullan
        setCategories(baseCategories.map(cat => ({ ...cat, count: "0" })));
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtreler</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAdvanced ? "Basit Görünüm" : "Gelişmiş Filtreler"}
        </button>
      </div>

      {/* Arama */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Haberlerde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Kategoriler */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Tag size={16} />
          Kategoriler
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {showAdvanced && (
        <div className="space-y-6">
          {/* Zaman Filtresi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Zaman Aralığı
            </h3>
            <div className="flex flex-wrap gap-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedTime(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTime === filter.id
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sıralama */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sıralama</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedSort === option.id
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Aktif Filtreler */}
      {(selectedCategory !== "all" || selectedTime !== "all" || searchTerm) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCategory !== "all" 
                ? categories.find(c => c.id === selectedCategory)?.count || "0"
                : totalCount
              } haber bulundu
            </span>
            <button
              onClick={() => {
                clearFilters();
              }}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
