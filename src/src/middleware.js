// src/middleware.js
// Middleware berjalan di Edge Runtime - TIDAK bisa pakai jsonwebtoken/bcrypt
// Gunakan Web Crypto API untuk verify JWT

import { NextResponse } from 'next/server'

const COOKIE_NAME = 'lele_session'
const PUBLIC_PATHS = ['/login', '/register', '/api/auth/login', '/api/auth/register']

// Decode JWT tanpa library (Edge-compatible)
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Base64url decode payload
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(payload)
    const parsed = JSON.parse(decoded)
    // Cek expiry
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Lewati public paths & static files
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) return NextResponse.next()

  // Cek session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  const user = token ? decodeJwtPayload(token) : null

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
