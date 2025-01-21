import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cleanupTempImages } from '@/lib/cleanupStorage';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { tempData, slug } = await request.json();

    console.log('=== TempData POST ===');
    console.log('1. Saving data:', {
      slug,
      hasData: !!tempData,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    const savedTempData = await prisma.tempData.create({
      data: {
        key: slug,
        data: JSON.stringify(tempData),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, key: savedTempData.key });
  } catch (error) {
    console.error('Error saving temp data:', error);
    return NextResponse.json(
      { error: 'Error saving temporary data' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    console.log('=== TempData GET ===');
    console.log('1. Fetching data for key:', key);

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const tempData = await prisma.tempData.findUnique({
      where: { key },
    });

    console.log('2. Found data:', {
      found: !!tempData,
      key,
      expiresAt: tempData?.expiresAt,
    });

    if (!tempData) {
      return NextResponse.json(
        { error: 'Temporary data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: JSON.parse(tempData.data) });
  } catch (error) {
    console.error('Error fetching temp data:', error);
    return NextResponse.json(
      { error: 'Error fetching temporary data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    // Limpar imagens temporárias
    const { data: files } = await supabase.storage
      .from('wedding-photos')
      .list(`temp/${key}`);

    if (files && files.length > 0) {
      await supabase.storage
        .from('wedding-photos')
        .remove(files.map((file) => `temp/${key}/${file.name}`));
    }

    // Limpar dados temporários do banco
    await prisma.tempData.delete({
      where: { key },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return NextResponse.json(
      { error: 'Erro ao limpar dados' },
      { status: 500 }
    );
  }
}
