import Image from 'next/image'
import Link from 'next/link'
import { type Article, type Series, type Tag, type User } from '@prisma/client'

type ArticleCardProps = {
  article: Article & {
    author: User
    series: Series
    tags: Tag[]
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="surface-card group flex h-full flex-col rounded-[28px]">
      <Link href={`/articles/${article.slug}`} className="relative block h-56 shrink-0 overflow-hidden bg-slate-200">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,rgba(15,35,65,0.96),rgba(28,105,212,0.9),rgba(210,45,35,0.86))] p-6">
            <span className="text-4xl font-black uppercase tracking-[0.3em] text-white/85">
              {article.series.name}
            </span>
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          <span className="shrink-0 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            {article.series.name}
          </span>
          {article.tags.slice(0, 2).map((tag) => (
            <span key={tag.id} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="min-w-0 space-y-3">
          <Link href={`/articles/${article.slug}`}>
            <h3 className="line-clamp-2 text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-[var(--bmw-blue)]">
              {article.title}
            </h3>
          </Link>
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">{article.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <span className="truncate">{article.author.name || article.author.email}</span>
          <time className="shrink-0" dateTime={article.publishDate.toISOString()}>
            {new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'medium' }).format(article.publishDate)}
          </time>
        </div>
      </div>
    </article>
  )
}
