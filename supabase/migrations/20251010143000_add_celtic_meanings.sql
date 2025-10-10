/*
  # Add Celtic Meanings to Tarot Cards

  1. Schema Changes
    - Add `celtic_meaning_upright` (text) - Celtic interpretation for upright position
    - Add `celtic_meaning_reversed` (text) - Celtic interpretation for reversed position
    - Add `celtic_keywords` (text[]) - Array of Celtic-themed keywords
    - Add `celtic_mythology` (text) - Detailed Celtic mythology associations and notes

  2. Notes
    - All new fields are optional (nullable) to maintain backward compatibility
    - Existing cards will have NULL values until Celtic meanings are imported
    - No changes to RLS policies needed as they apply to entire rows
*/

-- Add Celtic meaning columns to tarot_cards table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_cards' AND column_name = 'celtic_meaning_upright'
  ) THEN
    ALTER TABLE tarot_cards ADD COLUMN celtic_meaning_upright text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_cards' AND column_name = 'celtic_meaning_reversed'
  ) THEN
    ALTER TABLE tarot_cards ADD COLUMN celtic_meaning_reversed text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_cards' AND column_name = 'celtic_keywords'
  ) THEN
    ALTER TABLE tarot_cards ADD COLUMN celtic_keywords text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_cards' AND column_name = 'celtic_mythology'
  ) THEN
    ALTER TABLE tarot_cards ADD COLUMN celtic_mythology text;
  END IF;
END $$;

-- Create index on celtic_keywords for faster searches
CREATE INDEX IF NOT EXISTS idx_tarot_cards_celtic_keywords ON tarot_cards USING GIN(celtic_keywords);
