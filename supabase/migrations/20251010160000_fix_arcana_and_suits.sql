/*
  # Fix Arcana Values and Suit Constraints

  1. Changes
    - Update suit CHECK constraint to allow seasonal suits (spring, summer, autumn, winter)
    - Fix arcana values for all 22 Major Arcana cards
    - Set suit to NULL for Major Arcana cards

  2. Security
    - No changes to RLS policies
*/

-- Drop the old CHECK constraint
ALTER TABLE tarot_cards DROP CONSTRAINT IF EXISTS tarot_cards_suit_check;

-- Add new CHECK constraint that includes seasonal suits
ALTER TABLE tarot_cards ADD CONSTRAINT tarot_cards_suit_check
  CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles', 'spring', 'summer', 'autumn', 'winter') OR suit IS NULL);

-- Update Major Arcana cards to have correct arcana value and NULL suit
UPDATE tarot_cards
SET arcana = 'major', suit = NULL
WHERE name IN (
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
);
