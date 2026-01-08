-- Create daily_readings table
CREATE TABLE IF NOT EXISTS public.daily_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reading_date DATE NOT NULL,
  spread_name TEXT NOT NULL DEFAULT 'Three Card Spread',
  meaning_type TEXT NOT NULL DEFAULT 'celtic',
  question TEXT,
  cards JSONB NOT NULL,
  interpretation TEXT,
  UNIQUE(reading_date)
);

-- Add index for faster lookups by date
CREATE INDEX IF NOT EXISTS idx_daily_readings_date ON public.daily_readings(reading_date DESC);

-- Add index for faster lookups by ID
CREATE INDEX IF NOT EXISTS idx_daily_readings_id ON public.daily_readings(id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.daily_readings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON public.daily_readings;
CREATE POLICY "Allow public read access"
  ON public.daily_readings
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow service role to insert
DROP POLICY IF EXISTS "Allow service role to insert" ON public.daily_readings;
CREATE POLICY "Allow service role to insert"
  ON public.daily_readings
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow service role to update
DROP POLICY IF EXISTS "Allow service role to update" ON public.daily_readings;
CREATE POLICY "Allow service role to update"
  ON public.daily_readings
  FOR UPDATE
  TO service_role
  USING (true);

COMMENT ON TABLE public.daily_readings IS 'Stores daily tarot card readings with AI interpretations';
COMMENT ON COLUMN public.daily_readings.id IS 'Unique identifier for the reading (UUID)';
COMMENT ON COLUMN public.daily_readings.reading_date IS 'Date of the reading (unique per day)';
COMMENT ON COLUMN public.daily_readings.cards IS 'JSON array of cards drawn with their positions and orientations';
COMMENT ON COLUMN public.daily_readings.interpretation IS 'AI-generated interpretation of the reading';
