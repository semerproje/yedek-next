// AA Schedule Run Action
import { NextRequest, NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';

// POST /api/admin/aa/schedules/[id]/run - Schedule'ı manuel çalıştır
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await enhancedUltraPremiumAANewsManager.runSchedule(params.id);
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Schedule run hatası:', error);
    return NextResponse.json(
      { error: 'Schedule çalıştırılamadı' },
      { status: 500 }
    );
  }
}
