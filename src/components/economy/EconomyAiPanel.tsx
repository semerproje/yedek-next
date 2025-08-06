"use client";
import React, { useState } from "react";
import { Sparkles, Lightbulb, MessageCircle } from "lucide-react";

const exampleAiRecommendations = [
  {
    icon: <Sparkles className="w-6 h-6 text-blue-500" />,
    title: "Yatırım Fırsatı",
    text: "Uzun vadeli tahviller ve altın portföylerde artan ilgi görüyor. BIST 100’de sanayi hisseleri ön planda.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: "Tasarruf Uyarısı",
    text: "Enflasyonist ortamda TL mevduatları kısa vadeli değerlendirin, volatiliteye dikkat edin.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-emerald-500" />,
    title: "Ekonomi Sorusu",
    text: "‘Kripto paralarda son düşüş kalıcı mı?’ Uzmanlar ve AI’mız risk yönetimine odaklanıyor.",
  },
];

export default function EconomyAiPanel() {
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAskAi(e: React.FormEvent) {
    e.preventDefault();
    setAiLoading(true);
    setAiOutput(null);
    setTimeout(() => {
      setAiOutput(
        aiInput.toLowerCase().includes("dolar")
          ? "Yapay Zeka Tahmini: Dolar/TL kuru kısa vadede dalgalı seyreder. Uzmanlar, Merkez Bankası’nın adımlarına dikkat çekiyor."
          : "AI Önerisi: Portföyünüzü çeşitlendirerek riskinizi dağıtabilirsiniz. Detaylı analiz için uzman görüşleri alın."
      );
      setAiLoading(false);
    }, 1500);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol tarafta AI paneli */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-lg md:text-xl font-bold text-gray-900">Yapay Zeka Ekonomi Asistanı</span>
            </div>
            <form onSubmit={handleAskAi} className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ekonomiyle ilgili sorunuzu yazın (örn. 'Dolar ne olur?')"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                disabled={aiLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-xl px-5 py-2 font-semibold hover:bg-blue-700 transition"
                disabled={aiLoading || !aiInput.trim()}
              >
                {aiLoading ? "Yanıtlanıyor..." : "Sor"}
              </button>
            </form>
            {aiOutput && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-900 shadow-inner">
                {aiOutput}
              </div>
            )}
          </div>
          <div className="mt-6">
            <div className="font-semibold text-gray-700 mb-2">AI Önerileri</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exampleAiRecommendations.map((rec, idx) => (
                <div key={idx} className="flex flex-col items-start gap-2 bg-blue-50 rounded-xl p-3 shadow">
                  {rec.icon}
                  <div className="font-bold text-blue-900">{rec.title}</div>
                  <div className="text-sm text-blue-800">{rec.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Sağda boş alan veya ek panel yeri */}
        <div className="hidden md:block col-span-1" />
      </div>
    </div>
  );
}
