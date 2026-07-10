import useSWR from 'swr';
import { useState, useCallback } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Article {
  _id: string;
  title: string;
  content: string;
  description: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  wordCount: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export function useArticles(
  status: 'draft' | 'published' | 'all' = 'all',
  search?: string,
  tag?: string,
  category?: string
) {
  const params = new URLSearchParams();
  if (status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  if (tag) params.append('tag', tag);
  if (category) params.append('category', category);

  const { data, error, mutate } = useSWR<Article[]>(
    `/api/articles?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    articles: data || [],
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  };
}

export function useArticle(id: string) {
  const { data, error, mutate } = useSWR<Article>(
    id ? `/api/articles/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    article: data,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  };
}

export function useArticleActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = useCallback(
    async (article: Omit<Article, '_id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article),
        });

        if (!res.ok) throw new Error('Failed to create article');

        return await res.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateArticle = useCallback(
    async (id: string, article: Partial<Article>) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article),
        });

        if (!res.ok) throw new Error('Failed to update article');

        return await res.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteArticle = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete article');

      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    isLoading,
    error,
  };
}
