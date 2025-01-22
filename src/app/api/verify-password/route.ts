import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { slug, password } = await request.json();

    if (!slug || !password) {
      return new Response(
        JSON.stringify({
          error: 'Dados inválidos',
        }),
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      select: { password: true, isPrivate: true },
    });

    if (!page) {
      return new Response(
        JSON.stringify({
          error: 'Página não encontrada',
        }),
        { status: 404 }
      );
    }

    if (!page.isPrivate) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    }

    if (page.password !== password) {
      return new Response(
        JSON.stringify({
          error: 'Senha incorreta',
        }),
        { status: 401 }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao verificar senha',
      }),
      { status: 500 }
    );
  }
}
