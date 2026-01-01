import { NextResponse } from 'next/server';
import { ValueCalculator } from '@/../../services/value-calculator/src/index';

// Force dynamic rendering (prevents build-time execution)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize ValueCalculator (singleton pattern)
let calculatorInstance: ValueCalculator | null = null;

function getCalculator(): ValueCalculator {
  if (!calculatorInstance) {
    calculatorInstance = new ValueCalculator();
  }
  return calculatorInstance;
}

/**
 * GET /api/cer/current
 * Returns current CER value - ALWAYS attempts blockchain first
 */
export async function GET() {
  try {
    const calculator = getCalculator();

    // Get current CER (blockchain → supabase → mock fallback)
    const result = await calculator['getCurrentCERWithSource']();

    return NextResponse.json({
      success: true,
      data: {
        cer_value: result.value,
        timestamp: new Date().toISOString(),
        source: result.source, // 'blockchain', 'cache', or 'mock'
      },
    });
  } catch (error) {
    console.error('❌ Error in /api/cer/current:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch CER',
      },
      { status: 500 }
    );
  }
}