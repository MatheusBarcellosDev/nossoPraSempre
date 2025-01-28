import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { casal: string } }
) {
  try {
    // Buscar informações do casal no banco de dados
    const page = await prisma.page.findFirst({
      where: { slug: params.casal },
    });

    if (!page) {
      return new NextResponse('Página não encontrada', { status: 404 });
    }

    // Gerar manifest dinâmico
    const manifest = {
      name: `${page.nome1} & ${page.nome2}`,
      short_name: `${page.nome1} & ${page.nome2}`,
      description: `Celebre a história de amor de ${page.nome1} e ${page.nome2}`,
      start_url: `/${params.casal}`,
      scope: `/${params.casal}`,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#E11D48',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    };

    return NextResponse.json(manifest);
  } catch (error) {
    console.error('Erro ao gerar manifest:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}
