import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="surface-card max-w-2xl rounded-[32px] p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Tahle zatáčka nikam nevede
        </h1>
        <p className="mt-4 text-slate-600">
          Hledaná stránka neexistuje nebo už nebyla publikována. Vrať se zpět do veřejné části.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Domů
          </Link>
          <Link
            href="/articles"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Všechny články
          </Link>
        </div>
      </div>
    </div>
  )
}
