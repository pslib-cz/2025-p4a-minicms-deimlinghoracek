import { ArticleEditor } from '@/components/dashboard/article-editor'

type EditArticlePageProps = {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params

  return <ArticleEditor articleId={id} />
}
