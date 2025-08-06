'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  RefreshCw,
  Database,
  FileText,
  Image,
  Video,
  FileArchive,
  BarChart3,
  Loader2
} from 'lucide-react';

interface Schedule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  categories: number[];
  fetch_interval_minutes: number;
  max_news_per_fetch: number;
  auto_publish: boolean;
  ai_enhancement: boolean;
  image_search: boolean;
  duplicate_detection: boolean;
  newsml_format: boolean; // NewsML 2.9 format support
  content_types: number[]; // Type support: 1=haber, 2=fotoğraf, 3=video, 4=dosya, 5=grafik
  language: number; // 1=Türkçe, 2=İngilizce, 3=Arapça
  priority_levels: number[]; // Öncelik seviyeleri
  filters: {
    search_string?: string;
    keywords?: string;
    exclude_keywords?: string;
    start_date?: string;
    end_date?: string;
  };
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string;
  success_count?: number;
  error_count?: number;
  last_newsml_count?: number;
}

interface AACategory {
  id: number;
  name: string;
}

interface AAStats {
  daily_limit: number;
  used_today: number;
  remaining: number;
  last_reset: string;
}

export default function AutomationTab() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [aaCategories, setAACategories] = useState<AACategory[]>([]);
  const [aaStats, setAAStats] = useState<AAStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Schedule>>({
    name: '',
    description: '',
    active: true,
    categories: [],
    fetch_interval_minutes: 30,
    max_news_per_fetch: 20,
    auto_publish: false,
    ai_enhancement: true,
    image_search: true,
    duplicate_detection: true,
    newsml_format: true, // Default to NewsML 2.9 format
    content_types: [1], // Default to text news
    language: 1, // Default to Turkish
    priority_levels: [1, 2, 3, 4], // All priority levels
    filters: {
      search_string: '',
      keywords: '',
      exclude_keywords: '',
      start_date: '',
      end_date: 'NOW'
    }
  });

  // Content type options based on AA API
  const contentTypes = [
    { value: 1, label: 'Haber (Metin)', icon: FileText, description: 'Metin tabanlı haber içeriği' },
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

  const loadSchedules = useCallback(async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=get-schedules');
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast({
        title: "Hata",
        description: "Zamanlamalar yüklenemedi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadAACategories = useCallback(async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=discover');
      const data = await response.json();
      if (data.success && data.categories) {
        const categories = Object.entries(data.categories).map(([id, name]) => ({
          id: parseInt(id),
          name: name as string
        }));
        setAACategories(categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, []);

  const loadAAStats = useCallback(async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=get-aa-stats');
      const data = await response.json();
      if (data.success) {
        setAAStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load AA stats:', error);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
    loadAACategories();
    loadAAStats();
  }, [loadSchedules, loadAACategories, loadAAStats]);

  const handleSave = async () => {
    try {
      const action = editingSchedule ? 'update-schedule' : 'create-schedule';
      
      // Form verilerini kontrol et
      if (!formData.name || !formData.description) {
        toast({
          title: "Hata",
          description: "Ad ve açıklama alanları zorunludur",
          variant: "destructive"
        });
        return;
      }

      if (!formData.categories || formData.categories.length === 0) {
        toast({
          title: "Hata", 
          description: "En az bir kategori seçmelisiniz",
          variant: "destructive"
        });
        return;
      }

      const payload = editingSchedule 
        ? { 
            action,
            schedule: { ...formData, id: editingSchedule.id }
          }
        : { 
            action,
            schedule: {
              ...formData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          };

      console.log('Gönderilen payload:', payload);

      const response = await fetch('/api/ultra-premium-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      console.log('API yanıtı:', result);
      
      if (result.success) {
        await loadSchedules();
        setShowCreateForm(false);
        setEditingSchedule(null);
        resetForm();
        toast({
          title: "Başarılı",
          description: editingSchedule ? "Zamanlama güncellendi" : "Zamanlama oluşturuldu"
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || result.error || "Zamanlama kaydedilemedi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to save schedule:', error);
      toast({
        title: "Hata",
        description: "Zamanlama kaydedilemedi - Ağ hatası",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Bu zamanlamayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/ultra-premium-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-schedule',
          scheduleId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadSchedules();
        toast({
          title: "Başarılı",
          description: "Zamanlama silindi"
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Zamanlama silinemedi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast({
        title: "Hata",
        description: "Zamanlama silinemedi",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (scheduleId: string, active: boolean) => {
    try {
      const response = await fetch('/api/ultra-premium-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-schedule',
          scheduleId,
          active: !active
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadSchedules();
        toast({
          title: "Başarılı",
          description: `Zamanlama ${!active ? 'aktif' : 'pasif'} edildi`
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Zamanlama durumu değiştirilemedi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
      toast({
        title: "Hata",
        description: "Zamanlama durumu değiştirilemedi",
        variant: "destructive"
      });
    }
  };

  const handleRunNow = async (scheduleId: string) => {
    try {
      const response = await fetch('/api/ultra-premium-aa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run-schedule',
          scheduleId
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Başarılı",
          description: `Zamanlama çalıştırıldı: ${result.processed} haber işlendi, ${result.newsmlSaved || 0} NewsML kaydı`
        });
        await loadSchedules();
        await loadAAStats();
      } else {
        toast({
          title: "Hata",
          description: result.message || "Zamanlama çalıştırılamadı",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to run schedule:', error);
      toast({
        title: "Hata",
        description: "Zamanlama çalıştırılamadı",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      active: true,
      categories: [],
      fetch_interval_minutes: 30,
      max_news_per_fetch: 20,
      auto_publish: false,
      ai_enhancement: true,
      image_search: true,
      duplicate_detection: true,
      newsml_format: true,
      content_types: [1],
      language: 1,
      priority_levels: [1, 2, 3, 4],
      filters: {
        search_string: '',
        keywords: '',
        exclude_keywords: '',
        start_date: '',
        end_date: 'NOW'
      }
    });
  };

  const startEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setShowCreateForm(true);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Henüz çalışmadı';
    return new Date(timeString).toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Zamanlamalar yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AA Stats */}
      {aaStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              AA API Kullanım Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{aaStats.daily_limit}</div>
                <div className="text-sm text-gray-500">Günlük Limit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{aaStats.used_today}</div>
                <div className="text-sm text-gray-500">Bugün Kullanılan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{aaStats.remaining}</div>
                <div className="text-sm text-gray-500">Kalan</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{formatTime(aaStats.last_reset)}</div>
                <div className="text-sm text-gray-500">Son Sıfırlama</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Otomatik NewsML 2.9 Haber Çekimi</h3>
          <p className="text-gray-600">AA&apos;dan NewsML 2.9 formatında zamanlanmış haber çekimi</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true);
            setEditingSchedule(null);
            resetForm();
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni Zamanlama
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSchedule ? 'Zamanlamayı Düzenle' : 'Yeni NewsML 2.9 Zamanlaması'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Zamanlama Adı</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Örn: Günlük Ekonomi Haberleri"
                />
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Zamanlama açıklaması"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <Label>AA Kategorileri</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {aaCategories.map(category => (
                  <Badge
                    key={category.id}
                    variant={formData.categories?.includes(category.id) ? 'default' : 'outline'}
                    className="cursor-pointer p-2 justify-center"
                    onClick={() => {
                      const categories = formData.categories || [];
                      setFormData(prev => ({
                        ...prev,
                        categories: categories.includes(category.id)
                          ? categories.filter(id => id !== category.id)
                          : [...categories, category.id]
                      }));
                    }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div>
              <Label>İçerik Türleri</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {contentTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <Badge
                      key={type.value}
                      variant={formData.content_types?.includes(type.value) ? 'default' : 'outline'}
                      className="cursor-pointer p-3 justify-start gap-2"
                      onClick={() => {
                        const types = formData.content_types || [];
                        setFormData(prev => ({
                          ...prev,
                          content_types: types.includes(type.value)
                            ? types.filter(t => t !== type.value)
                            : [...types, type.value]
                        }));
                      }}
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
            </div>

            {/* Priority Levels */}
            <div>
              <Label>Öncelik Seviyeleri</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {priorityLevels.map(priority => (
                  <Badge
                    key={priority.value}
                    variant={formData.priority_levels?.includes(priority.value) ? 'default' : 'outline'}
                    className="cursor-pointer p-2 justify-center"
                    onClick={() => {
                      const levels = formData.priority_levels || [];
                      setFormData(prev => ({
                        ...prev,
                        priority_levels: levels.includes(priority.value)
                          ? levels.filter(l => l !== priority.value)
                          : [...levels, priority.value]
                      }));
                    }}
                  >
                    <div>
                      <div className="font-medium">{priority.label}</div>
                      <div className="text-xs opacity-70">{priority.description}</div>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="interval">Çekim Aralığı</Label>
                <Select
                  value={formData.fetch_interval_minutes?.toString() || "30"}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    fetch_interval_minutes: parseInt(value) 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 dakika</SelectItem>
                    <SelectItem value="30">30 dakika</SelectItem>
                    <SelectItem value="60">1 saat</SelectItem>
                    <SelectItem value="120">2 saat</SelectItem>
                    <SelectItem value="240">4 saat</SelectItem>
                    <SelectItem value="480">8 saat</SelectItem>
                    <SelectItem value="720">12 saat</SelectItem>
                    <SelectItem value="1440">24 saat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max_news">Maksimum Haber</Label>
                <Input
                  id="max_news"
                  type="number"
                  value={formData.max_news_per_fetch?.toString() || "20"}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    max_news_per_fetch: parseInt(e.target.value) || 20
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="language">Dil</Label>
                <Select
                  value={formData.language?.toString() || "1"}
                  onValueChange={(value) => setFormData(prev => ({ 
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
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search_string">Arama Metni</Label>
                <Input
                  id="search_string"
                  value={formData.filters?.search_string || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    filters: { ...prev.filters!, search_string: e.target.value }
                  }))}
                  placeholder="Dolar,Enflasyon,Borsa"
                />
              </div>
              <div>
                <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                <Input
                  id="keywords"
                  value={formData.filters?.keywords || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    filters: { ...prev.filters!, keywords: e.target.value }
                  }))}
                  placeholder="Virgülle ayırın"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsml_format ?? true}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    newsml_format: e.target.checked 
                  }))}
                  className="rounded"
                />
                <span className="text-sm font-medium text-blue-600">NewsML 2.9 formatında kaydet</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ai_enhancement ?? true}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    ai_enhancement: e.target.checked 
                  }))}
                  className="rounded"
                />
                <span className="text-sm">AI ile içerik geliştirme</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.image_search ?? true}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    image_search: e.target.checked 
                  }))}
                  className="rounded"
                />
                <span className="text-sm">Fotoğraf ve medya dahil et</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.duplicate_detection ?? true}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    duplicate_detection: e.target.checked 
                  }))}
                  className="rounded"
                />
                <span className="text-sm">Tekrar eden haberleri tespit et</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.auto_publish ?? false}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    auto_publish: e.target.checked 
                  }))}
                  className="rounded"
                />
                <span className="text-sm">Otomatik yayınla</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave}>
                {editingSchedule ? 'Güncelle' : 'Oluştur'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingSchedule(null);
                  resetForm();
                }}
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktif Zamanlamalar ({schedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz zamanlama oluşturulmamış
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map(schedule => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{schedule.name}</h4>
                      <p className="text-gray-600 text-sm">{schedule.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={schedule.active ? 'default' : 'secondary'}>
                        {schedule.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                      {schedule.newsml_format && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          NewsML 2.9
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Aralık:</span>
                      <div className="font-medium">{schedule.fetch_interval_minutes} dakika</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Maks Haber:</span>
                      <div className="font-medium">{schedule.max_news_per_fetch}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Son NewsML:</span>
                      <div className="font-medium text-blue-600">{schedule.last_newsml_count || 0}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Başarı/Hata:</span>
                      <div className="font-medium">
                        <span className="text-green-600">{schedule.success_count || 0}</span> / 
                        <span className="text-red-600 ml-1">{schedule.error_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(schedule)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(schedule.id, schedule.active)}
                    >
                      {schedule.active ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Durdur
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Başlat
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunNow(schedule.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Şimdi Çalıştır
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}