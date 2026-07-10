import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

export async function GET() {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Non-admins can only read when room is open
  const room = await db.chatRoom.findUnique({ where: { id: 'main' } });
  const isAdmin = member.role === 'ADMIN' || member.role === 'SUPER_ADMIN';
  if (!isAdmin && !room?.isOpen) {
    return NextResponse.json({ messages: [], room, closed: true });
  }

  const messages = await db.message.findMany({
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: {
      member: {
        select: { id: true, name: true, photo: true, role: true },
      },
    },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      memberId: m.memberId,
      memberName: m.member.name,
      memberPhoto: m.member.photo,
      memberRole: m.member.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
    room,
  });
}

export async function POST(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const room = await db.chatRoom.findUnique({ where: { id: 'main' } });
  const isAdmin = member.role === 'ADMIN' || member.role === 'SUPER_ADMIN';
  if (!isAdmin && !room?.isOpen) {
    return NextResponse.json({ error: 'Chat is closed by the coach' }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  }
  const msg = await db.message.create({
    data: { memberId: member.id, content: String(content).slice(0, 1000) },
    include: { member: { select: { name: true, photo: true, role: true } } },
  });

  return NextResponse.json({
    message: {
      id: msg.id,
      memberId: msg.memberId,
      memberName: msg.member.name,
      memberPhoto: msg.member.photo,
      memberRole: msg.member.role,
      content: msg.content,
      createdAt: msg.createdAt,
    },
  });
}
