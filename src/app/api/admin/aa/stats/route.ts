// Enhanced AA News API Routes
import { NextRequest, NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';
import { aaNewsFirestoreService } from '@/services/aaNewsFirestoreService';
import { 
  AASearchParams, 
  AAContentType, 
  AAPriority, 
  AALanguage,
  EnhancementOptions 
} from '@/types/aa-news';

// GET /api/admin/aa/stats - AA istatistikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'get-aa-stats':
        const aaStats = await enhancedUltraPremiumAANewsManager.getAAStats();
        return NextResponse.json(aaStats);

      case 'get-schedule-stats':
        const scheduleStats = await enhancedUltraPremiumAANewsManager.getScheduleStats();
        return NextResponse.json(scheduleStats);

      case 'get-filters':
        const filters = await enhancedUltraPremiumAANewsManager.getAAFilters();
        return NextResponse.json(filters);

      case 'get-categories':
        const categories = await enhancedUltraPremiumAANewsManager.getAACategories();
        return NextResponse.json(categories);

      case 'health-check':
        const health = await enhancedUltraPremiumAANewsManager.healthCheck();
        return NextResponse.json(health);

      default:
        // Genel istatistikler
        const generalStats = await aaNewsFirestoreService.getStats();
        return NextResponse.json(generalStats);
    }
  } catch (error) {
    console.error('AA stats API hatası:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/admin/aa/stats - AA haberleri çekme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'fetch-news':
        const { searchParams, options } = data;
        const fetchStats = await enhancedUltraPremiumAANewsManager.fetchNews(
          searchParams as AASearchParams,
          {
            processWithAI: options?.processWithAI ?? true,
            enhancementOptions: options?.enhancementOptions as EnhancementOptions,
            maxItems: options?.maxItems ?? 50
          }
        );
        return NextResponse.json(fetchStats);

      case 'run-schedule':
        const { scheduleId } = data;
        const scheduleResult = await enhancedUltraPremiumAANewsManager.runSchedule(scheduleId);
        return NextResponse.json(scheduleResult);

      case 'run-all-schedules':
        const allResults = await enhancedUltraPremiumAANewsManager.runAllActiveSchedules();
        return NextResponse.json(allResults);

      case 'create-schedule':
        const { schedule } = data;
        const newScheduleId = await enhancedUltraPremiumAANewsManager.createSchedule(schedule);
        return NextResponse.json({ id: newScheduleId });

      case 'update-schedule':
        const { id, updates } = data;
        await enhancedUltraPremiumAANewsManager.updateSchedule(id, updates);
        return NextResponse.json({ success: true });

      case 'delete-schedule':
        const { scheduleId: deleteId } = data;
        await enhancedUltraPremiumAANewsManager.deleteSchedule(deleteId);
        return NextResponse.json({ success: true });

      case 'toggle-schedule':
        const { scheduleId: toggleId, active } = data;
        await enhancedUltraPremiumAANewsManager.toggleSchedule(toggleId, active);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Geçersiz action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AA stats POST hatası:', error);
    return NextResponse.json(
      { error: 'İşlem başarısız' },
      { status: 500 }
    );
  }
}
