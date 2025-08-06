import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  description: string
  category: string
  publishedAt: string
  imageUrl: string
  author: string
}

interface NewsCardProps {
  article: Article
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/haber/${article.id}`}>
        <div className="relative h-48 bg-gray-200">
          {/* Placeholder for news image */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-gray-500">Haber Görseli</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(article.publishedAt), { 
                addSuffix: true, 
                locale: tr 
              })}
            </span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {article.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {article.author}
            </span>
            <span className="text-blue-600 hover:text-blue-800 font-medium">
              Devamını oku →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
