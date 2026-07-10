import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  authenticated: boolean;
  createdAt: number;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSessionToken(data: SessionData): string {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(payload);
  const hash = hmac.digest('hex');
  return Buffer.from(`${payload}.${hash}`).toString('base64');
}

function verifySessionToken(token: string): SessionData | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [payload, hash] = decoded.split('.');

    if (!payload || !hash) return null;

    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(payload);
    const expectedHash = hmac.digest('hex');

    if (hash !== expectedHash) return null;

    const data = JSON.parse(payload);

    // Check if session has expired
    if (Date.now() - data.createdAt > SESSION_DURATION) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  return hashPassword(password) === hashPassword(OWNER_PASSWORD);
}

export async function createSession(): Promise<string> {
  const sessionData: SessionData = {
    authenticated: true,
    createdAt: Date.now(),
  };
  return createSessionToken(sessionData);
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
