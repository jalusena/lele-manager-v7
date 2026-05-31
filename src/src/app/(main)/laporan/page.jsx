// src/app/(main)/laporan/page.jsx
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { calcPondSummary } from '@/lib/utils'
import LaporanClient from './LaporanClient'

export default async function LaporanPage() {
  const user = getSessionUser()
  if (!user) redirect('/login')

  const ponds = await prisma.pond.findMany({
    where: { userId: user.id },
    include: { seeds: true, feeds: true, harvests: true, expenses: true },
  })

  const serializedPonds = ponds.map(p => ({
    id: p.id, name: p.name, type: p.type, status: p.status,
    startDate: p.startDate.toISOString(),
    seeds:    p.seeds.map(s => ({ id: s.id, totalSeed: s.totalSeed, seedPrice: s.seedPrice, seedDate: s.seedDate.toISOString(), seedSize: s.seedSize, seedOrigin: s.seedOrigin })),
    feeds:    p.feeds.map(f => ({ id: f.id, feedName: f.feedName, feedWeight: f.feedWeight, price: f.price, feedDate: f.feedDate.toISOString(), notes: f.notes })),
    harvests: p.harvests.map(h => ({ id: h.id, harvestNumber: h.harvestNumber, grossWeight: h.grossWeight, refraction: h.refraction, netWeight: h.netWeight, pricePerKg: h.pricePerKg, totalPrice: h.totalPrice, buyer: h.buyer, harvestDate: h.harvestDate.toISOString(), notes: h.notes })),
    expenses: p.expenses.map(e => ({ id: e.id, category: e.category, expenseName: e.expenseName, nominal: e.nominal, expenseDate: e.expenseDate.toISOString(), notes: e.notes })),
  }))

  const pondsWithSummary = serializedPonds.map(p => ({ ...p, summary: calcPondSummary(p) }))

  const grandTotal = {
    modal:     pondsWithSummary.reduce((s, p) => s + p.summary.totalModal, 0),
    revenue:   pondsWithSummary.reduce((s, p) => s + p.summary.totalRevenue, 0),
    profit:    pondsWithSummary.reduce((s, p) => s + p.summary.netProfit, 0),
    harvestKg: pondsWithSummary.reduce((s, p) => s + p.summary.totalHarvestKg, 0),
    feedKg:    pondsWithSummary.reduce((s, p) => s + p.summary.totalFeedKg, 0),
  }
  grandTotal.roi = grandTotal.modal > 0
    ? ((grandTotal.profit / grandTotal.modal) * 100).toFixed(1) : '0'

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Laporan</h1>
        <p className="text-xs text-gray-400">Rekap seluruh kolam</p>
      </div>
      <LaporanClient pondsWithSummary={pondsWithSummary} grandTotal={grandTotal} ponds={serializedPonds} />
    </div>
  )
}
