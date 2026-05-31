// src/app/(main)/profil/ProfilClient.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, UploadCloud, HelpCircle, LogOut, ChevronRight,
         X, User2, Mail, Lock, Eye, EyeOff, Crown, Check,
         Bell, Palette, ChevronDown, ChevronUp } from 'lucide-react'

// ── Sub-komponen Modal ──────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl"
        style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
      </div>
    </div>
  )
}

// ── Accordion item untuk Panduan ───────────────────────────
function AccordionItem({ title, emoji, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-2">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-left">
        <span className="text-sm font-semibold text-gray-700">{emoji} {title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 bg-gray-50 text-xs text-gray-600 space-y-1.5 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function ProfilClient({ user }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut]       = useState(false)
  const [pengaturanModal, setPengaturan]  = useState(false)
  const [langgananModal, setLangganan]    = useState(false)
  const [panduanModal, setPanduan]        = useState(false)
  const [toast, setToast]                 = useState({ show: false, msg: '' })

  // Form edit profil
  const [tab, setTab]           = useState('profil') // 'profil' | 'tema'
  const [name, setName]         = useState(user?.name ?? '')
  const [email, setEmail]       = useState(user?.email ?? '')
  const [oldPass, setOldPass]   = useState('')
  const [newPass, setNewPass]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [theme, setTheme]       = useState('light')
  const [saving, setSaving]     = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const showToast = (msg, dur = 2500) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), dur)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const handleSaveProfil = async () => {
    if (!name.trim()) return showToast('Nama tidak boleh kosong')
    setSaving(true)
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, oldPassword: oldPass, newPassword: newPass }),
      })
      const d = await res.json()
      if (res.ok) { showToast('Profil berhasil disimpan ✅'); setPengaturan(false); router.refresh() }
      else showToast(d.error || 'Gagal menyimpan')
    } finally { setSaving(false) }
  }

  const menuItems = [
    { icon: Settings,    label: 'Pengaturan',    sub: 'Edit profil & tema',        color: 'bg-teal-50 text-teal-500',   action: () => setPengaturan(true) },
    { icon: UploadCloud, label: 'Backup Data',   sub: 'Fitur paket langganan',     color: 'bg-blue-50 text-blue-500',   action: () => setLangganan(true) },
    { icon: HelpCircle,  label: 'Panduan & FAQ', sub: 'Cara pakai aplikasi',       color: 'bg-amber-50 text-amber-500', action: () => setPanduan(true) },
    { icon: Crown,       label: 'Paket Premium', sub: 'Upgrade fitur lebih lengkap', color: 'bg-purple-50 text-purple-500', action: () => setLangganan(true) },
  ]

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Profil</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-800 truncate">{user?.name ?? 'Pengguna'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email ?? '-'}</p>
            <span className="inline-block mt-1 text-[10px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-medium">
              Paket Gratis
            </span>
          </div>
          <button onClick={() => setPengaturan(true)}
            className="text-xs text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl font-semibold shrink-0">
            Edit
          </button>
        </div>

        {/* Menu list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button key={i} onClick={item.action}
                className={`w-full flex items-center gap-3 p-4 active:bg-gray-50 transition-colors text-left
                  ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 bg-red-50 text-red-500 text-sm font-semibold active:scale-95 transition disabled:opacity-60">
          {loggingOut
            ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            : <LogOut size={16} />}
          {loggingOut ? 'Keluar...' : 'Keluar dari Akun'}
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">Lele Manager v1.0.0</p>
      </div>

      {/* ══ MODAL PENGATURAN ═══════════════════════════════ */}
      <Modal open={pengaturanModal} onClose={() => setPengaturan(false)} title="⚙️ Pengaturan">
        {/* Tab selector */}
        <div className="flex gap-2 mb-4">
          {['profil', 'tema'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition
                ${tab === t ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {t === 'profil' ? '👤 Edit Profil' : '🎨 Tema'}
            </button>
          ))}
        </div>

        {/* Tab: Edit Profil */}
        {tab === 'profil' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Ganti Password (opsional)</p>
              <div className="space-y-2">
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password lama"
                    value={oldPass} onChange={e => setOldPass(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password baru (min. 6 karakter)"
                    value={newPass} onChange={e => setNewPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
            </div>

            {/* Notifikasi Telegram - coming soon */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell size={15} className="text-blue-500" />
                  <p className="text-xs font-semibold text-gray-700">Notifikasi Telegram</p>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-semibold">SOON</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-blue-700 font-medium mb-1">🔔 Fitur segera hadir!</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Notifikasi jadwal pakan & dosis otomatis langsung ke Telegram kamu. Tersedia di paket langganan.
                </p>
                <button onClick={() => { setPengaturan(false); setLangganan(true) }}
                  className="mt-2 w-full text-xs bg-blue-500 text-white py-1.5 rounded-lg font-semibold">
                  Lihat Paket Langganan →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button onClick={() => setPengaturan(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600">
                Batal
              </button>
              <button onClick={handleSaveProfil} disabled={saving}
                className="w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Simpan
              </button>
            </div>
          </div>
        )}

        {/* Tab: Tema */}
        {tab === 'tema' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 mb-3">Pilih tampilan aplikasi</p>
            {[
              { value: 'light', label: 'Terang', emoji: '☀️', desc: 'Latar putih, cocok untuk siang hari' },
              { value: 'dark',  label: 'Gelap',  emoji: '🌙', desc: 'Latar gelap, hemat baterai' },
              { value: 'green', label: 'Hijau',  emoji: '🌿', desc: 'Tema hijau alam aquaculture' },
            ].map(t => (
              <button key={t.value} onClick={() => { setTheme(t.value); showToast(`Tema ${t.label} dipilih (segera hadir)`) }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition
                  ${theme === t.value ? 'border-teal-400 bg-teal-50' : 'border-gray-100 bg-white'}`}>
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{t.label}</p>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </div>
                {theme === t.value && <Check size={16} className="text-teal-500 shrink-0" />}
              </button>
            ))}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mt-2">
              <p className="text-xs text-amber-700">⚠️ Pilihan tema akan aktif di versi berikutnya</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ MODAL PAKET LANGGANAN ══════════════════════════ */}
      <Modal open={langgananModal} onClose={() => setLangganan(false)} title="👑 Paket Langganan">
        <div className="space-y-3">
          <p className="text-xs text-gray-500 text-center mb-2">Pilih paket yang sesuai kebutuhan budidaya kamu</p>

          {/* Paket Gratis */}
          <div className="border-2 border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-gray-700">🆓 Gratis</p>
                <p className="text-xs text-gray-400">Selamanya</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">Aktif</span>
            </div>
            <div className="space-y-1">
              {['Maksimal 3 kolam','Input pakan & panen manual','Laporan dasar','Export Excel'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                  <Check size={12} className="text-teal-400 shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Paket Starter */}
          <div className="border-2 border-blue-200 rounded-2xl p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-blue-700">⭐ Starter</p>
                <p className="text-xs text-blue-500">Rp 29.000 / bulan</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">SEGERA</span>
            </div>
            <div className="space-y-1">
              {['Kolam tidak terbatas','Estimasi pakan harian otomatis','Notifikasi jadwal pakan (Telegram)','Backup data cloud','Grafik pertumbuhan detail'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-blue-600">
                  <Check size={12} className="text-blue-400 shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Paket Pro */}
          <div className="border-2 border-purple-300 rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <span className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded-full font-bold">POPULER</span>
            </div>
            <div className="mb-2">
              <p className="text-sm font-bold text-purple-700">👑 Pro</p>
              <p className="text-xs text-purple-500">Rp 59.000 / bulan</p>
            </div>
            <div className="space-y-1">
              {[
                'Semua fitur Starter',
                'Estimasi panen & FCR otomatis',
                'Notifikasi dosis pakan per umur ikan',
                'Multi-user / karyawan',
                'Laporan PDF profesional',
                'Analisis laba rugi bulanan',
                'Prioritas support',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-purple-700">
                  <Check size={12} className="text-purple-500 shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Paket Bisnis */}
          <div className="border-2 border-amber-200 rounded-2xl p-4 bg-amber-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-amber-700">🏢 Bisnis</p>
                <p className="text-xs text-amber-500">Rp 149.000 / bulan</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-semibold">SEGERA</span>
            </div>
            <div className="space-y-1">
              {[
                'Semua fitur Pro',
                'Multi-farm / banyak lokasi',
                'Dashboard super admin',
                'API integrasi timbangan digital',
                'Laporan untuk investor',
                'Konsultasi budidaya 1-on-1',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-amber-700">
                  <Check size={12} className="text-amber-500 shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">🚀 Fitur langganan akan hadir bersamaan dengan</p>
            <p className="text-xs font-semibold text-gray-700">peluncuran di Play Store & App Store</p>
          </div>
        </div>
      </Modal>

      {/* ══ MODAL PANDUAN ══════════════════════════════════ */}
      <Modal open={panduanModal} onClose={() => setPanduan(false)} title="📖 Panduan Penggunaan">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 mb-3">Panduan lengkap menggunakan Lele Manager</p>

          <AccordionItem title="Memulai — Daftar & Login" emoji="🚀">
            <p>1. Buka aplikasi → tap <strong>Daftar sekarang</strong></p>
            <p>2. Isi nama lengkap, email, dan password (min. 6 karakter)</p>
            <p>3. Tap <strong>Buat Akun</strong> → langsung masuk ke Dashboard</p>
            <p>4. Untuk login berikutnya, masukkan email & password yang sama</p>
            <p>5. Tap <strong>Keluar</strong> di menu Profil untuk logout</p>
          </AccordionItem>

          <AccordionItem title="Mengelola Kolam" emoji="🏊">
            <p>1. Buka menu <strong>Kolam</strong> di navigasi bawah</p>
            <p>2. Tap <strong>+ Tambah</strong> untuk membuat kolam baru</p>
            <p>3. Isi nama, jenis (Terpal/Beton/Tanah/Fiber), luas, dan tanggal tebar</p>
            <p>4. Tap kolam untuk masuk ke halaman detail</p>
            <p>5. Gunakan tombol <strong>Edit Kolam</strong> untuk ubah status/nama</p>
            <p>6. <strong>Hapus Kolam</strong> akan menghapus semua data kolam tersebut</p>
          </AccordionItem>

          <AccordionItem title="Input Benih" emoji="🐟">
            <p>1. Masuk ke detail kolam → tap tab <strong>Benih</strong></p>
            <p>2. Tap <strong>+ Tambah</strong> → isi jumlah ekor, ukuran, asal, harga</p>
            <p>3. Data benih digunakan untuk estimasi pakan harian</p>
            <p>4. Bisa input benih beberapa kali jika ada penebaran ulang</p>
          </AccordionItem>

          <AccordionItem title="Pencatatan Pakan" emoji="🌾">
            <p>1. Masuk ke detail kolam → tab <strong>Pakan</strong> → tap <strong>+ Tambah</strong></p>
            <p>2. Isi jenis pakan, berat (kg), harga total, dan tanggal</p>
            <p>3. Harga per kg dihitung <strong>otomatis</strong></p>
            <p>4. Semua pakan masuk ke rekap di menu <strong>Pakan</strong></p>
            <p>5. Total biaya pakan otomatis masuk ke perhitungan modal</p>
          </AccordionItem>

          <AccordionItem title="Mencatat Panen" emoji="🎣">
            <p>1. Detail kolam → tab <strong>Panen</strong> → tap <strong>+ Tambah</strong></p>
            <p>2. Isi berat panen kotor (kg) dan refaksi (default 5%)</p>
            <p>3. <strong>Berat bersih & total penjualan dihitung otomatis</strong></p>
            <p>4. Rumus: Berat Bersih = Berat × (1 - Refaksi%)</p>
            <p>5. Bisa panen berkali-kali dalam 1 kolam (panen bertahap)</p>
            <p>6. Isi nama pembeli dan tanggal panen</p>
          </AccordionItem>

          <AccordionItem title="Biaya Operasional" emoji="💸">
            <p>1. Detail kolam → tab <strong>Biaya</strong> → tap <strong>+ Tambah</strong></p>
            <p>2. Pilih kategori: Listrik, Obat, Perawatan, Transportasi, dll</p>
            <p>3. Isi nama biaya, nominal, dan tanggal</p>
            <p>4. Semua biaya otomatis masuk ke perhitungan modal</p>
          </AccordionItem>

          <AccordionItem title="Membaca Laporan & Laba Rugi" emoji="📊">
            <p>1. Buka menu <strong>Laporan</strong> di navigasi bawah</p>
            <p>2. Lihat ringkasan total modal, penjualan, dan laba bersih</p>
            <p>3. <strong>Rumus Laba:</strong> Total Penjualan − (Benih + Pakan + Biaya Ops)</p>
            <p>4. FCR = Total Pakan (kg) ÷ Total Panen (kg) — makin kecil makin efisien</p>
            <p>5. Tap <strong>Download Excel</strong> untuk export laporan .xlsx</p>
            <p>6. File Excel berisi 5 sheet: Ringkasan, Pakan, Panen, Biaya, Laba Rugi</p>
          </AccordionItem>

          <AccordionItem title="Estimasi Pakan Harian" emoji="🧮">
            <p>Estimasi dihitung otomatis berdasarkan:</p>
            <p>• <strong>Umur ikan</strong> (hari sejak tebar)</p>
            <p>• <strong>Jumlah benih</strong> yang ditebar</p>
            <p>• <strong>FCR target</strong> dan persentase pemberian pakan</p>
            <p>Tabel standar pemberian pakan lele:</p>
            <p>• Umur 1-7 hari → 10% bobot/hari</p>
            <p>• Umur 8-30 hari → 5% bobot/hari</p>
            <p>• Umur 31-60 hari → 3% bobot/hari</p>
            <p>• Umur &gt;60 hari → 2% bobot/hari</p>
            <p>Estimasi tampil di halaman detail kolam dan dashboard</p>
          </AccordionItem>

          <AccordionItem title="Tips FCR & Efisiensi" emoji="💡">
            <p>• FCR ideal lele: <strong>0.8 – 1.2</strong></p>
            <p>• FCR &gt; 1.5 artinya pakan boros, cek kualitas air & pakan</p>
            <p>• Beri pakan 2-3x sehari (pagi, sore, malam)</p>
            <p>• Jangan beri pakan lebih dari yang bisa habis dalam 5 menit</p>
            <p>• Pantau SR (Survival Rate): idealnya &gt;80%</p>
            <p>• Ganti 20-30% air setiap minggu</p>
          </AccordionItem>

          <AccordionItem title="Notifikasi & Backup" emoji="🔔">
            <p>• <strong>Notifikasi Telegram</strong> untuk jadwal pakan akan hadir di versi Premium</p>
            <p>• Data tersimpan di cloud (Neon PostgreSQL) — aman dari kehilangan</p>
            <p>• Akses dari HP, tablet, atau laptop dengan akun yang sama</p>
            <p>• Backup manual: Export Excel dan simpan di Google Drive</p>
          </AccordionItem>
        </div>
      </Modal>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap">
          {toast.msg}
        </div>
      )}
    </div>
  )
}
