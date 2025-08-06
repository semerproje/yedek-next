'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Activity,
  FileText,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface DashboardStats {
  total_news: number;
  published_news: number;
  draft_news: number;
  ai_enhanced: number;
  last_fetch: string;
  today_fetched: number;
  weekly_fetched: number;
  monthly_fetched: number;
  duplicate_rate: number;
  category_distribution: { [key: string]: number };
  storage_usage: {
    used: number;
    total: number;
    percentage: number;
  };
}

export default function DashboardTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ultra-premium-aa?action=dashboard-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR');
  };

  const exportReport = async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=export-report', {
        method: 'POST'
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aa-news-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">İstatistikler yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Haber"
          value={stats.total_news}
          icon={<FileText className="h-5 w-5" />}
          color="blue"
          change={`+${stats.today_fetched} bugün`}
        />
        <StatCard
          title="Yayınlanan"
          value={stats.published_news}
          icon={<Eye className="h-5 w-5" />}
          color="green"
          percentage={(stats.published_news / stats.total_news) * 100}
        />
        <StatCard
          title="Taslak"
          value={stats.draft_news}
          icon={<Clock className="h-5 w-5" />}
          color="yellow"
          percentage={(stats.draft_news / stats.total_news) * 100}
        />
        <StatCard
          title="AI Geliştirilmiş"
          value={stats.ai_enhanced}
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          percentage={(stats.ai_enhanced / stats.total_news) * 100}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fetch Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Çekim İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Son Çekim</span>
              <span className="font-medium">{formatDate(stats.last_fetch)}</span>
            </div>
            <div className="space-y-2">
              <StatRow label="Bugün" value={stats.today_fetched} />
              <StatRow label="Bu Hafta" value={stats.weekly_fetched} />
              <StatRow label="Bu Ay" value={stats.monthly_fetched} />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tekrar Oranı</span>
                <span className="font-medium">{(stats.duplicate_rate || 0).toFixed(1)}%</span>
              </div>
              <Progress value={stats.duplicate_rate || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Kategori Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.category_distribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([category, count]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{category}</span>
                      <span className="text-gray-600">{count}</span>
                    </div>
                    <Progress 
                      value={(count / stats.total_news) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Depolama Kullanımı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Kullanılan Alan</span>
              <span className="font-medium">
                {(stats.storage_usage.used / 1024 / 1024).toFixed(2)} MB / 
                {(stats.storage_usage.total / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <Progress value={stats.storage_usage.percentage} className="h-3" />
            <p className="text-xs text-gray-500">
              %{stats.storage_usage.percentage.toFixed(1)} kullanılıyor
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '?tab=manual-fetch'}>
              <FileText className="h-4 w-4 mr-2" />
              Manuel Çekim
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '?tab=automation'}>
              <Clock className="h-4 w-4 mr-2" />
              Otomasyon
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '?tab=categories'}>
              <BarChart className="h-4 w-4 mr-2" />
              Kategoriler
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '?tab=duplicates'}>
              <Users className="h-4 w-4 mr-2" />
              Tekrarlar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  percentage 
}: { 
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
  percentage?: number;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          {percentage !== undefined && (
            <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
          )}
        </div>
        <h3 className="text-2xl font-bold">{value.toLocaleString('tr-TR')}</h3>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
        {change && (
          <p className="text-xs text-green-600 mt-2">{change}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value.toLocaleString('tr-TR')}</span>
    </div>
  );
}
