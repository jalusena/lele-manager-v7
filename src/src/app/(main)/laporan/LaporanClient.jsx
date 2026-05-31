// src/app/(main)/laporan/LaporanClient.jsx
'use client'
import { useState } from 'react'
import { formatRupiah, formatShort } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { Download, FileSpreadsheet, Printer } from 'lucide-react'
import { Button, Card, Toast } from '@/components/ui'
import { exportToExcel } from '@/lib/exportExcel'

export default function LaporanClient({ pondsWithSummary, grandTotal, ponds }) {
  const [toast, setToast] = useState({ show: false, msg: '' })

  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2500)
  }

  const handleExcelExport = () => {
    try {
      exportToExcel(ponds, 'Laporan_Lele')
      showToast('File Excel berhasil diunduh! ✅')
    } catch {
      showToast('Gagal export. Coba lagi.')
    }
  }

  // Data chart panen
  const harvestData = pondsWithSummary.map(p => ({
    name: p.name,
    Panen: p.summary.totalHarvestKg,
  }))

  // Data chart profit
  const profitData = pondsWithSummary.map(p => ({
    name: p.name,
    Laba: p.summary.netProfit,
  }))

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Profit Banner */}
      <div className={`rounded-2xl p-5 text-white ${grandTotal.profit >= 0 ? 'bg-gradient-to-br from-teal-500 to-teal-700' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
        <p className="text-xs opacity-80">Total Laba Bersih Keseluruhan</p>
        <p className="text-2xl font-bold">{formatRupiah(grandTotal.profit)}</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div><p className="text-[10px] opacity-70">Modal</p><p className="text-xs font-bold">{formatRupiah(grandTotal.modal)}</p></div>
          <div><p className="text-[10px] opacity-70">Penjualan</p><p className="text-xs font-bold">{formatRupiah(grandTotal.revenue)}</p></div>
          <div><p className="text-[10px] opacity-70">ROI</p><p className="text-xs font-bold">{grandTotal.profit >= 0 ? '+' : ''}{grandTotal.roi}%</p></div>
        </div>
      </div>

      {/* Chart Panen */}
      <Card>
        <p className="text-xs font-semibold text-gray-500 mb-3">Total Panen per Kolam (kg)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={harvestData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => [`${v} kg`, 'Panen']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="Panen" radius={[8, 8, 0, 0]}>
              {harvestData.map((_, i) => (
                <Cell key={i} fill={['#1D9E75', '#378ADD', '#BA7517', '#D85A30'][i % 4]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart Laba */}
      <Card>
        <p className="text-xs font-semibold text-gray-500 mb-3">Laba Bersih per Kolam (Rp)</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={profitData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} />
            <Tooltip
              formatter={(v) => [formatRupiah(v), 'Laba']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
            />
            <Bar dataKey="Laba" radius={[8, 8, 0, 0]}>
              {profitData.map((p, i) => (
                <Cell key={i} fill={p.Laba >= 0 ? '#1D9E75' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabel rekap per kolam */}
      <Card>
        <p className="text-xs font-semibold text-gray-500 mb-3">Rekap per Kolam</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[340px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-400 font-medium">Kolam</th>
                <th className="text-right py-2 text-gray-400 font-medium">Modal</th>
                <th className="text-right py-2 text-gray-400 font-medium">Penjualan</th>
                <th className="text-right py-2 text-gray-400 font-medium">Laba</th>
              </tr>
            </thead>
            <tbody>
              {pondsWithSummary.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-medium text-gray-700">{p.name}</td>
                  <td className="py-2.5 text-right text-gray-500">{formatShort(p.summary.totalModal)}</td>
                  <td className="py-2.5 text-right text-gray-700">{formatShort(p.summary.totalRevenue)}</td>
                  <td className={`py-2.5 text-right font-semibold ${p.summary.netProfit >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                    {p.summary.netProfit >= 0 ? '+' : ''}{formatShort(p.summary.netProfit)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 rounded-xl">
                <td className="py-2.5 font-bold text-gray-800 pl-1">Total</td>
                <td className="py-2.5 text-right font-bold text-gray-600">{formatShort(grandTotal.modal)}</td>
                <td className="py-2.5 text-right font-bold text-gray-700">{formatShort(grandTotal.revenue)}</td>
                <td className={`py-2.5 text-right font-bold ${grandTotal.profit >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                  {grandTotal.profit >= 0 ? '+' : ''}{formatShort(grandTotal.profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export buttons */}
      <div className="space-y-2">
        <Button className="w-full" onClick={handleExcelExport}>
          <FileSpreadsheet size={16} /> Download Excel (.xlsx)
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => showToast('Fitur PDF segera hadir')}>
            <Download size={15} /> PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print
          </Button>
        </div>
      </div>

      <Toast message={toast.msg} show={toast.show} />
    </div>
  )
}
