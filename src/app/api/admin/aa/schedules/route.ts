// AA Schedules API Routes
import { NextRequest, NextResponse } from 'next/server';
import { enhancedUltraPremiumAANewsManager } from '@/services/enhancedUltraPremiumAANewsManager';

// GET /api/admin/aa/schedules - Tüm schedule'ları getir
export async function GET() {
  try {
    const schedules = await enhancedUltraPremiumAANewsManager.getAllSchedules();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Schedule getirme hatası:', error);
    return NextResponse.json(
      { error: 'Schedule listesi alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/admin/aa/schedules - Yeni schedule oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const scheduleId = await enhancedUltraPremiumAANewsManager.createSchedule(body);
    
    return NextResponse.json({ 
      id: scheduleId,
      success: true 
    });
  } catch (error) {
    console.error('Schedule oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Schedule oluşturulamadı' },
      { status: 500 }
    );
  }
}
