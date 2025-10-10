import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import postgres from 'postgres';

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

// Use direct database connection if available
const dbUrl = env.VITE_SUPABASE_DB_URL || env.DATABASE_URL;

if (dbUrl) {
  console.log('Using direct database connection...');
  const sql = postgres(dbUrl);
  
  try {
    // Drop constraint
    console.log('1. Dropping old constraint...');
    await sql`ALTER TABLE tarot_cards DROP CONSTRAINT IF EXISTS tarot_cards_suit_check`;
    console.log('  ✓ Done\n');
    
    // Add new constraint
    console.log('2. Adding new constraint...');
    await sql`
      ALTER TABLE tarot_cards ADD CONSTRAINT tarot_cards_suit_check
      CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles', 'spring', 'summer', 'autumn', 'winter') OR suit IS NULL)
    `;
    console.log('  ✓ Done\n');
    
    // Update Major Arcana
    console.log('3. Updating Major Arcana cards...');
    const result = await sql`
      UPDATE tarot_cards
      SET arcana = 'major', suit = NULL
      WHERE name IN (
        'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
        'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
        'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
        'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
      )
    `;
    console.log(`  ✓ Updated ${result.count} cards\n`);
    
    await sql.end();
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
} else {
  console.error('No database URL found in .env');
}
