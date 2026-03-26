import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { ArticleStatus, type Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { buildArticleInput } from '@/lib/article-mutations'
import { prisma } from '@/lib/prisma'
import { dashboardArticlesPageSize } from '@/lib/site'
import { articlePayloadSchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Math.max(Number.parseInt(searchParams.get('page') ?? '1', 10) || 1, 1)
  const statusParam = searchParams.get('status')
  const status =
    statusParam === ArticleStatus.DRAFT || statusParam === ArticleStatus.PUBLISHED
      ? statusParam
      : undefined

  const where: Prisma.ArticleWhereInput = {
    authorId: session.user.id,
    ...(status ? { status } : {}),
  }

  const [items, totalItems] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      skip: (page - 1) * dashboardArticlesPageSize,
      take: dashboardArticlesPageSize,
      include: {
        series: true,
        tags: true,
      },
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({
    items,
    page,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / dashboardArticlesPageSize)),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = articlePayloadSchema.safeParse(await request.json())

  if (!payload.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: payload.error.flatten(),
      },
      { status: 400 },
    )
  }

  const existingSlug = await prisma.article.findUnique({
    where: { slug: payload.data.slug },
  })

  if (existingSlug) {
    return NextResponse.json(
      {
        error: 'Slug already exists',
      },
      { status: 409 },
    )
  }

  const articleInput = await buildArticleInput(payload.data)

  const article = await prisma.article.create({
    data: {
      ...articleInput,
      author: {
        connect: {
          id: session.user.id,
        },
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/articles')
  revalidatePath('/series')
  revalidatePath('/dashboard')

  return NextResponse.json({ article }, { status: 201 })
}
