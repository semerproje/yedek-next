'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Calendar,
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { 
  NewsML29Document, 
  NewsML29Query, 
  NewsML29Analytics 
} from '@/types/newsml29';

interface NewsML29DashboardProps {}

// Simple toast implementation
const useToast = () => {
  const [toasts, setToasts] = useState<Array<{id: string, title: string, description: string, variant?: 'default' | 'destructive'}>>([]);

  const toast = ({ title, description, variant = 'default' }: {title: string, description: string, variant?: 'default' | 'destructive'}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg max-w-sm ${
            toast.variant === 'destructive' 
              ? 'bg-red-500 text-white' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          <div className="text-sm opacity-90">{toast.description}</div>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
};

export default function NewsML29Dashboard({}: NewsML29DashboardProps) {
  const { toast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<NewsML29Document[]>([]);
  const [analytics, setAnalytics] = useState<NewsML29Analytics | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<NewsML29Document | null>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [query, setQuery] = useState<NewsML29Query>({
    limit: 20,
    orderBy: 'createdAt',
    orderDirection: 'desc'
  });

  // Filters state
  const [filters, setFilters] = useState({
    provider: '',
    urgency: '',
    status: '',
    language: '',
    dateFrom: '',
    dateTo: '',
    searchText: ''
  });

  useEffect(() => {
    loadDocuments();
    loadAnalytics();
  }, [query]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsml29/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        throw new Error('Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Hata',
        description: 'NewsML 2.9 belgeleri yüklenirken hata oluştu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/newsml29/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleImportFromAA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsml29/import-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: 24 })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Başarılı',
          description: `${result.processed} haber NewsML 2.9 formatında içe aktarıldı`
        });
        loadDocuments();
        loadAnalytics();
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      console.error('Error importing from AA:', error);
      toast({
        title: 'Hata',
        description: 'AA\'dan içe aktarma sırasında hata oluştu',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessDocument = async (documentId: string, action: 'enhance' | 'publish') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/newsml29/documents/${documentId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: `Belge ${action === 'enhance' ? 'geliştirildi' : 'yayınlandı'}`
        });
        loadDocuments();
      } else {
        throw new Error(`${action} failed`);
      }
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      toast({
        title: 'Hata',
        description: `Belge ${action === 'enhance' ? 'geliştirme' : 'yayınlama'} sırasında hata oluştu`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const newQuery: NewsML29Query = {
      ...query,
      provider: filters.provider ? [filters.provider] : undefined,
      urgency: filters.urgency ? [parseInt(filters.urgency)] : undefined,
      language: filters.language ? [filters.language] : undefined,
      createdAfter: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      createdBefore: filters.dateTo ? new Date(filters.dateTo) : undefined
    };
    setQuery(newQuery);
  };

  const resetFilters = () => {
    setFilters({
      provider: '',
      urgency: '',
      status: '',
      language: '',
      dateFrom: '',
      dateTo: '',
      searchText: ''
    });
    setQuery({
      limit: 20,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      raw: { label: 'Ham', variant: 'secondary' },
      parsed: { label: 'Ayrıştırıldı', variant: 'default' },
      enhanced: { label: 'Geliştirildi', variant: 'outline' },
      published: { label: 'Yayınlandı', variant: 'default' },
      error: { label: 'Hata', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || statusConfig.raw;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency <= 2) return 'text-red-600 font-bold';
    if (urgency <= 4) return 'text-orange-600 font-semibold';
    if (urgency <= 6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">NewsML 2.9 Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            NewsML 2.9 formatında haberleri yönetin ve işleyin
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleImportFromAA} disabled={loading}>
            <Upload className="w-4 h-4 mr-2" />
            AA\'dan İçe Aktar
          </Button>
          <Button variant="outline" onClick={() => loadDocuments()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Belge</p>
                  <p className="text-2xl font-bold">{analytics.totalDocuments}</p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bugün</p>
                  <p className="text-2xl font-bold">{analytics.documentsToday}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bu Hafta</p>
                  <p className="text-2xl font-bold">{analytics.documentsThisWeek}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ort. İşlem Süresi</p>
                  <p className="text-2xl font-bold">{analytics.averageProcessingTime}ms</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Belgeler</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="import">İçe Aktarma</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtreler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Input
                  placeholder="Sağlayıcı"
                  value={filters.provider}
                  onChange={(e) => setFilters(prev => ({ ...prev, provider: e.target.value }))}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filters.urgency}
                  onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                >
                  <option value="">Aciliyet</option>
                  <option value="1">1 - Çok Acil</option>
                  <option value="2">2 - Acil</option>
                  <option value="3">3 - Yüksek</option>
                  <option value="4">4 - Normal</option>
                  <option value="5">5 - Düşük</option>
                  <option value="6">6 - Çok Düşük</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Durum</option>
                  <option value="raw">Ham</option>
                  <option value="parsed">Ayrıştırıldı</option>
                  <option value="enhanced">Geliştirildi</option>
                  <option value="published">Yayınlandı</option>
                  <option value="error">Hata</option>
                </select>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button onClick={applyFilters} size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    Ara
                  </Button>
                  <Button variant="outline" onClick={resetFilters} size="sm">
                    Temizle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                NewsML 2.9 Belgeleri ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Henüz NewsML 2.9 belgesi bulunmuyor
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">
                              {doc.newsml.newsItem[0]?.contentMeta?.headline || 'Başlık Yok'}
                            </h3>
                            {getStatusBadge(doc.processing.status)}
                            <span className={`text-sm ${getUrgencyColor(doc.searchFields.urgency)}`}>
                              Aciliyet: {doc.searchFields.urgency}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Sağlayıcı: {doc.searchFields.provider}</p>
                            <p>Oluşturma: {new Date(doc.createdAt).toLocaleString('tr-TR')}</p>
                            <p>Dil: {doc.searchFields.language}</p>
                            {doc.searchFields.keywords.length > 0 && (
                              <p>Anahtar Kelimeler: {doc.searchFields.keywords.slice(0, 3).join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {doc.processing.status === 'parsed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProcessDocument(doc.id, 'enhance')}
                            >
                              Geliştir
                            </Button>
                          )}
                          {doc.processing.status === 'enhanced' && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessDocument(doc.id, 'publish')}
                            >
                              Yayınla
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            Detay
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Provider Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sağlayıcı Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.documentsByProvider).map(([provider, count]) => (
                      <div key={provider} className="flex justify-between">
                        <span>{provider}</span>
                        <Badge>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Durum Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.documentsByStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span>{status}</span>
                        <Badge>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle>Popüler Anahtar Kelimeler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topKeywords.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.keyword}</span>
                        <Badge>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Subjects */}
              <Card>
                <CardHeader>
                  <CardTitle>Popüler Konular</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topSubjects.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.subject}</span>
                        <Badge>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anadolu Ajansı\'ndan İçe Aktarma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Son 24 saatteki haberleri NewsML 2.9 formatında içe aktarın
              </p>
              <Button onClick={handleImportFromAA} disabled={loading} className="w-full">
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Son 24 Saati İçe Aktar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>NewsML 2.9 Belge Detayı</CardTitle>
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Kapat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Başlık</h4>
                  <p>{selectedDocument.newsml.newsItem[0]?.contentMeta?.headline}</p>
                </div>
                
                {selectedDocument.newsml.newsItem[0]?.contentMeta?.subheadline && (
                  <div>
                    <h4 className="font-semibold mb-2">Alt Başlık</h4>
                    <p>{selectedDocument.newsml.newsItem[0].contentMeta.subheadline}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Metadata</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>GUID:</strong> {selectedDocument.newsml.newsItem[0]?.guid}</p>
                      <p><strong>Sağlayıcı:</strong> {selectedDocument.searchFields.provider}</p>
                      <p><strong>Aciliyet:</strong> {selectedDocument.searchFields.urgency}</p>
                      <p><strong>Durum:</strong> {selectedDocument.processing.status}</p>
                      <p><strong>Dil:</strong> {selectedDocument.searchFields.language}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Tarihler</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Oluşturma:</strong> {new Date(selectedDocument.createdAt).toLocaleString('tr-TR')}</p>
                      <p><strong>Güncelleme:</strong> {new Date(selectedDocument.updatedAt).toLocaleString('tr-TR')}</p>
                      {selectedDocument.processedAt && (
                        <p><strong>İşleme:</strong> {new Date(selectedDocument.processedAt).toLocaleString('tr-TR')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedDocument.searchFields.keywords.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Anahtar Kelimeler</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.searchFields.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDocument.processing.errors && selectedDocument.processing.errors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Hatalar</h4>
                    <div className="space-y-1">
                      {selectedDocument.processing.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}
