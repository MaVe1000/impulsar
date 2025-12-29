// app/api/cer/current/route.ts
import { createClient } from '@supabase/supabase-js';

// Uses Next.js ISR for automatic caching
export const revalidate = 86400; // Cache for 24 hours

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Read directly from database (Next.js caches automatically)
    const { data, error } = await supabase
      .from('cer_publications')
      .select('cer_value, date')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return Response.json(
        { error: 'CER not available' },
        { status: 503 }
      );
    }

    return Response.json({
      cer: data.cer_value,
      date: data.date,
      source: 'database',
    });

  } catch (error) {
    console.error('Error fetching CER:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}