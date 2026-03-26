type RichContentProps = {
  content: string
}

export function RichContent({ content }: RichContentProps) {
  return <div className="prose-bimmer" dangerouslySetInnerHTML={{ __html: content }} />
}
