-- ============================================================================
-- Supabase Setup for ImpulsAR - CER Publications Table
-- ============================================================================
-- Execute this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/noxvdjqffhywqyqyiqac/sql/new
-- ============================================================================

-- Create cer_publications table
CREATE TABLE IF NOT EXISTS public.cer_publications (
  id BIGSERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  cer_value DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL,
  tx_hash TEXT,
  attestation JSONB,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date for fast queries
CREATE INDEX IF NOT EXISTS idx_cer_publications_date ON public.cer_publications(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cer_publications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (anyone can query CER)
CREATE POLICY "Allow public read access" ON public.cer_publications
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert/update
CREATE POLICY "Only service role can insert" ON public.cer_publications
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service role can update" ON public.cer_publications
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Insert initial CER data from BCRA (December 2024)
INSERT INTO public.cer_publications (date, cer_value, source)
VALUES
  ('2024-12-01', 1423.45, 'bcra'),
  ('2024-12-15', 1438.92, 'bcra'),
  ('2024-12-31', 1450.67, 'bcra'),
  ('2025-01-15', 1462.34, 'bcra')
ON CONFLICT (date) DO NOTHING;

-- Verify data
SELECT * FROM public.cer_publications ORDER BY date DESC LIMIT 5;
