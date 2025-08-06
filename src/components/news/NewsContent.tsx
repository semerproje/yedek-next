"use client";

import { useState } from "react";
import Image from "next/image";
import { Type, Minus, Plus, Copy, Check } from "lucide-react";

interface NewsContentProps {
  news: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar: string;
      bio: string;
      twitter: string;
      articles: number;
    };
    tags: string[];
    images?: Array<{url: string; desc: string}>;
    videos?: Array<{url: string; desc: string}>;
    source?: string;
  };
}

export default function NewsContent({ news }: NewsContentProps) {
  const [fontSize, setFontSize] = useState(16);
  const [isCopied, setIsCopied] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(prev => prev + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(prev => prev - 2);
  };

  const copyArticle = async () => {
    try {
      // Create clean text from HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = news.content;
      const cleanText = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(`${news.title}\n\n${cleanText}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      
      {/* Article Tools */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yazı Boyutu:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 12}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[2rem] text-center">
              {fontSize}px
            </span>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          onClick={copyArticle}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          {isCopied ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-green-600">Kopyalandı!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Metni Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* Article Content */}
      <div className="p-6 lg:p-8">
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* AA Media Gallery - if this is from AA source */}
        {news.source === 'anadolu_ajansi' && ((news.images && news.images.length > 0) || (news.videos && news.videos.length > 0)) && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Medya Galerisi
            </h3>
            
            {/* Images */}
            {news.images && news.images.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                  Fotoğraflar ({news.images.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.images.map((image, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                      {image.url && (
                        <Image
                          src={image.url}
                          alt={image.desc || `Fotoğraf ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      {image.desc && (
                        <div className="p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{image.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Videos */}
            {news.videos && news.videos.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                  Videolar ({news.videos.length})
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {news.videos.map((video, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                      {video.url && (
                        <video
                          controls
                          className="w-full h-64 object-cover"
                          poster={news.images?.[0]?.url}
                        >
                          <source src={video.url} type="video/mp4" />
                          <p className="p-4 text-center text-gray-600 dark:text-gray-300">
                            Video oynatıcınız bu formatı desteklemiyor.
                          </p>
                        </video>
                      )}
                      {video.desc && (
                        <div className="p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{video.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Article Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          
          {/* Author Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Image
                src={news.author.avatar}
                alt={news.author.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {news.author.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  {news.author.bio}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{news.author.articles} makale</span>
                  <a 
                    href={`https://twitter.com/${news.author.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {news.author.twitter}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Article Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button className="flex-1 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">← Önceki Haber</div>
              <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                Teknoloji Devlerinin Yapay Zeka Yarışı Hızlanıyor
              </div>
            </button>
            
            <button className="flex-1 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sonraki Haber →</div>
              <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
                Süper Lig'de Haftanın Maçı: Galatasaray - Fenerbahçe
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
