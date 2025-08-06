// AA Schedules Stats
import { NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';

// GET /api/admin/aa/schedules/stats - Schedule istatistikleri
export async function GET() {
  try {
    const stats = await enhancedUltraPremiumAANewsManager.getScheduleStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Schedule stats hatası:', error);
    return NextResponse.json(
      { error: 'Schedule istatistikleri alınamadı' },
      { status: 500 }
    );
  }
}
