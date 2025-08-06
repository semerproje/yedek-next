import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// In-memory batch to reduce Firebase writes
let vitalsBuffer: any[] = [];
let lastFlush = Date.now();
const FLUSH_INTERVAL = 5000; // 5 seconds
const MAX_BATCH_SIZE = 10;

async function flushVitals() {
  if (vitalsBuffer.length === 0) return;
  
  try {
    const batch = [...vitalsBuffer];
    vitalsBuffer = [];
    
    // Write all vitals in the batch
    await Promise.all(
      batch.map(vital => 
        addDoc(collection(db, 'web_vitals'), vital)
      )
    );
  } catch (error) {
    console.error('Failed to flush vitals batch:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const vitals = await request.json();
    
    // Skip Firebase writes in development for better performance
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, dev: true });
    }
    
    // Add to buffer instead of immediate write
    vitalsBuffer.push({
      ...vitals,
      timestamp: Timestamp.now(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    // Flush if buffer is full or time interval passed
    const now = Date.now();
    if (vitalsBuffer.length >= MAX_BATCH_SIZE || (now - lastFlush) >= FLUSH_INTERVAL) {
      lastFlush = now;
      // Non-blocking flush
      flushVitals().catch(console.error);
    }

    // Return immediately for better performance
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web Vitals tracking error:', error);
    return NextResponse.json({ error: 'Failed to track vitals' }, { status: 500 });
  }
}
