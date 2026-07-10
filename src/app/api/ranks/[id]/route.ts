import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';
import { rankTitleFor } from '@/lib/auth';

// Super admin controls ranking of every member (including admins)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const superAdmin = await getSessionMember();
  if (!superAdmin || superAdmin.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden — super admin only' }, { status: 403 });
  }
  const { id } = await params;
  const { rank, role } = await req.json();

  const data: Record<string, unknown> = {};
  if (rank !== undefined) {
    const r = Math.max(0, Math.min(8, Number(rank)));
    data.rank = r;
    data.rankTitle = rankTitleFor(r);
  }
  if (role !== undefined) {
    if (!['SUPER_ADMIN', 'ADMIN', 'TRAINEE'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    // don't allow demoting yourself
    if (id === superAdmin.id && role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
    }
    data.role = role;
  }

  const updated = await db.member.update({
    where: { id },
    data,
    select: {
      id: true, name: true, photo: true, role: true, rank: true, rankTitle: true,
      skillLevel: true, email: true, phone: true,
    },
  });

  return NextResponse.json({ member: updated });
}
