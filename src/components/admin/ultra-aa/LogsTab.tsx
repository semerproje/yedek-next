'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Download, Trash2, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  details?: any;
  userId?: string;
  ip?: string;
}

export default function LogsTab() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    search: ''
  });
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const logLevels = ['all', 'info', 'warning', 'error', 'debug'];
  const categories = ['all', 'aa-api', 'firebase', 'automation', 'auth', 'system'];

  useEffect(() => {
    loadLogs();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, filters]);

  useEffect(() => {
    if (realTimeEnabled) {
      intervalRef.current = setInterval(loadLogs, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realTimeEnabled]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ultra-premium-aa?action=get-logs');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs || []);
        if (realTimeEnabled) {
          scrollToBottom();
        }
      } else {
        toast.error('Loglar yüklenemedi');
      }
    } catch (error) {
      console.error('Load logs error:', error);
      toast.error('Loglar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm) ||
        log.category.toLowerCase().includes(searchTerm) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm))
      );
    }

    setFilteredLogs(filtered);
  };

  const clearLogs = async () => {
    if (!confirm('Tüm logları silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/ultra-premium-aa?action=clear-logs', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Loglar temizlendi');
        setLogs([]);
      } else {
        toast.error(data.error || 'Loglar temizlenemedi');
      }
    } catch (error) {
      console.error('Clear logs error:', error);
      toast.error('Loglar temizlenirken hata oluştu');
    }
  };

  const downloadLogs = async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=export-logs');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Loglar indirildi');
    } catch (error) {
      console.error('Download logs error:', error);
      toast.error('Loglar indirilirken hata oluştu');
    }
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'debug':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      case 'debug':
        return '⚪';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sistem Logları</CardTitle>
              <CardDescription>
                {logs.length} log kaydı bulundu, {filteredLogs.length} tanesi gösteriliyor
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={realTimeEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              >
                {realTimeEnabled ? 'Canlı ✓' : 'Canlı'}
              </Button>
              <Button onClick={loadLogs} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button onClick={downloadLogs} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                İndir
              </Button>
              <Button onClick={clearLogs} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Temizle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Seviye</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {logLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'Tüm Seviyeler' : level.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tüm Kategoriler' : category.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Log içeriğinde ara..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-6">
                <Alert>
                  <Filter className="h-4 w-4" />
                  <AlertDescription>
                    Filtrelere uygun log kaydı bulunamadı.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log, index) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-lg">{getLevelIcon(log.level)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs ${getLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(log.timestamp), { 
                              addSuffix: true, 
                              locale: tr 
                            })}
                          </span>
                          {log.userId && (
                            <Badge variant="secondary" className="text-xs">
                              User: {log.userId}
                            </Badge>
                          )}
                          {log.ip && (
                            <span className="text-xs text-gray-400">
                              {log.ip}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-900 mb-2">
                          {log.message}
                        </div>
                        {log.details && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              Detayları göster
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {realTimeEnabled && (
        <Alert>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <AlertDescription>
              Canlı log modu aktif. Loglar 5 saniyede bir güncelleniyor.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}
