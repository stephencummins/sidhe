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

const migration = readFileSync(join(__dirname, 'supabase/migrations/20251011000000_add_card_back_url.sql'), 'utf-8');

// Extract just the SQL commands (skip comments)
const sqlCommands = migration
  .split('\n')
  .filter(line => !line.trim().startsWith('/*') && !line.trim().startsWith('*') && !line.trim().startsWith('--'))
  .join('\n');

try {
  const { error } = await supabase.rpc('exec_sql', { sql: sqlCommands });
  if (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
  console.log('Migration applied successfully!');
} catch (err) {
  console.error('Error applying migration:', err);
  process.exit(1);
}
