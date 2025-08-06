'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Eye, Trash2, RefreshCw, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  aaCategory: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  url?: string;
  status: 'draft' | 'published' | 'archived';
  views?: number;
  source: 'aa' | 'manual';
  tags?: string[];
}

export default function NewsListTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const categories = ['all', 'Gündem', 'Spor', 'Ekonomi', 'Teknoloji', 'Kültür', 'Sağlık'];
  const statuses = ['all', 'draft', 'published', 'archived'];

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, selectedStatus]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ultra-premium-aa?action=get-news-list');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news || []);
      } else {
        toast.error('Haberler yüklenemedi');
      }
    } catch (error) {
      console.error('Load news error:', error);
      toast.error('Haberler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/ultra-premium-aa?action=delete-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Haber silindi');
        loadNews();
      } else {
        toast.error(data.error || 'Haber silinemedi');
      }
    } catch (error) {
      console.error('Delete news error:', error);
      toast.error('Haber silinirken hata oluştu');
    }
  };

  const updateNewsStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=update-news-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Haber durumu ${status} olarak güncellendi`);
        loadNews();
      } else {
        toast.error(data.error || 'Haber durumu güncellenemedi');
      }
    } catch (error) {
      console.error('Update news status error:', error);
      toast.error('Haber durumu güncellenirken hata oluştu');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    };
    
    const labels: Record<string, string> = {
      draft: 'Taslak',
      published: 'Yayında',
      archived: 'Arşiv'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Haber Listesi</CardTitle>
          <CardDescription>
            Toplam {news.length} haber bulundu, {filteredNews.length} tanesi gösteriliyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Haber ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Tüm Kategoriler' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tüm Durumlar' : 
                     status === 'draft' ? 'Taslak' :
                     status === 'published' ? 'Yayında' : 'Arşiv'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button onClick={loadNews} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {currentNews.length === 0 ? (
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              Filtrelere uygun haber bulunamadı.
            </AlertDescription>
          </Alert>
        ) : (
          currentNews.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDistanceToNow(new Date(item.publishDate), { 
                              addSuffix: true, 
                              locale: tr 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {item.category}
                          </div>
                          {item.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {item.views}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(item.status)}
                          <Badge variant="outline">
                            {item.source === 'aa' ? 'AA' : 'Manuel'}
                          </Badge>
                          {item.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => updateNewsStatus(item.id, e.target.value)}
                          className="text-xs px-2 py-1 border rounded"
                        >
                          <option value="draft">Taslak</option>
                          <option value="published">Yayında</option>
                          <option value="archived">Arşiv</option>
                        </select>
                        <div className="flex gap-1">
                          {item.url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteNews(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, filteredNews.length)} / {filteredNews.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Önceki
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => {
                const showEllipsis = index > 0 && page - array[index - 1] > 1;
                return (
                  <div key={page} className="flex items-center">
                    {showEllipsis && <span className="px-2">...</span>}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </div>
                );
              })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
