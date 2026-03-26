import type { Metadata } from 'next'

import { ArticleCard } from '@/components/public/article-card'
import { ArticleFilters } from '@/components/public/article-filters'
import { Pagination } from '@/components/public/pagination'
import { getPublicArticlePage } from '@/lib/articles'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

type ArticlesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  searchParams,
}: ArticlesPageProps): Promise<Metadata> {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : undefined
  const title = query ? `Vyhledavani: ${query}` : 'Clanky o BMW'

  return {
    title,
    description:
      'Seznam publikovanych clanku o BMW. Vyhledavani, filtry podle tagu a modelovych rad i strankovani.',
    alternates: {
      canonical: query ? `/articles?q=${encodeURIComponent(query)}` : '/articles',
    },
    openGraph: {
      title,
      description:
        'Prochazej recenze, navody a kupni pruvodce o BMW se server-side filtrovani a strankovanim.',
      url: absoluteUrl('/articles'),
    },
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : undefined
  const series = typeof params.series === 'string' ? params.series : undefined
  const tag = typeof params.tag === 'string' ? params.tag : undefined
  const page = typeof params.page === 'string' ? Number.parseInt(params.page, 10) || 1 : 1

  const result = await getPublicArticlePage({ query, series, tag, page })

  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Verejna cast
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Publikovany obsah o BMW
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Verejny listing bezi na server components a podporuje fulltextove vyhledavani,
          filtrovani podle rad a tagu i strankovani publikovaneho obsahu.
        </p>
      </section>

      <ArticleFilters
        query={query}
        series={series}
        tag={tag}
        seriesOptions={result.series.map((item) => ({
          slug: item.slug,
          name: item.name,
          count: item._count.articles,
        }))}
        tagOptions={result.tags.map((item) => ({
          slug: item.slug,
          name: item.name,
          count: item._count.articles,
        }))}
      />

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Nalezeno <strong className="text-slate-950">{result.totalItems}</strong>{' '}
            publikovanych clanku
          </p>
          <p className="text-sm text-slate-500">
            Strana {result.page} z {result.totalPages}
          </p>
        </div>

        {result.items.length === 0 ? (
          <div className="surface-card rounded-[32px] p-10 text-center">
            <h2 className="text-2xl font-black text-slate-950">Zadne clanky neodpovidaji filtru</h2>
            <p className="mt-3 text-slate-600">
              Zkus upravit hledani nebo resetovat filtry a zobrazit vsechny publikovane prispevky.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {result.items.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          basePath="/articles"
          query={{ q: query, series, tag }}
        />
      </section>
    </div>
  )
}
