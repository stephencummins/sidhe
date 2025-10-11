/**
 * Creates a thumbnail version of an image file
 * @param file - The original image file
 * @param maxWidth - Maximum width for the thumbnail (default: 300px)
 * @param maxHeight - Maximum height for the thumbnail (default: 450px)
 * @returns Promise with the thumbnail file
 */
export async function createThumbnail(
  file: File,
  maxWidth: number = 300,
  maxHeight: number = 450
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
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

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create thumbnail blob'));
              return;
            }

            // Create a new file from the blob
            const thumbnailFile = new File(
              [blob],
              `thumb_${file.name}`,
              { type: file.type }
            );

            resolve(thumbnailFile);
          },
          file.type,
          0.85 // Quality setting (85%)
        );
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}
