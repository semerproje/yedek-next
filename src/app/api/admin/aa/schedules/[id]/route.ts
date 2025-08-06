// AA Schedule Dynamic Routes
import { NextRequest, NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';

// GET /api/admin/aa/schedules/[id] - Belirli schedule'ı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = await enhancedUltraPremiumAANewsManager.getSchedule(params.id);
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Schedule getirme hatası:', error);
    return NextResponse.json(
      { error: 'Schedule alınamadı' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/aa/schedules/[id] - Schedule güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await enhancedUltraPremiumAANewsManager.updateSchedule(params.id, body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Schedule güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/aa/schedules/[id] - Schedule sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await enhancedUltraPremiumAANewsManager.deleteSchedule(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule silme hatası:', error);
    return NextResponse.json(
      { error: 'Schedule silinemedi' },
      { status: 500 }
    );
  }
}
