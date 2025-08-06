import { NextResponse } from 'next/server';

// Import crawler state - in production this should be in a shared module
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

export async function POST() {
  try {
    if (!global.crawlerState.isRunning) {
      return NextResponse.json({
        success: false,
        message: 'Crawler is not running'
      });
    }

    // Clear interval
    if (global.crawlerState.interval) {
      clearInterval(global.crawlerState.interval);
      global.crawlerState.interval = null;
    }

    // Reset state
    global.crawlerState.isRunning = false;
    global.crawlerState.config = null;
    global.crawlerState.nextRun = null;

    return NextResponse.json({
      success: true,
      message: 'Auto crawler stopped successfully',
      finalStats: global.crawlerState.stats
    });

  } catch (error) {
    console.error('Crawler stop error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
