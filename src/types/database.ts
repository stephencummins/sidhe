export interface TarotDeck {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TarotCardDB {
  id: string;
  deck_id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
  meaning_upright: string;
  meaning_reversed: string;
  image_url: string;
  keywords: string[];
  created_at: string;
}
