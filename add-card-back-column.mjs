import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addCardBackColumn() {
  try {
    // Direct query using Supabase client
    const { data, error } = await supabase
      .from('tarot_decks')
      .select('card_back_url')
      .limit(1);

    if (error && error.message.includes('card_back_url')) {
      console.log('Column does not exist, attempting to add...');

      // Use PostgREST to execute raw SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          sql: "ALTER TABLE tarot_decks ADD COLUMN IF NOT EXISTS card_back_url text DEFAULT '';"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add column:', errorText);
        console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
        console.log("ALTER TABLE tarot_decks ADD COLUMN card_back_url text DEFAULT '';");
        process.exit(1);
      }

      console.log('Column added successfully!');
    } else if (error) {
      throw error;
    } else {
      console.log('Column already exists!');
    }
  } catch (err) {
    console.error('Error:', err);
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
    console.log("ALTER TABLE tarot_decks ADD COLUMN card_back_url text DEFAULT '';");
    process.exit(1);
  }
}

addCardBackColumn();
