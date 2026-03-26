import { ArticleStatus, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { publicArticlesPageSize } from '@/lib/site'

export type ArticleFilters = {
  page?: number
  query?: string
  series?: string
  tag?: string
}

export function buildPublicArticleWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
  const query = filters.query?.trim()

  return {
    status: ArticleStatus.PUBLISHED,
    ...(filters.series
      ? {
          series: {
            slug: filters.series,
          },
        }
      : {}),
    ...(filters.tag
      ? {
          tags: {
            some: {
              slug: filters.tag,
            },
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { content: { contains: query } },
          ],
        }
      : {}),
  }
}

export async function getPublicArticlePage(filters: ArticleFilters) {
  const page = Math.max(filters.page ?? 1, 1)
  const where = buildPublicArticleWhere(filters)

  const [items, totalItems, series, tags] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * publicArticlesPageSize,
      take: publicArticlesPageSize,
      include: {
        author: true,
        series: true,
        tags: true,
      },
    }),
    prisma.article.count({ where }),
    prisma.series.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
    }),
  ])

  return {
    items,
    page,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / publicArticlesPageSize)),
    series,
    tags,
  }
}
