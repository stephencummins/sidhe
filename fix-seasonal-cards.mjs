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

console.log('Step 1: Setting suits for seasonal cards...\n');

// Update suits
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
for (const season of seasons) {
  const { data, error } = await supabase
    .from('tarot_cards')
    .update({ suit: season.toLowerCase(), arcana: 'minor' })
    .like('name', `%${season}%`)
    .select();

  if (error) {
    console.error(`Error updating ${season}:`, error);
  } else {
    console.log(`✓ Updated ${data.length} ${season} cards`);
  }
}

console.log('\nStep 2: Adding meanings for Eight of Winter...\n');

const { data: card, error: findError } = await supabase
  .from('tarot_cards')
  .select('*')
  .eq('name', 'Eight of Winter')
  .single();

if (findError) {
  console.error('Error finding card:', findError);
} else {
  console.log('Found card:', card.name);

  const { error: updateError } = await supabase
    .from('tarot_cards')
    .update({
      meaning_upright: 'Apprenticeship, skill development, quality, attention to detail. Mastering your craft through dedication.',
      meaning_reversed: 'Lack of focus, mediocrity, shortcuts, poor quality. Rushing through important work.',
      keywords: ['apprenticeship', 'skill', 'quality', 'dedication']
    })
    .eq('id', card.id);

  if (updateError) {
    console.error('Error updating meaning:', updateError);
  } else {
    console.log('✓ Added meanings for Eight of Winter');
  }
}

console.log('\nStep 3: Verifying...\n');
const { data: updated } = await supabase
  .from('tarot_cards')
  .select('name, suit, meaning_upright')
  .eq('name', 'Eight of Winter')
  .single();

if (updated) {
  console.log('Eight of Winter:');
  console.log(`  Suit: ${updated.suit}`);
  console.log(`  Meaning: ${updated.meaning_upright}`);
}
