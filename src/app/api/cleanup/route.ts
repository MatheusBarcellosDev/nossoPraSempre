import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Verificar se a requisição tem a chave de API correta
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CLEANUP_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calcular a data de 24 horas atrás
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // Deletar páginas não pagas criadas há mais de 24 horas
    const result = await prisma.page.deleteMany({
      where: {
        isPago: false,
        createdAt: {
          lt: oneDayAgo,
        },
      },
    });

    return NextResponse.json({
      message: `Deleted ${result.count} unpaid pages`,
      count: result.count,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Error during cleanup' },
      { status: 500 }
    );
  }
}
