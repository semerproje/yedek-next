import { useState } from 'react';

const EkonomiThemes = () => {
  const [selectedTheme, setSelectedTheme] = useState('borsa');

  const themes = [
    { id: 'borsa', name: 'Borsa', count: 45, color: 'bg-blue-500' },
    { id: 'doviz', name: 'Döviz', count: 32, color: 'bg-green-500' },
    { id: 'finans', name: 'Finans', count: 28, color: 'bg-purple-500' },
    { id: 'enerji', name: 'Enerji', count: 24, color: 'bg-orange-500' },
    { id: 'sanayi', name: 'Sanayi', count: 21, color: 'bg-red-500' },
    { id: 'turizm', name: 'Turizm', count: 18, color: 'bg-teal-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekonomi Konuları</h3>
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              selectedTheme === theme.id
                ? 'border-blue-200 bg-blue-50 text-blue-900'
                : 'border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${theme.color}`}></div>
              <span className="font-medium">{theme.name}</span>
            </div>
            <span className="text-sm text-gray-500">{theme.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EkonomiThemes;
