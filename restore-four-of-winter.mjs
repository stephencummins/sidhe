import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktjbtkkltvkmdwzkcwij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0amJ0a2tsdHZrbWR3emtjd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDY4NDQsImV4cCI6MjA3NTUyMjg0NH0.IFlD2U9xp2WoTK4FnCY86D9TGNGE38kZZXeiFBiHRlA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreFourOfWinter() {
  console.log('Restoring Four of Winter meanings...\n');

  // Find the Four of Winter card
  const { data: cards, error: findError } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('name', 'Four of Winter');

  if (findError) {
    console.error('Error finding card:', findError);
    return;
  }

  if (!cards || cards.length === 0) {
    console.error('Four of Winter card not found in database!');
    return;
  }

  const card = cards[0];
  console.log(`Found card: ${card.name} (ID: ${card.id})`);

  // Update with all meanings
  const { data, error } = await supabase
    .from('tarot_cards')
    .update({
      meaning_upright: 'Conservation, security, stability, possessiveness, control. Holding tight to what you have.',
      meaning_reversed: 'Greed, materialism, self-protection, resistance to change. Clinging too tightly.',
      keywords: ['security', 'stability', 'conservation', 'control'],
      celtic_meaning_upright: 'Like a warrior resting in the crannog after long battles, taking time to tend wounds and sharpen weapons. The Celts understood the wisdom of strategic retreat and recuperation. In the heart of winter, even the land itself rests beneath snow and ice, gathering strength for the renewal to come. This is sacred rest, protected and necessary, not laziness but preparation for future challenges.',
      celtic_meaning_reversed: 'The rest period has ended - spring stirs beneath the frozen earth and it is time to emerge from your winter retreat. Like the Celtic warriors preparing for the spring campaigns, you must shake off lethargy and engage with life again. Prolonged withdrawal becomes stagnation; even winter must eventually yield to spring. The time for contemplation has passed; action calls.',
      celtic_keywords: 'rest, recuperation, meditation, winter retreat, strategic withdrawal, restoration',
      celtic_mythology: 'Connected to the winter festivals when Celtic communities would retreat indoors, telling stories and preserving knowledge while the land slept beneath snow, gathering strength for the growing season ahead.'
    })
    .eq('id', card.id)
    .select();

  if (error) {
    console.error('Error updating card:', error);
    return;
  }

  console.log('\n✓ Successfully restored all meanings for Four of Winter!');
  console.log('\nUpdated fields:');
  console.log('- Standard upright meaning');
  console.log('- Standard reversed meaning');
  console.log('- Keywords');
  console.log('- Celtic upright meaning');
  console.log('- Celtic reversed meaning');
  console.log('- Celtic keywords');
  console.log('- Celtic mythology');
}

restoreFourOfWinter();
