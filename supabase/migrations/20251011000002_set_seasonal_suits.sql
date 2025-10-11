/*
  # Set Seasonal Suits for Minor Arcana

  1. Changes
    - Update all Minor Arcana cards to have their proper seasonal suit based on card name
    - Spring, Summer, Autumn, Winter cards will get their respective suit values

  2. Notes
    - This enables proper querying and filtering by suit
    - Cards keep their seasonal names in the 'name' field
*/

-- Update Spring cards
UPDATE tarot_cards
SET suit = 'spring', arcana = 'minor'
WHERE name LIKE '%Spring%';

-- Update Summer cards
UPDATE tarot_cards
SET suit = 'summer', arcana = 'minor'
WHERE name LIKE '%Summer%';

-- Update Autumn cards
UPDATE tarot_cards
SET suit = 'autumn', arcana = 'minor'
WHERE name LIKE '%Autumn%';

-- Update Winter cards
UPDATE tarot_cards
SET suit = 'winter', arcana = 'minor'
WHERE name LIKE '%Winter%';
