import { ArticleStatus, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slug'
import { type ArticlePayload } from '@/lib/validation'

export async function resolveTagConnections(tagNames: string[]) {
  const uniqueTags = Array.from(new Set(tagNames.map((tag) => tag.trim()).filter(Boolean)))

  const tags = await Promise.all(
    uniqueTags.map((name) =>
      prisma.tag.upsert({
        where: { slug: slugify(name) },
        update: {
          name,
        },
        create: {
          name,
          slug: slugify(name),
        },
      }),
    ),
  )

  return tags.map((tag) => ({ id: tag.id }))
}

export async function buildArticleInput(
  payload: ArticlePayload,
): Promise<Prisma.ArticleCreateWithoutAuthorInput> {
  const tags = await resolveTagConnections(payload.tags)

  return {
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    content: payload.content,
    imageUrl: payload.imageUrl,
    status: payload.status as ArticleStatus,
    publishDate: new Date(payload.publishDate),
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    series: {
      connect: {
        id: payload.seriesId,
      },
    },
    tags: {
      connect: tags,
    },
  }
}
