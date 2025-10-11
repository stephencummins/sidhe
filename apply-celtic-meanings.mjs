import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Read the migration SQL
const sql = readFileSync('supabase/migrations/20251011000004_add_missing_celtic_meanings.sql', 'utf8');

// Extract UPDATE statements
const updates = sql.match(/UPDATE tarot_cards[\s\S]*?WHERE name = '[^']+';/g);

console.log(`Found ${updates.length} update statements\n`);

for (const update of updates) {
  // Extract card name
  const nameMatch = update.match(/WHERE name = '([^']+)'/);
  if (!nameMatch) continue;
  
  const cardName = nameMatch[1];
  console.log(`Processing ${cardName}...`);
  
  // Extract values
  const uprightMatch = update.match(/celtic_meaning_upright = '([\s\S]*?)(?=',\n  celtic_meaning_reversed)/);
  const reversedMatch = update.match(/celtic_meaning_reversed = '([\s\S]*?)(?=',\n  celtic_keywords)/);
  const keywordsMatch = update.match(/celtic_keywords = '([^']*?)'/);
  const mythologyMatch = update.match(/celtic_mythology = '([\s\S]*?)'\nWHERE/);
  
  if (!uprightMatch || !reversedMatch) {
    console.log(`  Skipping - could not extract meanings`);
    continue;
  }
  
  const updateData = {
    celtic_meaning_upright: uprightMatch[1].replace(/''/g, "'"),
    celtic_meaning_reversed: reversedMatch[1].replace(/''/g, "'"),
    celtic_keywords: keywordsMatch ? keywordsMatch[1] : null,
    celtic_mythology: mythologyMatch ? mythologyMatch[1].replace(/''/g, "'") : null
  };
  
  const { data, error } = await supabase
    .from('tarot_cards')
    .update(updateData)
    .eq('name', cardName)
    .select();
  
  if (error) {
    console.log(`  Error: ${error.message}`);
  } else if (data && data.length > 0) {
    console.log(`  Updated successfully`);
  } else {
    console.log(`  No rows updated (card not found?)`);
  }
}

console.log('\nVerifying...');
const { data: cards } = await supabase
  .from('tarot_cards')
  .select('name, celtic_meaning_upright, celtic_meaning_reversed')
  .or('name.eq.Nine of Winter,name.eq.Ace of Winter,name.eq.Four of Winter,name.eq.Five of Winter,name.eq.Eight of Autumn,name.eq.Eight of Spring,name.eq.Eight of Summer,name.eq.Justice,name.eq.The Hierophant');

const stillMissing = cards.filter(c => !c.celtic_meaning_upright || !c.celtic_meaning_reversed);
console.log(stillMissing.length === 0 ? '\nAll cards updated!' : `\nStill missing: ${stillMissing.map(c => c.name).join(', ')}`);
