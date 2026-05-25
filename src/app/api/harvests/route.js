import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const pondId = searchParams.get('pondId')
  const harvests = await prisma.harvest.findMany({
    where: pondId ? { pondId, pond: { userId: user.id } } : { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { harvestDate: 'desc' },
  })
  return NextResponse.json(harvests)
}

export async function POST(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const gross = parseFloat(body.grossWeight)
  const ref   = parseFloat(body.refraction ?? 5)
  const price = parseFloat(body.pricePerKg ?? 18300)
  const net   = body.netWeight  ? parseFloat(body.netWeight)  : gross * (1 - ref / 100)
  const total = body.totalPrice ? parseFloat(body.totalPrice) : net * price
  const harvest = await prisma.harvest.create({
    data: {
      pondId: body.pondId, harvestNumber: parseInt(body.harvestNumber ?? 1),
      grossWeight: gross, refraction: ref, netWeight: parseFloat(net.toFixed(2)),
      pricePerKg: price, totalPrice: parseFloat(total.toFixed(0)),
      buyer: body.buyer ?? null, harvestDate: new Date(body.harvestDate), notes: body.notes ?? null,
    },
  })
  return NextResponse.json(harvest, { status: 201 })
}
