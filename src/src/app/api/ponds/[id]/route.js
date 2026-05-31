export const runtime = 'nodejs'

// src/app/api/ponds/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function GET(req, { params }) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const pond = await prisma.pond.findUnique({
    where: { id: params.id },
    include: { seeds: true, feeds: true, harvests: true, expenses: true },
  })
  if (!pond || pond.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(pond)
}

export async function PUT(req, { params }) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const pond = await prisma.pond.findUnique({ where: { id: params.id } })
  if (!pond || pond.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = await prisma.pond.update({
    where: { id: params.id },
    data: {
      name:      body.name,
      type:      body.type,
      size:      body.size ? parseFloat(body.size) : null,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      status:    body.status,
      notes:     body.notes ?? null,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req, { params }) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const pond = await prisma.pond.findUnique({ where: { id: params.id } })
  if (!pond || pond.userId !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.pond.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
