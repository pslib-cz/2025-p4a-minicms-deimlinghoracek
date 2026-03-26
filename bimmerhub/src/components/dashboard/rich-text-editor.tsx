'use client'

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
          'min-h-[280px] rounded-2xl border border-slate-200 bg-white px-4 py-4 focus:outline-none',
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML())
    },
  })

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
          Bold
        </button>
        <button
          type="button"
          className={toolbarButtonClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Odrzky
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
