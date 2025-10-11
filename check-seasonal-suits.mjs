import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const { data: cards } = await supabase
  .from('tarot_cards')
  .select('name, suit, meaning_upright')
  .order('name');

const suits = [...new Set(cards.filter(c => c.suit).map(c => c.suit))].sort();
console.log('Suits found:', suits);

console.log('\nEight cards:');
cards.filter(c => c.name.includes('Eight')).forEach(c => {
  console.log(`  ${c.name}: suit="${c.suit}", has_meaning=${!!c.meaning_upright}`);
});
