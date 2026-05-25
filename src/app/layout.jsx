// src/app/layout.jsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Lele Manager – Manajemen Budidaya Ikan Lele',
  description: 'Aplikasi mobile-first untuk mencatat dan mengelola budidaya ikan lele',
  manifest: '/manifest.json',
  themeColor: '#1D9E75',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-gray-50 font-sans">{children}</body>
    </html>
  )
}
