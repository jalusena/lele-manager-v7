// src/app/(main)/dashboard/ProfitBanner.jsx
'use client'
import { formatRupiah } from '@/lib/utils'

export default function ProfitBanner({ totalProfit, totalModal, totalRevenue }) {
  const roi = totalModal > 0 ? ((totalProfit / totalModal) * 100).toFixed(1) : 0
  const isProfit = totalProfit >= 0

  return (
    <div className={`rounded-2xl p-5 text-white ${isProfit ? 'bg-gradient-to-br from-teal-500 to-teal-700' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
      <p className="text-xs opacity-80 mb-1">Total Laba Bersih</p>
      <p className="text-2xl font-bold">{formatRupiah(totalProfit)}</p>
      <div className="flex gap-5 mt-4">
        <div>
          <p className="text-[10px] opacity-70">Total Modal</p>
          <p className="text-sm font-semibold">{formatRupiah(totalModal)}</p>
        </div>
        <div>
          <p className="text-[10px] opacity-70">Total Penjualan</p>
          <p className="text-sm font-semibold">{formatRupiah(totalRevenue)}</p>
        </div>
        <div>
          <p className="text-[10px] opacity-70">ROI</p>
          <p className="text-sm font-semibold">{isProfit ? '+' : ''}{roi}%</p>
        </div>
      </div>
    </div>
  )
}
