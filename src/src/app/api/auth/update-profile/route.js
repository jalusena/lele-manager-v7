// src/app/api/auth/update-profile/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser, hashPassword, verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth'

export async function PUT(req) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, oldPassword, newPassword } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { id: user.id } })
  if (!existing) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

  // Cek email sudah dipakai orang lain
  if (email !== existing.email) {
    const emailUsed = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (emailUsed && emailUsed.id !== user.id)
      return NextResponse.json({ error: 'Email sudah digunakan akun lain' }, { status: 409 })
  }

  // Update password jika diisi
  let hashedPassword = existing.password
  if (newPassword) {
    if (!oldPassword) return NextResponse.json({ error: 'Masukkan password lama untuk menggantinya' }, { status: 400 })
    const valid = await verifyPassword(oldPassword, existing.password)
    if (!valid) return NextResponse.json({ error: 'Password lama salah' }, { status: 401 })
    if (newPassword.length < 6) return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 })
    hashedPassword = await hashPassword(newPassword)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword },
  })

  // Refresh token dengan nama baru
  const token = createToken({ id: updated.id, name: updated.name, email: updated.email })
  const response = NextResponse.json({ success: true, user: { name: updated.name, email: updated.email } })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true, secure: false, sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, path: '/',
  })
  return response
}
