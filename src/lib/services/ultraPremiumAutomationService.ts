// Ultra Premium Automated Scheduling Service
// Complete professional automated news fetching and processing system

import { AAAutoSchedule } from '@/lib/firebase/models';
import { 
  AANewsService, 
  AAScheduleService, 
  AAStatsService, 
  AAAPILogService 
} from '@/lib/firebase/services';
import { ultraPremiumAAService } from './ultraPremiumAAService';
import { geminiService } from './geminiService';

interface ScheduleExecutionResult {
  success: boolean;
  scheduleId: string;
  newsProcessed: number;
  aiEnhanced: number;
  errors: string[];
  executionTime: number;
  nextExecution?: Date;
}

interface ScheduleConfig {
  name: string;
  enabled: boolean;
  interval: 'hourly' | 'daily' | 'weekly' | 'custom';
  intervalHours?: number;
  fetchCount?: number;
  customCron?: string;
  categories: string[];
  newsCount: number;
  autoPublish: boolean;
  aiEnhancement: boolean;
  seoOptimization: boolean;
  googleNewsOptimization: boolean;
  filters: {
    priority?: ('flas' | 'manset' | 'acil' | 'rutin')[];
    keywords?: string[];
    excludeKeywords?: string[];
    minImportanceScore?: number;
  };
  notifications: {
    email?: string[];
    slack?: string;
    webhook?: string;
  };
}

class UltraPremiumAutomationService {
  private runningSchedules: Set<string> = new Set();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeScheduleMonitoring();
  }

  private async initializeScheduleMonitoring() {
    console.log('🤖 Initializing Ultra Premium Automation Service...');
    
    try {
      // Load all active schedules
      const schedules = await AAScheduleService.getActiveSchedules();
      
      for (const schedule of schedules) {
        if (schedule.enabled && schedule.nextRun) {
          await this.scheduleExecution(schedule);
        }
      }
      
      console.log(`✅ Initialized ${schedules.length} active schedules`);
    } catch (error) {
      console.error('❌ Error initializing automation service:', error);
    }
  }

  async createSchedule(config: ScheduleConfig): Promise<{ success: boolean; scheduleId?: string; error?: string }> {
    try {
      console.log('📅 Creating new ultra premium schedule:', config.name);

      const nextRun = this.calculateNextRun(config.interval, config.customCron);
      
      const scheduleData: Omit<AAAutoSchedule, 'id' | 'createdAt' | 'updatedAt'> = {
        name: config.name,
        category: Array.isArray(config.categories) && config.categories.length > 0 ? config.categories[0] : 'all',
        interval: config.intervalHours ? Number(config.intervalHours) * 60 : 60, // Convert hours to minutes, default 1 hour
        enabled: true,
        lastRun: undefined,
        nextRun: nextRun || undefined,
        maxNews: config.fetchCount || config.newsCount || 10,
        priority: 'rutin' as const,
        aiEnhance: config.aiEnhancement,
        photoDownload: true,
        videoDownload: true,
        
        // Ultra premium properties
        categories: config.categories,
        newsCount: config.newsCount,
        filters: {
          ...config.filters,
          priority: config.filters.priority?.[0] // Take first priority if array
        },
        aiEnhancement: config.aiEnhancement,
        seoOptimization: config.seoOptimization,
        autoPublish: config.autoPublish,
        notifications: config.notifications,
        customCron: config.interval === 'custom' ? config.customCron : undefined,
        
        // Required properties
        totalRuns: 0,
        totalNewsProcessed: 0,
        lastRunSuccess: true
      };

      const scheduleId = await AAScheduleService.createSchedule(scheduleData);
      
      if (scheduleId && nextRun) {
        // Schedule execution will be handled by background process
        console.log(`🕐 Schedule created and will execute at: ${nextRun}`);
      }

      console.log(`✅ Schedule created successfully: ${scheduleId}`);
      
      return {
        success: true,
        scheduleId: scheduleId
      };

    } catch (error) {
      console.error('❌ Error creating schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async executeSchedule(scheduleId: string): Promise<ScheduleExecutionResult> {
    const startTime = Date.now();
    
    if (this.runningSchedules.has(scheduleId)) {
      return {
        success: false,
        scheduleId,
        newsProcessed: 0,
        aiEnhanced: 0,
        errors: ['Schedule is already running'],
        executionTime: 0
      };
    }

    this.runningSchedules.add(scheduleId);

    try {
      console.log(`🚀 Executing ultra premium schedule: ${scheduleId}`);

      // Get schedule details
      const schedule = await AAScheduleService.getSchedule(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // Update last run time
      await AAScheduleService.updateSchedule(scheduleId, {
        lastRun: new Date(),
        nextRun: this.calculateNextRun(schedule.interval.toString(), schedule.customCron) || undefined
      });

      // Fetch news from AA API
      const aaResponse = await ultraPremiumAAService.fetchNews({
        categories: schedule.categories || [schedule.category],
        count: schedule.newsCount || schedule.maxNews,
        date_range: 'today',
        priority: schedule.filters?.priority ? [schedule.filters.priority] : undefined,
        include_media: true,
        format: 'newsml29',
        keywords: schedule.filters?.keywords?.join(',')
      });

      if (!aaResponse.success) {
        throw new Error('Failed to fetch news from AA API: ' + aaResponse.message);
      }

      const errors: string[] = [];
      let newsProcessed = 0;
      let aiEnhanced = 0;

      // Process each news item
      for (const newsItem of aaResponse.news) {
        try {
          // Apply filters
          if (!this.passesFilters(newsItem, schedule.filters)) {
            continue;
          }

          // Check for duplicates
          const existingNews = await AANewsService.getNewsByAAId(newsItem.id);
          if (existingNews) {
            console.log(`⚠️ News item already exists: ${newsItem.id}`);
            continue;
          }

          let enhancedContent = newsItem.content;
          let aiGeneratedSummary = newsItem.summary;
          let aiGeneratedTags = newsItem.tags;
          let seoTitle = newsItem.title;
          let seoDescription = newsItem.summary;

          // AI Enhancement
          if (schedule.aiEnhancement || schedule.seoOptimization) {
            try {
              console.log(`🤖 AI enhancing news: ${newsItem.title}`);
              
              const aiResult = await geminiService.enhanceNewsContent(
                newsItem.content, 
                newsItem.title, 
                newsItem.category,
                {
                  targetAudience: 'genel',
                  contentGoal: 'inform',
                  toneOfVoice: 'professional',
                  seoFocus: 'national',
                  contentLength: 'medium'
                }
              );

              if (aiResult.success) {
                enhancedContent = aiResult.enhancedContent;
                aiGeneratedSummary = aiResult.googleNewsOptimization.snippet;
                aiGeneratedTags = aiResult.metaKeywords;
                seoTitle = aiResult.seoOptimizedTitle;
                seoDescription = aiResult.seoDescription;
                aiEnhanced++;
                
                console.log(`✅ AI enhancement completed for: ${newsItem.title}`);
              } else {
                console.warn(`⚠️ AI enhancement failed for: ${newsItem.title}`);
              }
            } catch (aiError) {
              console.error(`❌ AI enhancement error for ${newsItem.title}:`, aiError);
              errors.push(`AI enhancement failed for ${newsItem.title}: ${aiError}`);
            }
          }

          // Create news document
          const newsDoc = {
            aa_id: newsItem.id,
            title: newsItem.title,
            content: enhancedContent,
            summary: aiGeneratedSummary || newsItem.summary,
            category: newsItem.category,
            priority: newsItem.priority || 'rutin',
            status: 'published' as const,
            publishDate: schedule.autoPublish ? new Date() : new Date(newsItem.published_at || Date.now()),
            source: 'AA' as const,
            originalData: newsItem,
            aiEnhanced: schedule.aiEnhancement || false,
            aiGeneratedSummary,
            aiGeneratedTags,
            seoTitle: schedule.seoOptimization ? seoTitle : undefined,
            seoDescription: schedule.seoOptimization ? seoDescription : undefined,
            hasPhotos: newsItem.media_items?.some(m => m.type === 'photo') || false,
            hasVideos: newsItem.media_items?.some(m => m.type === 'video') || false,
            hasDocuments: newsItem.media_items?.some(m => m.type === 'document') || false,
            mediaUrls: newsItem.media_items?.map(m => m.url),
            viewCount: 0,
            shareCount: 0,
            author: newsItem.author || 'AA',
            tags: aiGeneratedTags || newsItem.tags || [],
            slug: this.generateSlug(newsItem.title)
          };

          // Save to Firestore
          await AANewsService.createNews(newsDoc);
          newsProcessed++;

          console.log(`💾 Saved news to Firestore: ${newsItem.title}`);

        } catch (itemError) {
          console.error(`❌ Error processing news item ${newsItem.id}:`, itemError);
          errors.push(`Processing failed for ${newsItem.title}: ${itemError}`);
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Log the execution
      await AAAPILogService.logOperation({
        operation: 'scheduled_fetch',
        endpoint: '/automation/execute',
        status: 'success',
        response_time: Date.now() - startTime,
        parameters: {
          scheduleId,
          categories: schedule.categories,
          newsCount: schedule.newsCount
        },
        result_count: newsProcessed
      });

      // Update schedule stats
      await AAScheduleService.updateSchedule(scheduleId, { 
        totalRuns: (schedule.totalRuns || 0) + 1,
        totalNewsProcessed: (schedule.totalNewsProcessed || 0) + newsProcessed,
        lastRunSuccess: errors.length === 0,
        lastRunError: errors.length > 0 ? errors.join(', ') : undefined,
        lastRun: new Date()
      });

      // Recalculate system stats
      await AAStatsService.recalculateStats();

      // Send notifications if configured
      if (schedule.notifications && newsProcessed > 0) {
        await this.sendNotifications(schedule, newsProcessed, aiEnhanced);
      }

      // Schedule next execution
      const nextExecution = this.calculateNextRun(schedule.interval.toString(), schedule.customCron);
      if (nextExecution && schedule.enabled) {
        await this.scheduleExecution({ ...schedule, nextRun: nextExecution });
      }

      const executionTime = Date.now() - startTime;
      
      console.log(`✅ Schedule execution completed: ${newsProcessed} news processed, ${aiEnhanced} AI enhanced`);

      return {
        success: true,
        scheduleId,
        newsProcessed,
        aiEnhanced,
        errors,
        executionTime,
        nextExecution: nextExecution || undefined
      };

    } catch (error) {
      console.error(`❌ Schedule execution failed for ${scheduleId}:`, error);

      // Log the error
      await AAAPILogService.logOperation({
        operation: 'scheduled_fetch',
        endpoint: '/automation/execute',
        status: 'error',
        response_time: Date.now() - startTime,
        parameters: { scheduleId },
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      // Update schedule stats with error
      const schedule = await AAScheduleService.getSchedule(scheduleId);
      if (schedule) {
        await AAScheduleService.updateSchedule(scheduleId, { 
          totalRuns: (schedule.totalRuns || 0) + 1,
          lastRunSuccess: false,
          lastRunError: error instanceof Error ? error.message : 'Unknown error',
          lastRun: new Date()
        });
      }

      return {
        success: false,
        scheduleId,
        newsProcessed: 0,
        aiEnhanced: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        executionTime: Date.now() - startTime
      };

    } finally {
      this.runningSchedules.delete(scheduleId);
    }
  }

  private async scheduleExecution(schedule: AAAutoSchedule): Promise<void> {
    if (!schedule.nextRun) return;

    const delay = schedule.nextRun.getTime() - Date.now();
    
    if (delay <= 0) {
      // Should run now
      setImmediate(() => this.executeSchedule(schedule.id));
      return;
    }

    // Clear existing timer
    const existingTimer = this.timers.get(schedule.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.executeSchedule(schedule.id);
      this.timers.delete(schedule.id);
    }, delay);

    this.timers.set(schedule.id, timer);
    
    console.log(`⏰ Scheduled next execution for ${schedule.name} at ${schedule.nextRun.toISOString()}`);
  }

  private calculateNextRun(interval: string, customCron?: string): Date | null {
    const now = new Date();
    
    switch (interval) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // 9 AM daily
        return tomorrow;
      
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0); // 9 AM weekly
        return nextWeek;
      
      case 'custom':
        if (customCron) {
          // Simple cron parsing - in production use a proper cron library
          return this.parseSimpleCron(customCron);
        }
        return null;
      
      default:
        return null;
    }
  }

  private parseSimpleCron(cron: string): Date | null {
    // Simple implementation - in production use node-cron or similar
    // Format: "0 9 * * *" = every day at 9 AM
    const parts = cron.split(' ');
    if (parts.length !== 5) return null;
    
    const [minute, hour, day, month, weekday] = parts;
    const now = new Date();
    const next = new Date(now);
    
    if (hour !== '*') {
      next.setHours(parseInt(hour), parseInt(minute), 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
    }
    
    return next;
  }

  private passesFilters(newsItem: any, filters: any): boolean {
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(newsItem.priority)) {
        return false;
      }
    }

    // Importance score filter
    if (filters.minImportanceScore && newsItem.importance_score < filters.minImportanceScore) {
      return false;
    }

    // Keyword filters
    if (filters.keywords && filters.keywords.length > 0) {
      const content = (newsItem.title + ' ' + newsItem.content).toLowerCase();
      const hasKeyword = filters.keywords.some((keyword: string) => 
        content.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) {
        return false;
      }
    }

    // Exclude keywords
    if (filters.excludeKeywords && filters.excludeKeywords.length > 0) {
      const content = (newsItem.title + ' ' + newsItem.content).toLowerCase();
      const hasExcludedKeyword = filters.excludeKeywords.some((keyword: string) => 
        content.includes(keyword.toLowerCase())
      );
      if (hasExcludedKeyword) {
        return false;
      }
    }

    return true;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\sğüşıöçĞÜŞIÖÇ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .substring(0, 50);
  }

  private async sendNotifications(schedule: AAAutoSchedule, newsProcessed: number, aiEnhanced: number): Promise<void> {
    try {
      const message = `🚀 Schedule "${schedule.name}" completed successfully!\n\n` +
                     `📰 News processed: ${newsProcessed}\n` +
                     `🤖 AI enhanced: ${aiEnhanced}\n` +
                     `⏰ Next run: ${schedule.nextRun?.toISOString() || 'Not scheduled'}\n\n` +
                     `Ultra Premium AA Manager`;

      // Email notifications (implement with your email service)
      if (schedule.notifications?.email && schedule.notifications.email.length > 0) {
        console.log('📧 Email notifications would be sent to:', schedule.notifications.email);
      }

      // Slack notifications (implement with Slack API)
      if (schedule.notifications?.slack) {
        console.log('💬 Slack notification would be sent to:', schedule.notifications.slack);
      }

      // Webhook notifications
      if (schedule.notifications?.webhook) {
        try {
          await fetch(schedule.notifications.webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              schedule: schedule.name,
              newsProcessed,
              aiEnhanced,
              timestamp: new Date().toISOString(),
              message
            })
          });
          console.log('🔗 Webhook notification sent successfully');
        } catch (webhookError) {
          console.error('❌ Webhook notification failed:', webhookError);
        }
      }

    } catch (error) {
      console.error('❌ Notification sending failed:', error);
    }
  }

  async toggleSchedule(scheduleId: string, enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await AAScheduleService.updateSchedule(scheduleId, { enabled });
      
      if (enabled) {
        const schedule = await AAScheduleService.getSchedule(scheduleId);
        if (schedule && schedule.nextRun) {
          await this.scheduleExecution(schedule);
        }
      } else {
        // Clear timer
        const timer = this.timers.get(scheduleId);
        if (timer) {
          clearTimeout(timer);
          this.timers.delete(scheduleId);
        }
      }

      console.log(`✅ Schedule ${scheduleId} ${enabled ? 'enabled' : 'disabled'}`);
      
      return { success: true };

    } catch (error) {
      console.error(`❌ Error toggling schedule ${scheduleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getScheduleStatus(): Promise<{
    activeSchedules: number;
    runningNow: number;
    nextExecution?: Date;
    totalSchedules: number;
  }> {
    try {
      const allSchedules = await AAScheduleService.getAllSchedules();
      const activeSchedules = allSchedules.filter(s => s.enabled);
      
      const nextExecutions = activeSchedules
        .map(s => s.nextRun)
        .filter(date => date)
        .sort((a, b) => a!.getTime() - b!.getTime());

      return {
        activeSchedules: activeSchedules.length,
        runningNow: this.runningSchedules.size,
        nextExecution: nextExecutions[0] || undefined,
        totalSchedules: allSchedules.length
      };

    } catch (error) {
      console.error('❌ Error getting schedule status:', error);
      return {
        activeSchedules: 0,
        runningNow: 0,
        totalSchedules: 0
      };
    }
  }

  async getSchedules(): Promise<AAAutoSchedule[]> {
    try {
      return await AAScheduleService.getAllSchedules();
    } catch (error) {
      console.error('❌ Error getting schedules:', error);
      return [];
    }
  }

  async pauseSchedule(scheduleId: string): Promise<{ success: boolean; error?: string }> {
    return this.toggleSchedule(scheduleId, false);
  }

  async resumeSchedule(scheduleId: string): Promise<{ success: boolean; error?: string }> {
    return this.toggleSchedule(scheduleId, true);
  }

  async deleteSchedule(scheduleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear timer
      const timer = this.timers.get(scheduleId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(scheduleId);
      }

      // Remove from running schedules
      this.runningSchedules.delete(scheduleId);

      // Delete from database
      await AAScheduleService.deleteSchedule(scheduleId);

      console.log(`✅ Schedule ${scheduleId} deleted successfully`);
      
      return { success: true };

    } catch (error) {
      console.error(`❌ Error deleting schedule ${scheduleId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Cleanup method
  destroy() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.runningSchedules.clear();
  }
}

export const ultraPremiumAutomationService = new UltraPremiumAutomationService();
export default ultraPremiumAutomationService;
export type { ScheduleConfig, ScheduleExecutionResult };
