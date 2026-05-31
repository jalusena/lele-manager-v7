// setup.js - Jalankan sekali untuk setup database
const { execSync } = require('child_process')

console.log('\n🐟 Lele Manager - Setup Database\n')

try {
  console.log('📦 Step 1/3: Generate Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Done\n')

  console.log('🗄️  Step 2/3: Membuat tabel database...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Done\n')

  console.log('🌱 Step 3/3: Mengisi data demo...')
  execSync('node prisma/seed.js', { stdio: 'inherit' })
  console.log('✅ Done\n')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Setup selesai! Jalankan: npm run dev')
  console.log('🌐 Buka: http://localhost:3000')
  console.log('👤 Demo: budi@demo.com / demo1234')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

} catch (err) {
  console.error('\n❌ Error:', err.message)
  console.log('\nCoba jalankan manual:')
  console.log('  npx prisma generate')
  console.log('  npx prisma db push')
  console.log('  node prisma/seed.js')
}
