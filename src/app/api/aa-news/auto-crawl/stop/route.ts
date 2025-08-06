import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Stop automatic crawling logic here
    // This would typically involve stopping scheduled jobs
    
    return NextResponse.json({ 
      success: true, 
      message: 'Otomatik çekim durduruldu' 
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
