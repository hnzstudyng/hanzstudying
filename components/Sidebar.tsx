'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full p-6">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">Notes</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5l3-3m0 0l3 3m-3-3v12" />
          </svg>
          Dashboard
        </Link>

        <Link
          href="/dashboard/new"
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>

        <Link
          href="/dashboard/drafts"
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Drafts
        </Link>

        <Link
          href="/dashboard/search"
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </Link>
      </nav>

      {/* Logout */}
      <div className="space-y-3 border-t border-border pt-6">
        <Button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm font-medium"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
