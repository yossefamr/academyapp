import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

export async function GET() {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const room = await db.chatRoom.findUnique({ where: { id: 'main' } });
  return NextResponse.json({ room });
}

// PATCH — admin opens/closes the group chat
export async function PATCH(req: NextRequest) {
  const admin = await getSessionMember();
  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { isOpen } = await req.json();
  const room = await db.chatRoom.update({
    where: { id: 'main' },
    data: {
      isOpen: !!isOpen,
      openedBy: isOpen ? admin.id : null,
      openedAt: isOpen ? new Date() : null,
    },
  });
  return NextResponse.json({ room });
}
