'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArticle, useArticleActions } from '@/hooks/useArticles';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [paramId, setParamId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [tagInput, setTagInput] = useState('');

  const router = useRouter();

  useEffect(() => {
    params.then((p) => setParamId(p.id));
  }, [params]);

  const { article, isLoading } = useArticle(paramId || '');
  const { updateArticle, isLoading: isUpdating } = useArticleActions();

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setDescription(article.description);
      setContent(article.content);
      setTags(article.tags);
      setCategory(article.category);
      setStatus(article.status);
    }
  }, [article]);

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!paramId) return;
    setIsSaving(true);

    try {
      await updateArticle(paramId, {
        title: title || 'Untitled Article',
        description,
        content,
        tags,
        category,
        status: newStatus || status,
      });

      setAutoSaveMessage('Saved successfully');
      setTimeout(() => setAutoSaveMessage(''), 3000);

      if (newStatus === 'published' && status === 'draft') {
        setStatus('published');
      }
    } catch (error) {
      setAutoSaveMessage('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card p-6 flex items-center justify-between">
        <div className="flex-1">
          <button
            onClick={() => router.back()}
            className="text-accent hover:text-accent/80 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            className="text-3xl font-bold text-foreground bg-transparent outline-none w-full"
          />
        </div>

        <div className="flex gap-3">
          {autoSaveMessage && (
            <span className="text-sm text-muted-foreground my-auto">{autoSaveMessage}</span>
          )}
          {status === 'draft' && (
            <Button
              onClick={() => handleSave('published')}
              disabled={isSaving || isUpdating}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isUpdating ? 'Publishing...' : 'Publish'}
            </Button>
          )}
          <Button
            onClick={() => handleSave()}
            disabled={isSaving || isUpdating}
            variant="outline"
          >
            {isSaving || isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of your article..."
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={2}
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Technology, Personal"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-input border border-border rounded-lg mb-2 min-h-12">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
