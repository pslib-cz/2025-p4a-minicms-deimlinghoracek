'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleStatus } from '@prisma/client'
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Spinner, Textarea } from '@nextui-org/react'

import { RichTextEditor } from '@/components/dashboard/rich-text-editor'
import { slugify } from '@/lib/slug'

type MetaResponse = {
  series: Array<{ id: string; name: string }>
  tags: Array<{ id: string; name: string }>
}

type ArticleEditorProps = {
  articleId?: string
}

type FormState = {
  title: string
  slug: string
  description: string
  content: string
  imageUrl: string
  status: ArticleStatus
  publishDate: string
  seriesId: string
  seoTitle: string
  seoDescription: string
  tags: string
}

const initialContent =
  '<h2>Úvod</h2><p>Sem napiš úvod ke článku o BMW. Popis jízdních dojmů, techniky a praktických zkušeností.</p>'

const initialFormState: FormState = {
  title: '',
  slug: '',
  description: '',
  content: initialContent,
  imageUrl: '',
  status: ArticleStatus.DRAFT,
  publishDate: new Date().toISOString().slice(0, 16),
  seriesId: '',
  seoTitle: '',
  seoDescription: '',
  tags: 'review, bmw',
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter()
  const [meta, setMeta] = useState<MetaResponse>({ series: [], tags: [] })
  const [form, setForm] = useState<FormState>(initialFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugLocked, setSlugLocked] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [metaResponse, articleResponse] = await Promise.all([
          fetch('/api/dashboard/meta', { cache: 'no-store' }),
          articleId
            ? fetch(`/api/dashboard/articles/${articleId}`, { cache: 'no-store' })
            : Promise.resolve(null),
        ])

        if (!metaResponse.ok) {
          throw new Error('Nepodařilo se načíst metadata formuláře.')
        }

        const metaData: MetaResponse = await metaResponse.json()
        setMeta(metaData)

        if (articleResponse) {
          if (!articleResponse.ok) {
            throw new Error('Nepodařilo se načíst článek k editaci.')
          }

          const { article } = await articleResponse.json()
          setForm({
            title: article.title,
            slug: article.slug,
            description: article.description,
            content: article.content,
            imageUrl: article.imageUrl || '',
            status: article.status,
            publishDate: new Date(article.publishDate).toISOString().slice(0, 16),
            seriesId: article.seriesId,
            seoTitle: article.seoTitle || '',
            seoDescription: article.seoDescription || '',
            tags: article.tags.map((tag: { name: string }) => tag.name).join(', '),
          })
          setSlugLocked(true)
        } else if (metaData.series[0]) {
          setForm((current) => ({
            ...current,
            seriesId: current.seriesId || metaData.series[0].id,
            tags: current.tags || metaData.tags.slice(0, 2).map((tag) => tag.name).join(', '),
          }))
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Nepodařilo se připravit formulář.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [articleId])

  const tagSuggestions = useMemo(
    () => meta.tags.slice(0, 8).map((tag) => tag.name).join(', '),
    [meta.tags],
  )

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value }

      if (key === 'title' && !slugLocked) {
        next.slug = slugify(String(value))
      }

      return next
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      publishDate: new Date(form.publishDate).toISOString(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    const response = await fetch(articleId ? `/api/dashboard/articles/${articleId}` : '/api/dashboard/articles', {
      method: articleId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => null)
    setSaving(false)

    if (!response.ok) {
      const fieldErrors = data?.issues?.fieldErrors
      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors).flat().find(Boolean)
        : undefined

      setError(firstFieldError || data?.error || 'Uložení se nepodařilo.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    )
  }

  return (
    <form className="dashboard-grid" onSubmit={handleSubmit}>
      <Card className="rounded-[32px] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/60">
        <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            {articleId ? 'Editace článku' : 'Nový článek'}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {articleId ? 'Upravit BMW obsah' : 'Vytvořit BMW článek'}
          </h1>
        </CardHeader>
        <CardBody className="space-y-5 px-6 pb-6">
          <Input
            label="Titulek"
            value={form.title}
            onValueChange={(value) => updateField('title', value)}
            variant="bordered"
            isRequired
          />
          <Input
            label="Slug"
            value={form.slug}
            onValueChange={(value) => {
              setSlugLocked(true)
              updateField('slug', slugify(value))
            }}
            variant="bordered"
            isRequired
          />
          <Textarea
            label="Perex / popis"
            value={form.description}
            onValueChange={(value) => updateField('description', value)}
            minRows={3}
            variant="bordered"
            isRequired
          />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Obsah článku</label>
            <RichTextEditor
              content={form.content}
              onChange={(value) => updateField('content', value)}
            />
          </div>
          <Input
            label="Obrázek URL"
            value={form.imageUrl}
            onValueChange={(value) => updateField('imageUrl', value)}
            variant="bordered"
          />
          <Textarea
            label="SEO title"
            value={form.seoTitle}
            onValueChange={(value) => updateField('seoTitle', value)}
            minRows={2}
            variant="bordered"
          />
          <Textarea
            label="SEO description"
            value={form.seoDescription}
            onValueChange={(value) => updateField('seoDescription', value)}
            minRows={3}
            variant="bordered"
          />
        </CardBody>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[32px] border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/60">
          <CardHeader className="px-6 pt-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950">Publikace</h2>
          </CardHeader>
          <CardBody className="space-y-4 px-6 pb-6">
            <Select
              label="Status"
              selectedKeys={[form.status]}
              onSelectionChange={(keys) =>
                updateField('status', Array.from(keys)[0] as ArticleStatus)
              }
              variant="bordered"
            >
              <SelectItem key={ArticleStatus.DRAFT}>Draft</SelectItem>
              <SelectItem key={ArticleStatus.PUBLISHED}>Published</SelectItem>
            </Select>
            <Input
              label="Datum publikace"
              type="datetime-local"
              value={form.publishDate}
              onValueChange={(value) => updateField('publishDate', value)}
              variant="bordered"
              isRequired
            />
            <Select
              label="Modelová řada"
              selectedKeys={form.seriesId ? [form.seriesId] : []}
              onSelectionChange={(keys) => updateField('seriesId', String(Array.from(keys)[0] || ''))}
              variant="bordered"
              isRequired
            >
              {meta.series.map((series) => (
                <SelectItem key={series.id}>{series.name}</SelectItem>
              ))}
            </Select>
            <Textarea
              label="Tagy"
              value={form.tags}
              onValueChange={(value) => updateField('tags', value)}
              description={`Odděl čárkou. Nápověda: ${tagSuggestions || 'review, servis, m-performance'}`}
              minRows={3}
              variant="bordered"
              isRequired
            />
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
            <div className="flex gap-3">
              <Button color="primary" type="submit" isLoading={saving} className="flex-1">
                {articleId ? 'Uložit změny' : 'Vytvořit článek'}
              </Button>
              <Button variant="bordered" type="button" onPress={() => router.push('/dashboard')}>
                Zpět
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </form>
  )
}
