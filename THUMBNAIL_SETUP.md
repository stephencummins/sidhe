# Thumbnail Setup Instructions

The admin panel now automatically generates thumbnails when uploading new card images. However, you need to add a database column to store the thumbnail URLs.

## Step 1: Add the Database Column

Go to your Supabase SQL Editor and run this command:

```sql
ALTER TABLE tarot_cards ADD COLUMN IF NOT EXISTS thumbnail_url text;
```

## Step 2: Test the Feature

1. Go to the admin panel
2. Upload a new card image
3. The system will automatically:
   - Upload the original full-size image
   - Generate a 300x450px thumbnail
   - Upload the thumbnail to the `thumbnails/` folder
   - Store both URLs in the database

## How It Works

- **Original images**: Stored at `{deckId}/{fileId}.{ext}`
- **Thumbnails**: Stored at `{deckId}/thumbnails/{fileId}.{ext}`
- **Size**: Thumbnails are resized to max 300x450px while maintaining aspect ratio
- **Quality**: 85% JPEG quality for optimal file size
- **Fallback**: If thumbnail generation fails, the original image is used

## Performance Benefits

- **Faster page loads**: Smaller file sizes load much quicker
- **Reduced bandwidth**: Thumbnails are typically 10-20x smaller than originals
- **Better UX**: Pages become interactive faster
- **Full quality on click**: Original images are still used in the detail modal

## Existing Cards

Existing cards without thumbnails will continue to work using the original images. You can:
- Re-upload cards to generate thumbnails for them
- Use the original images until you're ready to re-upload
- Both will display correctly in the admin panel
