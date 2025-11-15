import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createCanvas, loadImage } from 'canvas';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const standardWidth = 450;
const standardHeight = 675;

async function resizeImage(imageUrl, targetWidth, targetHeight) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Load image
    const img = await loadImage(buffer);

    console.log(`  Original size: ${img.width}x${img.height}`);

    // Create canvas with target dimensions
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');

    // Fill with white background (in case of transparency)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate dimensions to maintain aspect ratio and center the image
    const sourceRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (sourceRatio > targetRatio) {
      // Image is wider than target - fit to height
      drawHeight = targetHeight;
      drawWidth = img.width * (targetHeight / img.height);
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than target - fit to width
      drawWidth = targetWidth;
      drawHeight = img.height * (targetWidth / img.width);
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    // Draw the image
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Return as buffer
    return canvas.toBuffer('image/png', { compressionLevel: 6 });
  } catch (error) {
    console.error('Error resizing image:', error.message);
    return null;
  }
}

async function resizeNonStandardImages() {
  const nonStandardImages = [
    '6d6d390c-cc4a-49b3-bc6f-0f4106e7cb55/512c6b62-6f55-4d1f-9c87-172a7e6ae188.png',
    '6d6d390c-cc4a-49b3-bc6f-0f4106e7cb55/c5d59d4f-567e-4a1d-8471-c978d07a63e2.png'
  ];

  console.log(`Resizing ${nonStandardImages.length} images to ${standardWidth}x${standardHeight}...\n`);
  console.log('='.repeat(80));

  let succeeded = 0;
  let failed = 0;

  for (const imagePath of nonStandardImages) {
    console.log(`\nProcessing: ${imagePath}`);

    try {
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tarot-cards')
        .getPublicUrl(imagePath);

      console.log('  Downloading original image...');

      // Download and resize the image
      const resizedBuffer = await resizeImage(publicUrl, standardWidth, standardHeight);

      if (!resizedBuffer) {
        console.log('  ❌ Failed to resize image');
        failed++;
        continue;
      }

      const newSizeKB = (resizedBuffer.length / 1024).toFixed(2);
      console.log(`  New size: ${standardWidth}x${standardHeight} (${newSizeKB} KB)`);

      // Upload the resized image (overwrite the original)
      console.log('  Uploading resized image...');
      const { error: uploadError } = await supabase.storage
        .from('tarot-cards')
        .upload(imagePath, resizedBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.log(`  ❌ Upload failed: ${uploadError.message}`);
        failed++;
        continue;
      }

      console.log('  ✅ Successfully resized and uploaded');
      succeeded++;

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total processed: ${nonStandardImages.length}`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(80));
}

resizeNonStandardImages().catch(console.error);
