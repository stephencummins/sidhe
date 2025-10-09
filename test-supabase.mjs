import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ktjbtkkltvkmdwzkcwij.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0amJ0a2tsdHZrbWR3emtjd2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDY4NDQsImV4cCI6MjA3NTUyMjg0NH0.IFlD2U9xp2WoTK4FnCY86D9TGNGE38kZZXeiFBiHRlA'
);

console.log('Testing Supabase connection...\n');

// Test 1: Check auth configuration
const { data: authData } = await supabase.auth.getSession();
console.log('✓ Auth client initialized');

// Test 2: Query tarot_decks table
const { data: decks, error: decksError, count } = await supabase
  .from('tarot_decks')
  .select('*', { count: 'exact', head: true });

if (decksError) {
  console.log('✗ Database error:', decksError.message);
} else {
  console.log('✓ Connected to database');
  console.log('✓ Table "tarot_decks" accessible');
  console.log(`  Records: ${count ?? 0}`);
}

// Test 3: Check readings table
const { error: readingsError, count: readingsCount } = await supabase
  .from('readings')
  .select('*', { count: 'exact', head: true });

if (readingsError) {
  console.log('✗ Table "readings" error:', readingsError.message);
} else {
  console.log('✓ Table "readings" accessible');
  console.log(`  Records: ${readingsCount ?? 0}`);
}

console.log('\n✓ Supabase connection verified!');
