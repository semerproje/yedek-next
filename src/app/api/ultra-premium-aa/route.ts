import { NextRequest, NextResponse } from 'next/server';
import { ultraPremiumAANewsManager } from '@/lib/services/ultraPremiumAANewsManager';

export async function GET(request: NextRequest) {
  return ultraPremiumAANewsManager.handleAPIRequest(request);
}

export async function POST(request: NextRequest) {
  return ultraPremiumAANewsManager.handleAPIRequest(request);
}
