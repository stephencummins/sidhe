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
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Checking arcana values...\n');

const { data: cards, error } = await supabase
  .from('tarot_cards')
  .select('id, name, arcana, suit')
  .order('name');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Total cards:', cards.length);

const arcanaCount = {};
cards.forEach(card => {
  const arcana = card.arcana || 'null';
  arcanaCount[arcana] = (arcanaCount[arcana] || 0) + 1;
});
console.log('\nArcana breakdown:', arcanaCount);

const majorArcanaNames = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
];

console.log('\nChecking Major Arcana cards:');
const cardsToFix = [];
majorArcanaNames.forEach(name => {
  const card = cards.find(c => c.name === name);
  if (card) {
    console.log(`  ${card.name}: arcana='${card.arcana}'`);
    if (card.arcana !== 'major') {
      cardsToFix.push(card);
    }
  } else {
    console.log(`  ${name}: NOT FOUND`);
  }
});

if (cardsToFix.length > 0) {
  console.log(`\n🔧 Fixing ${cardsToFix.length} cards with incorrect arcana value...`);

  for (const card of cardsToFix) {
    const { error: updateError } = await supabase
      .from('tarot_cards')
      .update({ arcana: 'major', suit: null })
      .eq('id', card.id);

    if (updateError) {
      console.error(`  ❌ Error updating ${card.name}:`, updateError);
    } else {
      console.log(`  ✓ Fixed ${card.name}`);
    }
  }

  console.log('\n✅ All cards fixed!');
} else {
  console.log('\n✅ All Major Arcana cards have correct arcana value!');
}
