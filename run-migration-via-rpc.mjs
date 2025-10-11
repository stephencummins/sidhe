import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const sql = readFileSync('supabase/migrations/20251011000005_function_update_celtic_meanings.sql', 'utf8');

console.log('Attempting to run migration SQL...\n');

// Try using the postgres endpoint if available
const { data, error } = await supabase.rpc('exec_sql', { sql });

if (error) {
  console.error('Error:', error);
} else {
  console.log('Success!', data);
}

// Verify
console.log('\nVerifying updates...');
const { data: cards } = await supabase
  .from('tarot_cards')
  .select('name, celtic_meaning_upright')
  .eq('name', 'Nine of Winter')
  .maybeSingle();

console.log('Nine of Winter:', cards);
