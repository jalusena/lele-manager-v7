// src/app/(main)/dashboard/RecentActivity.jsx
'use client'
import { formatRupiah, formatDate } from '@/lib/utils'
import { Wheat, Fish } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'

export default function RecentActivity({ feeds, harvests }) {
  // Merge dan sort berdasarkan tanggal
  const activities = [
    ...feeds.map(f => ({
      type: 'feed',
      title: `${f.feedName} · ${f.feedWeight} kg`,
      sub: `${f.pond.name}`,
      amount: `-${formatRupiah(f.price)}`,
      date: f.feedDate,
      positive: false,
    })),
    ...harvests.map(h => ({
      type: 'harvest',
      title: `Panen ke-${h.harvestNumber} · ${h.grossWeight} kg`,
      sub: `${h.pond.name} · ${h.buyer ?? 'Pembeli'}`,
      amount: `+${formatRupiah(h.totalPrice)}`,
      date: h.harvestDate,
      positive: true,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  return (
    <Card>
      <SectionHeader title="Aktivitas Terbaru" />
      {activities.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">Belum ada aktivitas</p>
      ) : (
        <div className="space-y-1">
          {activities.map((act, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                act.type === 'harvest' ? 'bg-teal-50 text-teal-500' : 'bg-amber-50 text-amber-500'
              }`}>
                {act.type === 'harvest' ? <Fish size={16} /> : <Wheat size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{act.title}</p>
                <p className="text-xs text-gray-400">{act.sub}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs font-semibold ${act.positive ? 'text-teal-600' : 'text-gray-500'}`}>
                  {act.amount}
                </p>
                <p className="text-[10px] text-gray-300">{formatDate(act.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
