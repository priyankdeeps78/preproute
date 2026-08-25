import Highlight from '@tiptap/extension-highlight'
import ImageExtension from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import type { ChangeEvent, ReactNode } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  onDelete?: () => void
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={disabled ? `${title} (coming soon)` : title}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-lg text-ink-700 hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-ink-300',
        active && 'bg-primary-50 text-primary-600',
      )}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onDelete,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Highlight,
      TextAlign.configure({ types: ['paragraph'] }),
      ImageExtension,
      Placeholder.configure({ placeholder: placeholder ?? 'Type here' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none px-4 py-3 text-sm' },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML() && document.activeElement?.closest('.tiptap-root') === null) {
      editor.commands.setContent(value || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!editor) return null

  function handleImagePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      editor?.chain().focus().setImage({ src: String(reader.result) }).run()
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function handleLink() {
    const url = window.prompt('Enter URL')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="tiptap-root overflow-hidden rounded-xl border border-ink-300/60 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ink-300/60 px-2 py-1.5">
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em className="text-sm">I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong className="text-sm">B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="text-sm underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Link" onClick={handleLink}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-2.5-.5a3 3 0 013-3H10a1 1 0 110 2H8.5a1 1 0 100 2H10a1 1 0 110 2H8.5a3 3 0 01-3-3zm9-3H13a1 1 0 100 2h1.5a1 1 0 010 2H13a1 1 0 100 2h1.5a3 3 0 000-6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <span className="h-3.5 w-3.5 rounded-sm bg-accent-amber-600" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-ink-300/60" />
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M3 4h14v2H3V4zm0 5h9v2H3V9zm0 5h14v2H3v-2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M3 4h14v2H3V4zm3 5h8v2H6V9zm-3 5h14v2H3v-2z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M4 5.5a1 1 0 110-2 1 1 0 010 2zm3-1h9v1H7v-1zm-3 6.5a1 1 0 110-2 1 1 0 010 2zm3-1h9v1H7v-1zm-3 6.5a1 1 0 110-2 1 1 0 010 2zm3-1h9v1H7v-1z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Table" disabled>
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M3 4h14v12H3V4zm2 2v3h4V6H5zm6 0v3h4V6h-4zm-6 5v3h4v-3H5zm6 0v3h4v-3h-4z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm1 10h10l-3.2-4-2.3 3-1.5-2L5 14zm2-6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Formula" disabled>
          <span className="text-xs font-semibold italic">fx</span>
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImagePick}
        />
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M7 3h6l1 2h4v2H2V5h4l1-2zm-2 6h2v8H5V9zm4 0h2v8H9V9zm4 0h2v8h-2V9z" />
            </svg>
          </button>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
