import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';
import { SKILL_ORDER, skillIndex, rankTitleFor } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const target = await db.member.findUnique({
    where: { id },
    select: {
      id: true, email: true, name: true, phone: true, photo: true, role: true,
      skillLevel: true, rank: true, rankTitle: true, bio: true,
      weightClass: true, discipline: true, joinedAt: true, updatedAt: true,
    },
  });
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const attendance = await db.attendance.findMany({
    where: { memberId: id },
    orderBy: { checkIn: 'desc' },
    take: 30,
  });

  return NextResponse.json({ member: target, attendance, attendanceCount: attendance.length });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getSessionMember();
  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  const allowed = ['name', 'phone', 'photo', 'bio', 'weightClass', 'discipline', 'skillLevel', 'rank', 'rankTitle', 'role'];

  // Super admin can change role & rank of admins; admin can edit trainee skillLevel/details
  for (const key of allowed) {
    if (key in body) {
      // role changes only by super admin
      if (key === 'role' && admin.role !== 'SUPER_ADMIN') continue;
      if (key === 'rank' || key === 'rankTitle') {
        if (admin.role !== 'SUPER_ADMIN') continue;
      }
      data[key] = body[key];
    }
  }

  if (data.skillLevel !== undefined) {
    const idx = SKILL_ORDER.indexOf(data.skillLevel as string);
    if (idx === -1) delete data.skillLevel;
  }
  if (data.rank !== undefined) {
    const r = Math.max(0, Math.min(8, Number(data.rank)));
    data.rank = r;
    data.rankTitle = rankTitleFor(r);
  }

  const updated = await db.member.update({
    where: { id },
    data,
    select: {
      id: true, email: true, name: true, phone: true, photo: true, role: true,
      skillLevel: true, rank: true, rankTitle: true, bio: true,
      weightClass: true, discipline: true, joinedAt: true, updatedAt: true,
    },
  });
  return NextResponse.json({ member: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getSessionMember();
  if (!admin || admin.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  await db.member.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
