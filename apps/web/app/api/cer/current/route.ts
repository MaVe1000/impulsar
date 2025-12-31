import { NextResponse } from 'next/server';
import { ValueCalculator } from '@/../../services/value-calculator/src/index';

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
 * Returns current CER value from blockchain
 */
export async function GET() {
  try {
    const calculator = getCalculator();

    // Get current CER (uses fallback strategy internally)
    const cer = await calculator['getCurrentCER']();

    return NextResponse.json({
      success: true,
      data: {
        cer_value: cer,
        timestamp: new Date().toISOString(),
        source: 'blockchain', // Could be 'cache' or 'mock' depending on fallback
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