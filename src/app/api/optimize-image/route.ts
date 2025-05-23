import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      throw new Error('Configuração do Supabase ausente');
    }

    const { image, folder } = await request.json();

    if (!image || !folder) {
      return NextResponse.json(
        { error: 'Imagem ou pasta não fornecida' },
        { status: 400 }
      );
    }

    if (!image.includes('base64,')) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(image.split(',')[1], 'base64');

    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();

    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json(
        { error: 'Erro no upload', details: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('wedding-photos').getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
