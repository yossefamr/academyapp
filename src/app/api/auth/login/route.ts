import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const member = await db.member.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!member || !verifyPassword(password, member.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    await createSession(member.id);
    const { password: _p, ...safe } = member;
    return NextResponse.json({ member: safe });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
