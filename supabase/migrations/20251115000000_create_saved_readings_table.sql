-- Create saved_readings table for users to save their readings
CREATE TABLE IF NOT EXISTS public.saved_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  spread_type TEXT NOT NULL, -- 'single', 'three-card', 'celtic-cross'
  question TEXT,
  cards JSONB NOT NULL,
  interpretation TEXT,
  is_public BOOLEAN DEFAULT false,
  reading_source TEXT DEFAULT 'personal', -- 'personal' or 'daily'
  notes TEXT
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_readings_user_id ON public.saved_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_readings_created_at ON public.saved_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_readings_is_public ON public.saved_readings(is_public) WHERE is_public = true;

-- Enable RLS (Row Level Security)
ALTER TABLE public.saved_readings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own readings
DROP POLICY IF EXISTS "Users can view their own readings" ON public.saved_readings;
CREATE POLICY "Users can view their own readings"
  ON public.saved_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Anyone can view public readings
DROP POLICY IF EXISTS "Anyone can view public readings" ON public.saved_readings;
CREATE POLICY "Anyone can view public readings"
  ON public.saved_readings
  FOR SELECT
  TO public
  USING (is_public = true);

-- Policy: Users can insert their own readings
DROP POLICY IF EXISTS "Users can insert their own readings" ON public.saved_readings;
CREATE POLICY "Users can insert their own readings"
  ON public.saved_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own readings
DROP POLICY IF EXISTS "Users can update their own readings" ON public.saved_readings;
CREATE POLICY "Users can update their own readings"
  ON public.saved_readings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own readings
DROP POLICY IF EXISTS "Users can delete their own readings" ON public.saved_readings;
CREATE POLICY "Users can delete their own readings"
  ON public.saved_readings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_readings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function on update
DROP TRIGGER IF EXISTS set_saved_readings_updated_at ON public.saved_readings;
CREATE TRIGGER set_saved_readings_updated_at
  BEFORE UPDATE ON public.saved_readings
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_readings_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.saved_readings IS 'Stores user-saved tarot readings with optional public sharing';
COMMENT ON COLUMN public.saved_readings.id IS 'Unique identifier for the saved reading (UUID)';
COMMENT ON COLUMN public.saved_readings.user_id IS 'User who saved the reading';
COMMENT ON COLUMN public.saved_readings.title IS 'Optional user-provided title for the reading';
COMMENT ON COLUMN public.saved_readings.spread_type IS 'Type of spread used (single, three-card, celtic-cross)';
COMMENT ON COLUMN public.saved_readings.cards IS 'JSON array of cards drawn with their positions and orientations';
COMMENT ON COLUMN public.saved_readings.interpretation IS 'AI-generated or user interpretation of the reading';
COMMENT ON COLUMN public.saved_readings.is_public IS 'Whether the reading can be viewed by anyone with the link';
COMMENT ON COLUMN public.saved_readings.reading_source IS 'Source of the reading (personal or daily)';
COMMENT ON COLUMN public.saved_readings.notes IS 'User notes about the reading';
