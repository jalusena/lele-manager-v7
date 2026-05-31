// src/lib/utils.js

/**
 * Format angka ke format Rupiah
 * @param {number} number
 * @returns {string} e.g. "Rp 1.500.000"
 */
export function formatRupiah(number) {
  if (!number && number !== 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

/**
 * Format angka singkat: 1500000 -> 1.5jt
 */
export function formatShort(number) {
  if (!number) return '0'
  if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'jt'
  if (number >= 1_000) return (number / 1_000).toFixed(0) + 'rb'
  return number.toString()
}

/**
 * Hitung berat bersih setelah refaksi
 */
export function calcNetWeight(grossWeight, refraction) {
  return grossWeight * (1 - refraction / 100)
}

/**
 * Hitung total penjualan
 */
export function calcTotalPrice(netWeight, pricePerKg) {
  return netWeight * pricePerKg
}

/**
 * Hitung umur kolam dalam hari
 */
export function calcAge(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return diff
}

/**
 * Estimasi FCR
 */
export function calcFCR(totalFeedKg, totalHarvestKg) {
  if (!totalHarvestKg) return 0
  return (totalFeedKg / totalHarvestKg).toFixed(2)
}

/**
 * Hitung ringkasan finansial kolam
 */
export function calcPondSummary(pond) {
  const totalSeedCost = pond.seeds?.reduce((s, x) => s + x.seedPrice, 0) ?? 0
  const totalFeedCost = pond.feeds?.reduce((s, x) => s + x.price, 0) ?? 0
  const totalExpense = pond.expenses?.reduce((s, x) => s + x.nominal, 0) ?? 0
  const totalModal = totalSeedCost + totalFeedCost + totalExpense

  const totalFeedKg = pond.feeds?.reduce((s, x) => s + x.feedWeight, 0) ?? 0
  const totalHarvestKg = pond.harvests?.reduce((s, x) => s + x.grossWeight, 0) ?? 0
  const totalRevenue = pond.harvests?.reduce((s, x) => s + x.totalPrice, 0) ?? 0
  const netProfit = totalRevenue - totalModal

  return {
    totalModal,
    totalFeedCost,
    totalSeedCost,
    totalExpense,
    totalFeedKg,
    totalHarvestKg,
    totalRevenue,
    netProfit,
    roi: totalModal > 0 ? ((netProfit / totalModal) * 100).toFixed(1) : 0,
    fcr: calcFCR(totalFeedKg, totalHarvestKg),
    age: calcAge(pond.startDate),
  }
}

/**
 * Format tanggal ke ID locale
 */
export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format tanggal input (YYYY-MM-DD)
 */
export function toInputDate(date) {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

/**
 * Status badge config
 */
export const STATUS_CONFIG = {
  active: { label: 'Aktif', color: 'bg-teal-50 text-teal-600 border-teal-100' },
  harvest: { label: 'Masa Panen', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  inactive: { label: 'Nonaktif', color: 'bg-gray-100 text-gray-500 border-gray-200' },
}

export const EXPENSE_CATEGORIES = [
  { value: 'listrik', label: 'Listrik', icon: '⚡' },
  { value: 'obat', label: 'Obat & Vitamin', icon: '💊' },
  { value: 'perawatan', label: 'Perawatan', icon: '🔧' },
  { value: 'transportasi', label: 'Transportasi', icon: '🚛' },
  { value: 'lain-lain', label: 'Lain-lain', icon: '📋' },
]

export const POND_TYPES = ['Terpal', 'Beton', 'Tanah', 'Fiber']
