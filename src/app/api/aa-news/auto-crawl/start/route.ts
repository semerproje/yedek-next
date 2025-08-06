import { NextRequest, NextResponse } from 'next/server';
import { ultraPremiumAANewsManager } from '@/lib/services/ultraPremiumAANewsManager';

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    const success = await ultraPremiumAANewsManager.setupAutomaticCrawling(config);
    
    return NextResponse.json({ 
      success, 
      message: success ? 'Otomatik çekim başlatıldı' : 'Otomatik çekim başlatılamadı' 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
