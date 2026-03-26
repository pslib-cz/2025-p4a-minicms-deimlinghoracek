import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'

import { ArticleCard } from '@/components/public/article-card'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredArticles, latestArticles, series] = await Promise.all([
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      orderBy: [{ publishDate: 'desc' }],
      take: 3,
      include: { author: true, series: true, tags: true },
    }),
    prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      orderBy: [{ publishDate: 'desc' }],
      skip: 3,
      take: 3,
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

  return (
    <div className="space-y-12 pb-8">
      <section className="surface-card relative overflow-hidden rounded-[36px] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
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

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="surface-card rounded-[32px] p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                Editorial feed
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Nejčtenější téma týdne
              </h2>
            </div>
            <Link href="/articles" className="text-sm font-semibold text-[var(--bmw-blue)]">
              Všechny články
            </Link>
          </div>
          {featuredArticles[0] ? <ArticleCard article={featuredArticles[0]} /> : null}
        </div>

        <div className="surface-card rounded-[32px] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Modelové řady
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Prozkoumej BMW podle řady
          </h2>
          <div className="mt-6 space-y-3">
            {series.map((item) => (
              <Link
                key={item.id}
                href={`/articles?series=${item.slug}`}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:-translate-y-0.5"
              >
                <div>
                  <p className="text-lg font-bold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <span className="text-sm font-semibold text-slate-500">{item._count.articles}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Čerstvě publikováno
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Poslední články z BimmerHubu
            </h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  )
}
