import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktjbtkkltvkmdwzkcwij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0amJ0a2tsdHZrbWR3emtjd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDY4NDQsImV4cCI6MjA3NTUyMjg0NH0.IFlD2U9xp2WoTK4FnCY86D9TGNGE38kZZXeiFBiHRlA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFourOfWinter() {
  console.log('Checking Four of Winter cards in database...\n');

  const { data: cards, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('name', 'Four of Winter');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${cards.length} card(s) named "Four of Winter":\n`);

  cards.forEach((card, index) => {
    console.log(`Card ${index + 1}:`);
    console.log(`  ID: ${card.id}`);
    console.log(`  Deck ID: ${card.deck_id}`);
    console.log(`  Name: ${card.name}`);
    console.log(`  Image URL: ${card.image_url ? 'Present' : 'Missing'}`);
    console.log(`  Meaning Upright: ${card.meaning_upright || 'EMPTY'}`);
    console.log(`  Meaning Reversed: ${card.meaning_reversed || 'EMPTY'}`);
    console.log(`  Keywords: ${card.keywords ? JSON.stringify(card.keywords) : 'EMPTY'}`);
    console.log(`  Celtic Upright: ${card.celtic_meaning_upright ? 'Present' : 'EMPTY'}`);
    console.log(`  Celtic Reversed: ${card.celtic_meaning_reversed ? 'Present' : 'EMPTY'}`);
    console.log(`  Created: ${card.created_at}`);
    console.log('');
  });
}

checkFourOfWinter();
