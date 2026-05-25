// src/app/(main)/dashboard/page.jsx
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatShort, calcPondSummary, formatDate } from '@/lib/utils'
import Link from 'next/link'
import RecentActivity from './RecentActivity'
import ProfitBanner from './ProfitBanner'
import DashboardStats from './DashboardStats'

export default async function DashboardPage() {
  const user = getSessionUser()
  if (!user) redirect('/login')

  const ponds = await prisma.pond.findMany({
    where: { userId: user.id },
    include: {
      feeds: true,
      harvests: { orderBy: { harvestDate: 'desc' } },
      expenses: true,
      seeds: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalModal    = ponds.reduce((s, p) => s + calcPondSummary(p).totalModal, 0)
  const totalRevenue  = ponds.reduce((s, p) => s + (p.harvests?.reduce((ss, h) => ss + h.totalPrice, 0) ?? 0), 0)
  const totalProfit   = totalRevenue - totalModal
  const totalFeedKg   = ponds.reduce((s, p) => s + (p.feeds?.reduce((ss, f) => ss + f.feedWeight, 0) ?? 0), 0)
  const totalHarvestKg = ponds.reduce((s, p) => s + (p.harvests?.reduce((ss, h) => ss + h.grossWeight, 0) ?? 0), 0)

  const recentFeeds = await prisma.feed.findMany({
    where: { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { feedDate: 'desc' },
    take: 3,
  })

  const recentHarvests = await prisma.harvest.findMany({
    where: { pond: { userId: user.id } },
    include: { pond: { select: { name: true } } },
    orderBy: { harvestDate: 'desc' },
    take: 3,
  })

  const serializedFeeds = recentFeeds.map(f => ({
    id: f.id, feedName: f.feedName, feedWeight: f.feedWeight,
    price: f.price, feedDate: f.feedDate.toISOString(),
    pond: { name: f.pond.name },
  }))

  const serializedHarvests = recentHarvests.map(h => ({
    id: h.id, harvestNumber: h.harvestNumber, grossWeight: h.grossWeight,
    totalPrice: h.totalPrice, harvestDate: h.harvestDate.toISOString(),
    buyer: h.buyer, pond: { name: h.pond.name },
  }))

  const chartData = ponds.map(p => ({
    id: p.id,
    name: p.name,
    harvestKg: p.harvests?.reduce((s, h) => s + h.grossWeight, 0) ?? 0,
  }))

  const harvestSoon = ponds
    .filter(p => Math.floor((new Date() - new Date(p.startDate)) / 86400000) >= 55)
    .map(p => ({ name: p.name, age: Math.floor((new Date() - new Date(p.startDate)) / 86400000) }))

  // Nama depan saja
  const firstName = user.name?.split(' ')[0] ?? 'Petani'

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Selamat datang 👋</p>
            <h1 className="text-lg font-bold text-gray-800">{firstName}</h1>
          </div>
          <Link href="/kolam" className="relative p-2 rounded-full hover:bg-gray-50">
            <span className="text-xl">🔔</span>
            {harvestSoon.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            )}
          </Link>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <ProfitBanner totalProfit={totalProfit} totalModal={totalModal} totalRevenue={totalRevenue} />

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">🏊</div>
            <p className="text-xs text-gray-400 mb-0.5">Kolam Aktif</p>
            <p className="font-semibold text-gray-800 text-lg">{ponds.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">🌾</div>
            <p className="text-xs text-gray-400 mb-0.5">Total Pakan</p>
            <p className="font-semibold text-gray-800 text-lg">{totalFeedKg} kg</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">🐟</div>
            <p className="text-xs text-gray-400 mb-0.5">Total Panen</p>
            <p className="font-semibold text-gray-800 text-lg">{totalHarvestKg} kg</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
            <div className="text-lg mb-1">📈</div>
            <p className="text-xs text-gray-400 mb-0.5">Total Laba</p>
            <p className="font-semibold text-gray-800 text-lg">{formatShort(totalProfit)}</p>
          </div>
        </div>

        <DashboardStats chartData={chartData} />

        {harvestSoon.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 flex gap-3">
            <div className="text-xl">🎣</div>
            <div>
              <p className="text-xs font-semibold text-amber-700">Estimasi panen segera</p>
              <p className="text-xs text-amber-600 mt-0.5">
                {harvestSoon.map(p => p.name).join(', ')} sudah berumur {harvestSoon.map(p => p.age).join(', ')} hari
              </p>
            </div>
          </div>
        )}

        <RecentActivity feeds={serializedFeeds} harvests={serializedHarvests} />
      </div>
    </div>
  )
}
