import { CEROracle } from './cer-oracle-client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class ValueCalculator {
  private cerOracle: CEROracle;
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.cerOracle = new CEROracle({
      contractId: process.env.CER_ORACLE_CONTRACT_ID!,
      rpcUrl: process.env.STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
      networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    });
  }

  /**
   * Get Supabase client (lazy initialization)
   */
  private getSupabase(): SupabaseClient | null {
    if (this.supabase) return this.supabase;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.warn('⚠️ Supabase credentials not configured, skipping cache');
      return null;
    }

    this.supabase = createClient(url, key);
    return this.supabase;
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
   * Gets current CER with source information (public method for API)
   * Returns both value and source for transparency
   */
  async getCurrentCERWithSource(): Promise<{ value: number; source: 'blockchain' | 'cache' | 'mock' }> {
    // PASO 1: PRIMERO intentar leer del contrato CEROracle (valor firmado)
    try {
      console.log('📡 Fetching CER from blockchain contract...');
      const snapshot = await this.cerOracle.getCurrentCER();

      if (!snapshot) {
        throw new Error('CER not available on-chain');
      }

      const cerValue = CEROracle.rawToDecimal(snapshot.cer_value);
      console.log(`✅ CER from blockchain: ${cerValue} (date: ${snapshot.date})`);

      // Update Supabase cache asynchronously (fire and forget)
      this.updateSupabaseCache(snapshot).catch((err: Error) =>
        console.warn('⚠️ Failed to update Supabase cache:', err)
      );

      return { value: cerValue, source: 'blockchain' };
    } catch (error) {
      console.warn('⚠️ Blockchain fetch failed, trying Supabase fallback...', error);
    }

    // PASO 2: Fallback a Supabase SOLO si blockchain falla
    const supabase = this.getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cer_publications')
          .select('cer_value')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          console.log(`⚠️ Using CER from Supabase cache: ${data.cer_value}`);
          return { value: parseFloat(data.cer_value), source: 'cache' };
        }
      } catch (err) {
        console.warn('⚠️ Supabase fetch also failed:', err);
      }
    }

    // PASO 3: Último recurso - mock
    console.warn('⚠️ Using mock CER (blockchain + Supabase both unavailable)');
    return { value: 1100.50, source: 'mock' };
  }

  /**
   * Gets current CER - ALWAYS from blockchain (signed value)
   * Supabase is ONLY a fallback if blockchain is unavailable
   */
  private async getCurrentCER(): Promise<number> {
    const result = await this.getCurrentCERWithSource();
    return result.value;
  }

  /**
   * Updates Supabase cache with blockchain CER data
   */
  private async updateSupabaseCache(snapshot: { date: string; cer_value: number; publisher: string; timestamp: number }): Promise<void> {
    const supabase = this.getSupabase();
    if (!supabase) return;

    await supabase.from('cer_publications').upsert({
      date: snapshot.date,
      cer_value: CEROracle.rawToDecimal(snapshot.cer_value).toString(),
      publisher: snapshot.publisher,
      timestamp: new Date(snapshot.timestamp * 1000).toISOString(),
    });
  }
}