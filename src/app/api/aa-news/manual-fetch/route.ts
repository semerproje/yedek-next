import { NextRequest, NextResponse } from 'next/server';
import { ultraPremiumAANewsManager } from '@/lib/services/ultraPremiumAANewsManager';

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();
    const result = await ultraPremiumAANewsManager.manualFetchNews(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        news: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
