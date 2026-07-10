import { NextResponse } from 'next/server';
import { getSessionMember } from '@/lib/session';

export async function GET() {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ member: null });
  return NextResponse.json({ member });
}
