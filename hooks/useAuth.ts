import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();

  const login = useCallback(
    async (password: string) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Login failed');
        }

        router.push('/dashboard');
        return true;
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  return { login, logout };
}
