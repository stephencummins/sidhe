import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Check what suits are in the database
const { data: cards, error } = await supabase
  .from('tarot_cards')
  .select('name, suit, arcana')
  .order('name');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

const suits = new Set(cards.filter(c => c.suit).map(c => c.suit));
console.log('Suits in database:', Array.from(suits).sort());

console.log('\nSample seasonal cards:');
cards.filter(c => c.name.includes('Eight')).forEach(c => {
  console.log(`  ${c.name} - suit: ${c.suit}, arcana: ${c.arcana}`);
});

console.log('\nCards with meanings:');
const { data: withMeanings } = await supabase
  .from('tarot_cards')
  .select('name, suit, meaning_upright')
  .neq('meaning_upright', '')
  .limit(5);

withMeanings?.forEach(c => {
  console.log(`  ${c.name} (${c.suit}): ${c.meaning_upright.substring(0, 50)}...`);
});
