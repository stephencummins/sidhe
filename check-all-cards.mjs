import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAllCards() {
  const { data: cards, error } = await supabase
    .from('tarot_cards')
    .select('id, name, suit, arcana, celtic_meaning_upright, celtic_meaning_reversed')
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total cards: ${cards.length}\n`);

  const missingCeltic = cards.filter(card =>
    !card.celtic_meaning_upright || !card.celtic_meaning_reversed
  );

  if (missingCeltic.length > 0) {
    console.log(`Cards missing Celtic meanings (${missingCeltic.length}):`);
    missingCeltic.forEach(card => {
      console.log(`  - ${card.name} (${card.suit || card.arcana || 'unknown'})`);
      console.log(`    Upright: ${card.celtic_meaning_upright ? 'YES' : 'MISSING'}`);
      console.log(`    Reversed: ${card.celtic_meaning_reversed ? 'YES' : 'MISSING'}`);
    });
  } else {
    console.log('All cards have Celtic meanings!');
  }
}

checkAllCards();
