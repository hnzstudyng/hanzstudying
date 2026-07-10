import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [payload, hash] = decoded.split('.');

    if (!payload || !hash) return false;

    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(payload);
    const expectedHash = hmac.digest('hex');

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and API calls without session
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for session token
  const token = req.cookies.get('session')?.value;

  if (!token || !verifySessionToken(token)) {
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
