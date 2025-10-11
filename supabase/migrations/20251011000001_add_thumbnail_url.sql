/*
  # Add Thumbnail URL to Tarot Cards

  1. Changes
    - Add `thumbnail_url` column to `tarot_cards` table
    - This will store smaller versions of card images for faster loading in admin panels

  2. Notes
    - Nullable field as existing cards won't have thumbnails yet
    - Can be populated gradually as cards are re-uploaded or through a batch process
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tarot_cards' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE tarot_cards ADD COLUMN thumbnail_url text;
  END IF;
END $$;
