import { NextRequest, NextResponse } from 'next/server';
import { newsml29Service } from '@/services/newsml29.service';

interface RouteParams {
  params: {
    id: string;
    action: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id, action } = params;
    
    if (action === 'enhance') {
      await newsml29Service.enhanceDocument(id);
      return NextResponse.json({ success: true, message: 'Document enhanced successfully' });
    } else if (action === 'publish') {
      await newsml29Service.publishDocument(id);
      return NextResponse.json({ success: true, message: 'Document published successfully' });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "enhance" or "publish"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error ${params.action}ing document:`, error);
    return NextResponse.json(
      { error: `Failed to ${params.action} document` },
      { status: 500 }
    );
  }
}
