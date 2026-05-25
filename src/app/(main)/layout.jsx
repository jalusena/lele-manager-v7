// src/app/(main)/layout.jsx
import BottomNav from '@/components/BottomNav'

export default function MainLayout({ children }) {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
