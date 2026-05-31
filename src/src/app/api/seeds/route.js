import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
export async function POST(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const seed = await prisma.seed.create({
    data: {
      pondId: body.pondId, totalSeed: parseInt(body.totalSeed),
      seedWeight: body.seedWeight ? parseFloat(body.seedWeight) : null,
      seedSize: body.seedSize ?? null, seedOrigin: body.seedOrigin ?? null,
      seedPrice: parseFloat(body.seedPrice), seedDate: new Date(body.seedDate),
      notes: body.notes ?? null,
    },
  })
  return NextResponse.json(seed, { status: 201 })
}
