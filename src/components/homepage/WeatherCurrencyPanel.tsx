export default function WeatherCurrencyPanel() {
  return (
    <div className="container mx-auto flex flex-col sm:flex-row justify-center gap-4 py-4 px-4">
      {/* Hava Durumu */}
      <div className="flex items-center gap-3 bg-white rounded-2xl shadow p-4 w-full sm:w-auto max-w-xs border border-yellow-100">
        <div className="text-yellow-400">
          {/* Modern güneşli/bulutlu animasyonlu ikon */}
          <svg width={40} height={40} fill="none" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="11" fill="#FFD600" />
            <ellipse cx="27" cy="28" rx="7" ry="4" fill="#dbeafe" />
            <ellipse cx="16" cy="27" rx="6" ry="3" fill="#f3f4f6" />
            <ellipse cx="23" cy="23" rx="10" ry="6" fill="#fff" fillOpacity=".4" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg text-gray-800">İstanbul</p>
          <p className="text-gray-500 text-sm">31°C, Parçalı Bulutlu</p>
        </div>
      </div>

      {/* Döviz Kurları */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow p-4 w-full sm:w-auto max-w-xs flex justify-center gap-6 text-gray-900 font-semibold text-lg border border-green-100">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">$</span>
          <span>USD:</span>
          <span className="ml-1 font-bold text-green-700 tracking-wider">33.50</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold">€</span>
          <span>EUR:</span>
          <span className="ml-1 font-bold text-green-700 tracking-wider">36.25</span>
        </div>
      </div>
    </div>
  );
}
