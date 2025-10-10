import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { data: cards, error } = await supabase
  .from('tarot_cards')
  .select('name, arcana, suit')
  .order('name');

if (error) {
  console.error('Error:', error);
} else {
  console.log('\nArcana values:');
  const arcanaCount = {};
  cards.forEach(card => {
    const arcana = card.arcana || 'null';
    arcanaCount[arcana] = (arcanaCount[arcana] || 0) + 1;
  });
  console.log(arcanaCount);
  
  console.log('\nSample Major Arcana cards:');
  cards.filter(c => c.arcana === 'major').slice(0, 5).forEach(c => {
    console.log(`  ${c.name}: arcana='${c.arcana}'`);
  });
  
  console.log('\nSample cards that should be Major Arcana:');
  const majorNames = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor'];
  majorNames.forEach(name => {
    const card = cards.find(c => c.name === name);
    if (card) {
      console.log(`  ${card.name}: arcana='${card.arcana}', suit='${card.suit}'`);
    } else {
      console.log(`  ${name}: NOT FOUND`);
    }
  });
}
