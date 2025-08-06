import React from 'react'
import { Bot, Target, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

interface CategoryAnalysisProps {
  news: Array<{
    id: string
    title: string
    category: string
    categoryName: string
    enhancedCategory?: string
    categoryHints?: string[]
    aiProcessed?: boolean
    originalCategory?: string
  }>
}

const CategoryAnalysisPanel: React.FC<CategoryAnalysisProps> = ({ news }) => {
  // Kategori dağılımını hesapla
  const categoryDistribution = news.reduce((acc, item) => {
    const category = item.enhancedCategory || item.categoryName || 'Bilinmeyen'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // AI işlenmiş haberleri say
  const aiProcessedCount = news.filter(item => item.aiProcessed).length
  const totalCount = news.length
  const aiProcessedPercentage = totalCount > 0 ? Math.round((aiProcessedCount / totalCount) * 100) : 0

  // Kategori değişiklikleri
  const categoryChanges = news.filter(item => 
    item.enhancedCategory && 
    item.categoryName && 
    item.enhancedCategory !== item.categoryName
  )

  const categoryColors: Record<string, string> = {
    'Gündem': '#ef4444',
    'Ekonomi': '#f97316', 
    'Dünya': '#eab308',
    'Teknoloji': '#22c55e',
    'Spor': '#3b82f6',
    'Sağlık': '#8b5cf6',
    'Kültür': '#ec4899',
    'Magazin': '#f59e0b',
    'Çevre': '#10b981',
    'Politika': '#6366f1',
    'Eğitim': '#84cc16',
    'Din': '#14b8a6'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Kategori Analizi</h3>
      </div>

      {/* AI İşleme İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI İşlenmiş</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{aiProcessedCount}</div>
          <div className="text-sm text-blue-600">%{aiProcessedPercentage} toplam</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Kategori Değişimi</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{categoryChanges.length}</div>
          <div className="text-sm text-green-600">AI tarafından güncellendi</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Toplam Kategori</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{Object.keys(categoryDistribution).length}</div>
          <div className="text-sm text-purple-600">farklı kategori</div>
        </div>
      </div>

      {/* Kategori Dağılımı */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Kategori Dağılımı</h4>
        <div className="space-y-2">
          {Object.entries(categoryDistribution)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([category, count]) => {
              const percentage = Math.round((count / totalCount) * 100)
              const color = categoryColors[category] || '#6b7280'
              
              return (
                <div key={category} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">{count} (%{percentage})</span>
                  </div>
                  <div className="w-20">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Kategori Değişiklikleri */}
      {categoryChanges.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">AI Kategori Güncellemeleri</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categoryChanges.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.title.substring(0, 40)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.categoryName} → {item.enhancedCategory}
                  </div>
                </div>
              </div>
            ))}
            {categoryChanges.length > 5 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                +{categoryChanges.length - 5} daha fazla değişiklik
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryAnalysisPanel
