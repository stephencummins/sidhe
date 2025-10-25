import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktjbtkkltvkmdwzkcwij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0amJ0a2tsdHZrbWR3emtjd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDY4NDQsImV4cCI6MjA3NTUyMjg0NH0.IFlD2U9xp2WoTK4FnCY86D9TGNGE38kZZXeiFBiHRlA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllData() {
  console.log('Checking decks and cards...\n');

  // Get all decks
  const { data: decks, error: deckError } = await supabase
    .from('tarot_decks')
    .select('*');

  if (deckError) {
    console.error('Error fetching decks:', deckError);
    return;
  }

  console.log(`Found ${decks.length} deck(s):\n`);
  decks.forEach(deck => {
    console.log(`- ${deck.name} (ID: ${deck.id}, Active: ${deck.is_active})`);
  });

  // Get all cards named "Four of Winter"
  const { data: cards, error: cardError } = await supabase
    .from('tarot_cards')
    .select('*')
    .ilike('name', '%Four%Winter%');

  if (cardError) {
    console.error('\nError fetching cards:', cardError);
    return;
  }

  console.log(`\n\nFound ${cards.length} card(s) matching "Four of Winter":\n`);
  cards.forEach(card => {
    console.log(`Card: ${card.name}`);
    console.log(`  ID: ${card.id}`);
    console.log(`  Deck ID: ${card.deck_id}`);
    console.log(`  Has meanings: ${card.meaning_upright ? 'Yes' : 'No'}`);
    console.log('');
  });
}

checkAllData();
