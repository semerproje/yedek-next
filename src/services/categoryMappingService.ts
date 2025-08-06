// Category Mapping Service - AA Categories <-> Site Categories
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';

export interface CategoryMapping {
  id: string;
  aa_id: number;
  aa_name: string;
  site_slug: string;
  site_name: string;
  active: boolean;
  auto_fetch: boolean;
  priority: number;
  color: string;
  icon: string;
  seo_title?: string;
  seo_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AACategory {
  id: number;
  name: string;
  turkish_name: string;
}

class CategoryMappingService {
  private collectionName = 'category_mappings';

  // Default AA Categories (from API documentation)
  private defaultAACategories: AACategory[] = [
    { id: 1, name: 'general', turkish_name: 'Genel' },
    { id: 2, name: 'sports', turkish_name: 'Spor' },
    { id: 3, name: 'economy', turkish_name: 'Ekonomi' },
    { id: 4, name: 'politics', turkish_name: 'Politika' },
    { id: 5, name: 'world', turkish_name: 'Dünya' },
    { id: 6, name: 'technology', turkish_name: 'Teknoloji' },
    { id: 7, name: 'culture', turkish_name: 'Kültür' },
    { id: 8, name: 'health', turkish_name: 'Sağlık' }
  ];

  // Default Site Categories
  private defaultSiteCategories = [
    { slug: 'gundem', name: 'Gündem', color: '#ef4444', icon: '📰' },
    { slug: 'spor', name: 'Spor', color: '#10b981', icon: '⚽' },
    { slug: 'ekonomi', name: 'Ekonomi', color: '#f59e0b', icon: '💰' },
    { slug: 'politika', name: 'Politika', color: '#8b5cf6', icon: '🏛️' },
    { slug: 'dunya', name: 'Dünya', color: '#06b6d4', icon: '🌍' },
    { slug: 'teknoloji', name: 'Teknoloji', color: '#3b82f6', icon: '💻' },
    { slug: 'kultur', name: 'Kültür', color: '#ec4899', icon: '🎭' },
    { slug: 'saglik', name: 'Sağlık', color: '#84cc16', icon: '🏥' },
    { slug: 'magazin', name: 'Magazin', color: '#f97316', icon: '⭐' },
    { slug: 'egitim', name: 'Eğitim', color: '#6366f1', icon: '📚' }
  ];

  // Get all category mappings
  async getSiteCategories() {
    return this.defaultSiteCategories;
  }

  async getAACategories() {
    return this.defaultAACategories;
  }

  async getAllMappings(): Promise<CategoryMapping[]> {
    try {
      const mappingsRef = collection(db, this.collectionName);
      const snapshot = await getDocs(mappingsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CategoryMapping));
    } catch (error) {
      console.error('Error fetching category mappings:', error);
      return [];
    }
  }

  // Get active mappings only
  async getActiveMappings(): Promise<CategoryMapping[]> {
    try {
      const mappingsRef = collection(db, this.collectionName);
      const q = query(mappingsRef, where('active', '==', true));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CategoryMapping));
    } catch (error) {
      console.error('Error fetching active mappings:', error);
      return [];
    }
  }

  // Get auto-fetch enabled mappings
  async getAutoFetchMappings(): Promise<CategoryMapping[]> {
    try {
      const mappingsRef = collection(db, this.collectionName);
      const q = query(mappingsRef, where('auto_fetch', '==', true), where('active', '==', true));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CategoryMapping));
    } catch (error) {
      console.error('Error fetching auto-fetch mappings:', error);
      return [];
    }
  }

  // Create new mapping
  async createMapping(mappingData: Partial<CategoryMapping>): Promise<string> {
    try {
      const id = `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newMapping: CategoryMapping = {
        id,
        aa_id: mappingData.aa_id || 0,
        aa_name: mappingData.aa_name || '',
        site_slug: mappingData.site_slug || '',
        site_name: mappingData.site_name || '',
        active: mappingData.active ?? true,
        auto_fetch: mappingData.auto_fetch ?? false,
        priority: mappingData.priority || 1,
        color: mappingData.color || '#3b82f6',
        icon: mappingData.icon || '📰',
        seo_title: mappingData.seo_title,
        seo_description: mappingData.seo_description,
        created_at: new Date(),
        updated_at: new Date()
      };

      await setDoc(doc(db, this.collectionName, id), newMapping);
      return id;
    } catch (error) {
      console.error('Error creating category mapping:', error);
      throw error;
    }
  }

  // Update existing mapping
  async updateMapping(id: string, updates: Partial<CategoryMapping>): Promise<CategoryMapping> {
    try {
      const updatedMapping = {
        ...updates,
        updated_at: new Date()
      };

      await setDoc(doc(db, this.collectionName, id), updatedMapping, { merge: true });
      
      // Return updated mapping
      const mappings = await this.getAllMappings();
      const updated = mappings.find(m => m.id === id);
      
      if (!updated) {
        throw new Error('Mapping not found after update');
      }
      
      return updated;
    } catch (error) {
      console.error('Error updating category mapping:', error);
      throw error;
    }
  }

  // Bulk update mappings
  async bulkUpdateMappings(mappings: Array<{id: string, updates: Partial<CategoryMapping>}>): Promise<{success: number, failed: number}> {
    let success = 0;
    let failed = 0;

    for (const mapping of mappings) {
      try {
        await this.updateMapping(mapping.id, mapping.updates);
        success++;
      } catch (error) {
        console.error(`Failed to update mapping ${mapping.id}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
  async createOrUpdateMapping(mapping: Omit<CategoryMapping, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const mappingId = `aa_${mapping.aa_id}_to_${mapping.site_slug}`;
      const mappingRef = doc(db, this.collectionName, mappingId);
      
      const now = new Date();
      const mappingData: Omit<CategoryMapping, 'id'> = {
        ...mapping,
        created_at: now,
        updated_at: now
      };

      await setDoc(mappingRef, mappingData, { merge: true });
      return mappingId;
    } catch (error) {
      console.error('Error creating/updating mapping:', error);
      throw error;
    }
  }

  // Delete mapping
  async deleteMapping(mappingId: string): Promise<void> {
    try {
      const mappingRef = doc(db, this.collectionName, mappingId);
      await deleteDoc(mappingRef);
    } catch (error) {
      console.error('Error deleting mapping:', error);
      throw error;
    }
  }

  // Get site category by AA category ID
  async getSiteCategoryByAAId(aaId: number): Promise<string | null> {
    try {
      const mappingsRef = collection(db, this.collectionName);
      const q = query(mappingsRef, where('aa_id', '==', aaId), where('active', '==', true));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const mapping = snapshot.docs[0].data() as CategoryMapping;
        return mapping.site_slug;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding site category:', error);
      return null;
    }
  }

  // Get AA category IDs for auto-fetch
  async getAAIdsForAutoFetch(): Promise<number[]> {
    try {
      const mappings = await this.getAutoFetchMappings();
      return mappings.map(mapping => mapping.aa_id);
    } catch (error) {
      console.error('Error getting AA IDs for auto-fetch:', error);
      return [];
    }
  }

  // Initialize default mappings
  async initializeDefaultMappings(): Promise<void> {
    try {
      // Create default mappings
      const defaultMappings = [
        { aa_id: 1, aa_name: 'Genel', site_slug: 'gundem', site_name: 'Gündem' },
        { aa_id: 2, aa_name: 'Spor', site_slug: 'spor', site_name: 'Spor' },
        { aa_id: 3, aa_name: 'Ekonomi', site_slug: 'ekonomi', site_name: 'Ekonomi' },
        { aa_id: 4, aa_name: 'Politika', site_slug: 'politika', site_name: 'Politika' },
        { aa_id: 5, aa_name: 'Dünya', site_slug: 'dunya', site_name: 'Dünya' },
        { aa_id: 6, aa_name: 'Teknoloji', site_slug: 'teknoloji', site_name: 'Teknoloji' },
        { aa_id: 7, aa_name: 'Kültür', site_slug: 'kultur', site_name: 'Kültür' },
        { aa_id: 8, aa_name: 'Sağlık', site_slug: 'saglik', site_name: 'Sağlık' }
      ];

      for (const mapping of defaultMappings) {
        const siteCategory = this.defaultSiteCategories.find(cat => cat.slug === mapping.site_slug);
        
        await this.createOrUpdateMapping({
          aa_id: mapping.aa_id,
          aa_name: mapping.aa_name,
          site_slug: mapping.site_slug,
          site_name: mapping.site_name,
          active: true,
          auto_fetch: true,
          priority: mapping.aa_id,
          color: siteCategory?.color || '#6b7280',
          icon: siteCategory?.icon || '📰',
          seo_title: `${mapping.site_name} Haberleri`,
          seo_description: `En güncel ${mapping.site_name.toLowerCase()} haberleri ve gelişmeleri`
        });
      }

      console.log('Default category mappings initialized');
    } catch (error) {
      console.error('Error initializing default mappings:', error);
      throw error;
    }
  }

  // Validate mapping
  validateMapping(mapping: Partial<CategoryMapping>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mapping.aa_id || mapping.aa_id < 1 || mapping.aa_id > 100) {
      errors.push('Geçerli bir AA kategori ID\'si gerekli (1-100)');
    }

    if (!mapping.aa_name || mapping.aa_name.trim().length < 2) {
      errors.push('AA kategori adı gerekli (min 2 karakter)');
    }

    if (!mapping.site_slug || !/^[a-z0-9-]+$/.test(mapping.site_slug)) {
      errors.push('Site slug gerekli (sadece küçük harf, rakam ve tire)');
    }

    if (!mapping.site_name || mapping.site_name.trim().length < 2) {
      errors.push('Site kategori adı gerekli (min 2 karakter)');
    }

    if (mapping.priority !== undefined && (mapping.priority < 1 || mapping.priority > 100)) {
      errors.push('Öncelik 1-100 arasında olmalı');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get default categories for reference
  getDefaultAACategories(): AACategory[] {
    return this.defaultAACategories;
  }

  getDefaultSiteCategories() {
    return this.defaultSiteCategories;
  }
}

export const categoryMappingService = new CategoryMappingService();
export default categoryMappingService;
