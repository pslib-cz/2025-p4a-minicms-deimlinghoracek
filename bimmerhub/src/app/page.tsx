import Image from 'next/image'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'

import { ArticleCard } from '@/components/public/article-card'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [allPublished, series] = await Promise.all([
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      orderBy: [{ publishDate: 'desc' }],
      take: 7,
      include: { author: true, series: true, tags: true },
    }),
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
      take: 6,
    }),
  ])

  const featured = allPublished[0]
  const latestArticles = allPublished.slice(1, 4)

  return (
    <div className="space-y-12 pb-8">
      {/* Hero */}
      <section className="surface-card relative rounded-[36px] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(28,105,212,0.18),transparent_58%)] lg:block" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Publikační platforma pro fanoušky BMW
          </div>
          <h1 className="max-w-2xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Recenze, návody a editorial o autech z Mnichova.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            BimmerHub spojuje veřejný magazín, vlastní dashboard a API. Uživatelé publikují
            vlastní obsah o modelových řadách BMW, servisu, kupních tipech i galerii.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/articles"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bmw-blue)]"
            >
              Projít články
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Otevřít dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Featured article — full width, no nesting */}
      {featured && (
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                Editorial feed
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Nejčtenější téma týdne
              </h2>
            </div>
            <Link href="/articles" className="shrink-0 text-sm font-semibold text-[var(--bmw-blue)]">
              Všechny články
            </Link>
          </div>
          <Link
            href={`/articles/${featured.slug}`}
            className="surface-card group grid rounded-[32px] md:grid-cols-[1fr_1.2fr]"
          >
            <div className="relative min-h-[240px] bg-slate-200 md:min-h-[320px]">
              {featured.imageUrl ? (
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(135deg,rgba(15,35,65,0.96),rgba(28,105,212,0.9),rgba(210,45,35,0.86))] p-8">
                  <span className="text-5xl font-black uppercase tracking-[0.35em] text-white/90">
                    {featured.series.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-4 p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
                  {featured.series.name}
                </span>
                {featured.tags.slice(0, 2).map((tag) => (
                  <span key={tag.id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    #{tag.name}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-black tracking-tight text-slate-950 transition group-hover:text-[var(--bmw-blue)] lg:text-4xl">
                {featured.title}
              </h3>
              <p className="line-clamp-3 text-base leading-8 text-slate-600">
                {featured.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{featured.author.name || featured.author.email}</span>
                <time dateTime={featured.publishDate.toISOString()}>
                  {new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long' }).format(featured.publishDate)}
                </time>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Series sidebar + latest articles grid */}
      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Čerstvě publikováno
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Poslední články z BimmerHubu
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        <div className="surface-card self-start rounded-[32px] p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Modelové řady
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Prozkoumej BMW podle řady
          </h2>
          <div className="mt-5 space-y-3">
            {series.map((item) => (
              <Link
                key={item.id}
                href={`/articles?series=${item.slug}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950">{item.name}</p>
                  <p className="truncate text-sm text-slate-500">{item.description}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-400">{item._count.articles}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
