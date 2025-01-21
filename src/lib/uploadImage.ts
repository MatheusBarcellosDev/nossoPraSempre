import sharp from 'sharp';
import { supabase } from './supabase';

export async function uploadImage(base64Image: string, folder: string) {
  try {
    // Comprimir e otimizar
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(1920, 1080, { fit: 'inside' })
      .toBuffer();

    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.webp`;

    // Upload usando o cliente Supabase já configurado
    const { data, error } = await supabase.storage
      .from('wedding-photos')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
      });

    if (error) throw error;

    // Pegar URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from('wedding-photos').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}
