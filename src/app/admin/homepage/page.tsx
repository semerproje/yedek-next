"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  BarChart3, 
  Refresh,
  Save,
  GripVertical,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useHomepageModules, useAnalytics } from '@/components/homepage/hooks/useHomepage';
import { HomepageModuleService } from '@/lib/firestore/homepage-services';
import { HomepageModule } from '@/types/homepage';
import { EnhancedHomepageModule, ModuleTemplate } from '@/types/firestore';

// Mock module templates
const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    id: 'breaking-news-template',
    name: 'Son Dakika Haberleri',
    description: 'Gerçek zamanlı son dakika haberleri',
    moduleType: 'breaking-bar',
    componentName: 'EnhancedBreakingNewsBar',
    defaultSettings: {
      autoRotate: true,
      rotateInterval: 5000,
      backgroundColor: 'red',
      showIcon: true,
      animationType: 'slide',
      pauseOnHover: true
    },
    requiredFields: ['title', 'newsCount'],
    optionalFields: ['category', 'manualNewsIds'],
    category: 'news',
    tags: ['breaking', 'real-time'],
    author: 'System',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'main-visual-template',
    name: 'Ana Manşet',
    description: 'Öne çıkan haberlerin görsel sunumu',
    moduleType: 'main-visual',
    componentName: 'EnhancedMainVisualHeadline',
    defaultSettings: {
      enableAutoplay: true,
      autoplaySpeed: 5000,
      showAuthor: true,
      showDate: true,
      transitionEffect: 'slide',
      navigationStyle: 'both'
    },
    requiredFields: ['title', 'newsCount'],
    optionalFields: ['category', 'manualNewsIds'],
    category: 'news',
    tags: ['featured', 'visual'],
    author: 'System',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface ModuleCardProps {
  module: HomepageModule;
  index: number;
  onEdit: (module: HomepageModule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onAnalytics: (module: HomepageModule) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function ModuleCard({ 
  module, 
  index, 
  onEdit, 
  onDelete, 
  onToggle, 
  onAnalytics, 
  onMoveUp, 
  onMoveDown,
  canMoveUp,
  canMoveDown 
}: ModuleCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(module.id, !module.active);
    setIsLoading(false);
  };

  const getModuleIcon = (moduleType: string) => {
    const icons: Record<string, JSX.Element> = {
      'breaking-bar': <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />,
      'main-visual': <Monitor className="w-4 h-4" />,
      'headline-grid': <div className="grid grid-cols-2 gap-0.5 w-4 h-4"><div className="bg-blue-500 rounded-sm"></div><div className="bg-blue-500 rounded-sm"></div><div className="bg-blue-500 rounded-sm"></div><div className="bg-blue-500 rounded-sm"></div></div>,
      'editor-picks': <Edit className="w-4 h-4" />,
      'video-highlights': <div className="w-4 h-4 bg-purple-500 rounded" />,
      'ai-recommendations': <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded" />
    };
    return icons[moduleType] || <div className="w-4 h-4 bg-gray-400 rounded" />;
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg
      ${module.active ? 'border-green-200' : 'border-gray-200'}
    `}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => onMoveUp(module.id)}
                disabled={!canMoveUp}
                className={`p-0.5 rounded ${canMoveUp ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onMoveDown(module.id)}
                disabled={!canMoveDown}
                className={`p-0.5 rounded ${canMoveDown ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300'}`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
            {getModuleIcon(module.moduleType)}
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className={`
              px-2 py-1 text-xs rounded-full
              ${module.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {module.active ? 'Aktif' : 'Pasif'}
            </span>
            <span className="text-xs text-gray-500">#{module.order}</span>
          </div>
        </div>

            {/* Module Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tip:</span>
                <span className="font-medium">{module.componentName}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Haber Sayısı:</span>
                <span className="font-medium">{module.newsCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Güncelleme:</span>
                <span className="font-medium">
                  {new Date(module.lastUpdated).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {module.category && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {module.category}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(module)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onAnalytics(module)}
                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                  title="Analitik"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onDelete(module.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`
                  p-1.5 rounded transition-colors duration-200
                  ${module.active
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={module.active ? 'Devre Dışı Bırak' : 'Etkinleştir'}
              >
                {isLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : module.active ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageManagement() {
  const { modules, loading, error, refreshModules, updateModuleOrder, toggleModule } = useHomepageModules();
  const { getModulePerformance } = useAnalytics();
  
  const [selectedModule, setSelectedModule] = useState<HomepageModule | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Handle drag and drop replacement - move up/down
  const handleMoveUp = async (moduleId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex <= 0) return;

    const newModules = [...modules];
    [newModules[moduleIndex - 1], newModules[moduleIndex]] = [newModules[moduleIndex], newModules[moduleIndex - 1]];

    const updatedModules = newModules.map((module, index) => ({
      id: module.id,
      order: index + 1
    }));

    try {
      await updateModuleOrder(updatedModules);
    } catch (err) {
      console.error('Error updating module order:', err);
    }
  };

  const handleMoveDown = async (moduleId: string) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex >= modules.length - 1) return;

    const newModules = [...modules];
    [newModules[moduleIndex], newModules[moduleIndex + 1]] = [newModules[moduleIndex + 1], newModules[moduleIndex]];

    const updatedModules = newModules.map((module, index) => ({
      id: module.id,
      order: index + 1
    }));

    try {
      await updateModuleOrder(updatedModules);
    } catch (err) {
      console.error('Error updating module order:', err);
    }
  };

  // Handle module creation
  const handleCreateModule = async (template: ModuleTemplate) => {
    try {
      const newModule = {
        title: template.name,
        moduleType: template.moduleType as any,
        componentName: template.componentName,
        manualNewsIds: [],
        autoFetch: true,
        newsCount: 5,
        displayType: 'grid' as any,
        active: true,
        order: modules.length + 1,
        lastUpdated: new Date(),
        settings: template.defaultSettings
      };

      await HomepageModuleService.createModule(newModule);
      await refreshModules();
      setShowTemplates(false);
    } catch (err) {
      console.error('Error creating module:', err);
    }
  };

  // Handle module deletion
  const handleDeleteModule = async (id: string) => {
    if (!confirm('Bu modülü silmek istediğinizden emin misiniz?')) return;
    
    try {
      await HomepageModuleService.deleteModule(id);
      await refreshModules();
    } catch (err) {
      console.error('Error deleting module:', err);
    }
  };

  // Handle analytics view
  const handleViewAnalytics = async (module: HomepageModule) => {
    try {
      const data = await getModulePerformance(module.id);
      setAnalyticsData(data);
      setSelectedModule(module);
      setShowAnalytics(true);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Initialize default modules if none exist
  const handleInitializeDefaults = async () => {
    try {
      await HomepageModuleService.initializeDefaultModules();
      await refreshModules();
    } catch (err) {
      console.error('Error initializing default modules:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Anasayfa Modül Yönetimi
              </h1>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {modules.length} Modül
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Preview Device Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={refreshModules}
                className="btn-secondary"
                disabled={loading}
              >
                <Refresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </button>

              <button
                onClick={() => setShowTemplates(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Modül
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Modüller yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Hata: {error}</p>
          </div>
        )}

        {!loading && !error && modules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz modül yok
            </h3>
            <p className="text-gray-600 mb-6">
              Anasayfa için modüller oluşturmaya başlayın
            </p>
            <div className="space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Modülü Oluştur
              </button>
              <button
                onClick={handleInitializeDefaults}
                className="btn-secondary"
              >
                Varsayılan Modülleri Yükle
              </button>
            </div>
          </div>
        )}

        {!loading && !error && modules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                onEdit={setSelectedModule}
                onDelete={handleDeleteModule}
                onToggle={toggleModule}
                onAnalytics={handleViewAnalytics}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                canMoveUp={index > 0}
                canMoveDown={index < modules.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Module Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Yeni Modül Oluştur</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODULE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                    onClick={() => handleCreateModule(template)}
                  >
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && selectedModule && analyticsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {selectedModule.title} - Analitik
                </h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.totalViews}
                  </div>
                  <div className="text-sm text-blue-600">Toplam Görüntüleme</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.totalClicks}
                  </div>
                  <div className="text-sm text-green-600">Toplam Tıklama</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.clickThroughRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-600">Tıklama Oranı</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {analyticsData.dailyStats.length}
                  </div>
                  <div className="text-sm text-yellow-600">Günlük Veri</div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Son 7 gün verisi gösteriliyor
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}