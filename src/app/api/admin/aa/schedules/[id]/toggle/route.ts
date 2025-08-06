// AA Schedule Actions
import { NextRequest, NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';

// POST /api/admin/aa/schedules/[id]/toggle - Schedule aktif/pasif
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { active } = body;

    await enhancedUltraPremiumAANewsManager.toggleSchedule(params.id, active);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule toggle hatası:', error);
    return NextResponse.json(
      { error: 'Schedule durumu değiştirilemedi' },
      { status: 500 }
    );
  }
}
