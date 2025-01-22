import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const alt = 'O Nosso Pra Sempre - História de Amor';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { casal: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.casal },
  });

  if (!page)
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            color: '#666',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          Página não encontrada
        </div>
      )
    );

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #ff6b6b, #ff8787)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '40px',
          color: 'white',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {page.nome1} & {page.nome2}
        </div>
        <div
          style={{
            fontSize: 30,
            opacity: 0.8,
          }}
        >
          Nossa História de Amor
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'sans-serif',
          data: await fetch(
            new URL(
              'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
            )
          ).then((res) => res.arrayBuffer()),
        },
      ],
    }
  );
}
