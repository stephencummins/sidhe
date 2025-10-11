import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createCanvas, loadImage } from 'canvas';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createThumbnailFromUrl(imageUrl, maxWidth = 300, maxHeight = 450) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load image
    const img = await loadImage(buffer);

    // Calculate new dimensions
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
    }

    // Create canvas and draw resized image
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    // Return as buffer
    return canvas.toBuffer('image/jpeg', { quality: 0.85 });
  } catch (error) {
    console.error('Error creating thumbnail:', error.message);
    return null;
  }
}

async function generateThumbnails() {
  console.log('Fetching all cards without thumbnails...\n');

  // Get all cards
  const { data: cards, error } = await supabase
    .from('tarot_cards')
    .select('id, name, deck_id, image_url, thumbnail_url')
    .order('name');

  if (error) {
    console.error('Error fetching cards:', error);
    return;
  }

  console.log(`Found ${cards.length} total cards`);
  const cardsNeedingThumbnails = cards.filter(c => !c.thumbnail_url);
  console.log(`${cardsNeedingThumbnails.length} cards need thumbnails\n`);

  if (cardsNeedingThumbnails.length === 0) {
    console.log('All cards already have thumbnails!');
    return;
  }

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const card of cardsNeedingThumbnails) {
    processed++;
    console.log(`[${processed}/${cardsNeedingThumbnails.length}] Processing: ${card.name}`);

    try {
      // Create thumbnail
      const thumbnailBuffer = await createThumbnailFromUrl(card.image_url);

      if (!thumbnailBuffer) {
        console.log(`  ❌ Failed to create thumbnail\n`);
        failed++;
        continue;
      }

      // Extract file extension from original URL
      const urlParts = card.image_url.split('.');
      const ext = urlParts[urlParts.length - 1].split('?')[0];

      // Upload thumbnail
      const thumbPath = `${card.deck_id}/thumbnails/${card.id}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('tarot-cards')
        .upload(thumbPath, thumbnailBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.log(`  ❌ Upload failed: ${uploadError.message}\n`);
        failed++;
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tarot-cards')
        .getPublicUrl(thumbPath);

      // Update database
      const { error: updateError } = await supabase
        .from('tarot_cards')
        .update({ thumbnail_url: publicUrl })
        .eq('id', card.id);

      if (updateError) {
        console.log(`  ❌ Database update failed: ${updateError.message}\n`);
        failed++;
        continue;
      }

      console.log(`  ✅ Thumbnail created: ${thumbPath}\n`);
      succeeded++;

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total processed: ${processed}`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(50));
}

generateThumbnails().catch(console.error);
