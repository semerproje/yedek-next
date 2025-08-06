'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Tab Components
import DashboardTab from '@/components/admin/ultra-aa/DashboardTab';
import ManualFetchTab from '@/components/admin/ultra-aa/ManualFetchTab';
import AutomationTab from '@/components/admin/ultra-aa/AutomationTab';
import CategoryMappingTab from '@/components/admin/ultra-aa/CategoryMappingTab';
import NewsListTab from '@/components/admin/ultra-aa/NewsListTab';
import DuplicatesTab from '@/components/admin/ultra-aa/DuplicatesTab';
import SettingsTab from '@/components/admin/ultra-aa/SettingsTab';
import LogsTab from '@/components/admin/ultra-aa/LogsTab';

export default function UltraAAManagerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<{
    aa: boolean;
    firebase: boolean;
    gemini: boolean;
    loading: boolean;
  }>({
    aa: false,
    firebase: false,
    gemini: false,
    loading: true
  });

  // Check system connections on mount
  useEffect(() => {
    checkSystemConnections();
  }, []);

  const checkSystemConnections = async () => {
    try {
      // Check AA API connection
      const aaResponse = await fetch('/api/ultra-premium-aa?action=test-connection');
      const aaData = await aaResponse.json();

      // Check Firebase connection
      const firebaseResponse = await fetch('/api/ultra-premium-aa?action=firebase-status');
      const firebaseData = await firebaseResponse.json();

      // Check Gemini AI connection
      const geminiResponse = await fetch('/api/ultra-premium-aa?action=gemini-status');
      const geminiData = await geminiResponse.json();

      setConnectionStatus({
        aa: aaData.success,
        firebase: firebaseData.success,
        gemini: geminiData.success,
        loading: false
      });
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus({
        aa: false,
        firebase: false,
        gemini: false,
        loading: false
      });
    }
  };

  return (
    <div className="w-full max-w-none">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ultra Premium AA News Manager
        </h1>
        <p className="text-gray-600">
          Anadolu Ajansı entegrasyonu ile gelişmiş haber yönetim sistemi
        </p>
      </div>

      {/* System Status */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sistem Durumu</h3>
          {connectionStatus.loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="flex gap-4">
              <StatusIndicator
                label="AA API"
                status={connectionStatus.aa}
              />
              <StatusIndicator
                label="Firebase"
                status={connectionStatus.firebase}
              />
              <StatusIndicator
                label="Gemini AI"
                status={connectionStatus.gemini}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Connection Warning */}
      {!connectionStatus.loading && (!connectionStatus.aa || !connectionStatus.firebase) && (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sistem bağlantılarında sorun var. Lütfen .env.local dosyanızı kontrol edin.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="manual-fetch">Manuel Çekim</TabsTrigger>
          <TabsTrigger value="automation">Otomasyon</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="news-list">Haberler</TabsTrigger>
          <TabsTrigger value="duplicates">Tekrarlar</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          <TabsTrigger value="logs">Loglar</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="manual-fetch">
          <ManualFetchTab />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationTab />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryMappingTab />
        </TabsContent>

        <TabsContent value="news-list">
          <NewsListTab />
        </TabsContent>

        <TabsContent value="duplicates">
          <DuplicatesTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>

        <TabsContent value="logs">
          <LogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}:</span>
      {status ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}
