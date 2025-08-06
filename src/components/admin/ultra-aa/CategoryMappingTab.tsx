'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, RefreshCw, AlertCircle, List, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryMapping {
  id: string;
  aaCategory: string;
  localCategory: string;
  isActive: boolean;
  newsCount?: number;
}

interface AACategory {
  id: string;
  name: string;
}

export default function CategoryMappingTab() {
  const [mappings, setMappings] = useState<CategoryMapping[]>([]);
  const [aaCategories, setAACategories] = useState<AACategory[]>([]);
  const [localCategories] = useState<string[]>([
    'Gündem', 'Politika', 'Ekonomi', 'Dünya', 'Spor', 'Teknoloji', 
    'Sağlık', 'Eğitim', 'Kültür', 'Çevre', 'Turizm', 'Tarih', 
    'Otomotiv', 'Emlak', 'Finans', 'Sanat', 'Bilim', 'Yaşam'
  ]);
  const [newMapping, setNewMapping] = useState({ aaCategory: '', localCategory: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCategoryLists, setShowCategoryLists] = useState(false);

  useEffect(() => {
    loadCategoryMappings();
    loadAACategories();
  }, []);

  const loadAACategories = async () => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=discover');
      const data = await response.json();
      
      if (data.success && data.categories) {
        const categoryList = Object.entries(data.categories).map(([id, name]) => ({
          id,
          name: name as string
        }));
        setAACategories(categoryList);
      }
    } catch (error) {
      console.error('AA categories load error:', error);
    }
  };

  const loadCategoryMappings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ultra-premium-aa?action=get-category-mappings');
      const data = await response.json();
      
      if (data.success) {
        setMappings(data.mappings || []);
      } else {
        toast.error('Kategori eşlemeleri yüklenemedi');
      }
    } catch (error) {
      console.error('Category mappings load error:', error);
      toast.error('Kategori eşlemeleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addMapping = async () => {
    if (!newMapping.aaCategory || !newMapping.localCategory) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/ultra-premium-aa?action=add-category-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMapping)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Kategori eşlemesi eklendi');
        setNewMapping({ aaCategory: '', localCategory: '' });
        loadCategoryMappings();
      } else {
        toast.error(data.error || 'Kategori eşlemesi eklenemedi');
      }
    } catch (error) {
      console.error('Add mapping error:', error);
      toast.error('Kategori eşlemesi eklenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const deleteMapping = async (id: string) => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=delete-category-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Kategori eşlemesi silindi');
        loadCategoryMappings();
      } else {
        toast.error(data.error || 'Kategori eşlemesi silinemedi');
      }
    } catch (error) {
      console.error('Delete mapping error:', error);
      toast.error('Kategori eşlemesi silinirken hata oluştu');
    }
  };

  const toggleMappingStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/ultra-premium-aa?action=toggle-category-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Kategori eşlemesi ${isActive ? 'aktif' : 'pasif'} edildi`);
        loadCategoryMappings();
      } else {
        toast.error(data.error || 'Kategori durumu değiştirilemedi');
      }
    } catch (error) {
      console.error('Toggle mapping error:', error);
      toast.error('Kategori durumu değiştirilirken hata oluştu');
    }
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
      {/* Category Lists View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Kategori Listeleri
              </CardTitle>
              <CardDescription>
                Mevcut AA kategorileri ve yerel kategorileri görüntüleyin
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowCategoryLists(!showCategoryLists)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showCategoryLists ? 'Gizle' : 'Göster'}
            </Button>
          </div>
        </CardHeader>
        {showCategoryLists && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AA Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">
                  AA Kategorileri ({aaCategories.length})
                </h3>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  {aaCategories.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Kategoriler yükleniyor...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {aaCategories.map((category) => (
                        <div 
                          key={category.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                        >
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="outline">ID: {category.id}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Local Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">
                  Yerel Kategoriler ({localCategories.length})
                </h3>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {localCategories.map((category, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                      >
                        <span className="font-medium">{category}</span>
                        <Badge variant="secondary">Yerel</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add New Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Yeni Kategori Eşlemesi
          </CardTitle>
          <CardDescription>
            AA kategorilerini yerel kategorilere eşleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="aa-category">AA Kategorisi</Label>
              <Select
                value={newMapping.aaCategory}
                onValueChange={(value) => setNewMapping(prev => ({ ...prev, aaCategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AA kategorisi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {aaCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name} (ID: {category.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="local-category">Yerel Kategori</Label>
              <Select
                value={newMapping.localCategory}
                onValueChange={(value) => setNewMapping(prev => ({ ...prev, localCategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yerel kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {localCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addMapping} 
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mappings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mevcut Kategori Eşlemeleri</CardTitle>
              <CardDescription>
                {mappings.length} kategori eşlemesi bulundu
              </CardDescription>
            </div>
            <Button variant="outline" onClick={loadCategoryMappings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Henüz kategori eşlemesi tanımlanmamış. Yeni bir eşleme ekleyin.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{mapping.aaCategory}</div>
                      <div className="text-sm text-gray-500">→ {mapping.localCategory}</div>
                    </div>
                    {mapping.newsCount !== undefined && (
                      <Badge variant="secondary">
                        {mapping.newsCount} haber
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={mapping.isActive ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleMappingStatus(mapping.id, !mapping.isActive)}
                    >
                      {mapping.isActive ? 'Aktif' : 'Pasif'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMapping(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
