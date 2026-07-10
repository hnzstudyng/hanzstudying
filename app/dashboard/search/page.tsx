'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/hooks/useArticles';
import ArticleCard from '@/components/ArticleCard';

export default function SearchPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-6">Search Articles</h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <svg className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles by title, content, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tag
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              Found {articles.length} article{articles.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
