'use client';

import { useRouter } from 'next/navigation';
import { useArticleActions } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';

export default function NewArticlePage() {
  const router = useRouter();
  const { createArticle, isLoading } = useArticleActions();

  const handleCreateArticle = async () => {
    try {
      const article = await createArticle({
        title: 'Untitled Article',
        content: '',
        description: '',
        tags: [],
        category: 'General',
        status: 'draft',
        wordCount: 0,
        readTime: 0,
      });

      router.push(`/dashboard/articles/${article._id}`);
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <svg className="w-24 h-24 text-accent/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-foreground mb-2">Create New Article</h2>
        <p className="text-muted-foreground mb-8">Start writing your thoughts and ideas</p>
        <Button
          onClick={handleCreateArticle}
          disabled={isLoading}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isLoading ? 'Creating...' : 'Create Article'}
        </Button>
      </div>
    </div>
  );
}
