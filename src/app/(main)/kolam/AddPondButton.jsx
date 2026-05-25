// src/app/(main)/kolam/AddPondButton.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { BottomSheet, Input, Select, Textarea, Button, Toast } from '@/components/ui'
import { POND_TYPES } from '@/lib/utils'

export default function AddPondButton({ userId }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [form, setForm] = useState({
    name: '', type: 'Terpal', size: '', startDate: '', notes: '',
  })

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2500)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.startDate) return showToast('Nama dan tanggal wajib diisi!')
    setLoading(true)
    try {
      const res = await fetch('/api/ponds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      })
      if (res.ok) {
        showToast('Kolam berhasil ditambahkan! ✅')
        setOpen(false)
        setForm({ name: '', type: 'Terpal', size: '', startDate: '', notes: '' })
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-teal-50 text-teal-600 text-sm font-semibold px-3 py-1.5 rounded-xl"
      >
        <Plus size={16} /> Tambah
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Tambah Kolam Baru">
        <div className="space-y-3.5">
          <Input
            label="Nama Kolam *"
            placeholder="Kolam A"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Jenis Kolam"
              options={POND_TYPES}
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            />
            <Input
              label="Luas (m²)"
              type="number"
              placeholder="48"
              value={form.size}
              onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
            />
          </div>
          <Input
            label="Tanggal Mulai Tebar *"
            type="date"
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
          />
          <Textarea
            label="Catatan"
            placeholder="Opsional..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button loading={loading} onClick={handleSubmit}>Simpan</Button>
          </div>
        </div>
      </BottomSheet>

      <Toast message={toast.message} show={toast.show} />
    </>
  )
}
