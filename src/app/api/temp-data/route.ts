import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cleanupTempImages } from '@/lib/cleanupStorage';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { key, data } = await request.json();

    if (!key || !data) {
      return new Response(
        JSON.stringify({
          error: 'Dados inválidos',
        }),
        { status: 400 }
      );
    }

    // Salvar dados temporários usando o Prisma
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    await prisma.tempData.upsert({
      where: { key },
      update: {
        data: JSON.stringify(data),
        expiresAt,
      },
      create: {
        key,
        data: JSON.stringify(data),
        expiresAt,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error saving temp data:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao salvar dados temporários',
      }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return new Response(
        JSON.stringify({
          error: 'Chave não fornecida',
        }),
        { status: 400 }
      );
    }

    const tempData = await prisma.tempData.findUnique({
      where: { key },
    });

    if (!tempData || new Date() > tempData.expiresAt) {
      if (tempData) {
        // Limpar dados expirados
        await prisma.tempData.delete({
          where: { key },
        });
      }
      return new Response(
        JSON.stringify({
          error: 'Dados não encontrados ou expirados',
        }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ data: JSON.parse(tempData.data) }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching temp data:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao buscar dados temporários',
      }),
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
