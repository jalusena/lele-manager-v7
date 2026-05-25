// src/app/(main)/pakan/page.jsx
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatRupiah, formatDate } from '@/lib/utils'
import { Wheat } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export default async function PakanPage() {
  const user = getSessionUser()
  if (!user) redirect('/login')

  const feeds = await prisma.feed.findMany({
    where: { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { feedDate: 'desc' },
  })

  const totalFeedKg   = feeds.reduce((s, f) => s + f.feedWeight, 0)
  const totalFeedCost = feeds.reduce((s, f) => s + f.price, 0)

  const byType = feeds.reduce((acc, f) => {
    if (!acc[f.feedName]) acc[f.feedName] = { kg: 0, cost: 0 }
    acc[f.feedName].kg   += f.feedWeight
    acc[f.feedName].cost += f.price
    return acc
  }, {})

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Data Pakan</h1>
        <p className="text-xs text-gray-400">Semua kolam · {feeds.length} catatan</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">🌾</div>
            <p className="text-xs text-gray-400 mb-0.5">Total Pakan</p>
            <p className="font-semibold text-gray-800 text-lg">{totalFeedKg} kg</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">💰</div>
            <p className="text-xs text-gray-400 mb-0.5">Total Biaya</p>
            <p className="font-semibold text-amber-600 text-base">{formatRupiah(totalFeedCost)}</p>
          </div>
        </div>

        {Object.keys(byType).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">Ringkasan per Jenis Pakan</p>
            {Object.entries(byType).map(([name, data]) => (
              <div key={name} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{name}</p>
                  <p className="text-xs text-gray-400">{data.kg} kg</p>
                </div>
                <p className="text-sm font-semibold text-amber-600">{formatRupiah(data.cost)}</p>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-700">Riwayat Lengkap</p>
        {feeds.length === 0 && (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="text-5xl">🌾</div>
            <p className="text-sm font-medium text-gray-500">Belum ada data pakan</p>
            <p className="text-xs text-gray-400">Input pakan dari halaman detail kolam</p>
          </div>
        )}
        <div className="space-y-2">
          {feeds.map(f => (
            <div key={f.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-base">🌾</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{f.feedName} · {f.feedWeight} kg</p>
                <p className="text-xs text-gray-400">{f.pond.name} · {formatDate(f.feedDate.toISOString())}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600">{formatRupiah(f.price)}</p>
                <p className="text-[10px] text-gray-400">{formatRupiah(Math.round(f.price / f.feedWeight))}/kg</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
