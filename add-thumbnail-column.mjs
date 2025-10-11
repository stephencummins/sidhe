import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if column exists
const { data: columns, error: checkError } = await supabase
  .from('tarot_cards')
  .select('*')
  .limit(1);

if (checkError) {
  console.error('Error checking table:', checkError);
  process.exit(1);
}

console.log('Table accessible. Column should be added via Supabase dashboard.');
console.log('Please run this SQL in your Supabase SQL editor:');
console.log('');
console.log('ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS thumbnail_url text;');
console.log('');
