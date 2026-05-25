// src/app/(main)/kolam/[id]/page.jsx
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { calcPondSummary, formatRupiah, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PondTabs from './PondTabs'

export default async function PondDetailPage({ params }) {
  const user = getSessionUser()
  if (!user) redirect('/login')

  const pond = await prisma.pond.findUnique({
    where: { id: params.id },
    include: {
      seeds:    { orderBy: { seedDate: 'desc' } },
      feeds:    { orderBy: { feedDate: 'desc' } },
      harvests: { orderBy: { harvestDate: 'asc' } },
      expenses: { orderBy: { expenseDate: 'desc' } },
    },
  })

  if (!pond || pond.userId !== user.id) notFound()

  const serialized = {
    id: pond.id, name: pond.name, type: pond.type,
    status: pond.status, startDate: pond.startDate.toISOString(), notes: pond.notes,
    seeds:    pond.seeds.map(s => ({ id: s.id, totalSeed: s.totalSeed, seedWeight: s.seedWeight, seedSize: s.seedSize, seedOrigin: s.seedOrigin, seedPrice: s.seedPrice, seedDate: s.seedDate.toISOString(), notes: s.notes })),
    feeds:    pond.feeds.map(f => ({ id: f.id, feedName: f.feedName, feedWeight: f.feedWeight, price: f.price, feedDate: f.feedDate.toISOString(), notes: f.notes })),
    harvests: pond.harvests.map(h => ({ id: h.id, harvestNumber: h.harvestNumber, grossWeight: h.grossWeight, refraction: h.refraction, netWeight: h.netWeight, pricePerKg: h.pricePerKg, totalPrice: h.totalPrice, buyer: h.buyer, harvestDate: h.harvestDate.toISOString(), notes: h.notes })),
    expenses: pond.expenses.map(e => ({ id: e.id, category: e.category, expenseName: e.expenseName, nominal: e.nominal, expenseDate: e.expenseDate.toISOString(), notes: e.notes })),
  }

  const summary = calcPondSummary(serialized)

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <Link href="/kolam" className="flex items-center gap-1.5 text-teal-600 text-sm mb-3">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{serialized.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{serialized.type} · Tebar: {formatDate(serialized.startDate)}</p>
          </div>
          <Badge status={serialized.status} />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className={`rounded-2xl p-4 text-white ${summary.netProfit >= 0 ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-red-400 to-red-500'}`}>
          <p className="text-xs opacity-80">Laba Bersih</p>
          <p className="text-2xl font-bold">{formatRupiah(summary.netProfit)}</p>
          <div className="flex gap-4 mt-3 text-xs">
            <div><p className="opacity-70">Modal</p><p className="font-semibold">{formatRupiah(summary.totalModal)}</p></div>
            <div><p className="opacity-70">Penjualan</p><p className="font-semibold">{formatRupiah(summary.totalRevenue)}</p></div>
            <div><p className="opacity-70">ROI</p><p className="font-semibold">{summary.roi}%</p></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5"><div className="text-lg mb-1">🐟</div><p className="text-xs text-gray-400 mb-0.5">Total Panen</p><p className="font-semibold text-gray-800">{summary.totalHarvestKg} kg</p></div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5"><div className="text-lg mb-1">🌾</div><p className="text-xs text-gray-400 mb-0.5">Total Pakan</p><p className="font-semibold text-gray-800">{summary.totalFeedKg} kg</p></div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5"><div className="text-lg mb-1">📊</div><p className="text-xs text-gray-400 mb-0.5">FCR</p><p className="font-semibold text-gray-800">{summary.fcr > 0 ? summary.fcr : '-'}</p></div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5"><div className="text-lg mb-1">📅</div><p className="text-xs text-gray-400 mb-0.5">Umur Kolam</p><p className="font-semibold text-gray-800">{summary.age} hari</p></div>
        </div>

        {serialized.seeds.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">🐟 Data Benih</p>
            {serialized.seeds.map(seed => (
              <div key={seed.id} className="text-sm text-gray-600 space-y-0.5">
                <p><span className="text-gray-400">Jumlah:</span> {seed.totalSeed.toLocaleString()} ekor</p>
                <p><span className="text-gray-400">Ukuran:</span> {seed.seedSize ?? '-'}</p>
                <p><span className="text-gray-400">Asal:</span> {seed.seedOrigin ?? '-'}</p>
                <p><span className="text-gray-400">Harga:</span> {formatRupiah(seed.seedPrice)}</p>
              </div>
            ))}
          </div>
        )}

        <PondTabs pond={serialized} summary={summary} />
      </div>
    </div>
  )
}
