import { NextRequest, NextResponse } from 'next/server';
import ultraPremiumAAService from '@/services/ultraPremiumAAService';

export async function POST(request: NextRequest) {
  try {
    const { hours = 24 } = await request.json();
    
    const result = await ultraPremiumAAService.syncRecentNewsToNewsML29(hours);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error importing from AA:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import from AA', 
        processed: 0, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
}
