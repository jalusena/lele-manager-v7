// src/app/api/auth/register/route.js
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password)
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    if (password.length < 6)
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })

    const emailNorm = email.toLowerCase().trim()
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (existing)
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name: name.trim(), email: emailNorm, password: hashed },
    })

    const token = createToken({ id: user.id, name: user.name, email: user.email })
    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: true, sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, path: '/',
    })
    return response
  } catch (err) {
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 })
  }
}
