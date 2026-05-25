// src/app/(main)/profil/ProfilClient.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, UploadCloud, HelpCircle, LogOut, ChevronRight } from 'lucide-react'

const menuItems = [
  { icon: Settings,    label: 'Pengaturan',    sub: 'Notifikasi, tema, akun',   color: 'bg-teal-50 text-teal-500'  },
  { icon: UploadCloud, label: 'Backup Data',   sub: 'Data tersimpan otomatis',  color: 'bg-blue-50 text-blue-500'  },
  { icon: HelpCircle,  label: 'Panduan & FAQ', sub: 'Cara pakai aplikasi',      color: 'bg-amber-50 text-amber-500' },
]

export default function ProfilClient({ user }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  // Buat inisial dari nama
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">Profil</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Avatar & info user */}
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
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 cursor-pointer active:bg-gray-50 transition-colors
                  ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            )
          })}
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 bg-red-50 text-red-500 text-sm font-semibold active:scale-95 transition disabled:opacity-60"
        >
          {loggingOut
            ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            : <LogOut size={16} />
          }
          {loggingOut ? 'Keluar...' : 'Keluar dari Akun'}
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">Lele Manager v1.0.0</p>
      </div>
    </div>
  )
}
