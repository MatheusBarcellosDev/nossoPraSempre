import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { nome1, nome2, data, mensagem, fotos, musica, template, plano } =
      body;

    // Validar dados obrigatórios
    if (!nome1 || !nome2 || !data || !mensagem || !template || !plano) {
      console.log('Missing fields:', {
        nome1,
        nome2,
        data,
        mensagem,
        template,
        plano,
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Criar um slug único baseado nos nomes do casal
    const baseSlug = slugify(`${nome1}-e-${nome2}`, {
      lower: true,
      strict: true,
    });

    // Verificar se o slug já existe e adicionar um número se necessário
    let slug = baseSlug;
    let counter = 1;
    let existingPage = await prisma.page.findUnique({ where: { slug } });

    while (existingPage) {
      slug = `${baseSlug}-${counter}`;
      existingPage = await prisma.page.findUnique({ where: { slug } });
      counter++;
    }

    // Garantir que fotos seja um array de strings
    const fotosArray = Array.isArray(fotos) ? fotos : [];

    console.log('Creating page with data:', {
      nome1,
      nome2,
      data,
      mensagem,
      template,
      musica,
      slug,
      plano,
      fotosCount: fotosArray.length,
    });

    // Criar a página no banco de dados
    const page = await prisma.page.create({
      data: {
        nome1,
        nome2,
        data,
        mensagem,
        template,
        musica: musica || null,
        slug,
        plano,
        isPago: false,
        fotos: fotosArray,
      },
    });

    console.log('Page created successfully:', page.slug);
    return NextResponse.json({ slug: page.slug });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      {
        error: 'Error creating page',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Garantir que as fotos sejam um array de strings
    const transformedPage = {
      ...page,
      fotos: Array.isArray(page.fotos) ? page.fotos : [],
    };

    return NextResponse.json(transformedPage);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Error fetching page' }, { status: 500 });
  }
}
