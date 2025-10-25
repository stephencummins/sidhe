import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktjbtkkltvkmdwzkcwij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0amJ0a2tsdHZrbWR3emtjd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDY4NDQsImV4cCI6MjA3NTUyMjg0NH0.IFlD2U9xp2WoTK4FnCY86D9TGNGE38kZZXeiFBiHRlA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceUpdateFourOfWinter() {
  console.log('Force updating Four of Winter meanings...\n');

  const cardId = 'e5039d85-3783-4ab4-ad1f-a0c2654fe54d';

  const updateData = {
    meaning_upright: 'Conservation, security, stability, possessiveness, control. Holding tight to what you have.',
    meaning_reversed: 'Greed, materialism, self-protection, resistance to change. Clinging too tightly.',
    keywords: ['security', 'stability', 'conservation', 'control'],
    celtic_meaning_upright: 'Like a warrior resting in the crannog after long battles, taking time to tend wounds and sharpen weapons. The Celts understood the wisdom of strategic retreat and recuperation. In the heart of winter, even the land itself rests beneath snow and ice, gathering strength for the renewal to come. This is sacred rest, protected and necessary, not laziness but preparation for future challenges.',
    celtic_meaning_reversed: 'The rest period has ended - spring stirs beneath the frozen earth and it is time to emerge from your winter retreat. Like the Celtic warriors preparing for the spring campaigns, you must shake off lethargy and engage with life again. Prolonged withdrawal becomes stagnation; even winter must eventually yield to spring. The time for contemplation has passed; action calls.',
    celtic_keywords: 'rest, recuperation, meditation, winter retreat, strategic withdrawal, restoration',
    celtic_mythology: 'Connected to the winter festivals when Celtic communities would retreat indoors, telling stories and preserving knowledge while the land slept beneath snow, gathering strength for the growing season ahead.'
  };

  console.log('Updating card with ID:', cardId);
  console.log('Update data:', JSON.stringify(updateData, null, 2));

  const { data, error } = await supabase
    .from('tarot_cards')
    .update(updateData)
    .eq('id', cardId)
    .select();

  if (error) {
    console.error('\n❌ Error updating card:', error);
    return;
  }

  console.log('\n✓ Update successful!');
  console.log('Result:', JSON.stringify(data, null, 2));

  // Verify the update
  const { data: verifyData, error: verifyError } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (verifyError) {
    console.error('\n❌ Error verifying:', verifyError);
    return;
  }

  console.log('\n--- Verification ---');
  console.log('Meaning Upright:', verifyData.meaning_upright ? 'Present ✓' : 'Missing ✗');
  console.log('Meaning Reversed:', verifyData.meaning_reversed ? 'Present ✓' : 'Missing ✗');
  console.log('Keywords:', verifyData.keywords ? `${verifyData.keywords.length} keywords ✓` : 'Missing ✗');
  console.log('Celtic Upright:', verifyData.celtic_meaning_upright ? 'Present ✓' : 'Missing ✗');
  console.log('Celtic Reversed:', verifyData.celtic_meaning_reversed ? 'Present ✓' : 'Missing ✗');
}

forceUpdateFourOfWinter();
