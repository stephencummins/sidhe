-- Create Salvador Dali deck and populate with cards
-- This migration is idempotent and can be run multiple times safely

-- Insert Salvador Dali deck if it doesn't exist
INSERT INTO tarot_decks (id, name, description, is_active, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Salvador Dali',
  'Salvador Dali Tarot deck with surrealist interpretations and in-depth psychological meanings',
  false,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM tarot_decks WHERE name = 'Salvador Dali'
);

-- Copy card structure from Celtic Mythology deck to Salvador Dali deck
-- (Only if Salvador Dali deck has no cards yet)
INSERT INTO tarot_cards (
  deck_id,
  name,
  arcana,
  suit,
  meaning_upright,
  meaning_reversed,
  keywords,
  created_at
)
SELECT
  (SELECT id FROM tarot_decks WHERE name = 'Salvador Dali'),
  name,
  arcana,
  suit,
  meaning_upright,
  meaning_reversed,
  keywords,
  now()
FROM tarot_cards
WHERE deck_id = (SELECT id FROM tarot_decks WHERE name = 'Celtic Mythology')
AND NOT EXISTS (
  SELECT 1 FROM tarot_cards
  WHERE deck_id = (SELECT id FROM tarot_decks WHERE name = 'Salvador Dali')
);
