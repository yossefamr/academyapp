import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, RANK_TITLES } from '@/lib/auth';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    const existing = await db.member.findUnique({ where: { email: String(email).toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const member = await db.member.create({
      data: {
        name: String(name),
        email: String(email).toLowerCase(),
        password: hashPassword(password),
        phone: String(phone || ''),
        role: 'TRAINEE',
        skillLevel: 'NOVICE',
        rank: 0,
        rankTitle: RANK_TITLES[0],
        photo: '/trainees/trainee1.svg',
        discipline: 'MMA',
      },
    });
    await createSession(member.id);
    const { password: _p, ...safe } = member;
    return NextResponse.json({ member: safe });
  } catch {
    return NextResponse.json({ error: 'Sign-up failed' }, { status: 500 });
  }
}
