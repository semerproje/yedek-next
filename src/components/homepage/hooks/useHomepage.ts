// Custom hooks for Ultra Premium Homepage Module System
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  HomepageModuleService, 
  HomepageNewsService, 
  HomepageRealtimeService,
  HomepageAnalyticsService 
} from '@/lib/firestore/homepage-services';
import { HomepageModule, News } from '@/types/homepage';
import { ModulePerformance, AnalyticsEvent } from '@/types/firestore';

// Hook for managing homepage modules
export function useHomepageModules() {
  const [modules, setModules] = useState<HomepageModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const modulesList = await HomepageModuleService.getActiveModules();
        setModules(modulesList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load modules');
        console.error('Error loading modules:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time updates
    unsubscribeRef.current = HomepageRealtimeService.subscribeToModules((updatedModules) => {
      setModules(updatedModules);
      setLoading(false);
    });

    loadModules();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const refreshModules = useCallback(async () => {
    try {
      setLoading(true);
      const modulesList = await HomepageModuleService.getActiveModules();
      setModules(modulesList);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh modules');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModuleOrder = useCallback(async (modules: { id: string; order: number }[]) => {
    try {
      await HomepageModuleService.updateModuleOrder(modules);
      await refreshModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module order');
    }
  }, [refreshModules]);

  const toggleModule = useCallback(async (id: string, active: boolean) => {
    try {
      await HomepageModuleService.toggleModuleActive(id, active);
      // Update local state immediately for better UX
      setModules(prev => prev.map(module => 
        module.id === id ? { ...module, active } : module
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle module');
      // Revert local state on error
      await refreshModules();
    }
  }, [refreshModules]);

  return {
    modules,
    loading,
    error,
    refreshModules,
    updateModuleOrder,
    toggleModule
  };
}

// Hook for fetching news for a specific module
export function useModuleNews(module: HomepageModule | null, enabled: boolean = true) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    if (!module || !enabled) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedNews = await HomepageNewsService.getNewsForModule(module);
      setNews(fetchedNews);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching module news:', err);
    } finally {
      setLoading(false);
    }
  }, [module, enabled]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Auto-refresh based on module settings
  useEffect(() => {
    if (!module?.settings?.autoRefreshMinutes || !enabled) return;

    const interval = setInterval(() => {
      fetchNews();
    }, module.settings.autoRefreshMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [module?.settings?.autoRefreshMinutes, fetchNews, enabled]);

  const refreshNews = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    lastFetch,
    refreshNews
  };
}

// Hook for breaking news with real-time updates
export function useBreakingNews() {
  const [breakingNews, setBreakingNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadBreakingNews = async () => {
      try {
        setLoading(true);
        const news = await HomepageNewsService.getBreakingNews();
        setBreakingNews(news);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load breaking news');
        console.error('Error loading breaking news:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time updates
    unsubscribeRef.current = HomepageRealtimeService.subscribeToBreakingNews((news) => {
      setBreakingNews(news);
      setLoading(false);
    });

    loadBreakingNews();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    breakingNews,
    loading,
    error
  };
}

// Hook for featured news with real-time updates
export function useFeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        setLoading(true);
        const news = await HomepageNewsService.getFeaturedNews();
        setFeaturedNews(news);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured news');
        console.error('Error loading featured news:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to real-time updates
    unsubscribeRef.current = HomepageRealtimeService.subscribeToFeaturedNews((news) => {
      setFeaturedNews(news);
      setLoading(false);
    });

    loadFeaturedNews();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    featuredNews,
    loading,
    error
  };
}

// Hook for analytics tracking
export function useAnalytics() {
  const trackModuleView = useCallback(async (moduleId: string, moduleType: string) => {
    try {
      await HomepageAnalyticsService.trackModuleView(moduleId, moduleType);
    } catch (err) {
      console.error('Error tracking module view:', err);
    }
  }, []);

  const trackNewsClick = useCallback(async (newsId: string, moduleId: string, moduleType: string) => {
    try {
      await HomepageAnalyticsService.trackNewsClick(newsId, moduleId, moduleType);
      // Also increment news views
      await HomepageNewsService.incrementNewsViews(newsId);
    } catch (err) {
      console.error('Error tracking news click:', err);
    }
  }, []);

  const getModulePerformance = useCallback(async (moduleId: string, days: number = 7) => {
    try {
      return await HomepageAnalyticsService.getModulePerformance(moduleId, days);
    } catch (err) {
      console.error('Error getting module performance:', err);
      return null;
    }
  }, []);

  return {
    trackModuleView,
    trackNewsClick,
    getModulePerformance
  };
}

// Hook for infinite scroll functionality
export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number) => Promise<T[]>,
  limit: number = 10
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const newItems = await fetchFunction(page, limit);
      
      if (newItems.length < limit) {
        setHasMore(false);
      }
      
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
      console.error('Error in infinite scroll:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []); // Only run on mount

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
}

// Hook for local storage with SSR safety
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, isLoading] as const;
}

// Hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Hook for intersection observer (for lazy loading)
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isIntersecting];
}