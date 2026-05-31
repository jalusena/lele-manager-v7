// src/app/(main)/kolam/page.jsx
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { calcPondSummary, formatShort, formatDate } from '@/lib/utils'
import { Badge, EmptyState } from '@/components/ui'
import { Waves } from 'lucide-react'
import Link from 'next/link'
import AddPondButton from './AddPondButton'

export default async function KolamPage() {
  const user = getSessionUser()
  if (!user) redirect('/login')

  const ponds = await prisma.pond.findMany({
    where: { userId: user.id },
    include: { seeds: true, feeds: true, harvests: true, expenses: true },
    orderBy: { createdAt: 'desc' },
  })

  const serializedPonds = ponds.map(p => ({
    id: p.id, name: p.name, type: p.type, status: p.status,
    startDate: p.startDate.toISOString(), notes: p.notes,
    seeds:    p.seeds.map(s => ({ id: s.id, totalSeed: s.totalSeed, seedPrice: s.seedPrice })),
    feeds:    p.feeds.map(f => ({ id: f.id, feedWeight: f.feedWeight, price: f.price })),
    harvests: p.harvests.map(h => ({ id: h.id, grossWeight: h.grossWeight, totalPrice: h.totalPrice })),
    expenses: p.expenses.map(e => ({ id: e.id, nominal: e.nominal })),
  }))

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Kolam Saya</h1>
          <p className="text-xs text-gray-400">
            {serializedPonds.filter(p => p.status === 'active').length} kolam aktif
          </p>
        </div>
        <AddPondButton userId={user.id} />
      </div>

      <div className="px-4 py-4 space-y-3">
        {serializedPonds.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="text-5xl">🏊</div>
            <p className="text-sm font-medium text-gray-500">Belum ada kolam</p>
            <p className="text-xs text-gray-400">Tap tombol + untuk menambah kolam pertama</p>
          </div>
        )}
        {serializedPonds.map(pond => {
          const { totalHarvestKg, netProfit, age, fcr } = calcPondSummary(pond)
          const totalSeeds = pond.seeds?.[0]?.totalSeed ?? 0
          return (
            <Link
              key={pond.id}
              href={`/kolam/${pond.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-base font-semibold text-gray-800">{pond.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {pond.type} · Tebar: {formatDate(pond.startDate)}
                  </p>
                </div>
                <Badge status={pond.status} />
              </div>
              <div className="h-px bg-gray-50 mb-3" />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{totalHarvestKg} kg</p>
                  <p className="text-[10px] text-gray-400">Panen</p>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${netProfit >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                    Rp {formatShort(netProfit)}
                  </p>
                  <p className="text-[10px] text-gray-400">Laba</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{age} hr</p>
                  <p className="text-[10px] text-gray-400">Umur</p>
                </div>
              </div>
              {fcr > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">FCR:</span>
                  <span className={`text-[10px] font-medium ${fcr <= 1.5 ? 'text-teal-600' : 'text-amber-600'}`}>{fcr}</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{totalSeeds.toLocaleString()} ekor</span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
