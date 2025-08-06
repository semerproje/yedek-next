"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

export default function GundemAiPanel() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // AI API entegrasyonu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    try {
      const response = await fetch("/api/ai/gundem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setAiResult(data.result || "Yapay Zeka yanıtı alınamadı.");
    } catch (err) {
      setAiResult("Yapay Zeka yanıtı alınamadı.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/90 dark:bg-[#232c3a]/90 rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 p-6 md:p-8 flex flex-col h-full min-h-[480px] justify-between transition-all duration-300 backdrop-blur-lg">
      {/* Başlık ve Form */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Yapay Zeka Gündem Asistanı</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row mb-2" autoComplete="off">
          <input
            type="text"
            className="flex-1 border border-blue-100 dark:border-neutral-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 text-gray-900 dark:text-white bg-white dark:bg-neutral-900 transition"
            placeholder="Gündemle ilgili sorunuzu yazın..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
            aria-label="Gündem Sorusu"
            maxLength={160}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-semibold shadow transition disabled:opacity-60"
            disabled={loading || !input}
            aria-busy={loading}
          >
            {loading ? "Yapay Zeka Yanıtlıyor..." : "Öneri Al"}
          </button>
        </form>
        {aiResult && (
          <div className="mt-2 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-900 rounded-xl px-4 py-3 text-sm">
            <span className="font-semibold">AI Yanıtı:</span> {aiResult}
          </div>
        )}
      </div>
      {/* Dipnot */}
      <div className="mt-8 pt-3 border-t border-gray-100 dark:border-neutral-700 flex flex-col md:flex-row gap-3 items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">AI destekli hızlı analiz ve trend tespiti, beta sürümünde sunulmaktadır.</span>
        <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Toplumsal gündem değişimlerine dair yeni analizler için yakında!</span>
      </div>
    </div>
  );
}
