'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Database,
  Activity,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react';
import { 
  AAContentType, 
  AAPriority, 
  AALanguage, 
  AASearchParams,
  EnhancementOptions 
} from '@/types/aa-news';

interface Schedule {
  id: string;
  name: string;
  description: string;
  category_filters: number[];
  priority_filters: number[];
  type_filters: number[];
  language_filters: number[];
  search_terms: string[];
  cron_expression: string;
  active: boolean;
  last_run?: string;
  next_run?: string;
  success_count: number;
  error_count: number;
  ai_enhancement: boolean;
  enhancement_options: EnhancementOptions;
  created_at: string;
  updated_at: string;
}

interface ScheduleStats {
  total_schedules: number;
  active_schedules: number;
  total_runs_today: number;
  success_rate: number;
  last_sync: string;
}

const EnhancedAutomationTab: React.FC = () => {
  // State management
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("schedules");

  // Form state
  const [formData, setFormData] = useState<Partial<Schedule>>({
    name: '',
    description: '',
    category_filters: [],
    priority_filters: [],
    type_filters: [],
    language_filters: [],
    search_terms: [],
    cron_expression: '0 */2 * * *', // Her 2 saatte bir
    active: true,
    ai_enhancement: true,
    enhancement_options: {
      enhanceTitle: true,
      enhanceContent: true,
      generateSummary: true,
      generateKeywords: true,
      seoOptimize: true,
      autoTranslate: false,
      targetLanguage: AALanguage.TURKCE,
      maxContentLength: 2000
    }
  });

  // Load data functions
  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/aa/schedules');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Schedule loading error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/aa/schedules/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats loading error:', error);
    }
  }, []);

  // Effect hooks
  useEffect(() => {
    loadSchedules();
    loadStats();
  }, [loadSchedules, loadStats]);

  // Form handlers
  const handleInputChange = (field: keyof Schedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnhancementOptionChange = (option: keyof EnhancementOptions, value: any) => {
    setFormData(prev => ({
      ...prev,
      enhancement_options: {
        enhanceTitle: true,
        enhanceContent: true,
        generateSummary: true,
        generateKeywords: true,
        seoOptimize: true,
        autoTranslate: false,
        targetLanguage: AALanguage.TURKCE,
        maxContentLength: 2000,
        ...prev.enhancement_options,
        [option]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setIsLoading(true);
      
      const url = selectedSchedule 
        ? `/api/admin/aa/schedules/${selectedSchedule.id}`
        : '/api/admin/aa/schedules';
      
      const method = selectedSchedule ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadSchedules();
        setIsCreating(false);
        setSelectedSchedule(null);
        resetForm();
      }
    } catch (error) {
      console.error('Schedule save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/aa/schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadSchedules();
        if (selectedSchedule?.id === id) {
          setSelectedSchedule(null);
        }
      }
    } catch (error) {
      console.error('Schedule delete error:', error);
    }
  };

  const handleToggleSchedule = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/aa/schedules/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        await loadSchedules();
      }
    } catch (error) {
      console.error('Schedule toggle error:', error);
    }
  };

  const handleRunSchedule = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/aa/schedules/${id}/run`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadSchedules();
        await loadStats();
      }
    } catch (error) {
      console.error('Schedule run error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_filters: [],
      priority_filters: [],
      type_filters: [],
      language_filters: [],
      search_terms: [],
      cron_expression: '0 */2 * * *',
      active: true,
      ai_enhancement: true,
      enhancement_options: {
        enhanceTitle: true,
        enhanceContent: true,
        generateSummary: true,
        generateKeywords: true,
        seoOptimize: true,
        autoTranslate: false,
        targetLanguage: AALanguage.TURKCE,
        maxContentLength: 2000
      }
    });
  };

  const editSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData(schedule);
    setIsCreating(true);
  };

  // Predefined cron expressions
  const cronExpressions = [
    { label: 'Her 30 dakika', value: '0 */30 * * *' },
    { label: 'Her saat', value: '0 0 * * *' },
    { label: 'Her 2 saatte', value: '0 */2 * * *' },
    { label: 'Her 4 saatte', value: '0 */4 * * *' },
    { label: 'Her 6 saatte', value: '0 */6 * * *' },
    { label: 'Günde 2 kez (09:00, 21:00)', value: '0 9,21 * * *' },
    { label: 'Günlük (09:00)', value: '0 9 * * *' },
    { label: 'Haftalık (Pazartesi 09:00)', value: '0 9 * * 1' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AA Haber Otomasyonu</h2>
          <p className="text-muted-foreground">
            Anadolu Ajansı haberlerini otomatik çekme ve işleme sistemini yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              loadSchedules();
              loadStats();
            }}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          <Button
            onClick={() => {
              setIsCreating(true);
              setActiveTab("create");
              resetForm();
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Yeni Program
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Program</p>
                  <p className="text-2xl font-bold">{stats.total_schedules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Aktif Program</p>
                  <p className="text-2xl font-bold">{stats.active_schedules}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Bugün Çalışma</p>
                  <p className="text-2xl font-bold">{stats.total_runs_today}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Başarı Oranı</p>
                  <p className="text-2xl font-bold">{Math.round(stats.success_rate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules">Programlar</TabsTrigger>
          <TabsTrigger value="create">
            {isCreating ? (selectedSchedule ? 'Düzenle' : 'Yeni Program') : 'Oluştur'}
          </TabsTrigger>
        </TabsList>

        {/* Schedules List */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mevcut Programlar</CardTitle>
              <CardDescription>
                Tanımlanmış otomatik çekme programlarınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Henüz program yok</h3>
                  <p className="text-muted-foreground mb-4">
                    İlk otomatik çekme programınızı oluşturun
                  </p>
                  <Button
                    onClick={() => {
                      setIsCreating(true);
                      resetForm();
                    }}
                  >
                    Program Oluştur
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{schedule.name}</h4>
                          <Badge variant={schedule.active ? 'default' : 'secondary'}>
                            {schedule.active ? 'Aktif' : 'Pasif'}
                          </Badge>
                          {schedule.ai_enhancement && (
                            <Badge variant="outline">AI</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {schedule.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📅 {schedule.cron_expression}</span>
                          <span>✅ {schedule.success_count} başarılı</span>
                          <span>❌ {schedule.error_count} hata</span>
                          {schedule.last_run && (
                            <span>🕐 Son: {new Date(schedule.last_run).toLocaleString('tr-TR')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.active}
                          onCheckedChange={(checked) => 
                            handleToggleSchedule(schedule.id, checked)
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunSchedule(schedule.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editSchedule(schedule)}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create/Edit Schedule */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedSchedule ? 'Program Düzenle' : 'Yeni Program Oluştur'}
              </CardTitle>
              <CardDescription>
                AA haberlerini otomatik çekmek için yeni bir program tanımlayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Adı</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Örn: Ana Haber Çekimi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cron">Çalışma Sıklığı</Label>
                  <Select
                    value={formData.cron_expression || ''}
                    onValueChange={(value) => handleInputChange('cron_expression', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sıklık seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {cronExpressions.map((cron) => (
                        <SelectItem key={cron.value} value={cron.value}>
                          {cron.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Bu programın ne yaptığını açıklayın..."
                  rows={3}
                />
              </div>

              {/* Filters */}
              <div>
                <h4 className="font-medium mb-4">Filtreleme Seçenekleri</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Content Type */}
                  <div className="space-y-2">
                    <Label>İçerik Türü</Label>
                    <div className="space-y-2">
                      {Object.entries(AAContentType).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`type-${value}`}
                            checked={formData.type_filters?.includes(Number(value)) || false}
                            onChange={(e) => {
                              const currentFilters = formData.type_filters || [];
                              if (e.target.checked) {
                                handleInputChange('type_filters', [...currentFilters, Number(value)]);
                              } else {
                                handleInputChange('type_filters', currentFilters.filter(f => f !== Number(value)));
                              }
                            }}
                          />
                          <Label htmlFor={`type-${value}`}>{key}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>Öncelik</Label>
                    <div className="space-y-2">
                      {Object.entries(AAPriority).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`priority-${value}`}
                            checked={formData.priority_filters?.includes(Number(value)) || false}
                            onChange={(e) => {
                              const currentFilters = formData.priority_filters || [];
                              if (e.target.checked) {
                                handleInputChange('priority_filters', [...currentFilters, Number(value)]);
                              } else {
                                handleInputChange('priority_filters', currentFilters.filter(f => f !== Number(value)));
                              }
                            }}
                          />
                          <Label htmlFor={`priority-${value}`}>{key}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Terms */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="search_terms">Arama Terimleri (virgülle ayırın)</Label>
                  <Input
                    id="search_terms"
                    value={formData.search_terms?.join(', ') || ''}
                    onChange={(e) => 
                      handleInputChange('search_terms', e.target.value.split(',').map(t => t.trim()).filter(t => t))
                    }
                    placeholder="Örn: ekonomi, borsa, dolar"
                  />
                </div>
              </div>

              {/* AI Enhancement */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">AI Geliştirme</h4>
                    <p className="text-sm text-muted-foreground">
                      Çekilen haberleri AI ile geliştir
                    </p>
                  </div>
                  <Switch
                    checked={formData.ai_enhancement || false}
                    onCheckedChange={(checked) => handleInputChange('ai_enhancement', checked)}
                  />
                </div>

                {formData.ai_enhancement && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enhance-title"
                        checked={formData.enhancement_options?.enhanceTitle || false}
                        onChange={(e) => handleEnhancementOptionChange('enhanceTitle', e.target.checked)}
                      />
                      <Label htmlFor="enhance-title">Başlık Geliştir</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enhance-content"
                        checked={formData.enhancement_options?.enhanceContent || false}
                        onChange={(e) => handleEnhancementOptionChange('enhanceContent', e.target.checked)}
                      />
                      <Label htmlFor="enhance-content">İçerik Geliştir</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="generate-summary"
                        checked={formData.enhancement_options?.generateSummary || false}
                        onChange={(e) => handleEnhancementOptionChange('generateSummary', e.target.checked)}
                      />
                      <Label htmlFor="generate-summary">Özet Oluştur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="seo-optimize"
                        checked={formData.enhancement_options?.seoOptimize || false}
                        onChange={(e) => handleEnhancementOptionChange('seoOptimize', e.target.checked)}
                      />
                      <Label htmlFor="seo-optimize">SEO Optimizasyonu</Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4">
                <Button 
                  onClick={handleSaveSchedule}
                  disabled={isLoading || !formData.name}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {selectedSchedule ? 'Güncelle' : 'Kaydet'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedSchedule(null);
                    resetForm();
                  }}
                >
                  İptal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAutomationTab;
