import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pages = await prisma.$transaction(async (tx) => {
      return await tx.page.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
      });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://www.onossoprasempre.com.br</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      ${pages
        .map(
          (page) => `
        <url>
          <loc>https://www.onossoprasempre.com.br/${page.slug}</loc>
          <lastmod>${page.updatedAt.toISOString()}</lastmod>
        </url>
      `
        )
        .join('')}
    </urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
