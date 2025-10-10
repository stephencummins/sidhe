import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    env[key.trim()] = values.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { data: cards } = await supabase
  .from('tarot_cards')
  .select('*')
  .eq('name', 'The Fool')
  .single();

console.log('The Fool card data:');
console.log('\nMeaning Upright:');
console.log(cards.meaning_upright || 'NO DATA');
console.log('\nMeaning Reversed:');
console.log(cards.meaning_reversed || 'NO DATA');
console.log('\nCeltic Meaning Upright:');
console.log(cards.celtic_meaning_upright || 'NO DATA');
console.log('\nCeltic Mythology:');
console.log(cards.celtic_mythology || 'NO DATA');
