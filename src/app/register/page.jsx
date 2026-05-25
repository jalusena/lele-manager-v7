// src/app/register/page.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User2, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Konfirmasi password tidak cocok')
    if (form.password.length < 6) return setError('Password minimal 6 karakter')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registrasi gagal')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Koneksi bermasalah, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🐟</div>
          <h1 className="text-2xl font-bold text-white">Lele Manager</h1>
          <p className="text-teal-100 text-sm mt-1">Buat akun baru gratis</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Daftar Akun</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nama */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Nama kamu" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="email@kamu.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 karakter" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* Konfirmasi */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent
                    ${form.confirm && form.confirm !== form.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition active:scale-95 disabled:opacity-60 mt-1">
              {loading
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><UserPlus size={16} /> Buat Akun</>}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-teal-600 font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
