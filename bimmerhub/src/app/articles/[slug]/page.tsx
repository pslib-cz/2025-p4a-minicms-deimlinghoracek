import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import { notFound } from 'next/navigation'

import { RichContent } from '@/components/public/rich-content'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

type ArticleDetailPageProps = {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      status: ArticleStatus.PUBLISHED,
    },
    include: {
      author: true,
      series: true,
      tags: true,
    },
  })
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: 'Článek nenalezen',
    }
  }

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.description,
      url: absoluteUrl(`/articles/${article.slug}`),
      type: 'article',
      publishedTime: article.publishDate.toISOString(),
      authors: [article.author.name || article.author.email || 'BimmerHub'],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.title }] : undefined,
    },
  }
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <article className="space-y-8 pb-12">
      <section className="surface-card overflow-hidden rounded-[36px]">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/articles?series=${article.series.slug}`}
                className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white"
              >
                {article.series.name}
              </Link>
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {article.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">{article.description}</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <span>Autor: {article.author.name || article.author.email}</span>
              <time dateTime={article.publishDate.toISOString()}>
                Publikováno{' '}
                {new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long' }).format(article.publishDate)}
              </time>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-[28px] bg-slate-200">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            ) : (
              <div className="flex h-full items-end bg-[linear-gradient(135deg,rgba(15,35,65,0.96),rgba(28,105,212,0.9),rgba(210,45,35,0.86))] p-8">
                <span className="text-5xl font-black uppercase tracking-[0.35em] text-white/90">
                  BMW
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card rounded-[36px] p-8 lg:p-10">
        <RichContent content={article.content} />
      </section>
    </article>
  )
}
