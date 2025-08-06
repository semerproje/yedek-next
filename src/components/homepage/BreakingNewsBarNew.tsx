"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, getDocs, where, orderBy, limit, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { News, ModuleSettings } from "@/types/homepage";

interface BreakingNewsBarProps {
  moduleId?: string;
  manualNewsIds?: string[];
  autoFetch?: boolean;
  newsCount?: number;
  settings?: ModuleSettings;
}

// Fallback breaking news
const fallbackBreaking = [
  {
    id: "breaking-1",
    title: "Son dakika: Ekonomide yeni gelişmeler yaşanıyor",
    summary: "Ekonomi alanında önemli gelişmeler...",
    content: "Detaylı ekonomi haberi...",
    category: "ekonomi",
    images: [],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published" as const,
    views: 0,
    tags: ["ekonomi", "son dakika"],
    breaking: true,
    urgent: true,
    featured: false
  },
  {
    id: "breaking-2", 
    title: "Teknoloji sektöründe büyük yatırım",
    summary: "Teknoloji yatırımlarında artış...",
    content: "Detaylı teknoloji haberi...",
    category: "teknoloji",
    images: [],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published" as const,
    views: 0,
    tags: ["teknoloji", "yatırım"],
    breaking: true,
    urgent: true,
    featured: false
  },
  {
    id: "breaking-3",
    title: "Spor dünyasından önemli transfer haberi",
    summary: "Transfer sezonunda önemli gelişme...",
    content: "Detaylı spor haberi...",
    category: "spor",
    images: [],
    author: "Editör",
    source: "NetNext",
    createdAt: new Date(),
    publishedAt: new Date(),
    status: "published" as const,
    views: 0,
    tags: ["spor", "transfer"],
    breaking: true,
    urgent: true,
    featured: false
  }
];

export default function BreakingNewsBar({
  moduleId,
  manualNewsIds = [],
  autoFetch = true,
  newsCount = 5,
  settings = {
    autoRotate: true,
    rotateInterval: 5000,
    showIcon: true,
    backgroundColor: 'red'
  }
}: BreakingNewsBarProps) {
  const [breakingNews, setBreakingNews] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    const cooldownTime = 30000; // 30 saniye cooldown
    
    // Sadece cooldown süresi geçtiyse ve retry limiti aşılmadıysa yükle
    if ((!hasError || retryCount < 3) && (now - lastAttempt > cooldownTime)) {
      loadBreakingNews();
    }
  }, [manualNewsIds, autoFetch, newsCount]);

  useEffect(() => {
    if (!settings?.autoRotate || breakingNews.length <= 1) return;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, settings.rotateInterval || 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, breakingNews.length, settings?.autoRotate, settings?.rotateInterval]);

  const loadBreakingNews = async () => {
    try {
      setLoading(true);
      setHasError(false);
      setLastAttempt(Date.now());
      let newsData: News[] = [];

      // Manuel seçim varsa bu haberleri getir
      if (manualNewsIds.length > 0) {
        const manualQuery = query(
          collection(db, 'news'),
          where(documentId(), 'in', manualNewsIds.slice(0, 10)),
          where('status', '==', 'published')
        );
        
        const snapshot = await getDocs(manualQuery);
        newsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Başlık Bulunamadı',
            summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
            content: data.content || '',
            category: data.category || 'Genel',
            images: data.images || [],
            author: data.author || 'Editör',
            source: data.source || 'NetNext',
            createdAt: data.createdAt,
            publishedAt: data.publishedAt,
            status: data.status,
            views: data.views || 0,
            tags: data.tags || [],
            breaking: data.breaking || false,
            urgent: data.urgent || false,
            featured: data.featured || false
          } as News;
        });

        // Manuel seçili haberleri sırayla dizle
        newsData = manualNewsIds.map(id => newsData.find(n => n.id === id)).filter(Boolean) as News[];
      }

      // Otomatik seçim veya manuel seçim yeterli değilse
      if (autoFetch && newsData.length < newsCount) {
        const neededCount = newsCount - newsData.length;
        const existingIds = newsData.map(n => n.id);
        
        // Breaking news için önce breaking=true olan haberleri getir
        // Firebase composite index gereksinimi nedeniyle ayrı sorgular yapıyoruz
        const breakingQuery = query(
          collection(db, 'news'),
          where('breaking', '==', true),
          where('status', '==', 'published'),
          limit(neededCount + existingIds.length)
        );
        
        const snapshot = await getDocs(breakingQuery);
        const autoNews = snapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Başlık Bulunamadı',
              summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
              content: data.content || '',
              category: data.category || 'Genel',
              images: data.images || [],
              author: data.author || 'Editör',
              source: data.source || 'NetNext',
              createdAt: data.createdAt,
              publishedAt: data.publishedAt,
              status: data.status,
              views: data.views || 0,
              tags: data.tags || [],
              breaking: data.breaking || false,
              urgent: data.urgent || false,
              featured: data.featured || false
            } as News;
          })
          .filter(n => !existingIds.includes(n.id))
          .sort((a, b) => {
            // Tarihe göre sıralama (en yeni önce)
            const dateA = a.publishedAt?.toDate?.() || a.publishedAt || new Date(0);
            const dateB = b.publishedAt?.toDate?.() || b.publishedAt || new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, neededCount);

        newsData = [...newsData, ...autoNews];
      }
      
      if (newsData.length > 0) {
        setBreakingNews(newsData);
        setRetryCount(0); // Reset retry count on success
      } else {
        // Sadece ilk denemede log yaz
        if (retryCount === 0) {
          console.log('No breaking news found, using fallback');
        }
        setBreakingNews(fallbackBreaking);
      }
    } catch (error: any) {
      console.warn('Breaking news loading error:', error?.message || error);
      
      // Firebase index hatası durumunda daha basit bir sorgu dene
      if (error?.code === 'failed-precondition' || error?.message?.includes('requires an index')) {
        try {
          console.log('Trying simpler query due to index requirement...');
          const simpleQuery = query(
            collection(db, 'news'),
            where('status', '==', 'published'),
            limit(newsCount)
          );
          
          const snapshot = await getDocs(simpleQuery);
          const simpleNews = snapshot.docs
            .map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || 'Başlık Bulunamadı',
                summary: data.summary || data.content?.substring(0, 200) || 'Özet bulunamadı',
                content: data.content || '',
                category: data.category || 'Genel',
                images: data.images || [],
                author: data.author || 'Editör',
                source: data.source || 'NetNext',
                createdAt: data.createdAt,
                publishedAt: data.publishedAt,
                status: data.status,
                views: data.views || 0,
                tags: data.tags || [],
                breaking: data.breaking || false,
                urgent: data.urgent || false,
                featured: data.featured || false
              } as News;
            })
            .filter(n => n.breaking) // Client-side filtering for breaking news
            .slice(0, newsCount);
            
          if (simpleNews.length > 0) {
            setBreakingNews(simpleNews);
            return;
          }
        } catch (simpleError) {
          console.warn('Simple query also failed:', simpleError);
        }
      }
      
      setHasError(true);
      setRetryCount(prev => prev + 1);
      setBreakingNews(fallbackBreaking);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 rounded-b-2xl shadow mb-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span className="text-sm">Son dakika haberleri yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) {
    return null;
  }

  const current = breakingNews[currentIndex];
  const bgColor = settings?.backgroundColor === 'blue' ? 'from-blue-600 to-blue-800' : 
                  settings?.backgroundColor === 'black' ? 'from-gray-800 to-black' :
                  'from-red-600 to-red-800';

  return (
    <div
      className={`w-full bg-gradient-to-r ${bgColor} text-white py-2 px-4 rounded-b-2xl shadow mb-4 select-none flex flex-wrap items-center justify-center`}
      style={{ minHeight: 40 }}
    >
      <div className="flex-shrink-0 font-bold mr-3 whitespace-nowrap text-center w-full sm:w-auto mb-1 sm:mb-0">
        {settings?.showIcon && <span className="mr-1">🚨</span>}
        Son Dakika:
      </div>
      
      <Link
        href={`/haber/${current.id}`}
        className="font-semibold hover:underline text-white text-base sm:text-lg transition-colors flex-1 text-center sm:text-left"
      >
        {current.title}
      </Link>
      
      {breakingNews.length > 1 && (
        <div className="flex items-center space-x-1 ml-3">
          {breakingNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`${index + 1}. habere git`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
