'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  Filter,
  Search,
  Calendar,
  Tag,
  Image,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText,
  Video,
  FileArchive,
  BarChart3,
  Database,
  Globe
} from 'lucide-react';

interface FetchParams {
  categories: number[];
  content_types: number[]; // 1=haber, 2=fotoğraf, 3=video, 4=dosya, 5=grafik
  keywords: string;
  search_string: string;
  start_date: string;
  end_date: string;
  limit: number;
  priority: number[];
  language: number;
  auto_process: boolean;
  auto_publish: boolean;
  fetch_photos: boolean;
  ai_enhance: boolean;
  newsml_format: boolean; // NewsML 2.9 format support
}

interface AACategory {
  id: number;
  name: string;
}

interface FetchResult {
  success: boolean;
  fetched: number;
  processed: number;
  errors: string[];
  news?: any[];
  newsmlSaved?: number;
}

export default function ManualFetchTab() {
  const [aaCategories, setAACategories] = useState<AACategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [fetchParams, setFetchParams] = useState<FetchParams>({
    categories: [],
    content_types: [1], // Default to text news
    keywords: '',
    search_string: '',
    start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: 'NOW', // Real-time support
    limit: 50,
    priority: [1, 2, 3, 4], // All priority levels
    language: 1, // Turkish
    auto_process: true,
    auto_publish: false,
    fetch_photos: true,
    ai_enhance: true,
    newsml_format: true // Default to NewsML 2.9 format
  });
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Content type options based on AA API
  const contentTypes = [
    { value: 1, label: 'Haber', icon: FileText, description: 'Metin tabanlı haber içeriği' },
    { value: 2, label: 'Fotoğraf', icon: Image, description: 'Görsel içerik' },
    { value: 3, label: 'Video', icon: Video, description: 'Video içerik' },
    { value: 4, label: 'Dosya', icon: FileArchive, description: 'PDF, belgeler' },
    { value: 5, label: 'Grafik', icon: BarChart3, description: 'İnfografik, çizelgeler' }
  ];

  const languageOptions = [
    { value: 1, label: 'Türkçe', code: 'tr_TR' },
    { value: 2, label: 'İngilizce', code: 'en_US' },
    { value: 3, label: 'Arapça', code: 'ar_AR' }
  ];

  const priorityLevels = [
    { value: 1, label: 'Flaş', description: 'Acil haberler', color: 'red' },
    { value: 2, label: 'Manşet', description: 'Önemli haberler', color: 'orange' },
    { value: 3, label: 'Normal', description: 'Standart haberler', color: 'blue' },
    { value: 4, label: 'Rutin', description: 'Düzenli haberler', color: 'gray' }
  ];

  useEffect(() => {
    loadAACategories();
  }, []);

  const loadAACategories = async () => {
    setCategoriesLoading(true);
    try {
      console.log('Loading AA categories...');
      const response = await fetch('/api/ultra-premium-aa?action=discover');
      const data = await response.json();
      console.log('AA categories response:', data);
      
      if (data.success && data.categories) {
        const categories = Object.entries(data.categories).map(([id, name]) => ({
          id: parseInt(id),
          name: name as string
        }));
        console.log('Processed categories:', categories);
        setAACategories(categories);
        
        toast({
          title: "Başarılı",
          description: `${categories.length} kategori yüklendi`
        });
      } else {
        console.error('No categories in response:', data);
        // Fallback kategoriler ekle
        const fallbackCategories = [
          { id: 1, name: 'Politika' },
          { id: 2, name: 'Ekonomi' },
          { id: 3, name: 'Spor' },
          { id: 4, name: 'Teknoloji' },
          { id: 5, name: 'Sağlık' },
          { id: 6, name: 'Gündem' },
          { id: 7, name: 'Dünya' },
          { id: 8, name: 'Kültür Sanat' }
        ];
        setAACategories(fallbackCategories);
        
        toast({
          title: "Uyarı",
          description: "AA kategorileri yüklenemedi, varsayılan kategoriler kullanılıyor",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to load AA categories:', error);
      
      // Fallback kategoriler
      const fallbackCategories = [
        { id: 1, name: 'Politika' },
        { id: 2, name: 'Ekonomi' },
        { id: 3, name: 'Spor' },
        { id: 4, name: 'Teknoloji' },
        { id: 5, name: 'Sağlık' },
        { id: 6, name: 'Gündem' },
        { id: 7, name: 'Dünya' },
        { id: 8, name: 'Kültür Sanat' }
      ];
      setAACategories(fallbackCategories);
      
      toast({
        title: "Hata",
        description: "AA kategorileri yüklenemedi, varsayılan kategoriler kullanılıyor",
        variant: "destructive"
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleFetch = async () => {
    if (fetchParams.categories.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen en az bir kategori seçin",
        variant: "destructive"
      });
      return;
    }

    setFetching(true);
    setProgress(0);
    setFetchResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      const response = await fetch('/api/ultra-premium-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'manual-fetch',
          params: fetchParams
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();
      
      // Ensure result has the required structure
      const normalizedResult = {
        success: result.success || false,
        fetched: result.fetched || 0,
        processed: result.processed || 0,
        errors: result.errors || [],
        news: result.news || [],
        newsmlSaved: result.newsmlSaved || 0
      };
      
      setFetchResult(normalizedResult);

      if (result.success) {
        toast({
          title: "Başarılı",
          description: `${result.fetched} haber çekildi, ${result.processed} işlendi, ${result.newsmlSaved || 0} NewsML kaydı`
        });
        
        setTimeout(() => {
          setProgress(0);
        }, 2000);
      } else {
        toast({
          title: "Hata",
          description: result.errors?.[0] || "Haber çekimi başarısız",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFetchResult({
        success: false,
        fetched: 0,
        processed: 0,
        errors: ['Haber çekimi sırasında bir hata oluştu'],
        newsmlSaved: 0
      });
      toast({
        title: "Hata",
        description: "Haber çekimi sırasında bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  };

  // Gerçek AA API'den veri çekme fonksiyonu
  const handleRealAAFetch = async () => {
    if (fetchParams.categories.length === 0) {
      toast({
        title: "Uyarı",
        description: "Lütfen en az bir kategori seçin",
        variant: "destructive"
      });
      return;
    }

    setFetching(true);
    setProgress(0);
    setFetchResult(null);

    try {
      toast({
        title: "AA API",
        description: "Gerçek AA API'den veri çekiliyor...",
      });

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 85));
      }, 2000);

      const response = await fetch('/api/aa/fetch-real-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: fetchParams.categories,
          content_types: fetchParams.content_types,
          keywords: fetchParams.keywords,
          search_string: fetchParams.search_string,
          start_date: fetchParams.start_date,
          end_date: fetchParams.end_date,
          limit: fetchParams.limit,
          priority: fetchParams.priority,
          language: fetchParams.language,
          newsml_format: fetchParams.newsml_format,
          ai_enhance: fetchParams.ai_enhance
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();
      
      if (result.success) {
        const fetchData = result.data;
        setFetchResult({
          success: true,
          fetched: fetchData.total_found,
          processed: fetchData.processed_count,
          errors: fetchData.errors || [],
          news: fetchData.processed_news || [],
          newsmlSaved: fetchData.newsml_count || 0
        });

        toast({
          title: "🎉 Gerçek AA Verisi Alındı!",
          description: `${fetchData.total_found} haber bulundu, ${fetchData.processed_count} işlendi${fetchData.newsml_count ? `, ${fetchData.newsml_count} NewsML 2.9 kaydı` : ''}`,
        });

        console.log('📊 AA Gerçek Veri Sonucu:', {
          toplam_bulunan: fetchData.total_found,
          işlenen: fetchData.processed_count,
          newsml: fetchData.newsml_count,
          hatalar: fetchData.error_count
        });

      } else {
        setFetchResult({
          success: false,
          fetched: 0,
          processed: 0,
          errors: [result.error || 'AA API hatası'],
          newsmlSaved: 0
        });

        toast({
          title: "❌ AA API Hatası",
          description: result.error || "Gerçek veri çekimi başarısız",
          variant: "destructive"
        });
      }

      setTimeout(() => setProgress(0), 3000);

    } catch (error: any) {
      console.error('❌ Real AA fetch error:', error);
      setFetchResult({
        success: false,
        fetched: 0,
        processed: 0,
        errors: [`Ağ hatası: ${error.message}`],
        newsmlSaved: 0
      });

      toast({
        title: "❌ Bağlantı Hatası",
        description: "AA API'ye bağlanılamadı",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setFetchParams(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const toggleContentType = (typeId: number) => {
    setFetchParams(prev => ({
      ...prev,
      content_types: prev.content_types.includes(typeId)
        ? prev.content_types.filter(id => id !== typeId)
        : [...prev.content_types, typeId]
    }));
  };

  const togglePriority = (priority: number) => {
    setFetchParams(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  };

  const selectAllCategories = () => {
    setFetchParams(prev => ({
      ...prev,
      categories: aaCategories.map(cat => cat.id)
    }));
  };

  const clearAllCategories = () => {
    setFetchParams(prev => ({
      ...prev,
      categories: []
    }));
  };

  const setQuickDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
    
    setFetchParams(prev => ({
      ...prev,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    }));
  };

  const setRealTime = () => {
    setFetchParams(prev => ({
      ...prev,
      end_date: 'NOW'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Manuel NewsML 2.9 Haber Çekimi</h2>
        <p className="text-gray-600">
          AA API'den NewsML 2.9 formatında manuel olarak haber çekin ve işleyin
        </p>
      </div>

      {/* Fetch Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Categories & Content Types */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                AA Kategorileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Kategoriler yükleniyor...</span>
                </div>
              ) : aaCategories.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Kategori bulunamadı</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={loadAACategories}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Yeniden Yükle
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {aaCategories.map(category => (
                      <Badge
                        key={category.id}
                        variant={fetchParams.categories.includes(category.id) ? 'default' : 'outline'}
                        className="cursor-pointer p-2 justify-center"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={selectAllCategories}>
                      Tümünü Seç
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAllCategories}>
                      Temizle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={loadAACategories}
                      disabled={categoriesLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${categoriesLoading ? 'animate-spin' : ''}`} />
                      Yenile
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Content Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                İçerik Türleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {contentTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <Badge
                      key={type.value}
                      variant={fetchParams.content_types.includes(type.value) ? 'default' : 'outline'}
                      className="cursor-pointer p-3 justify-start gap-2"
                      onClick={() => toggleContentType(type.value)}
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </div>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tarih Aralığı
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Başlangıç</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={fetchParams.start_date}
                    onChange={(e) => setFetchParams(prev => ({ 
                      ...prev, 
                      start_date: e.target.value 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Bitiş</Label>
                  <div className="flex gap-2">
                    <Input
                      id="end_date"
                      type="date"
                      value={fetchParams.end_date === 'NOW' ? '' : fetchParams.end_date}
                      onChange={(e) => setFetchParams(prev => ({ 
                        ...prev, 
                        end_date: e.target.value 
                      }))}
                      disabled={fetchParams.end_date === 'NOW'}
                    />
                    <Button
                      size="sm"
                      variant={fetchParams.end_date === 'NOW' ? 'default' : 'outline'}
                      onClick={setRealTime}
                    >
                      Canlı
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange(1)}>
                  Son 24 Saat
                </Button>
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange(7)}>
                  Son 7 Gün
                </Button>
                <Button size="sm" variant="outline" onClick={() => setQuickDateRange(30)}>
                  Son 30 Gün
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Arama ve Filtreler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search_string">Arama Metni</Label>
                <Input
                  id="search_string"
                  value={fetchParams.search_string}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    search_string: e.target.value 
                  }))}
                  placeholder="Dolar,Enflasyon,Borsa"
                />
              </div>
              <div>
                <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                <Input
                  id="keywords"
                  value={fetchParams.keywords}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    keywords: e.target.value 
                  }))}
                  placeholder="Virgülle ayırın"
                />
              </div>
              <div>
                <Label>Öncelik Seviyeleri</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {priorityLevels.map(priority => (
                    <Badge
                      key={priority.value}
                      variant={fetchParams.priority.includes(priority.value) ? 'default' : 'outline'}
                      className="cursor-pointer p-2 justify-center"
                      onClick={() => togglePriority(priority.value)}
                    >
                      {priority.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Options & Actions */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Ayarlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="limit">Maksimum Haber Sayısı</Label>
                <Input
                  id="limit"
                  type="number"
                  value={fetchParams.limit}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    limit: parseInt(e.target.value) || 50
                  }))}
                  min="1"
                  max="200"
                />
              </div>
              <div>
                <Label htmlFor="language">Dil</Label>
                <Select
                  value={fetchParams.language.toString()}
                  onValueChange={(value) => setFetchParams(prev => ({ 
                    ...prev, 
                    language: parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map(lang => (
                      <SelectItem key={lang.value} value={lang.value.toString()}>
                        {lang.label} ({lang.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Processing Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                İşlem Seçenekleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fetchParams.newsml_format}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    newsml_format: e.target.checked 
                  }))}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">NewsML 2.9 formatında kaydet</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fetchParams.ai_enhance}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    ai_enhance: e.target.checked 
                  }))}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">AI ile içerik geliştirme</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fetchParams.fetch_photos}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    fetch_photos: e.target.checked 
                  }))}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Fotoğraf ve medya dahil et</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fetchParams.auto_process}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    auto_process: e.target.checked 
                  }))}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Otomatik İşle</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fetchParams.auto_publish}
                  onChange={(e) => setFetchParams(prev => ({ 
                    ...prev, 
                    auto_publish: e.target.checked 
                  }))}
                  className="rounded"
                />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Otomatik Yayınla</span>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Fetch Buttons */}
          <div className="space-y-3">
            {/* Gerçek AA API Butonu */}
            <Button
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
              size="lg"
              onClick={handleRealAAFetch}
              disabled={fetching || fetchParams.categories.length === 0}
            >
              {fetching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Gerçek AA Verisi Çekiliyor...
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5 mr-2" />
                  🔴 Gerçek AA API'den Çek ({fetchParams.categories.length} kategori)
                </>
              )}
            </Button>

            {/* Test/Mock Butonu */}
            <Button
              className="w-full h-12"
              size="lg"
              variant="outline"
              onClick={handleFetch}
              disabled={fetching || fetchParams.categories.length === 0}
            >
              {fetching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Test Verisi Çekiliyor...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  📋 Test/Mock Verisi Çek ({fetchParams.categories.length} kategori)
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {progress > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>İlerleme</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {fetchResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {fetchResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  Çekim Sonuçları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Çekilen:</span>
                    <div className="font-medium text-blue-600">{fetchResult.fetched}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">İşlenen:</span>
                    <div className="font-medium text-green-600">{fetchResult.processed}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">NewsML Kayıt:</span>
                    <div className="font-medium text-purple-600">{fetchResult.newsmlSaved || 0}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Hata:</span>
                    <div className="font-medium text-red-600">{fetchResult.errors.length}</div>
                  </div>
                </div>

                {fetchResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <Label>Hatalar/Uyarılar:</Label>
                    <div className="space-y-1">
                      {fetchResult.errors.map((error, index) => (
                        <Alert key={index} variant={error.startsWith('✅') ? 'default' : 'destructive'}>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            {error}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
