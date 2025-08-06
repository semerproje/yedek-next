import { TrendingUp, DollarSign, BarChart3, Building2 } from 'lucide-react';

const EkonomiSummaryCards = () => {
  const summaryData = [
    {
      title: 'Borsa İstanbul',
      value: '8.247,32',
      change: '+2.34%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'BIST 100 endeksi günlük değişim'
    },
    {
      title: 'USD/TRY',
      value: '34,28',
      change: '-0.12%',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Dolar kuru anlık değer'
    },
    {
      title: 'Enflasyon',
      value: '%42,8',
      change: '+1.2%',
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Yıllık tüketici enflasyonu'
    },
    {
      title: 'Faiz',
      value: '%45,0',
      change: '0.0%',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'TCMB politika faizi'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Piyasa Özeti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className={`text-sm font-medium ${item.change.startsWith('+') ? 'text-green-600' : item.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {item.change}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.value}</h3>
              <p className="text-sm font-medium text-gray-700 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EkonomiSummaryCards;
