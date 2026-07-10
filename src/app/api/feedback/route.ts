import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionMember } from '@/lib/session';

export async function GET() {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isAdmin = member.role === 'ADMIN' || member.role === 'SUPER_ADMIN';
  const feedback = await db.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: { member: { select: { id: true, name: true, photo: true } } },
    ...(isAdmin ? {} : { where: { memberId: member.id } }),
  });

  return NextResponse.json({
    feedback: feedback.map((f) => ({
      id: f.id,
      memberId: f.memberId,
      memberName: f.member.name,
      memberPhoto: f.member.photo,
      rating: f.rating,
      comment: f.comment,
      category: f.category,
      createdAt: f.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rating, comment, category } = await req.json();
  const r = Math.max(1, Math.min(5, Number(rating) || 0));
  if (r < 1) return NextResponse.json({ error: 'Rating required' }, { status: 400 });
  if (!comment || !String(comment).trim()) {
    return NextResponse.json({ error: 'Comment required' }, { status: 400 });
  }

  const fb = await db.feedback.create({
    data: {
      memberId: member.id,
      rating: r,
      comment: String(comment).slice(0, 1000),
      category: String(category || 'general'),
    },
    include: { member: { select: { name: true, photo: true } } },
  });

  return NextResponse.json({
    feedback: {
      id: fb.id,
      memberId: fb.memberId,
      memberName: fb.member.name,
      memberPhoto: fb.member.photo,
      rating: fb.rating,
      comment: fb.comment,
      category: fb.category,
      createdAt: fb.createdAt,
    },
  });
}
