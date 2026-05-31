// src/app/(main)/kolam/[id]/PondTabs.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Fish, Wheat, Receipt, Sprout } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'
import { BottomSheet, Input, Select, Button, Toast, EmptyState } from '@/components/ui'

const TABS = ['Panen', 'Pakan', 'Biaya', 'Benih']

export default function PondTabs({ pond, summary }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast]         = useState({ show: false, msg: '' })
  const [harvestModal, setHarvestModal] = useState(false)
  const [feedModal,    setFeedModal]    = useState(false)
  const [expenseModal, setExpenseModal] = useState(false)
  const [seedModal,    setSeedModal]    = useState(false)
  const [editModal,    setEditModal]    = useState(false)

  const [hForm, setHForm] = useState({ grossWeight: '', refraction: '5', pricePerKg: '18300', buyer: '', harvestDate: '', notes: '' })
  const [fForm, setFForm] = useState({ feedName: '', feedWeight: '', price: '', feedDate: '', notes: '' })
  const [eForm, setEForm] = useState({ category: 'listrik', expenseName: '', nominal: '', expenseDate: '', notes: '' })
  const [sForm, setSForm] = useState({ totalSeed: '', seedWeight: '', seedSize: '', seedOrigin: '', seedPrice: '', seedDate: '' })
  const [pForm, setPForm] = useState({ name: pond.name, type: pond.type, size: pond.size ?? '', status: pond.status, notes: pond.notes ?? '' })

  const netW  = hForm.grossWeight ? (parseFloat(hForm.grossWeight) * (1 - parseFloat(hForm.refraction || 5) / 100)).toFixed(1) : 0
  const totalS = netW ? (parseFloat(netW) * parseFloat(hForm.pricePerKg || 0)).toFixed(0) : 0

  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2500)
  }

  const save = async (url, body, onDone) => {
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, pondId: pond.id }),
    })
    if (res.ok) { onDone(); router.refresh() }
    else { const d = await res.json(); showToast(d.error || 'Gagal menyimpan') }
  }

  const deleteItem = async (url, id) => {
    if (!confirm('Hapus data ini?')) return
    const res = await fetch(`${url}/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Dihapus ✅'); router.refresh() }
  }

  const handleDeletePond = async () => {
    if (!confirm(`Hapus kolam "${pond.name}" beserta semua datanya?`)) return
    const res = await fetch(`/api/ponds/${pond.id}`, { method: 'DELETE' })
    if (res.ok) { router.push('/kolam'); router.refresh() }
  }

  const handleEditPond = async () => {
    const res = await fetch(`/api/ponds/${pond.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pForm),
    })
    if (res.ok) { showToast('Kolam diperbarui ✅'); setEditModal(false); router.refresh() }
  }

  return (
    <div>
      {/* Tombol Edit & Hapus */}
      <div className="flex gap-2 mb-3">
        <button onClick={() => setEditModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold bg-white">
          <Pencil size={13} /> Edit Kolam
        </button>
        <button onClick={handleDeletePond}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-100 text-red-500 text-xs font-semibold bg-red-50">
          <Trash2 size={13} /> Hapus Kolam
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)}
            className={`py-2 rounded-xl text-xs font-semibold transition
              ${activeTab === i ? 'bg-teal-500 text-white' : 'bg-white border border-gray-100 text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── PANEN ───────────────────────────────── */}
      {activeTab === 0 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Riwayat Panen</p>
            <button onClick={() => setHarvestModal(true)} className="flex items-center gap-1 text-xs text-teal-600 font-semibold bg-teal-50 px-3 py-1.5 rounded-lg">
              <Plus size={13} /> Tambah
            </button>
          </div>
          {pond.harvests.length === 0 && <EmptyState icon={Fish} title="Belum ada panen" subtitle="Tap + untuk mencatat" />}
          {pond.harvests.map(h => (
            <div key={h.id} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-bold text-xs">{h.harvestNumber}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700">Panen ke-{h.harvestNumber} · {h.grossWeight} kg</p>
                <p className="text-xs text-gray-400">Bersih: {h.netWeight} kg · Refaksi {h.refraction}% · {h.buyer ?? '-'}</p>
                <p className="text-xs text-gray-400">{formatDate(h.harvestDate)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-teal-600">{formatRupiah(h.totalPrice)}</p>
                <button onClick={() => deleteItem('/api/harvests', h.id)} className="mt-1 text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {pond.harvests.length > 0 && (
            <div className="bg-teal-50 rounded-xl p-3 flex justify-between items-center border border-teal-100">
              <span className="text-sm font-semibold text-teal-700">Total Penjualan</span>
              <span className="text-sm font-bold text-teal-700">{formatRupiah(summary.totalRevenue)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── PAKAN ───────────────────────────────── */}
      {activeTab === 1 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Riwayat Pakan</p>
            <button onClick={() => setFeedModal(true)} className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg">
              <Plus size={13} /> Tambah
            </button>
          </div>
          {pond.feeds.length === 0 && <EmptyState icon={Wheat} title="Belum ada data pakan" />}
          {pond.feeds.map(f => (
            <div key={f.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
              <div className="text-base shrink-0">🌾</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{f.feedName} · {f.feedWeight} kg</p>
                <p className="text-xs text-gray-400">{formatDate(f.feedDate)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-600">{formatRupiah(f.price)}</p>
                <button onClick={() => deleteItem('/api/feeds', f.id)} className="mt-1 text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {pond.feeds.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3 flex justify-between items-center border border-amber-100">
              <span className="text-sm font-semibold text-amber-700">Total Biaya Pakan</span>
              <span className="text-sm font-bold text-amber-700">{formatRupiah(summary.totalFeedCost)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── BIAYA ───────────────────────────────── */}
      {activeTab === 2 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Biaya Operasional</p>
            <button onClick={() => setExpenseModal(true)} className="flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={13} /> Tambah
            </button>
          </div>
          {pond.expenses.length === 0 && <EmptyState icon={Receipt} title="Belum ada biaya" />}
          {pond.expenses.map(exp => (
            <div key={exp.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
              <div className="text-base shrink-0">💸</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{exp.expenseName}</p>
                <p className="text-xs text-gray-400">{exp.category} · {formatDate(exp.expenseDate)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-red-500">-{formatRupiah(exp.nominal)}</p>
                <button onClick={() => deleteItem('/api/expenses', exp.id)} className="mt-1 text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {pond.expenses.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3 flex justify-between items-center border border-red-100">
              <span className="text-sm font-semibold text-red-600">Total Biaya Ops</span>
              <span className="text-sm font-bold text-red-600">{formatRupiah(summary.totalExpense)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── BENIH ───────────────────────────────── */}
      {activeTab === 3 && (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Data Benih</p>
            <button onClick={() => setSeedModal(true)} className="flex items-center gap-1 text-xs text-green-700 font-semibold bg-green-50 px-3 py-1.5 rounded-lg">
              <Plus size={13} /> Tambah
            </button>
          </div>
          {pond.seeds.length === 0 && <EmptyState icon={Sprout} title="Belum ada data benih" subtitle="Tap + untuk input benih" />}
          {pond.seeds.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex justify-between mb-1.5">
                <p className="text-sm font-semibold text-gray-700">🐟 {s.totalSeed.toLocaleString()} ekor</p>
                <p className="text-sm font-semibold text-green-700">{formatRupiah(s.seedPrice)}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-3 text-xs text-gray-500">
                <p>Ukuran: {s.seedSize ?? '-'}</p>
                <p>Berat: {s.seedWeight ?? '-'} kg</p>
                <p>Asal: {s.seedOrigin ?? '-'}</p>
                <p>Tebar: {formatDate(s.seedDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL PANEN ════════════════════════════ */}
      <BottomSheet open={harvestModal} onClose={() => setHarvestModal(false)} title="🐟 Input Panen">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Berat Panen (kg) *" type="number" min="0" placeholder="400"
              value={hForm.grossWeight} onChange={e => setHForm(f => ({ ...f, grossWeight: e.target.value }))} />
            <Input label="Refaksi (%)" type="number" min="0" max="100" placeholder="5"
              value={hForm.refraction} onChange={e => setHForm(f => ({ ...f, refraction: e.target.value }))} />
          </div>
          {parseFloat(netW) > 0 && (
            <div className="bg-teal-50 rounded-xl p-2.5 flex justify-between items-center border border-teal-100">
              <span className="text-xs text-teal-700 font-medium">Berat bersih</span>
              <span className="text-sm font-bold text-teal-700">{netW} kg → {formatRupiah(parseFloat(totalS))}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Harga/kg (Rp)" type="number" min="0" placeholder="18300"
              value={hForm.pricePerKg} onChange={e => setHForm(f => ({ ...f, pricePerKg: e.target.value }))} />
            <Input label="Pembeli" placeholder="Nama pembeli"
              value={hForm.buyer} onChange={e => setHForm(f => ({ ...f, buyer: e.target.value }))} />
          </div>
          <Input label="Tanggal Panen *" type="date"
            value={hForm.harvestDate} onChange={e => setHForm(f => ({ ...f, harvestDate: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setHarvestModal(false)}>Batal</Button>
            <Button onClick={() => {
              if (!hForm.grossWeight || !hForm.harvestDate) return showToast('Berat & tanggal wajib diisi')
              save('/api/harvests', { ...hForm, harvestNumber: (pond.harvests?.length ?? 0) + 1, netWeight: parseFloat(netW), totalPrice: parseFloat(totalS) },
                () => { setHarvestModal(false); setHForm({ grossWeight:'', refraction:'5', pricePerKg:'18300', buyer:'', harvestDate:'', notes:'' }); showToast('Panen dicatat! ✅') })
            }}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      {/* ══ MODAL PAKAN ════════════════════════════ */}
      <BottomSheet open={feedModal} onClose={() => setFeedModal(false)} title="🌾 Input Pakan">
        <div className="space-y-3">
          <Input label="Jenis Pakan *" placeholder="Safir-2, Pf-1000, Hi-Pro-Vite..."
            value={fForm.feedName} onChange={e => setFForm(f => ({ ...f, feedName: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Berat (kg) *" type="number" min="0" placeholder="30"
              value={fForm.feedWeight} onChange={e => setFForm(f => ({ ...f, feedWeight: e.target.value }))} />
            <Input label="Harga Total (Rp) *" type="number" min="0" placeholder="370000"
              value={fForm.price} onChange={e => setFForm(f => ({ ...f, price: e.target.value }))} />
          </div>
          {fForm.feedWeight && fForm.price && parseFloat(fForm.feedWeight) > 0 && (
            <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-100">
              <span className="text-xs text-amber-700">Harga/kg: <strong>{formatRupiah(Math.round(parseFloat(fForm.price) / parseFloat(fForm.feedWeight)))}</strong></span>
            </div>
          )}
          <Input label="Tanggal *" type="date"
            value={fForm.feedDate} onChange={e => setFForm(f => ({ ...f, feedDate: e.target.value }))} />
          <Input label="Catatan" placeholder="Opsional..."
            value={fForm.notes} onChange={e => setFForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setFeedModal(false)}>Batal</Button>
            <Button onClick={() => {
              if (!fForm.feedName || !fForm.feedWeight || !fForm.price || !fForm.feedDate) return showToast('Semua field wajib diisi')
              save('/api/feeds', fForm, () => { setFeedModal(false); setFForm({ feedName:'', feedWeight:'', price:'', feedDate:'', notes:'' }); showToast('Pakan disimpan! ✅') })
            }}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      {/* ══ MODAL BIAYA ════════════════════════════ */}
      <BottomSheet open={expenseModal} onClose={() => setExpenseModal(false)} title="💸 Input Biaya">
        <div className="space-y-3">
          <Select label="Kategori" value={eForm.category}
            options={[
              { value: 'listrik',      label: '⚡ Listrik' },
              { value: 'obat',         label: '💊 Obat & Vitamin' },
              { value: 'perawatan',    label: '🔧 Perawatan' },
              { value: 'transportasi', label: '🚛 Transportasi' },
              { value: 'lain-lain',    label: '📋 Lain-lain' },
            ]}
            onChange={e => setEForm(f => ({ ...f, category: e.target.value }))} />
          <Input label="Nama Biaya *" placeholder="Listrik bulan April"
            value={eForm.expenseName} onChange={e => setEForm(f => ({ ...f, expenseName: e.target.value }))} />
          <Input label="Nominal (Rp) *" type="number" min="0" placeholder="180000"
            value={eForm.nominal} onChange={e => setEForm(f => ({ ...f, nominal: e.target.value }))} />
          <Input label="Tanggal *" type="date"
            value={eForm.expenseDate} onChange={e => setEForm(f => ({ ...f, expenseDate: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setExpenseModal(false)}>Batal</Button>
            <Button onClick={() => {
              if (!eForm.expenseName || !eForm.nominal || !eForm.expenseDate) return showToast('Semua field wajib diisi')
              save('/api/expenses', eForm, () => { setExpenseModal(false); setEForm({ category:'listrik', expenseName:'', nominal:'', expenseDate:'', notes:'' }); showToast('Biaya disimpan! ✅') })
            }}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      {/* ══ MODAL BENIH ════════════════════════════ */}
      <BottomSheet open={seedModal} onClose={() => setSeedModal(false)} title="🌱 Input Benih">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Jumlah (ekor) *" type="number" min="0" placeholder="10000"
              value={sForm.totalSeed} onChange={e => setSForm(f => ({ ...f, totalSeed: e.target.value }))} />
            <Input label="Berat Masa (kg)" type="number" min="0" placeholder="12"
              value={sForm.seedWeight} onChange={e => setSForm(f => ({ ...f, seedWeight: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Input label="Ukuran" placeholder="5-7 cm"
              value={sForm.seedSize} onChange={e => setSForm(f => ({ ...f, seedSize: e.target.value }))} />
            <Input label="Asal Benih" placeholder="Pak Dwi / BPBAT"
              value={sForm.seedOrigin} onChange={e => setSForm(f => ({ ...f, seedOrigin: e.target.value }))} />
          </div>
          <Input label="Harga Benih (Rp) *" type="number" min="0" placeholder="1500000"
            value={sForm.seedPrice} onChange={e => setSForm(f => ({ ...f, seedPrice: e.target.value }))} />
          <Input label="Tanggal Tebar *" type="date"
            value={sForm.seedDate} onChange={e => setSForm(f => ({ ...f, seedDate: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setSeedModal(false)}>Batal</Button>
            <Button onClick={() => {
              if (!sForm.totalSeed || !sForm.seedPrice || !sForm.seedDate) return showToast('Jumlah, harga & tanggal wajib diisi')
              save('/api/seeds', sForm, () => { setSeedModal(false); setSForm({ totalSeed:'', seedWeight:'', seedSize:'', seedOrigin:'', seedPrice:'', seedDate:'' }); showToast('Benih disimpan! ✅') })
            }}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      {/* ══ MODAL EDIT KOLAM ═══════════════════════ */}
      <BottomSheet open={editModal} onClose={() => setEditModal(false)} title="✏️ Edit Kolam">
        <div className="space-y-3">
          <Input label="Nama Kolam *" value={pForm.name}
            onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5">
            <Select label="Jenis" value={pForm.type}
              options={['Terpal', 'Beton', 'Tanah', 'Fiber']}
              onChange={e => setPForm(f => ({ ...f, type: e.target.value }))} />
            <Select label="Status" value={pForm.status}
              options={[
                { value: 'active',   label: '✅ Aktif' },
                { value: 'harvest',  label: '🎣 Masa Panen' },
                { value: 'inactive', label: '⏸ Nonaktif' },
              ]}
              onChange={e => setPForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <Input label="Luas (m²)" type="number" min="0"
            value={pForm.size} onChange={e => setPForm(f => ({ ...f, size: e.target.value }))} />
          <Input label="Catatan" value={pForm.notes}
            onChange={e => setPForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button variant="outline" onClick={() => setEditModal(false)}>Batal</Button>
            <Button onClick={handleEditPond}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      <Toast message={toast.msg} show={toast.show} />
    </div>
  )
}
