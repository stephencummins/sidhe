import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImageSizes() {
  console.log('Fetching all image files from tarot-cards storage...\n');

  // List all files in the bucket
  const { data: files, error } = await supabase.storage
    .from('tarot-cards')
    .list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    console.error('Error listing files:', error);
    return;
  }

  console.log(`Found ${files.length} items in root\n`);

  // Get all deck folders
  const folders = files.filter(f => !f.id);
  console.log(`Found ${folders.length} deck folders\n`);

  const allImageFiles = [];

  // List files in each folder
  for (const folder of folders) {
    if (!folder.name) continue;

    const { data: folderFiles, error: folderError } = await supabase.storage
      .from('tarot-cards')
      .list(folder.name, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (folderError) {
      console.error(`Error listing files in ${folder.name}:`, folderError);
      continue;
    }

    // Filter out thumbnail folders and only include image files
    const imageFiles = folderFiles.filter(f =>
      f.id &&
      !f.name.includes('/') &&
      (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
    );

    for (const file of imageFiles) {
      allImageFiles.push({
        path: `${folder.name}/${file.name}`,
        name: file.name,
        size: file.metadata?.size || 0,
        width: file.metadata?.width,
        height: file.metadata?.height
      });
    }
  }

  console.log(`\nTotal image files: ${allImageFiles.length}\n`);
  console.log('='.repeat(80));
  console.log('IMAGE SIZE ANALYSIS');
  console.log('='.repeat(80));

  // Get metadata for each image by downloading headers
  const standardWidth = 450;
  const standardHeight = 675;
  const nonStandardImages = [];

  for (const file of allImageFiles) {
    try {
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tarot-cards')
        .getPublicUrl(file.path);

      // Fetch just the headers to get image dimensions
      const response = await fetch(publicUrl, { method: 'HEAD' });

      // For more accurate dimensions, we need to actually fetch and check the image
      // Let's fetch it
      const imgResponse = await fetch(publicUrl);
      const arrayBuffer = await imgResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Check PNG signature
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        // PNG format - read IHDR chunk
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);

        file.width = width;
        file.height = height;
        file.fileSize = buffer.length;

        if (width !== standardWidth || height !== standardHeight) {
          nonStandardImages.push(file);
        }
      }
      // Check JPEG signature
      else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        // JPEG format - more complex parsing needed
        let offset = 2;
        while (offset < buffer.length) {
          if (buffer[offset] !== 0xFF) break;

          const marker = buffer[offset + 1];
          offset += 2;

          // SOF0 or SOF2 markers contain dimensions
          if (marker === 0xC0 || marker === 0xC2) {
            const height = buffer.readUInt16BE(offset + 3);
            const width = buffer.readUInt16BE(offset + 5);

            file.width = width;
            file.height = height;
            file.fileSize = buffer.length;

            if (width !== standardWidth || height !== standardHeight) {
              nonStandardImages.push(file);
            }
            break;
          }

          // Skip to next marker
          const segmentLength = buffer.readUInt16BE(offset);
          offset += segmentLength;
        }
      }
      // Check WebP signature
      else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        // WebP format
        // VP8 or VP8L chunk contains dimensions
        if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
          // Simple WebP format check
          const width = buffer.readUInt16LE(26) & 0x3FFF;
          const height = buffer.readUInt16LE(28) & 0x3FFF;

          file.width = width;
          file.height = height;
          file.fileSize = buffer.length;

          if (width !== standardWidth || height !== standardHeight) {
            nonStandardImages.push(file);
          }
        }
      }

    } catch (error) {
      console.error(`Error checking ${file.path}:`, error.message);
    }
  }

  console.log(`\nStandard size (${standardWidth}x${standardHeight}): ${allImageFiles.length - nonStandardImages.length} images`);
  console.log(`Non-standard size: ${nonStandardImages.length} images\n`);

  if (nonStandardImages.length > 0) {
    console.log('NON-STANDARD SIZE IMAGES:');
    console.log('='.repeat(80));
    for (const img of nonStandardImages) {
      const sizeKB = (img.fileSize / 1024).toFixed(2);
      console.log(`${img.path}`);
      console.log(`  Dimensions: ${img.width}x${img.height}`);
      console.log(`  File size: ${sizeKB} KB`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
}

checkImageSizes().catch(console.error);
