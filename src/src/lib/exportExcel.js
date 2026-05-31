// src/lib/exportExcel.js
import * as XLSX from 'xlsx'
import { formatRupiah, formatDate } from './utils'

/**
 * Export laporan kolam ke file Excel (.xlsx)
 * @param {object[]} ponds - array kolam dengan relasi lengkap
 * @param {string} filename - nama file output
 */
export function exportToExcel(ponds, filename = 'Laporan_Budidaya_Lele') {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Ringkasan Kolam ──────────────────────────────────
  const summaryData = [
    ['LAPORAN BUDIDAYA LELE', '', '', '', '', ''],
    ['Tanggal Export:', new Date().toLocaleDateString('id-ID'), '', '', '', ''],
    [''],
    ['No', 'Nama Kolam', 'Jenis', 'Status', 'Umur (Hari)', 'Total Benih', 'Total Pakan (kg)', 'Total Modal (Rp)', 'Total Panen (kg)', 'Total Penjualan (Rp)', 'Laba Bersih (Rp)', 'ROI (%)'],
  ]

  ponds.forEach((pond, i) => {
    const totalSeed = pond.seeds?.reduce((s, x) => s + x.seedPrice, 0) ?? 0
    const totalFeed = pond.feeds?.reduce((s, x) => s + x.price, 0) ?? 0
    const totalExp = pond.expenses?.reduce((s, x) => s + x.nominal, 0) ?? 0
    const totalModal = totalSeed + totalFeed + totalExp
    const totalFeedKg = pond.feeds?.reduce((s, x) => s + x.feedWeight, 0) ?? 0
    const totalHarvestKg = pond.harvests?.reduce((s, x) => s + x.grossWeight, 0) ?? 0
    const totalRevenue = pond.harvests?.reduce((s, x) => s + x.totalPrice, 0) ?? 0
    const profit = totalRevenue - totalModal
    const roi = totalModal > 0 ? ((profit / totalModal) * 100).toFixed(1) : 0
    const age = Math.floor((new Date() - new Date(pond.startDate)) / 86400000)

    summaryData.push([
      i + 1,
      pond.name,
      pond.type,
      pond.status,
      age,
      pond.seeds?.[0]?.totalSeed ?? 0,
      totalFeedKg,
      totalModal,
      totalHarvestKg,
      totalRevenue,
      profit,
      `${roi}%`,
    ])
  })

  // Total baris
  const totalRow = [
    'TOTAL', '', '', '', '', '',
    ponds.reduce((s, p) => s + (p.feeds?.reduce((ss, f) => ss + f.feedWeight, 0) ?? 0), 0),
    ponds.reduce((s, p) => {
      const ts = p.seeds?.reduce((ss, x) => ss + x.seedPrice, 0) ?? 0
      const tf = p.feeds?.reduce((ss, x) => ss + x.price, 0) ?? 0
      const te = p.expenses?.reduce((ss, x) => ss + x.nominal, 0) ?? 0
      return s + ts + tf + te
    }, 0),
    ponds.reduce((s, p) => s + (p.harvests?.reduce((ss, h) => ss + h.grossWeight, 0) ?? 0), 0),
    ponds.reduce((s, p) => s + (p.harvests?.reduce((ss, h) => ss + h.totalPrice, 0) ?? 0), 0),
    ponds.reduce((s, p) => {
      const ts = p.seeds?.reduce((ss, x) => ss + x.seedPrice, 0) ?? 0
      const tf = p.feeds?.reduce((ss, x) => ss + x.price, 0) ?? 0
      const te = p.expenses?.reduce((ss, x) => ss + x.nominal, 0) ?? 0
      const rev = p.harvests?.reduce((ss, h) => ss + h.totalPrice, 0) ?? 0
      return s + rev - (ts + tf + te)
    }, 0),
    '',
  ]
  summaryData.push(totalRow)

  const wsSum = XLSX.utils.aoa_to_sheet(summaryData)
  wsSum['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 22 }, { wch: 20 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, wsSum, 'Ringkasan Kolam')

  // ── Sheet 2: Data Pakan ───────────────────────────────────────
  const feedData = [
    ['DATA PAKAN SELURUH KOLAM'],
    [''],
    ['No', 'Kolam', 'Jenis Pakan', 'Berat (kg)', 'Harga (Rp)', 'Harga/kg (Rp)', 'Tanggal', 'Catatan'],
  ]
  let feedNo = 1
  ponds.forEach((pond) => {
    pond.feeds?.forEach((feed) => {
      feedData.push([
        feedNo++,
        pond.name,
        feed.feedName,
        feed.feedWeight,
        feed.price,
        Math.round(feed.price / feed.feedWeight),
        formatDate(feed.feedDate),
        feed.notes ?? '',
      ])
    })
  })
  const wsFeeds = XLSX.utils.aoa_to_sheet(feedData)
  wsFeeds['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 14 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, wsFeeds, 'Data Pakan')

  // ── Sheet 3: Data Panen ───────────────────────────────────────
  const harvestData = [
    ['DATA PANEN SELURUH KOLAM'],
    [''],
    ['No', 'Kolam', 'Panen ke-', 'Berat Kotor (kg)', 'Refaksi (%)', 'Berat Bersih (kg)', 'Harga/kg (Rp)', 'Total Penjualan (Rp)', 'Pembeli', 'Tanggal Panen'],
  ]
  let harvestNo = 1
  ponds.forEach((pond) => {
    pond.harvests?.forEach((h) => {
      harvestData.push([
        harvestNo++,
        pond.name,
        h.harvestNumber,
        h.grossWeight,
        `${h.refraction}%`,
        h.netWeight,
        h.pricePerKg,
        h.totalPrice,
        h.buyer ?? '-',
        formatDate(h.harvestDate),
      ])
    })
  })
  const wsHarvests = XLSX.utils.aoa_to_sheet(harvestData)
  wsHarvests['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 22 }, { wch: 20 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, wsHarvests, 'Data Panen')

  // ── Sheet 4: Biaya Operasional ────────────────────────────────
  const expData = [
    ['DATA BIAYA OPERASIONAL'],
    [''],
    ['No', 'Kolam', 'Kategori', 'Nama Biaya', 'Nominal (Rp)', 'Tanggal', 'Catatan'],
  ]
  let expNo = 1
  ponds.forEach((pond) => {
    pond.expenses?.forEach((exp) => {
      expData.push([
        expNo++,
        pond.name,
        exp.category,
        exp.expenseName,
        exp.nominal,
        formatDate(exp.expenseDate),
        exp.notes ?? '',
      ])
    })
  })
  const wsExp = XLSX.utils.aoa_to_sheet(expData)
  wsExp['!cols'] = [{ wch: 5 }, { wch: 12 }, { wch: 14 }, { wch: 25 }, { wch: 18 }, { wch: 14 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, wsExp, 'Biaya Operasional')

  // ── Sheet 5: Laba Rugi ────────────────────────────────────────
  const prData = [
    ['LAPORAN LABA RUGI'],
    [''],
    ['Kolam', 'Modal Benih', 'Modal Pakan', 'Biaya Ops', 'Total Modal', 'Total Penjualan', 'Laba Bersih', 'ROI', 'Status'],
  ]
  ponds.forEach((pond) => {
    const ts = pond.seeds?.reduce((s, x) => s + x.seedPrice, 0) ?? 0
    const tf = pond.feeds?.reduce((s, x) => s + x.price, 0) ?? 0
    const te = pond.expenses?.reduce((s, x) => s + x.nominal, 0) ?? 0
    const totalModal = ts + tf + te
    const totalRevenue = pond.harvests?.reduce((s, x) => s + x.totalPrice, 0) ?? 0
    const profit = totalRevenue - totalModal
    prData.push([
      pond.name, ts, tf, te, totalModal, totalRevenue, profit,
      totalModal > 0 ? `${((profit / totalModal) * 100).toFixed(1)}%` : '0%',
      profit >= 0 ? 'UNTUNG' : 'RUGI',
    ])
  })
  const wsPR = XLSX.utils.aoa_to_sheet(prData)
  wsPR['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 8 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(wb, wsPR, 'Laba Rugi')

  // Simpan file
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}
