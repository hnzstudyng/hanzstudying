'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/hooks/useArticles';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { articles, isLoading } = useArticles('published', search, selectedTag, selectedCategory);

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));
  const allCategories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Published Articles</h1>
            <p className="text-muted-foreground mt-1">
              {articles.length} article{articles.length !== 1 ? 's' : ''} published
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Article
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">No articles yet</h3>
            <p className="text-muted-foreground mb-6">Create your first article to get started</p>
            <Link href="/dashboard/new">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Create Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
