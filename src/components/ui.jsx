// src/components/ui.jsx
'use client'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { STATUS_CONFIG } from '@/lib/utils'

// ── StatCard ──────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'gray', small = false }) {
  const colorMap = {
    teal:  'bg-teal-50 text-teal-600',
    blue:  'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red:   'bg-red-50 text-red-500',
    gray:  'bg-gray-50 text-gray-500',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5">
      {Icon && typeof Icon === 'function' && (
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl mb-2 ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
      )}
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`font-semibold text-gray-800 ${small ? 'text-sm' : 'text-lg'}`}>{value}</p>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-4 ${className}`}>
      {children}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  )
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      )}
      <input
        className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      )}
      <select
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
          bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      )}
      <textarea
        rows={2}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
          bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none"
        {...props}
      />
    </div>
  )
}

// ── Button ────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition active:scale-95 disabled:opacity-60 w-full'
  const variants = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger:  'bg-red-500 text-white hover:bg-red-600',
    ghost:   'text-teal-600 hover:bg-teal-50',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : children}
    </button>
  )
}

// ── Center Modal — posisi tengah layar, scroll di dalam ───────
export function BottomSheet({ open, onClose, title, children }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0
      }, 30)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal box — posisi tengah */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl fade-in"
        style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header sticky */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Konten scrollable */}
        <div
          ref={contentRef}
          className="overflow-y-auto overscroll-contain px-5 py-4 flex-1"
        >
          {children}
          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ message, show }) {
  if (!show) return null
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg fade-in whitespace-nowrap pointer-events-none">
      {message}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {Icon && <Icon size={36} className="text-gray-200 mb-3" />}
      <p className="text-sm font-medium text-gray-400">{title}</p>
      {subtitle && <p className="text-xs text-gray-300 mt-1">{subtitle}</p>}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />
}

// ── Section Header ────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {action && (
        <button onClick={onAction} className="text-xs text-teal-600 font-medium">
          {action}
        </button>
      )}
    </div>
  )
}
