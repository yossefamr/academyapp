import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

export async function GET() {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isAdmin = member.role === 'ADMIN' || member.role === 'SUPER_ADMIN';
  const where = isAdmin ? {} : { id: member.id };

  const members = await db.member.findMany({
    where,
    orderBy: [{ rank: 'desc' }, { skillLevel: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      photo: true,
      role: true,
      skillLevel: true,
      rank: true,
      rankTitle: true,
      bio: true,
      weightClass: true,
      discipline: true,
      joinedAt: true,
      updatedAt: true,
    },
  });

  // attach attendance counts
  const withCounts = await Promise.all(
    members.map(async (m) => {
      const attendanceCount = await db.attendance.count({ where: { memberId: m.id } });
      return { ...m, attendanceCount };
    })
  );

  return NextResponse.json({ members: withCounts });
}
