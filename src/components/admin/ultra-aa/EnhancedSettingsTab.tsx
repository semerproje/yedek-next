'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Save, 
  RefreshCw, 
  Server,
  Bot,
  Globe,
  CheckCircle,
  AlertTriangle,
  Database,
  Zap,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  AALanguage, 
  AAContentType, 
  AAPriority,
  EnhancementOptions 
} from '@/types/aa-news';

interface SettingsData {
  // AA API Settings
  aaApi: {
    baseUrl: string;
    username: string;
    password: string;
    timeout: number;
    retryAttempts: number;
    rateLimit: number;
    quotaLimit: number;
  };
  
  // Firebase Settings
  firebase: {
    projectId: string;
    enableRealtime: boolean;
    batchSize: number;
    cacheExpiry: number;
    enableBackup: boolean;
    backupInterval: number;
  };
  
  // Automation Settings
  automation: {
    enabled: boolean;
    defaultInterval: number;
    maxNewsPerBatch: number;
    enableDuplicateCheck: boolean;
    retryFailedFetches: boolean;
    maxRetries: number;
  };
  
  // AI Enhancement Settings
  aiEnhancement: EnhancementOptions;
  
  // Content Settings
  content: {
    defaultLanguage: AALanguage;
    supportedLanguages: AALanguage[];
    defaultContentTypes: AAContentType[];
    defaultPriorities: AAPriority[];
    minContentLength: number;
    maxContentLength: number;
    enableSeo: boolean;
    enableMetaTags: boolean;
  };
  
  // Performance Settings
  performance: {
    enableCaching: boolean;
    cacheExpiry: number;
    enableCompression: boolean;
    maxConcurrentRequests: number;
    requestDelay: number;
  };
  
  // Notification Settings
  notifications: {
    emailAlerts: boolean;
    webhookUrl: string;
    slackChannel: string;
    discordWebhook: string;
  };
}

const defaultSettings: SettingsData = {
  aaApi: {
    baseUrl: 'https://api.aa.com.tr/abone',
    username: '',
    password: '',
    timeout: 30000,
    retryAttempts: 3,
    rateLimit: 500,
    quotaLimit: 1000
  },
  firebase: {
    projectId: '',
    enableRealtime: true,
    batchSize: 50,
    cacheExpiry: 3600,
    enableBackup: true,
    backupInterval: 24
  },
  automation: {
    enabled: true,
    defaultInterval: 7200, // 2 hours
    maxNewsPerBatch: 100,
    enableDuplicateCheck: true,
    retryFailedFetches: true,
    maxRetries: 3
  },
  aiEnhancement: {
    enhanceTitle: true,
    enhanceContent: true,
    generateSummary: true,
    generateKeywords: true,
    seoOptimize: true,
    autoTranslate: false,
    targetLanguage: AALanguage.TURKCE,
    maxContentLength: 2000
  },
  content: {
    defaultLanguage: AALanguage.TURKCE,
    supportedLanguages: [AALanguage.TURKCE, AALanguage.INGILIZCE],
    defaultContentTypes: [AAContentType.HABER, AAContentType.FOTOGRAF],
    defaultPriorities: [AAPriority.FLAS, AAPriority.MANSET, AAPriority.NORMAL],
    minContentLength: 100,
    maxContentLength: 5000,
    enableSeo: true,
    enableMetaTags: true
  },
  performance: {
    enableCaching: true,
    cacheExpiry: 1800,
    enableCompression: true,
    maxConcurrentRequests: 5,
    requestDelay: 500
  },
  notifications: {
    emailAlerts: false,
    webhookUrl: '',
    slackChannel: '',
    discordWebhook: ''
  }
};

export default function EnhancedSettingsTab() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState('aa-api');
  const [connectionStatus, setConnectionStatus] = useState({
    aaApi: false,
    firebase: false,
    aiService: false
  });

  useEffect(() => {
    loadSettings();
    testConnections();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Settings'i localStorage'dan yükle (production'da database kullanılmalı)
      const savedSettings = localStorage.getItem('aa_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Load settings error:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // LocalStorage'a kaydet (production'da API endpoint kullanılmalı)
      localStorage.setItem('aa_settings', JSON.stringify(settings));
      
      toast.success('Ayarlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const testConnections = async () => {
    try {
      setTestingConnection(true);
      const response = await fetch('/api/admin/aa/stats?action=health-check');

      if (response.ok) {
        const healthData = await response.json();
        
        setConnectionStatus({
          aaApi: healthData.aa_api,
          firebase: healthData.firestore,
          aiService: healthData.ai_service
        });
        
        const successCount = Object.values(healthData).filter(Boolean).length - 2; // Exclude non-boolean fields
        
        if (successCount === 3) {
          toast.success('Tüm bağlantılar başarılı');
        } else {
          toast.warning(`${successCount}/3 bağlantı başarılı`);
        }
      } else {
        toast.error('Bağlantı test edilemedi');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      toast.error('Bağlantı testi sırasında hata oluştu');
    } finally {
      setTestingConnection(false);
    }
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistem Ayarları</h2>
          <p className="text-muted-foreground">
            AA News sisteminin yapılandırma ayarları
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={testConnections}
            disabled={testingConnection}
          >
            {testingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Bağlantı Testi
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Kaydet
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Bağlantı Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {connectionStatus.aaApi ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span>AA API</span>
              <Badge variant={connectionStatus.aaApi ? 'default' : 'destructive'}>
                {connectionStatus.aaApi ? 'Bağlı' : 'Bağlantı Yok'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {connectionStatus.firebase ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span>Firebase</span>
              <Badge variant={connectionStatus.firebase ? 'default' : 'destructive'}>
                {connectionStatus.firebase ? 'Bağlı' : 'Bağlantı Yok'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {connectionStatus.aiService ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span>AI Service</span>
              <Badge variant={connectionStatus.aiService ? 'default' : 'destructive'}>
                {connectionStatus.aiService ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="aa-api">AA API</TabsTrigger>
          <TabsTrigger value="firebase">Firebase</TabsTrigger>
          <TabsTrigger value="automation">Otomasyon</TabsTrigger>
          <TabsTrigger value="ai">AI Enhancement</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="performance">Performans</TabsTrigger>
        </TabsList>

        {/* AA API Settings */}
        <TabsContent value="aa-api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                AA API Ayarları
              </CardTitle>
              <CardDescription>
                Anadolu Ajansı API bağlantı ve kimlik doğrulama ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aaBaseUrl">API Base URL</Label>
                  <Input
                    id="aaBaseUrl"
                    value={settings.aaApi.baseUrl}
                    onChange={(e) => updateSetting('aaApi', 'baseUrl', e.target.value)}
                    placeholder="https://api.aa.com.tr/abone"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aaQuotaLimit">Günlük Kota Limiti</Label>
                  <Input
                    id="aaQuotaLimit"
                    type="number"
                    value={settings.aaApi.quotaLimit}
                    onChange={(e) => updateSetting('aaApi', 'quotaLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aaUsername">Kullanıcı Adı</Label>
                  <Input
                    id="aaUsername"
                    value={settings.aaApi.username}
                    onChange={(e) => updateSetting('aaApi', 'username', e.target.value)}
                    placeholder="AA kullanıcı adınız"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aaPassword">Şifre</Label>
                  <Input
                    id="aaPassword"
                    type="password"
                    value={settings.aaApi.password}
                    onChange={(e) => updateSetting('aaApi', 'password', e.target.value)}
                    placeholder="AA şifreniz"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aaTimeout">Timeout (ms)</Label>
                  <Input
                    id="aaTimeout"
                    type="number"
                    value={settings.aaApi.timeout}
                    onChange={(e) => updateSetting('aaApi', 'timeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aaRetryAttempts">Yeniden Deneme</Label>
                  <Input
                    id="aaRetryAttempts"
                    type="number"
                    value={settings.aaApi.retryAttempts}
                    onChange={(e) => updateSetting('aaApi', 'retryAttempts', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aaRateLimit">Rate Limit (ms)</Label>
                  <Input
                    id="aaRateLimit"
                    type="number"
                    value={settings.aaApi.rateLimit}
                    onChange={(e) => updateSetting('aaApi', 'rateLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Firebase Settings */}
        <TabsContent value="firebase">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Firebase Ayarları
              </CardTitle>
              <CardDescription>
                Firestore database ve storage yapılandırması
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firebaseProjectId">Project ID</Label>
                  <Input
                    id="firebaseProjectId"
                    value={settings.firebase.projectId}
                    onChange={(e) => updateSetting('firebase', 'projectId', e.target.value)}
                    placeholder="Firebase project ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firebaseBatchSize">Batch Size</Label>
                  <Input
                    id="firebaseBatchSize"
                    type="number"
                    value={settings.firebase.batchSize}
                    onChange={(e) => updateSetting('firebase', 'batchSize', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firebaseCacheExpiry">Cache Expiry (seconds)</Label>
                  <Input
                    id="firebaseCacheExpiry"
                    type="number"
                    value={settings.firebase.cacheExpiry}
                    onChange={(e) => updateSetting('firebase', 'cacheExpiry', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firebaseBackupInterval">Backup Interval (hours)</Label>
                  <Input
                    id="firebaseBackupInterval"
                    type="number"
                    value={settings.firebase.backupInterval}
                    onChange={(e) => updateSetting('firebase', 'backupInterval', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="firebaseRealtime"
                    checked={settings.firebase.enableRealtime}
                    onCheckedChange={(checked) => updateSetting('firebase', 'enableRealtime', checked)}
                  />
                  <Label htmlFor="firebaseRealtime">Realtime Updates</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="firebaseBackup"
                    checked={settings.firebase.enableBackup}
                    onCheckedChange={(checked) => updateSetting('firebase', 'enableBackup', checked)}
                  />
                  <Label htmlFor="firebaseBackup">Otomatik Backup</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Otomasyon Ayarları
              </CardTitle>
              <CardDescription>
                Otomatik haber çekme ve işleme ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="automationInterval">Varsayılan Interval (seconds)</Label>
                  <Input
                    id="automationInterval"
                    type="number"
                    value={settings.automation.defaultInterval}
                    onChange={(e) => updateSetting('automation', 'defaultInterval', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="automationMaxNews">Max News Per Batch</Label>
                  <Input
                    id="automationMaxNews"
                    type="number"
                    value={settings.automation.maxNewsPerBatch}
                    onChange={(e) => updateSetting('automation', 'maxNewsPerBatch', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="automationMaxRetries">Max Retries</Label>
                <Input
                  id="automationMaxRetries"
                  type="number"
                  value={settings.automation.maxRetries}
                  onChange={(e) => updateSetting('automation', 'maxRetries', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="automationEnabled"
                    checked={settings.automation.enabled}
                    onCheckedChange={(checked) => updateSetting('automation', 'enabled', checked)}
                  />
                  <Label htmlFor="automationEnabled">Otomasyonu Etkinleştir</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="automationDuplicateCheck"
                    checked={settings.automation.enableDuplicateCheck}
                    onCheckedChange={(checked) => updateSetting('automation', 'enableDuplicateCheck', checked)}
                  />
                  <Label htmlFor="automationDuplicateCheck">Duplicate Check</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="automationRetryFailed"
                    checked={settings.automation.retryFailedFetches}
                    onCheckedChange={(checked) => updateSetting('automation', 'retryFailedFetches', checked)}
                  />
                  <Label htmlFor="automationRetryFailed">Başarısız Fetchleri Tekrarla</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Enhancement Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Enhancement Ayarları
              </CardTitle>
              <CardDescription>
                Yapay zeka destekli içerik geliştirme ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiMaxContentLength">Max Content Length</Label>
                <Input
                  id="aiMaxContentLength"
                  type="number"
                  value={settings.aiEnhancement.maxContentLength}
                  onChange={(e) => updateSetting('aiEnhancement', 'maxContentLength', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiEnhanceTitle"
                    checked={settings.aiEnhancement.enhanceTitle}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'enhanceTitle', checked)}
                  />
                  <Label htmlFor="aiEnhanceTitle">Başlık Geliştir</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiEnhanceContent"
                    checked={settings.aiEnhancement.enhanceContent}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'enhanceContent', checked)}
                  />
                  <Label htmlFor="aiEnhanceContent">İçerik Geliştir</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiGenerateSummary"
                    checked={settings.aiEnhancement.generateSummary}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'generateSummary', checked)}
                  />
                  <Label htmlFor="aiGenerateSummary">Özet Oluştur</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiGenerateKeywords"
                    checked={settings.aiEnhancement.generateKeywords}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'generateKeywords', checked)}
                  />
                  <Label htmlFor="aiGenerateKeywords">Anahtar Kelime Oluştur</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiSeoOptimize"
                    checked={settings.aiEnhancement.seoOptimize}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'seoOptimize', checked)}
                  />
                  <Label htmlFor="aiSeoOptimize">SEO Optimizasyonu</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aiAutoTranslate"
                    checked={settings.aiEnhancement.autoTranslate}
                    onCheckedChange={(checked) => updateSetting('aiEnhancement', 'autoTranslate', checked)}
                  />
                  <Label htmlFor="aiAutoTranslate">Otomatik Çeviri</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                İçerik Ayarları
              </CardTitle>
              <CardDescription>
                İçerik işleme ve filtreleme ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentMinLength">Min Content Length</Label>
                  <Input
                    id="contentMinLength"
                    type="number"
                    value={settings.content.minContentLength}
                    onChange={(e) => updateSetting('content', 'minContentLength', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentMaxLength">Max Content Length</Label>
                  <Input
                    id="contentMaxLength"
                    type="number"
                    value={settings.content.maxContentLength}
                    onChange={(e) => updateSetting('content', 'maxContentLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="contentSeo"
                    checked={settings.content.enableSeo}
                    onCheckedChange={(checked) => updateSetting('content', 'enableSeo', checked)}
                  />
                  <Label htmlFor="contentSeo">SEO Optimizasyonu</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="contentMetaTags"
                    checked={settings.content.enableMetaTags}
                    onCheckedChange={(checked) => updateSetting('content', 'enableMetaTags', checked)}
                  />
                  <Label htmlFor="contentMetaTags">Meta Tags Oluştur</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performans Ayarları
              </CardTitle>
              <CardDescription>
                Sistem performansı ve optimizasyon ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perfCacheExpiry">Cache Expiry (seconds)</Label>
                  <Input
                    id="perfCacheExpiry"
                    type="number"
                    value={settings.performance.cacheExpiry}
                    onChange={(e) => updateSetting('performance', 'cacheExpiry', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="perfMaxConcurrent">Max Concurrent Requests</Label>
                  <Input
                    id="perfMaxConcurrent"
                    type="number"
                    value={settings.performance.maxConcurrentRequests}
                    onChange={(e) => updateSetting('performance', 'maxConcurrentRequests', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="perfRequestDelay">Request Delay (ms)</Label>
                <Input
                  id="perfRequestDelay"
                  type="number"
                  value={settings.performance.requestDelay}
                  onChange={(e) => updateSetting('performance', 'requestDelay', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perfCaching"
                    checked={settings.performance.enableCaching}
                    onCheckedChange={(checked) => updateSetting('performance', 'enableCaching', checked)}
                  />
                  <Label htmlFor="perfCaching">Caching Etkinleştir</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="perfCompression"
                    checked={settings.performance.enableCompression}
                    onCheckedChange={(checked) => updateSetting('performance', 'enableCompression', checked)}
                  />
                  <Label htmlFor="perfCompression">Compression Etkinleştir</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
