import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

// POST { code } -> smart toggle check-in / check-out by scanning a trainee QR code
export async function POST(req: NextRequest) {
  const admin = await getSessionMember();
  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: 'QR code required' }, { status: 400 });

  // code format: "LYC:<memberId>"
  const memberId = String(code).startsWith('LYC:') ? String(code).slice(4) : String(code);

  const target = await db.member.findUnique({ where: { id: memberId } });
  if (!target) return NextResponse.json({ error: 'Invalid QR — member not found' }, { status: 404 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const open = await db.attendance.findFirst({
    where: { memberId, checkOut: null, checkIn: { gte: todayStart } },
    orderBy: { checkIn: 'desc' },
  });

  if (open) {
    // check-out
    const att = await db.attendance.update({
      where: { id: open.id },
      data: { checkOut: new Date() },
    });
    const duration = Math.round((att.checkOut!.getTime() - att.checkIn.getTime()) / 60000);
    return NextResponse.json({
      action: 'checkout',
      attendance: att,
      member: { id: target.id, name: target.name, photo: target.photo, rankTitle: target.rankTitle },
      durationMin: duration,
      checkIn: att.checkIn,
      checkOut: att.checkOut,
    });
  }

  // check-in
  const att = await db.attendance.create({ data: { memberId, checkIn: new Date() } });
  return NextResponse.json({
    action: 'checkin',
    attendance: att,
    member: { id: target.id, name: target.name, photo: target.photo, rankTitle: target.rankTitle },
    checkIn: att.checkIn,
    checkOut: null,
  });
}
