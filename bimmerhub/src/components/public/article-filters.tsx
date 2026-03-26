import Link from 'next/link'

type FilterOption = {
  slug: string
  name: string
  count: number
}

type ArticleFiltersProps = {
  query?: string
  series?: string
  tag?: string
  seriesOptions: FilterOption[]
  tagOptions: FilterOption[]
}

export function ArticleFilters({
  query,
  series,
  tag,
  seriesOptions,
  tagOptions,
}: ArticleFiltersProps) {
  return (
    <section className="surface-card rounded-[32px] p-6 sm:p-8">
      <form action="/articles" className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Hledat podle názvu, perexu nebo obsahu"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        />
        <select
          name="series"
          defaultValue={series ?? ''}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        >
          <option value="">Všechny řady</option>
          {seriesOptions.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name} ({item.count})
            </option>
          ))}
        </select>
        <select
          name="tag"
          defaultValue={tag ?? ''}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
        >
          <option value="">Všechny tagy</option>
          {tagOptions.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name} ({item.count})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bmw-blue)]"
        >
          Filtrovat
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/articles" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950">
          Reset filtrů
        </Link>
        {seriesOptions.slice(0, 5).map((item) => (
          <Link
            key={item.slug}
            href={`/articles?series=${item.slug}`}
            className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-950"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
