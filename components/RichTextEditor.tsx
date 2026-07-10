'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const clearFormatting = () => editor.chain().focus().clearNodes().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  const Toolbar = () => (
    <div className="border-b border-border bg-secondary/30 p-3 flex flex-wrap gap-1 rounded-t-lg">
      <ToolbarButton
        onClick={toggleHeading1}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleHeading2}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={toggleBold}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleItalic}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleStrike}
        active={editor.isActive('strike')}
        title="Strike"
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleCode}
        active={editor.isActive('code')}
        title="Inline Code"
      >
        {'<>'}
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={toggleBulletList}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="1.5" />
          <circle cx="6" cy="12" r="1.5" />
          <circle cx="6" cy="18" r="1.5" />
          <path d="M10 6h8M10 12h8M10 18h8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleOrderedList}
        active={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <text x="6" y="8" fontSize="8">1</text>
          <text x="6" y="14" fontSize="8">2</text>
          <text x="6" y="20" fontSize="8">3</text>
          <path d="M10 6h8M10 12h8M10 18h8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleBlockquote}
        active={editor.isActive('blockquote')}
        title="Blockquote"
      >
        {'"'}
      </ToolbarButton>
      <ToolbarButton
        onClick={toggleCodeBlock}
        active={editor.isActive('codeBlock')}
        title="Code Block"
      >
        {'{}'}
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={clearFormatting}
        title="Clear Formatting"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        onClick={undo}
        title="Undo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v3m-9-17v2.5A2.5 2.5 0 013 10" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={redo}
        title="Redo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v3m9-17v2.5A2.5 2.5 0 0121 10" />
        </svg>
      </ToolbarButton>
    </div>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Toolbar />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none dark:prose-invert p-4 min-h-96 bg-input text-foreground focus:outline-none"
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors text-sm font-medium ${
        active
          ? 'bg-accent text-accent-foreground'
          : 'bg-card hover:bg-secondary text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-border mx-1" />;
}
