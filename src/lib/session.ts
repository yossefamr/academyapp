import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const SECRET = process.env.SESSION_SECRET || 'lycans-fight-club-secret-2026';
const COOKIE_NAME = 'lycans_session';

function sign(payload: string): string {
  const mac = createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${mac}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf('.');
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = createHmac('sha256', SECRET).update(payload).digest('hex');
  const a = Buffer.from(mac, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  return payload;
}

export async function createSession(memberId: string) {
  const token = sign(memberId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionMember() {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const memberId = verify(token);
    if (!memberId) return null;
    const member = await db.member.findUnique({ where: { id: memberId } });
    if (!member) return null;
    const { password, ...safe } = member;
    return safe;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const member = await getSessionMember();
  if (!member) {
    throw new Error('UNAUTHORIZED');
  }
  return member;
}

export async function requireAdmin() {
  const member = await requireAuth();
  if (member.role !== 'ADMIN' && member.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return member;
}

export async function requireSuperAdmin() {
  const member = await requireAuth();
  if (member.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return member;
}

export function memberToDTO(m: any) {
  const { password, ...safe } = m;
  return safe;
}
