/*
  # Add Card Back Image to Tarot Decks

  1. Changes
    - Add `card_back_url` column to `tarot_decks` table
    - This URL will point to the card back image shown during card selection
    - Defaults to empty string to maintain backward compatibility

  2. Notes
    - Existing decks will use the default card back until updated
    - The card back image can be uploaded via the admin interface
*/

-- Add card_back_url column to tarot_decks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_decks' AND column_name = 'card_back_url'
  ) THEN
    ALTER TABLE tarot_decks ADD COLUMN card_back_url text DEFAULT '';
  END IF;
END $$;
