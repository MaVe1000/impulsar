import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Cache in-memory (renovar cada 24hs)
let cachedCER: { cer: number; date: string; timestamp: number } | null = null;
const CACHE_TTL = 86400 * 1000; // 24 hours en ms

// Lazy initialization of Supabase client
function getSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * GET /api/cer/current
 *
 * Gets current CER value from Supabase cache
 *
 * Response:
 *   - cer: number (CER value)
 *   - date: string (date of CER)
 *   - source: 'cache' | 'database'
 */
router.get('/current', async (req, res) => {
  try {
    // Verificar cache
    if (cachedCER && (Date.now() - cachedCER.timestamp) < CACHE_TTL) {
      return res.json({
        cer: cachedCER.cer,
        date: cachedCER.date,
        source: 'cache',
      });
    }

    // Consultar Supabase
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('cer_publications')
      .select('cer_value, date')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(503).json({
        error: 'CER not available'
      });
    }

    // Actualizar cache
    cachedCER = {
      cer: data.cer_value,
      date: data.date,
      timestamp: Date.now(),
    };

    return res.json({
      cer: data.cer_value,
      date: data.date,
      source: 'database',
    });

  } catch (error) {
    console.error('Error fetching CER:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
