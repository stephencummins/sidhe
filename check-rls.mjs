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
const supabaseServiceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
console.log('Using service key:', supabaseServiceKey ? 'YES' : 'NO (using anon key)');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('Attempting to update The Fool...');

const { data: before } = await supabase
  .from('tarot_cards')
  .select('name, arcana')
  .eq('name', 'The Fool')
  .single();

console.log('Before:', before);

const { data: updated, error } = await supabase
  .from('tarot_cards')
  .update({ arcana: 'major' })
  .eq('name', 'The Fool')
  .select();

if (error) {
  console.error('Update error:', error);
} else {
  console.log('Update result:', updated);
}

const { data: after } = await supabase
  .from('tarot_cards')
  .select('name, arcana')
  .eq('name', 'The Fool')
  .single();

console.log('After:', after);
