import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const meanings = {
  'Nine of Winter': {
    upright: 'Like the dark nights before Samhain when ancient fears surface, this card speaks of anxiety and nightmares that plague the Celtic soul. The nine winter ravens circle overhead, embodying worry and sleepless nights. Yet even in the darkest hour before dawn, the Celts knew that acknowledging our fears gives us power over them.',
    reversed: 'The winter dawn breaks and the ravens scatter - your nightmares lose their power in the light of day. Like emerging from the dark passage of a burial mound into sunlight, you find that your fears were shadows without substance.',
    keywords: 'anxiety, nightmares, winter darkness, fear, worry',
    mythology: 'Associated with the Morrigans ravens that brought prophecies and fears in the night'
  }
};

async function fixMeanings() {
  // First, check the current owner
  const { data: deck } = await supabase
    .from('tarot_decks')
    .select('id, created_by, name')
    .limit(1)
    .maybeSingle();
  
  console.log('Deck:', deck);
  
  // Try to find the card
  const { data: card } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('name', 'Nine of Winter')
    .maybeSingle();
  
  console.log('Card found:', card ? 'YES' : 'NO');
  if (card) {
    console.log('Card deck_id:', card.deck_id);
    console.log('Card current celtic_meaning_upright:', card.celtic_meaning_upright);
  }
}

fixMeanings();
