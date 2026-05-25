// src/lib/auth.js
// Hanya untuk Server Components & API Routes (Node.js runtime)
// JANGAN import di middleware.js

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'lele-manager-secret-2025'
export const COOKIE_NAME = 'lele_session'

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// Ambil user dari cookie - gunakan di Server Components & API Routes
export function getSessionUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
