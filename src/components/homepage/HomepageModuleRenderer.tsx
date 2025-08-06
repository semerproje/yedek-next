'use client';

import { HomepageModule } from '@/types/homepage';
import MainVisualHeadline from '@/components/homepage/MainVisualHeadline';
import HeadlineNewsGrid from '@/components/homepage/HeadlineNewsGrid';
import BreakingNewsBar from '@/components/homepage/BreakingNewsBar';

interface HomepageModuleRendererProps {
  module: HomepageModule;
}

export default function HomepageModuleRenderer({ module }: HomepageModuleRendererProps) {
  if (!module.active) {
    return null;
  }

  const commonProps = {
    moduleId: module.id,
    manualNewsIds: module.manualNewsIds || [],
    autoFetch: module.autoFetch ?? true,
    newsCount: module.newsCount || 5,
    settings: module.settings || {}
  };

  switch (module.moduleType) {
    case 'main-visual':
      return <MainVisualHeadline {...commonProps} />;
      
    case 'breaking-bar':
      return <BreakingNewsBar {...commonProps} />;
      
    case 'headline-grid':
      return <HeadlineNewsGrid {...commonProps} />;
      
    case 'editor-picks':
      return (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <p className="text-purple-800">Editor Picks - Geliştiriliyor</p>
          <p className="text-sm text-purple-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'popular-sidebar':
      return (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded">
          <p className="text-orange-800">Popular Sidebar - Geliştiriliyor</p>
          <p className="text-sm text-orange-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'video-highlights':
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Video Highlights - Geliştiriliyor</p>
          <p className="text-sm text-red-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'weekend-reads':
      return (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded">
          <p className="text-indigo-800">Weekend Reads - Geliştiriliyor</p>
          <p className="text-sm text-indigo-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'ai-recommendations':
      return (
        <div className="p-4 bg-pink-50 border border-pink-200 rounded">
          <p className="text-pink-800">AI Recommendations - Geliştiriliyor</p>
          <p className="text-sm text-pink-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'news-programs':
      return (
        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded">
          <p className="text-cyan-800">News Programs - Geliştiriliyor</p>
          <p className="text-sm text-cyan-600">Modül ID: {module.id}</p>
        </div>
      );
      
    case 'sticky-banner':
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">Sticky Banner - Geliştiriliyor</p>
          <p className="text-sm text-yellow-600">Modül ID: {module.id}</p>
        </div>
      );
      
    default:
      console.warn(`Unknown module type: ${module.moduleType}`);
      return (
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-gray-800">
            Bilinmeyen modül tipi: {module.moduleType}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Lütfen modül tipini kontrol edin.
          </p>
        </div>
      );
  }
}
