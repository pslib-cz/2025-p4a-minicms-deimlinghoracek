import { ArticleStatus } from '@prisma/client'
import type { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, series] = await Promise.all([
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.series.findMany({
      select: {
        slug: true,
      },
    }),
  ])

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl('/articles'),
      lastModified: new Date(),
    },
    {
      url: absoluteUrl('/series'),
      lastModified: new Date(),
    },
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt,
    })),
    ...series.map((item) => ({
      url: absoluteUrl(`/articles?series=${item.slug}`),
      lastModified: new Date(),
    })),
  ]
}
