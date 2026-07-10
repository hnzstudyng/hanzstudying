import { NextRequest, NextResponse } from 'next/server';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const decoded = atob(token);
    const [payload, hash] = decoded.split('.');

    if (!payload || !hash) return false;

    // Use Web Crypto API for HMAC
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SESSION_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );

    const hashArray = Array.from(new Uint8Array(signature));
    const expectedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (hash !== expectedHash) return false;

    const data = JSON.parse(payload);

    // Check if session has expired
    if (Date.now() - data.createdAt > SESSION_DURATION) {
      return false;
    }

    return data.authenticated === true;
  } catch (error) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and API calls without session
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for session token
  const token = req.cookies.get('session')?.value;

  if (!token || !(await verifySessionToken(token))) {
    // Redirect to login if accessing protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/articles')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
