import { NextRequest, NextResponse } from 'next/server';
import { ultraPremiumAANewsManager } from '@/services/ultraPremiumAANewsManager';

// This endpoint will be called by external cron services like Vercel Cron
// or can be set up with GitHub Actions or other scheduling services

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (you can add API key authentication here)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🤖 Ultra Premium AA Scheduled Task Started:', new Date().toISOString());

    // Run auto fetch
    const result = await ultraPremiumAANewsManager.runAutoFetch();

    console.log('✅ Ultra Premium AA Scheduled Task Completed:', {
      processed: result.total_processed,
      schedules: result.schedules_run,
      errors: result.errors?.length || 0
    });

    return NextResponse.json({
      success: true,
      message: 'Scheduled task completed successfully',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Ultra Premium AA Scheduled Task Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_type, options } = body;

    console.log('🤖 Ultra Premium AA Manual Scheduled Task:', task_type);

    switch (task_type) {
      case 'auto_fetch':
        const autoResult = await ultraPremiumAANewsManager.runAutoFetch();
        return NextResponse.json({ success: true, data: autoResult });

      case 'duplicate_detection':
        const duplicateResult = await ultraPremiumAANewsManager.detectAndMergeDuplicates();
        return NextResponse.json({ success: true, data: duplicateResult });

      case 'cleanup_old_news':
        // Implement cleanup logic for old/expired news
        const cleanupResult = await cleanupOldNews(options?.days_old || 30);
        return NextResponse.json({ success: true, data: cleanupResult });

      case 'health_check':
        // System health check
        const healthResult = await performHealthCheck();
        return NextResponse.json({ success: true, data: healthResult });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid task type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Ultra Premium AA Manual Task Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to cleanup old news
async function cleanupOldNews(daysOld: number) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // This would implement logic to archive or delete old news
    // For now, we'll just return a placeholder
    console.log(`🧹 Cleaning up news older than ${daysOld} days (before ${cutoffDate.toISOString()})`);

    return {
      cleaned_count: 0,
      cutoff_date: cutoffDate.toISOString(),
      message: 'Cleanup functionality not yet implemented'
    };

  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
}

// Helper function for system health check
async function performHealthCheck() {
  try {
    const healthReport = {
      timestamp: new Date().toISOString(),
      services: {
        aa_api: false,
        firebase: false,
        gemini_ai: false
      },
      statistics: {
        total_news: 0,
        published_news: 0,
        draft_news: 0,
        last_fetch: null as string | null
      },
      errors: [] as string[]
    };

    // Check AA API
    try {
      const ultraPremiumAAService = (await import('@/services/ultraPremiumAAService')).default;
      const testResult = await ultraPremiumAAService.testConnection();
      healthReport.services.aa_api = testResult.success;
      if (!testResult.success && testResult.data) {
        healthReport.errors.push(`AA API: ${JSON.stringify(testResult.data)}`);
      }
    } catch (error) {
      healthReport.services.aa_api = false;
      healthReport.errors.push(`AA API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check Firebase
    try {
      const { db } = await import('@/lib/firebase');
      healthReport.services.firebase = !!db;
    } catch (error) {
      healthReport.services.firebase = false;
      healthReport.errors.push(`Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check Gemini AI
    try {
      healthReport.services.gemini_ai = !!process.env.GEMINI_API_KEY;
      if (!healthReport.services.gemini_ai) {
        healthReport.errors.push('Gemini AI: API key not configured');
      }
    } catch (error) {
      healthReport.services.gemini_ai = false;
      healthReport.errors.push(`Gemini AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get statistics
    try {
      const allNews = await ultraPremiumAANewsManager.getAllNews({ limit: 1000 });
      const publishedNews = allNews.filter(news => news.status === 'published');
      const draftNews = allNews.filter(news => news.status === 'draft');

      healthReport.statistics = {
        total_news: allNews.length,
        published_news: publishedNews.length,
        draft_news: draftNews.length,
        last_fetch: allNews.length > 0 ? (allNews[0].publish_date?.toISOString() ?? null) : null
      };
    } catch (error) {
      healthReport.errors.push(`Statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return healthReport;

  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}
