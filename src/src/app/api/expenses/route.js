import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
export async function GET(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const pondId = searchParams.get('pondId')
  const expenses = await prisma.expense.findMany({
    where: pondId ? { pondId, pond: { userId: user.id } } : { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { expenseDate: 'desc' },
  })
  return NextResponse.json(expenses)
}
export async function POST(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const expense = await prisma.expense.create({
    data: {
      pondId: body.pondId, category: body.category ?? 'lain-lain',
      expenseName: body.expenseName, nominal: parseFloat(body.nominal),
      expenseDate: new Date(body.expenseDate), notes: body.notes ?? null,
    },
  })
  return NextResponse.json(expense, { status: 201 })
}
