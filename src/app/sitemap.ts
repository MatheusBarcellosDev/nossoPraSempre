import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || 'https://onossoprasempre.com.br';

  // Buscar todas as páginas públicas
  const pages = await prisma.page.findMany({
    where: {
      isPrivate: false,
      isPago: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // URLs estáticas
  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // URLs dinâmicas das páginas dos casais
  const dynamicRoutes = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...dynamicRoutes];
}
