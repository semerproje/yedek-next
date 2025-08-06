import { NextRequest, NextResponse } from 'next/server';
import { newsml29Service } from '@/services/newsml29.service';

export async function GET() {
  try {
    const analytics = await newsml29Service.getAnalytics();
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching NewsML 2.9 analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NewsML 2.9 analytics' },
      { status: 500 }
    );
  }
}
