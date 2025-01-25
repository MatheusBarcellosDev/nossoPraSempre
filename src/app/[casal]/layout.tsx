import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: { casal: string };
}): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: params.casal },
    });

    if (!page) {
      return {
        title: 'Página não encontrada | O Nosso Pra Sempre',
        description: 'A página que você procura não existe.',
      };
    }

    const title = `${page.nome1} & ${page.nome2} | O Nosso Pra Sempre`;
    const description = page.mensagem
      ? `${page.mensagem.slice(0, 150)}...`
      : `Celebre a história de amor de ${page.nome1} e ${page.nome2}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        siteName: 'O Nosso Pra Sempre',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_URL}/logo.jpg`,
            width: 1200,
            height: 630,
            alt: `${page.nome1} & ${page.nome2} - Nossa História de Amor`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${process.env.NEXT_PUBLIC_URL}/logo.jpg`],
      },
    };
  } catch (error) {
    // Fallback metadata quando o banco de dados estiver indisponível
    return {
      title: 'O Nosso Pra Sempre',
      description: 'Eternize sua história de amor',
      openGraph: {
        title: 'O Nosso Pra Sempre',
        description: 'Eternize sua história de amor',
        type: 'website',
        siteName: 'O Nosso Pra Sempre',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_URL}/logo.jpg`,
            width: 1200,
            height: 630,
            alt: 'O Nosso Pra Sempre - Eternize sua história de amor',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'O Nosso Pra Sempre',
        description: 'Eternize sua história de amor',
        images: [`${process.env.NEXT_PUBLIC_URL}/logo.jpg`],
      },
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
