import { NextRequest, NextResponse } from 'next/server';
import { newsml29Service } from '@/services/newsml29.service';
import { NewsML29Query } from '@/types/newsml29';

export async function POST(request: NextRequest) {
  try {
    const query: NewsML29Query = await request.json();
    
    const documents = await newsml29Service.queryDocuments(query);
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error querying NewsML 2.9 documents:', error);
    return NextResponse.json(
      { error: 'Failed to query NewsML 2.9 documents' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get recent documents by default
    const documents = await newsml29Service.queryDocuments({
      limit: 50,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching NewsML 2.9 documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NewsML 2.9 documents' },
      { status: 500 }
    );
  }
}
