'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react'

type DashboardArticle = {
  id: string
  title: string
  slug: string
  status: ArticleStatus
  publishDate: string
  updatedAt: string
  series: { name: string }
  tags: Array<{ id: string; name: string }>
}

type DashboardResponse = {
  items: DashboardArticle[]
  page: number
  totalPages: number
  totalItems: number
}

export function DashboardArticles() {
  const [status, setStatus] = useState<'ALL' | ArticleStatus>('ALL')
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadArticles = useCallback(
    async (nextPage = page, nextStatus = status) => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/dashboard/articles?page=${nextPage}&status=${nextStatus}`,
          { cache: 'no-store' },
        )

        if (!response.ok) {
          throw new Error('Nepodarilo se nacist tvoje clanky.')
        }

        const result = (await response.json()) as DashboardResponse
        setData(result)
        setPage(result.page)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error ? caughtError.message : 'Neco se pokazilo pri nacitani.',
        )
      } finally {
        setLoading(false)
      }
    },
    [page, status],
  )

  useEffect(() => {
    void loadArticles(1, status)
  }, [loadArticles, status])

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Opravdu chces clanek smazat?')

    if (!confirmed) {
      return
    }

    const response = await fetch(`/api/dashboard/articles/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      setError('Clanek se nepodarilo smazat.')
      return
    }

    await loadArticles()
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[32px] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/60">
        <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Sprava vlastniho obsahu
            </h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Select
              label="Status"
              selectedKeys={[status]}
              onSelectionChange={(keys) =>
                setStatus(String(Array.from(keys)[0] || 'ALL') as 'ALL' | ArticleStatus)
              }
              className="min-w-[180px]"
              variant="bordered"
            >
              <SelectItem key="ALL">Vsechno</SelectItem>
              <SelectItem key={ArticleStatus.DRAFT}>Draft</SelectItem>
              <SelectItem key={ArticleStatus.PUBLISHED}>Published</SelectItem>
            </Select>
            <Button as={Link} href="/dashboard/articles/new" color="primary">
              Novy clanek
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-5 px-6 pb-6">
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <p className="text-sm font-medium text-danger">{error}</p>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid gap-4">
                {data.items.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip
                            color={
                              article.status === ArticleStatus.PUBLISHED ? 'primary' : 'default'
                            }
                          >
                            {article.status}
                          </Chip>
                          <Chip variant="flat">{article.series.name}</Chip>
                          {article.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag.id} variant="bordered">
                              {tag.name}
                            </Chip>
                          ))}
                        </div>
                        <div>
                          <h2 className="text-xl font-black tracking-tight text-slate-950">
                            {article.title}
                          </h2>
                          <p className="text-sm text-slate-500">/{article.slug}</p>
                        </div>
                        <p className="text-sm text-slate-500">
                          Publikace:{' '}
                          {new Intl.DateTimeFormat('cs-CZ', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }).format(new Date(article.publishDate))}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          as={Link}
                          href={`/dashboard/articles/${article.id}/edit`}
                          variant="bordered"
                        >
                          Editovat
                        </Button>
                        <Button as={Link} href={`/articles/${article.slug}`} variant="flat">
                          Detail
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={() => handleDelete(article.id)}
                        >
                          Smazat
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Celkem {data.totalItems} clanku</p>
                <Pagination
                  page={page}
                  total={data.totalPages}
                  onChange={(nextPage) => {
                    setPage(nextPage)
                    void loadArticles(nextPage, status)
                  }}
                />
              </div>
            </>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Zatim nemas zadny clanek
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Vytvor prvni recenzi, navod nebo kupni pruvodce a odesli ho pres vlastni API.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
