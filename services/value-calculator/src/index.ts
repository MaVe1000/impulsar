// import { CEROracle } from './cer-oracle-client'; // TODO: Implement in doc 05
import { createClient } from '@supabase/supabase-js';

// Uses Supabase for caching (NO Redis needed)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class ValueCalculator {
  // private cerOracle: CEROracle; // TODO: Uncomment after doc 05

  constructor() {
    // this.cerOracle = new CEROracle(process.env.CER_ORACLE_CONTRACT_ID!);
  }

  /**
   * Converts ARU units to current pesos
   *
   * @param aruUnits - Amount of ARU units
   * @param cerOverride - Specific CER (optional, uses current if not provided)
   * @returns Value in current pesos
   */
  async calculatePesos(
    aruUnits: number,
    cerOverride?: number
  ): Promise<number> {
    const cer = cerOverride || await this.getCurrentCER();
    return aruUnits * cer;
  }

  /**
   * Converts pesos to ARU units
   *
   * @param pesos - Amount in pesos
   * @param cerOverride - Specific CER (optional, uses current if not provided)
   * @returns Required ARU units
   */
  async calculateAruUnits(
    pesos: number,
    cerOverride?: number
  ): Promise<number> {
    const cer = cerOverride || await this.getCurrentCER();
    return pesos / cer;
  }

  /**
   * Gets current CER (with Supabase cache, NOT Redis)
   * Cache: Latest row from cer_publications table
   */
  private async getCurrentCER(): Promise<number> {
    // Try to read from Supabase (cer_publications table)
    const { data, error } = await supabase
      .from('cer_publications')
      .select('cer_value')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      return parseFloat(data.cer_value);
    }

    // Fallback: query CEROracle contract if DB is empty
    // TODO: Implement after doc 05 (Soroban contracts)
    // const cerOnChain = await this.cerOracle.getCurrentCER();
    // if (!cerOnChain) {
    //   throw new Error('CER not available on-chain');
    // }
    // return cerOnChain / 1_000_000;

    // TEMPORARY: Use mock CER until CEROracle is implemented
    console.warn('⚠️ Using mock CER - implement CEROracle in doc 05');
    return 1100.50;
  }

  /**
   * Gets CER from a specific date
   */
  async getCERAtDate(_date: string): Promise<number | null> {
    // TODO: Implement after doc 05 (CEROracle contract)
    // const snapshot = await this.cerOracle.getCERAtDate(date);
    // if (!snapshot) return null;
    // return snapshot.cer_value / 1_000_000;

    console.warn('⚠️ getCERAtDate not implemented - needs CEROracle (doc 05)');
    return null;
  }
}