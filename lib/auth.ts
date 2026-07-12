import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET!;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD!;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  authenticated: boolean;
  createdAt: number;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createSessionToken(data: SessionData): Promise<string> {
  const payload = JSON.stringify(data);
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
  const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return btoa(`${payload}.${hash}`);
}

async function verifySessionToken(token: string): Promise<SessionData | null> {
  try {
    const decoded = atob(token);
    const [payload, hash] = decoded.split('.');

    if (!payload || !hash) return null;

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
  const [inputHash, ownerHash] = await Promise.all([
    hashPassword(password),
    hashPassword(OWNER_PASSWORD),
  ]);
  return inputHash === ownerHash;
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

  return await verifySessionToken(token);
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
