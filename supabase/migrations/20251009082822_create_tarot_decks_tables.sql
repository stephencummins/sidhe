/*
  # Create Tarot Decks and Cards Tables

  1. New Tables
    - `tarot_decks`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the deck
      - `description` (text) - Description of the deck
      - `is_active` (boolean) - Whether this deck is currently in use
      - `created_by` (uuid) - Reference to auth.users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tarot_cards`
      - `id` (uuid, primary key)
      - `deck_id` (uuid) - Reference to tarot_decks
      - `name` (text) - Card name
      - `arcana` (text) - 'major' or 'minor'
      - `suit` (text) - For minor arcana: 'wands', 'cups', 'swords', 'pentacles'
      - `meaning_upright` (text) - Upright meaning
      - `meaning_reversed` (text) - Reversed meaning
      - `image_url` (text) - URL to card image in storage
      - `keywords` (text[]) - Array of keywords
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for active decks and their cards
    - Only authenticated users can create/update decks
    - Only deck creators can modify their decks
*/

-- Create tarot_decks table
CREATE TABLE IF NOT EXISTS tarot_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tarot_cards table
CREATE TABLE IF NOT EXISTS tarot_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES tarot_decks(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  arcana text NOT NULL CHECK (arcana IN ('major', 'minor')),
  suit text CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles', NULL)),
  meaning_upright text DEFAULT '',
  meaning_reversed text DEFAULT '',
  image_url text DEFAULT '',
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tarot_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;

-- Policies for tarot_decks
CREATE POLICY "Anyone can view active decks"
  ON tarot_decks FOR SELECT
  USING (is_active = true OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create decks"
  ON tarot_decks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Deck creators can update their decks"
  ON tarot_decks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Deck creators can delete their decks"
  ON tarot_decks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for tarot_cards
CREATE POLICY "Anyone can view cards from active decks"
  ON tarot_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tarot_decks
      WHERE tarot_decks.id = tarot_cards.deck_id
      AND (tarot_decks.is_active = true OR tarot_decks.created_by = auth.uid())
    )
  );

CREATE POLICY "Deck creators can insert cards"
  ON tarot_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tarot_decks
      WHERE tarot_decks.id = tarot_cards.deck_id
      AND tarot_decks.created_by = auth.uid()
    )
  );

CREATE POLICY "Deck creators can update cards"
  ON tarot_cards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tarot_decks
      WHERE tarot_decks.id = tarot_cards.deck_id
      AND tarot_decks.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tarot_decks
      WHERE tarot_decks.id = tarot_cards.deck_id
      AND tarot_decks.created_by = auth.uid()
    )
  );

CREATE POLICY "Deck creators can delete cards"
  ON tarot_cards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tarot_decks
      WHERE tarot_decks.id = tarot_cards.deck_id
      AND tarot_decks.created_by = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tarot_decks_created_by ON tarot_decks(created_by);
CREATE INDEX IF NOT EXISTS idx_tarot_decks_is_active ON tarot_decks(is_active);
CREATE INDEX IF NOT EXISTS idx_tarot_cards_deck_id ON tarot_cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_tarot_cards_arcana ON tarot_cards(arcana);