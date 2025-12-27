import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { BubbleMenu } from '@tiptap/react'
import {
  TextBolder,
  TextItalic,
  ListBullets,
  ListNumbers,
  Quotes,
  TextHOne,
  TextHTwo,
} from 'phosphor-react'
import { useEffect } from 'react'
import clsx from 'clsx'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sapphire max-w-none focus:outline-none min-h-[200px] px-6 py-4',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-sapphire-200 rounded-xl overflow-hidden bg-white">
      {editable && (
        <>
          {/* Toolbar */}
          <div className="border-b border-sapphire-200 bg-vapor/30 px-4 py-2 flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('bold') && 'bg-white text-teal'
              )}
              title="Bold"
            >
              <TextBolder size={20} weight="bold" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('italic') && 'bg-white text-teal'
              )}
              title="Italic"
            >
              <TextItalic size={20} weight="bold" />
            </button>
            <div className="w-px h-6 bg-sapphire-200 mx-2" />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('heading', { level: 1 }) && 'bg-white text-teal'
              )}
              title="Heading 1"
            >
              <TextHOne size={20} weight="bold" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('heading', { level: 2 }) && 'bg-white text-teal'
              )}
              title="Heading 2"
            >
              <TextHTwo size={20} weight="bold" />
            </button>
            <div className="w-px h-6 bg-sapphire-200 mx-2" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('bulletList') && 'bg-white text-teal'
              )}
              title="Bullet List"
            >
              <ListBullets size={20} weight="bold" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('orderedList') && 'bg-white text-teal'
              )}
              title="Numbered List"
            >
              <ListNumbers size={20} weight="bold" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={clsx(
                'p-2 rounded-lg hover:bg-white transition-colors',
                editor.isActive('blockquote') && 'bg-white text-teal'
              )}
              title="Quote"
            >
              <Quotes size={20} weight="bold" />
            </button>
          </div>

          {/* Bubble Menu */}
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bg-sapphire-900 text-white rounded-lg shadow-xl flex items-center gap-1 p-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={clsx(
                  'p-2 rounded hover:bg-sapphire-800 transition-colors',
                  editor.isActive('bold') && 'bg-sapphire-800'
                )}
              >
                <TextBolder size={16} weight="bold" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={clsx(
                  'p-2 rounded hover:bg-sapphire-800 transition-colors',
                  editor.isActive('italic') && 'bg-sapphire-800'
                )}
              >
                <TextItalic size={16} weight="bold" />
              </button>
            </div>
          </BubbleMenu>
        </>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
