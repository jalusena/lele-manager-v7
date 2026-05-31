export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
export async function GET(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const pondId = searchParams.get('pondId')
  const feeds = await prisma.feed.findMany({
    where: pondId ? { pondId, pond: { userId: user.id } } : { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { feedDate: 'desc' },
  })
  return NextResponse.json(feeds)
}
export async function POST(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const feed = await prisma.feed.create({
    data: {
      pondId: body.pondId, feedName: body.feedName,
      feedWeight: parseFloat(body.feedWeight), price: parseFloat(body.price),
      feedDate: new Date(body.feedDate), notes: body.notes ?? null,
    },
  })
  return NextResponse.json(feed, { status: 201 })
}
