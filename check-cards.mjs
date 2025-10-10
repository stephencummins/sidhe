import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
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

// All 78 tarot cards
const allCards = [
  // Major Arcana (22)
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',

  // Wands (14)
  'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands',
  'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands',
  'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands',

  // Cups (14)
  'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups',
  'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups',
  'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups',

  // Swords (14)
  'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords',
  'Six of Swords', 'Seven of Swords', 'Eight of Swords', 'Nine of Swords', 'Ten of Swords',
  'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords',

  // Pentacles (14)
  'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles',
  'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles',
  'Page of Pentacles', 'Knight of Pentacles', 'Queen of Pentacles', 'King of Pentacles'
];

async function checkCards() {
  console.log('Checking tarot cards in database...\n');

  // Get all decks
  const { data: decks, error: deckError } = await supabase
    .from('tarot_decks')
    .select('id, name');

  if (deckError) {
    console.error('Error fetching decks:', deckError);
    return;
  }

  if (!decks || decks.length === 0) {
    console.log('No decks found in database.');
    return;
  }

  for (const deck of decks) {
    console.log(`\n📚 Deck: ${deck.name} (${deck.id})`);
    console.log('='.repeat(60));

    const { data: cards, error: cardError } = await supabase
      .from('tarot_cards')
      .select('name, image_url, celtic_meaning_upright')
      .eq('deck_id', deck.id)
      .order('name');

    if (cardError) {
      console.error('Error fetching cards:', cardError);
      continue;
    }

    console.log(`\nTotal cards in database: ${cards.length}/78`);

    const cardNames = cards.map(c => c.name);
    const missing = allCards.filter(name => !cardNames.includes(name));
    const extra = cardNames.filter(name => !allCards.includes(name));

    if (missing.length > 0) {
      console.log(`\n❌ Missing ${missing.length} cards:`);
      missing.forEach(name => console.log(`  - ${name}`));
    } else {
      console.log('\n✅ All 78 standard tarot cards present!');
    }

    if (extra.length > 0) {
      console.log(`\n⚠️  Extra/non-standard cards (${extra.length}):`);
      extra.forEach(name => console.log(`  - ${name}`));
    }

    // Check for cards with images
    const cardsWithImages = cards.filter(c => c.image_url && c.image_url.trim() !== '');
    const cardsWithoutImages = cards.filter(c => !c.image_url || c.image_url.trim() === '');

    console.log(`\n🖼️  Cards with images: ${cardsWithImages.length}`);
    console.log(`📷 Cards without images: ${cardsWithoutImages.length}`);

    if (cardsWithoutImages.length > 0 && cardsWithoutImages.length <= 10) {
      console.log('   Cards missing images:');
      cardsWithoutImages.forEach(c => console.log(`   - ${c.name}`));
    }

    // Check Celtic meanings
    const cardsWithCeltic = cards.filter(c => c.celtic_meaning_upright);
    console.log(`\n🍀 Cards with Celtic meanings: ${cardsWithCeltic.length}`);

    if (cardsWithCeltic.length === 0) {
      console.log('   ℹ️  No Celtic meanings imported yet. Use the Admin Panel to import.');
    } else if (cardsWithCeltic.length < 78) {
      console.log(`   ⚠️  ${78 - cardsWithCeltic.length} cards still need Celtic meanings`);
    } else {
      console.log('   ✅ All cards have Celtic meanings!');
    }
  }
}

checkCards().catch(console.error);
