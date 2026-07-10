'use client';

import Link from 'next/link';
import { Article } from '@/hooks/useArticles';

export default function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/dashboard/articles/${article._id}`}>
      <div className="group bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {article.description || 'No description'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{date}</span>
            <span>{article.readTime} min read</span>
            <span>{article.wordCount} words</span>
          </div>
          {article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
