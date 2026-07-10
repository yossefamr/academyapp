import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

// GET attendance for the current member (or all for admin)
export async function GET(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');
  const isAdmin = member.role === 'ADMIN' || member.role === 'SUPER_ADMIN';

  const where = isAdmin && memberId ? { memberId } : { memberId: member.id };
  const records = await db.attendance.findMany({
    where,
    orderBy: { checkIn: 'desc' },
    take: 50,
    include: { member: { select: { name: true, photo: true } } },
  });

  return NextResponse.json({ attendance: records });
}

// POST — check-in / check-out by QR scan (admin only)
export async function POST(req: NextRequest) {
  const admin = await getSessionMember();
  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { memberId, action } = await req.json();
  if (!memberId || !action) {
    return NextResponse.json({ error: 'memberId and action required' }, { status: 400 });
  }

  const target = await db.member.findUnique({ where: { id: memberId } });
  if (!target) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  if (action === 'checkin') {
    // find an open session (no checkout) for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const open = await db.attendance.findFirst({
      where: { memberId, checkOut: null, checkIn: { gte: todayStart } },
      orderBy: { checkIn: 'desc' },
    });
    if (open) {
      return NextResponse.json({ error: 'Already checked in today', attendance: open }, { status: 409 });
    }
    const att = await db.attendance.create({ data: { memberId, checkIn: new Date() } });
    return NextResponse.json({ attendance: att, action: 'checkin', member: { name: target.name, photo: target.photo } });
  }

  if (action === 'checkout') {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const open = await db.attendance.findFirst({
      where: { memberId, checkOut: null, checkIn: { gte: todayStart } },
      orderBy: { checkIn: 'desc' },
    });
    if (!open) {
      return NextResponse.json({ error: 'No open session to check out' }, { status: 404 });
    }
    const att = await db.attendance.update({ where: { id: open.id }, data: { checkOut: new Date() } });
    return NextResponse.json({ attendance: att, action: 'checkout', member: { name: target.name, photo: target.photo } });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
