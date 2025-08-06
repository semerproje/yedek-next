"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHomepageModules } from "./hooks/useHomepage";
import { HomepageModule } from "@/types/homepage";

// Import enhanced components
import EnhancedBreakingNewsBar from "./EnhancedBreakingNewsBar";
import EnhancedMainVisualHeadline from "./EnhancedMainVisualHeadline";
import EnhancedHeadlineNewsGrid from "./EnhancedHeadlineNewsGrid";
import EnhancedEditorPicks from "./EnhancedEditorPicks";
import AIRecommendationPanel from "./AIRecommendationPanel";

// Import existing components for fallback
import VideoHighlights from "./VideoHighlights";
import WeatherCurrencyPanel from "./WeatherCurrencyPanel";
import MoneyMarketsTicker from "./MoneyMarketsTicker";
import PopularNewsSidebar from "./PopularNewsSidebar";

interface UltraPremiumHomepageRendererProps {
  previewMode?: boolean;
  adminMode?: boolean;
}

// Component mapping
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'EnhancedBreakingNewsBar': EnhancedBreakingNewsBar,
  'BreakingNewsBar': EnhancedBreakingNewsBar, // Fallback
  'EnhancedMainVisualHeadline': EnhancedMainVisualHeadline,
  'MainVisualHeadline': EnhancedMainVisualHeadline, // Fallback
  'EnhancedHeadlineNewsGrid': EnhancedHeadlineNewsGrid,
  'HeadlineNewsGrid': EnhancedHeadlineNewsGrid, // Fallback
  'EnhancedEditorPicks': EnhancedEditorPicks,
  'EditorPicks': EnhancedEditorPicks, // Fallback
  'AIRecommendationPanel': AIRecommendationPanel,
  'AiRecommendationPanel': AIRecommendationPanel, // Fallback
  'VideoHighlights': VideoHighlights,
  'WeatherCurrencyPanel': WeatherCurrencyPanel,
  'MoneyMarketsTicker': MoneyMarketsTicker,
  'PopularNewsSidebar': PopularNewsSidebar
};

// Layout configurations
const LAYOUT_CONFIGS = {
  'breaking-bar': { fullWidth: true, order: 0 },
  'main-visual': { fullWidth: true, order: 1 },
  'headline-grid': { fullWidth: true, order: 2 },
  'editor-picks': { fullWidth: true, order: 3 },
  'video-highlights': { fullWidth: true, order: 4 },
  'ai-recommendations': { fullWidth: false, order: 5 },
  'popular-sidebar': { fullWidth: false, order: 6 },
  'weather-currency': { fullWidth: false, order: 7 },
  'money-markets': { fullWidth: true, order: 8 }
};

interface ModuleWrapperProps {
  module: HomepageModule;
  children: React.ReactNode;
  adminMode?: boolean;
  onModuleEdit?: (module: HomepageModule) => void;
}

function ModuleWrapper({ module, children, adminMode, onModuleEdit }: ModuleWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const layoutConfig = LAYOUT_CONFIGS[module.moduleType as keyof typeof LAYOUT_CONFIGS] || { fullWidth: true, order: 99 };

  if (adminMode) {
    return (
      <div 
        className={`
          relative group transition-all duration-200
          ${layoutConfig.fullWidth ? 'col-span-full' : 'col-span-1'}
          ${isHovered ? 'z-10' : 'z-0'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Admin overlay */}
        <div className={`
          absolute inset-0 border-2 border-dashed transition-all duration-200 rounded-lg z-20
          ${isHovered ? 'border-blue-500 bg-blue-50 bg-opacity-50' : 'border-transparent'}
        `}>
          {isHovered && (
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-2 flex space-x-1">
              <button
                onClick={() => onModuleEdit?.(module)}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Düzenle
              </button>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                {module.componentName}
              </span>
            </div>
          )}
        </div>
        
        {/* Module content */}
        <div className={`${isHovered ? 'opacity-75' : 'opacity-100'} transition-opacity duration-200`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={layoutConfig.fullWidth ? 'col-span-full' : 'col-span-1'}>
      {children}
    </div>
  );
}

function ModuleRenderer({ module, adminMode, onModuleEdit }: { 
  module: HomepageModule; 
  adminMode?: boolean; 
  onModuleEdit?: (module: HomepageModule) => void;
}) {
  const Component = COMPONENT_MAP[module.componentName];
  
  if (!Component) {
    console.warn(`Component not found: ${module.componentName}`);
    return (
      <ModuleWrapper module={module} adminMode={adminMode} onModuleEdit={onModuleEdit}>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Bileşen bulunamadı: {module.componentName}
          </p>
        </div>
      </ModuleWrapper>
    );
  }

  return (
    <ModuleWrapper module={module} adminMode={adminMode} onModuleEdit={onModuleEdit}>
      <Component
        moduleId={module.id}
        module={module}
        manualNewsIds={module.manualNewsIds}
        autoFetch={module.autoFetch}
        newsCount={module.newsCount}
        settings={module.settings}
      />
    </ModuleWrapper>
  );
}

export default function UltraPremiumHomepageRenderer({ 
  previewMode = false, 
  adminMode = false 
}: UltraPremiumHomepageRendererProps) {
  const { modules, loading, error } = useHomepageModules();
  const [editingModule, setEditingModule] = useState<HomepageModule | null>(null);

  // Separate modules by layout type
  const fullWidthModules = modules.filter(module => {
    const layoutConfig = LAYOUT_CONFIGS[module.moduleType as keyof typeof LAYOUT_CONFIGS];
    return layoutConfig?.fullWidth !== false;
  });

  const sidebarModules = modules.filter(module => {
    const layoutConfig = LAYOUT_CONFIGS[module.moduleType as keyof typeof LAYOUT_CONFIGS];
    return layoutConfig?.fullWidth === false;
  });

  // Sort modules by order
  const sortedFullWidthModules = fullWidthModules.sort((a, b) => a.order - b.order);
  const sortedSidebarModules = sidebarModules.sort((a, b) => a.order - b.order);

  const handleModuleEdit = (module: HomepageModule) => {
    setEditingModule(module);
    // In a real implementation, this would open a modal or navigate to an edit page
    console.log('Edit module:', module);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ultra Premium anasayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz Modül Yok</h2>
          <p className="text-gray-600 mb-4">
            Anasayfa modülleri henüz yapılandırılmamış.
          </p>
          {adminMode && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              İlk Modülü Oluştur
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${previewMode ? 'bg-gray-50' : 'bg-white'}`}>
      {/* Admin header */}
      {adminMode && (
        <div className="bg-blue-600 text-white p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Admin Modu Aktif</span>
              <span className="text-blue-200 text-sm">|</span>
              <span className="text-sm">{modules.length} aktif modül</span>
            </div>
            <div className="text-sm">
              Modülleri düzenlemek için üzerine gelip tıklayın
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        {/* Full-width modules */}
        <div className="space-y-6 lg:space-y-8">
          {sortedFullWidthModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ModuleRenderer
                module={module}
                adminMode={adminMode}
                onModuleEdit={handleModuleEdit}
              />
            </motion.div>
          ))}
        </div>

        {/* Sidebar modules */}
        {sortedSidebarModules.length > 0 && (
          <div className="mt-8 lg:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Main content area (if needed for layout) */}
              <div className="lg:col-span-3">
                {/* This could contain additional full-width content */}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {sortedSidebarModules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (sortedFullWidthModules.length + index) * 0.1 }}
                  >
                    <ModuleRenderer
                      module={module}
                      adminMode={adminMode}
                      onModuleEdit={handleModuleEdit}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview mode indicator */}
      {previewMode && (
        <div className="fixed bottom-4 right-4 bg-orange-600 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Önizleme Modu</span>
          </div>
        </div>
      )}

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
          <div>Modül Sayısı: {modules.length}</div>
          <div>Tam Genişlik: {sortedFullWidthModules.length}</div>
          <div>Kenar Çubuğu: {sortedSidebarModules.length}</div>
        </div>
      )}
    </div>
  );
}