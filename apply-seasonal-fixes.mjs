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

console.log('Step 1: Setting seasonal suits...');
const migrations = [
  `UPDATE tarot_cards SET suit = 'spring', arcana = 'minor' WHERE name LIKE '%Spring%'`,
  `UPDATE tarot_cards SET suit = 'summer', arcana = 'minor' WHERE name LIKE '%Summer%'`,
  `UPDATE tarot_cards SET suit = 'autumn', arcana = 'minor' WHERE name LIKE '%Autumn%'`,
  `UPDATE tarot_cards SET suit = 'winter', arcana = 'minor' WHERE name LIKE '%Winter%'`
];

for (const sql of migrations) {
  const { error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.error('Error:', error);
  }
}

console.log('Step 2: Checking results...');
const { data: cards } = await supabase
  .from('tarot_cards')
  .select('name, suit')
  .limit(10);

console.log('Sample cards:', cards);

console.log('\nStep 3: Adding meanings...');
const meaningSql = readFileSync('supabase/migrations/20251011000003_add_seasonal_meanings.sql', 'utf-8');

// Split by UPDATE statements
const updates = meaningSql.split('UPDATE tarot_cards SET').filter(s => s.trim());
console.log(`Found ${updates.length} card meaning updates`);

let processed = 0;
let failed = 0;

for (const update of updates) {
  if (!update.trim()) continue;

  const sql = 'UPDATE tarot_cards SET' + update;
  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    failed++;
    console.error(`Failed update: ${error.message}`);
  } else {
    processed++;
  }
}

console.log(`\nProcessed: ${processed}, Failed: ${failed}`);

console.log('\nStep 4: Verifying...');
const { data: withMeanings } = await supabase
  .from('tarot_cards')
  .select('name, suit, meaning_upright')
  .neq('meaning_upright', '')
  .order('name')
  .limit(5);

console.log('Cards with meanings:');
withMeanings?.forEach(c => {
  console.log(`  ${c.name} (${c.suit}): ${c.meaning_upright.substring(0, 50)}...`);
});
