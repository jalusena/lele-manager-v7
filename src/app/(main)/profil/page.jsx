// src/app/(main)/profil/page.jsx
import { getSessionUser } from '@/lib/auth'
import ProfilClient from './ProfilClient'

export default async function ProfilPage() {
  const user = getSessionUser()
  return <ProfilClient user={user} />
}
