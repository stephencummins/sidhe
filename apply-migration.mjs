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

console.log('Applying migration...\n');

const migrationSQL = readFileSync(join(__dirname, 'supabase/migrations/20251010160000_fix_arcana_and_suits.sql'), 'utf-8');

// Split by semicolons and execute each statement
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('/*') && !s.startsWith('--'));

for (const statement of statements) {
  if (!statement) continue;
  
  console.log('Executing:', statement.substring(0, 80) + '...');
  
  const { error } = await supabase.rpc('exec_sql', { sql: statement });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✓ Success\n');
  }
}

console.log('Verifying fix...');
const { data: cards } = await supabase
  .from('tarot_cards')
  .select('arcana')
  .eq('name', 'The Fool');

console.log('The Fool arcana:', cards?.[0]?.arcana || 'NOT FOUND');
