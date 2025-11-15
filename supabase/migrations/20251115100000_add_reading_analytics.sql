-- Add analytics fields to saved_readings table
ALTER TABLE public.saved_readings
ADD COLUMN IF NOT EXISTS accuracy_rating INTEGER CHECK (accuracy_rating BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
ADD COLUMN IF NOT EXISTS outcome_notes TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS power_score NUMERIC,
ADD COLUMN IF NOT EXISTS major_arcana_count INTEGER,
ADD COLUMN IF NOT EXISTS court_card_count INTEGER,
ADD COLUMN IF NOT EXISTS suit_pattern_score INTEGER,
ADD COLUMN IF NOT EXISTS reversal_percentage NUMERIC,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_saved_readings_accuracy ON public.saved_readings(accuracy_rating) WHERE accuracy_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_readings_sentiment ON public.saved_readings(sentiment) WHERE sentiment IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_readings_power ON public.saved_readings(power_score) WHERE power_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_readings_created_month ON public.saved_readings(date_trunc('month', created_at));
CREATE INDEX IF NOT EXISTS idx_saved_readings_tags ON public.saved_readings USING GIN(tags);

-- Add comment for documentation
COMMENT ON COLUMN public.saved_readings.accuracy_rating IS 'User rating of reading accuracy (1-5 moons)';
COMMENT ON COLUMN public.saved_readings.sentiment IS 'User sentiment about the reading (positive/neutral/negative)';
COMMENT ON COLUMN public.saved_readings.power_score IS 'Calculated power score based on Major Arcana, Court cards, suits, and reversals';
COMMENT ON COLUMN public.saved_readings.major_arcana_count IS 'Number of Major Arcana cards in reading';
COMMENT ON COLUMN public.saved_readings.court_card_count IS 'Number of Court cards (Page/Knight/Queen/King) in reading';
COMMENT ON COLUMN public.saved_readings.suit_pattern_score IS 'Score from suit patterns (trines of 3+ same suit)';
COMMENT ON COLUMN public.saved_readings.reversal_percentage IS 'Percentage of cards that are reversed';
COMMENT ON COLUMN public.saved_readings.tags IS 'User-defined tags for categorizing readings';
