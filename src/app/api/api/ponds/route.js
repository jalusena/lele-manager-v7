export const runtime = 'nodejs'

// src/app/api/ponds/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const ponds = await prisma.pond.findMany({
    where: { userId: user.id },
    include: { seeds: true, feeds: true, harvests: true, expenses: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(ponds)
}

export async function POST(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const pond = await prisma.pond.create({
    data: {
      userId:    user.id,
      name:      body.name,
      type:      body.type ?? 'Terpal',
      size:      body.size ? parseFloat(body.size) : null,
      startDate: new Date(body.startDate),
      status:    body.status ?? 'active',
      notes:     body.notes ?? null,
    },
  })
  return NextResponse.json(pond, { status: 201 })
}
