'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, RefreshCw, AlertTriangle, Merge, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DuplicateGroup {
  id: string;
  similarity: number;
  items: DuplicateItem[];
  status: 'pending' | 'merged' | 'ignored';
}

interface DuplicateItem {
  id: string;
  title: string;
  summary: string;
  publishDate: string;
  source: string;
  imageUrl?: string;
  category: string;
  selected?: boolean;
}

export default function DuplicatesTab() {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDuplicates();
  }, []);

  const loadDuplicates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ultra-premium-aa?action=get-duplicates');
      const data = await response.json();
      
      if (data.success) {
        setDuplicateGroups(data.duplicates || []);
      } else {
        toast.error('Tekrar eden haberler yüklenemedi');
      }
    } catch (error) {
      console.error('Load duplicates error:', error);
      toast.error('Tekrar eden haberler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const scanForDuplicates = async () => {
    try {
      setProcessing(true);
      toast.info('Tekrar eden haberler taranıyor...');
      
      const response = await fetch('/api/ultra-premium-aa?action=scan-duplicates', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`${data.duplicatesFound} tekrar grubu bulundu`);
        loadDuplicates();
      } else {
        toast.error(data.error || 'Tarama başarısız');
      }
    } catch (error) {
      console.error('Scan duplicates error:', error);
      toast.error('Tarama sırasında hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const mergeDuplicates = async (groupId: string, keepItemId: string, removeItemIds: string[]) => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=merge-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, keepItemId, removeItemIds })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Tekrar eden haberler birleştirildi');
        loadDuplicates();
      } else {
        toast.error(data.error || 'Birleştirme başarısız');
      }
    } catch (error) {
      console.error('Merge duplicates error:', error);
      toast.error('Birleştirme sırasında hata oluştu');
    }
  };

  const ignoreDuplicateGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=ignore-duplicate-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Tekrar grubu yok sayıldı');
        loadDuplicates();
      } else {
        toast.error(data.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Ignore duplicate group error:', error);
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  const deleteNewsItem = async (itemId: string) => {
    if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/ultra-premium-aa?action=delete-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Haber silindi');
        loadDuplicates();
      } else {
        toast.error(data.error || 'Haber silinemedi');
      }
    } catch (error) {
      console.error('Delete news error:', error);
      toast.error('Haber silinirken hata oluştu');
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-red-600 bg-red-100';
    if (similarity >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity >= 90) return 'Çok Yüksek';
    if (similarity >= 70) return 'Yüksek';
    return 'Orta';
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
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Tekrar Eden Haberler
              </CardTitle>
              <CardDescription>
                {duplicateGroups.length} tekrar grubu bulundu
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadDuplicates} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button onClick={scanForDuplicates} disabled={processing}>
                {processing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Tekrar Tara
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Duplicates List */}
      {duplicateGroups.length === 0 ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Tekrar eden haber bulunamadı. Haberlerinizi taramak için "Tekrar Tara" butonunu kullanın.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {duplicateGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getSimilarityColor(group.similarity)}>
                      %{group.similarity} {getSimilarityLabel(group.similarity)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {group.items.length} haber
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => ignoreDuplicateGroup(group.id)}
                    >
                      Yok Say
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {group.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg ${
                        item.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-2 line-clamp-2">
                                {item.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {item.summary}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{item.source}</span>
                                <span>{item.category}</span>
                                <span>
                                  {formatDistanceToNow(new Date(item.publishDate), { 
                                    addSuffix: true, 
                                    locale: tr 
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteNewsItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`keep-${group.id}`}
                              id={`keep-${item.id}`}
                              defaultChecked
                              className="form-radio"
                            />
                            <label 
                              htmlFor={`keep-${item.id}`}
                              className="text-sm font-medium text-green-600"
                            >
                              Bu haberi tut
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const keepItem = group.items[0];
                      const removeItems = group.items.slice(1).map(item => item.id);
                      mergeDuplicates(group.id, keepItem.id, removeItems);
                    }}
                    className="flex-1"
                  >
                    <Merge className="h-4 w-4 mr-2" />
                    İlk Haberi Tut, Diğerlerini Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
