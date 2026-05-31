// src/app/api/auth/login/route.js
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user)
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

    const valid = await verifyPassword(password, user.password)
    if (!valid)
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

    const token = createToken({ id: user.id, name: user.name, email: user.email })
    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: true, sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, path: '/',
    })
    return response
  } catch (err) {
    console.error('[LOGIN]', err)
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
