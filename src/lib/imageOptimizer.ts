import sharp from 'sharp';

export async function optimizeImage(base64Image: string) {
  const buffer = Buffer.from(base64Image.split(',')[1], 'base64');

  return await sharp(buffer)
    .webp({ quality: 80 }) // Formato WebP é mais eficiente
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();
}
