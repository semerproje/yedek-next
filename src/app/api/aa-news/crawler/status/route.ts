import { NextResponse } from 'next/server';

// Import crawler state
declare global {
  var crawlerState: {
    isRunning: boolean;
    interval: NodeJS.Timeout | null;
    config: any;
    stats: {
      totalProcessed: number;
      successCount: number;
      errorCount: number;
      duplicateCount: number;
    };
    lastRun: string | null;
    nextRun: string | null;
  };
}

if (!global.crawlerState) {
  global.crawlerState = {
    isRunning: false,
    interval: null,
    config: null,
    stats: {
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      duplicateCount: 0
    },
    lastRun: null,
    nextRun: null
  };
}

export async function GET() {
  try {
    return NextResponse.json({
      isRunning: global.crawlerState.isRunning,
      lastRun: global.crawlerState.lastRun,
      nextRun: global.crawlerState.nextRun,
      config: global.crawlerState.config,
      stats: global.crawlerState.stats
    });

  } catch (error) {
    console.error('Crawler status error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
