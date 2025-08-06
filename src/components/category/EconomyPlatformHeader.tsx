"use client";

import { TrendingUp, DollarSign, BarChart3, PiggyBank } from "lucide-react";

export default function EconomyPlatformHeader() {
  return (
    <div className="text-center py-12 px-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-4 rounded-2xl shadow-lg transform rotate-12">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg transform -rotate-6">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg transform rotate-12">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-red-600 p-4 rounded-2xl shadow-lg transform -rotate-6">
          <PiggyBank className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Ekonomi Platformu
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Borsa analizi, döviz kurları, enflasyon verileri ve ekonomi dünyasından güncel gelişmeleri takip edin. 
        Finansal veriler ve uzman analizleriyle ekonomiyi anlayın.
      </p>
      
      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Gerçek Zamanlı Veriler</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Uzman Analizi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Finans Haberleri</span>
        </div>
      </div>
    </div>
  );
}
