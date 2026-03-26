import Link from 'next/link'

type PaginationProps = {
  page: number
  totalPages: number
  basePath: string
  query: Record<string, string | undefined>
}

function buildHref(basePath: string, query: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  if (page > 1) {
    params.set('page', String(page))
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

export function Pagination({ page, totalPages, basePath, query }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Strankovani">
      <Link
        href={buildHref(basePath, query, Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          page <= 1
            ? 'pointer-events-none border border-slate-200 text-slate-300'
            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-950'
        }`}
      >
        Predchozi
      </Link>

      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildHref(basePath, query, pageNumber)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            pageNumber === page
              ? 'bg-slate-950 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-950'
          }`}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={buildHref(basePath, query, Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          page >= totalPages
            ? 'pointer-events-none border border-slate-200 text-slate-300'
            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-950'
        }`}
      >
        Dalsi
      </Link>
    </nav>
  )
}
