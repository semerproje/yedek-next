"use client";
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: any;
  }
}

export function WebVitals() {
  useEffect(() => {
    // Web Vitals tracking
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });

    // Performance Observer for custom metrics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming;
            
            // Custom metrics
            const metrics = {
              dns_lookup: nav.domainLookupEnd - nav.domainLookupStart,
              tcp_connection: nav.connectEnd - nav.connectStart,
              server_response: nav.responseStart - nav.requestStart,
              dom_interactive: nav.domInteractive - nav.fetchStart,
              dom_complete: nav.domComplete - nav.fetchStart,
              page_load: nav.loadEventEnd - nav.fetchStart
            };

            // Send to analytics
            if (window.gtag) {
              Object.entries(metrics).forEach(([name, value]) => {
                window.gtag('event', 'timing_complete', {
                  name: name,
                  value: Math.round(value)
                });
              });
            }
          }
        });
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });

      // Long Task Observer
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 200) { // Tasks longer than 200ms (more strict)
            // Disable logging in development for cleaner console
            // console.warn('Long task detected:', entry.duration);
            
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                duration: Math.round(entry.duration),
                start_time: Math.round(entry.startTime)
              });
            }
          }
        });
      });
      
      if ('observe' in longTaskObserver) {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      }

      // Layout Shift Observer
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });

        if (clsValue > 0.1) { // CLS threshold
          console.warn('High Cumulative Layout Shift:', clsValue);
          
          if (window.gtag) {
            window.gtag('event', 'layout_shift', {
              value: clsValue
            });
          }
        }
      });
      
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      // Resource timing for optimization
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources (increased threshold to 3s)
          if (resource.duration > 3000) { 
            // Disable logging in development for cleaner console
            // console.warn('Slow resource:', resource.name, resource.duration);
            
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                resource_name: resource.name,
                duration: Math.round(resource.duration),
                resource_type: getResourceType(resource.name)
              });
            }
          }
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
    }

    // Memory usage tracking (Chrome only)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        };

        // Warn if memory usage is high
        if (memoryUsage.used > 100) { // > 100MB
          console.warn('High memory usage:', memoryUsage);
          
          if (window.gtag) {
            window.gtag('event', 'memory_usage', {
              used_mb: memoryUsage.used,
              total_mb: memoryUsage.total
            });
          }
        }
      };

      // Check memory every 30 seconds
      const memoryInterval = setInterval(checkMemory, 30000);
      
      return () => clearInterval(memoryInterval);
    }
  }, []);

  return null;
}

function sendToAnalytics(metric: any) {
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta
    });
  }

  // Console log for debugging
  console.log('Web Vital:', metric.name, metric.value);

  // Send to custom analytics endpoint
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href
    })
  }).catch(console.error);
}

function getResourceType(url: string): string {
  if (url.includes('.js')) return 'javascript';
  if (url.includes('.css')) return 'stylesheet';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
  return 'other';
}
