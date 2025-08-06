'use client'

import { useState, useEffect } from 'react'
import NewsCard from '@/components/news/NewsCard'

// Temporary mock data
const mockNews = [
  {
    id: '1',
    title: 'Teknoloji Sektöründe Yeni Gelişmeler',
    description: 'Yapay zeka ve makine öğrenmesi alanında son gelişmeler hakkında detaylı analiz.',
    category: 'Teknoloji',
    publishedAt: new Date().toISOString(),
    imageUrl: '/api/placeholder/400/200',
    author: 'Ahmet Yılmaz'
  },
  {
    id: '2',
    title: 'Ekonomik Göstergeler Pozitif Seyirde',
    description: 'Bu ayın ekonomik verilerinde görülen olumlu trendler ve gelecek projeksiyonları.',
    category: 'Ekonomi',
    publishedAt: new Date().toISOString(),
    imageUrl: '/api/placeholder/400/200',
    author: 'Fatma Kaya'
  },
  {
    id: '3',
    title: 'Spor Dünyasından Haberler',
    description: 'Futbol, basketbol ve diğer spor dallarından en güncel gelişmeler.',
    category: 'Spor',
    publishedAt: new Date().toISOString(),
    imageUrl: '/api/placeholder/400/200',
    author: 'Mehmet Demir'
  }
]

export default function NewsSection() {
  const [news, setNews] = useState(mockNews)
  const [loading, setLoading] = useState(false)

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Son Haberler</h2>
        <p className="text-gray-600">En güncel haberler ve analizler</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Load more button */}
      <div className="text-center mt-8">
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // TODO: Implement load more functionality
            console.log('Load more articles')
          }}
        >
          Daha Fazla Haber Yükle
        </button>
      </div>
    </section>
  )
}
