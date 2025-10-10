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
  .select('name, suit, arcana')
  .order('name');

const suits = {};
cards.forEach(c => {
  const suit = c.suit || 'null';
  suits[suit] = (suits[suit] || 0) + 1;
});

console.log('Suits breakdown:', suits);

console.log('\nSample cards:');
cards.slice(0, 10).forEach(c => console.log(`  ${c.name} - ${c.suit} - ${c.arcana}`));
