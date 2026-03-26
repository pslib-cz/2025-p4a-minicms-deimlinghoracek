import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { buildArticleInput, resolveTagConnections } from '@/lib/article-mutations'
import { prisma } from '@/lib/prisma'
import { articlePayloadSchema } from '@/lib/validation'

type RouteContext = {
  params: Promise<{ id: string }>
}

async function getOwnedArticle(id: string, userId: string) {
  return prisma.article.findFirst({
    where: {
      id,
      authorId: userId,
    },
    include: {
      tags: true,
      series: true,
    },
  })
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params
  const article = await getOwnedArticle(id, session.user.id)

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ article })
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params
  const existingArticle = await getOwnedArticle(id, session.user.id)

  if (!existingArticle) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
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

  const conflictingSlug = await prisma.article.findFirst({
    where: {
      slug: payload.data.slug,
      NOT: { id },
    },
  })

  if (conflictingSlug) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const articleInput = await buildArticleInput(payload.data)
  const tagConnections = await resolveTagConnections(payload.data.tags)

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...articleInput,
      tags: {
        set: [],
        connect: tagConnections,
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/articles')
  revalidatePath(`/articles/${existingArticle.slug}`)
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath('/series')
  revalidatePath('/dashboard')

  return NextResponse.json({ article })
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params
  const article = await getOwnedArticle(id, session.user.id)

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.article.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/articles')
  revalidatePath(`/articles/${article.slug}`)
  revalidatePath('/series')
  revalidatePath('/dashboard')

  return NextResponse.json({ ok: true })
}
