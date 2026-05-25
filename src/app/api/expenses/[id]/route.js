import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
export async function DELETE(req, { params }) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.expense.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
