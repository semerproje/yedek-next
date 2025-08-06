"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Users, PieChart } from "lucide-react";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GundemKpiWidget() {
  const [kpi, setKpi] = useState({
    headlineCount: 24,
    reportCount: 8,
    activeEditors: 5,
  });

  useEffect(() => {
    async function fetchKPIs() {
      try {
        if (!db) return;
        
        // Firestore'un yeni "count" özelliği ile süper hızlı sorgu!
        const newsQ = query(collection(db, "news"), where("category", "==", "gundem"));
        const reportQ = query(collection(db, "reports"), where("type", "==", "editor-analysis"));
        const editorsQ = query(collection(db, "users"), where("role", "==", "editor"), where("active", "==", true));

        // getCountFromServer ile hızlıca sayılar çekilir
        const [newsSnap, reportSnap, editorsSnap] = await Promise.all([
          getCountFromServer(newsQ),
          getCountFromServer(reportQ),
          getCountFromServer(editorsQ),
        ]);
        setKpi({
          headlineCount: newsSnap.data().count,
          reportCount: reportSnap.data().count,
          activeEditors: editorsSnap.data().count,
        });
      } catch (error) {
        console.error("KPI veriler alınırken hata:", error);
        // Hata durumunda mock veriler kullan (zaten varsayılan değerler set)
      }
    }
    fetchKPIs();
  }, []);

  const kpiData = [
    {
      icon: <TrendingUp className="w-7 h-7 text-blue-600" />,
      label: "Gündem Başlığı",
      value: kpi.headlineCount,
      desc: "Son 24 saatte işlenen başlık",
    },
    {
      icon: <PieChart className="w-7 h-7 text-indigo-500" />,
      label: "Analiz Raporu",
      value: kpi.reportCount,
      desc: "Editör incelemesi",
    },
    {
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      label: "Aktif Editör",
      value: kpi.activeEditors,
      desc: "Canlı katkı yapan",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
      {kpiData.map((k, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow-xl px-6 py-5 border border-gray-100 dark:border-neutral-800 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          tabIndex={0}
          aria-label={k.label}
        >
          <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
            {k.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{k.value}</span>
            <span className="text-base font-semibold text-gray-600 dark:text-gray-300">{k.label}</span>
            <span className="text-xs text-gray-400 dark:text-gray-400">{k.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
