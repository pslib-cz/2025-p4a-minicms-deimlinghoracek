import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Modelove rady BMW',
  description: 'Prehled modelovych rad BMW pouzitych pro kategorizaci publikovaneho obsahu.',
}

export const dynamic = 'force-dynamic'

export default async function SeriesPage() {
  const series = await prisma.series.findMany({
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
  })

  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Kategorizace
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          BMW modelove rady
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Kazdy clanek je zarazen do konkretni modelove rady. Tahle sekce ukazuje prehled 1:N
          vztahu mezi radou BMW a publikovanym obsahem.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {series.map((item) => (
          <Link
            key={item.id}
            href={`/articles?series=${item.slug}`}
            className="surface-card rounded-[30px] p-7 transition hover:-translate-y-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              {item._count.articles} publikovanych clanku
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{item.name}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            <span className="mt-6 inline-flex text-sm font-semibold text-[var(--bmw-blue)]">
              Zobrazit clanky
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
