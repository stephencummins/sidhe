# Fix Missing Seasonal Card Meanings

Your deck uses seasonal suits (Spring, Summer, Autumn, Winter) instead of traditional suits (Wands, Cups, Swords, Pentacles). The cards need their suit values and meanings added to the database.

## Step 1: Add Thumbnail Column

Run this in your Supabase SQL Editor:

```sql
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS thumbnail_url text;
```

## Step 2: Set Seasonal Suits

Run this in your Supabase SQL Editor:

```sql
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
```

## Step 3: Add Card Meanings

The file `supabase/migrations/20251011000003_add_seasonal_meanings.sql` contains all the card meanings.

Copy the entire contents of that file and run it in your Supabase SQL Editor.

This will add meanings for all 56 Minor Arcana cards mapping:
- **Spring (Wands)**: Growth, energy, passion, new beginnings
- **Summer (Cups)**: Emotions, relationships, intuition, love
- **Autumn (Swords)**: Intellect, conflict, change, clarity
- **Winter (Pentacles)**: Material world, stability, manifestation

## What This Fixes

After running these SQL commands:
- ✓ All seasonal cards will have their correct suit values
- ✓ "Eight of Winter" and all other minor arcana will have upright meanings
- ✓ All cards will have reversed meanings
- ✓ Keywords will be populated for each card
- ✓ Readings will show complete card interpretations

## How to Access SQL Editor

1. Go to your Supabase dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Paste the SQL and click "Run"
