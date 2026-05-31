// src/app/(main)/dashboard/DashboardStats.jsx
'use client'

export default function DashboardStats({ chartData }) {
  const maxHarvest = Math.max(...chartData.map(p => p.harvestKg), 1)
  const colors = ['bg-teal-400', 'bg-blue-400', 'bg-amber-400', 'bg-red-400']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Panen per Kolam</p>
      {chartData.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">Belum ada data kolam</p>
      )}
      <div className="space-y-3">
        {chartData.map((pond, i) => {
          const pct = Math.round((pond.harvestKg / maxHarvest) * 100)
          return (
            <div key={pond.id} className="flex items-center gap-2.5">
              <span className="text-xs text-gray-500 w-16 shrink-0 text-right">{pond.name}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[i % colors.length]} rounded-full flex items-center pl-2 transition-all duration-700`}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                >
                  {pct > 20 && (
                    <span className="text-[10px] text-white font-medium">{pond.harvestKg} kg</span>
                  )}
                </div>
              </div>
              {pct <= 20 && (
                <span className="text-xs text-gray-500">{pond.harvestKg} kg</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
