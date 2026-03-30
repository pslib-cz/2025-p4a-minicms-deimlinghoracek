'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type RichTextEditorProps = {
  content: string
  onChange: (value: string) => void
}

const toolbarButtonClass =
  'rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950'

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          'prose-bimmer min-h-[280px] rounded-2xl border border-slate-200 bg-white px-4 py-4 focus:outline-none',
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const currentHtml = editor.getHTML()
    if (content !== currentHtml) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Tučně
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Odrážky
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Kroky
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Text
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
